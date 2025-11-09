import { useState, useCallback } from 'react';
import { S3UploadService } from '../services/s3UploadService';
import type { UploadProgress, UploadedFile } from '../types/upload';

export const useS3Upload = (uploadService: S3UploadService) => {
  const [uploadProgress, setUploadProgress] = useState<Map<string, UploadProgress>>(
    new Map()
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      setIsUploading(true);
      setError(null);

      // Initialize progress for all files
      const initialProgress = new Map<string, UploadProgress>();
      files.forEach((file) => {
        initialProgress.set(file.name, {
          fileName: file.name,
          fileSize: file.size,
          uploadedBytes: 0,
          percentage: 0,
          status: 'pending',
        });
      });
      setUploadProgress(initialProgress);

      try {
        const urls = await uploadService.uploadMultipleFiles(
          files,
          (fileIndex, progress) => {
            setUploadProgress((prev) => {
              const next = new Map(prev);
              next.set(files[fileIndex].name, progress);
              return next;
            });
          }
        );

        // Add uploaded files to the list
        const newUploadedFiles = files.map((file, index) => ({
          name: file.name,
          size: file.size,
          url: urls[index],
          uploadedAt: new Date(),
        }));

        setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [uploadService]
  );

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([]);
    setUploadProgress(new Map());
  }, []);

  return {
    uploadFiles,
    uploadProgress,
    uploadedFiles,
    isUploading,
    error,
    clearUploadedFiles,
  };
};
