import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { UploadConfig, UploadProgress } from '../types/upload';

export class S3UploadService {
  private s3Client: S3Client;
  private config: UploadConfig;

  constructor(config: UploadConfig) {
    this.config = config;
    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async getPresignedUrl(fileName: string, fileType: string): Promise<string> {
    const key = `uploads/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return signedUrl;
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (this.config.maxFileSize && file.size > this.config.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${this.config.maxFileSize / 1024 / 1024}MB`,
      };
    }

    // Check file type
    if (this.config.allowedFileTypes && this.config.allowedFileTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isAllowed = this.config.allowedFileTypes.some(
        (type) => type.toLowerCase() === fileExtension || file.type.includes(type)
      );

      if (!isAllowed) {
        return {
          valid: false,
          error: `File type not allowed. Allowed types: ${this.config.allowedFileTypes.join(', ')}`,
        };
      }
    }

    return { valid: true };
  }

  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Get presigned URL
    const presignedUrl = await this.getPresignedUrl(file.name, file.type);

    // Upload file using presigned URL with progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress({
            fileName: file.name,
            fileSize: file.size,
            uploadedBytes: e.loaded,
            percentage: Math.round((e.loaded / e.total) * 100),
            status: 'uploading',
          });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          // Extract the file URL (without query parameters)
          const url = presignedUrl.split('?')[0];
          if (onProgress) {
            onProgress({
              fileName: file.name,
              fileSize: file.size,
              uploadedBytes: file.size,
              percentage: 100,
              status: 'completed',
            });
          }
          resolve(url);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });

      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  async uploadMultipleFiles(
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<string[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadFile(file, (progress) => {
        if (onProgress) {
          onProgress(index, progress);
        }
      })
    );

    return Promise.all(uploadPromises);
  }
}
