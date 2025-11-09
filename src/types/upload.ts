export interface UploadConfig {
  bucketName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  maxFileSize?: number; // in bytes
  allowedFileTypes?: string[];
}

export interface UploadProgress {
  fileName: string;
  fileSize: number;
  uploadedBytes: number;
  percentage: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  url: string;
  uploadedAt: Date;
}
