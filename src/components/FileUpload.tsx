import React, { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import type { UploadProgress } from '../types/upload';
import './FileUpload.css';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  isUploading?: boolean;
  uploadProgress?: Map<string, UploadProgress>;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  accept = '*',
  multiple = true,
  maxSize,
  isUploading = false,
  uploadProgress,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    onFilesSelected(files);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          accept={accept}
          multiple={multiple}
          style={{ display: 'none' }}
        />
        <div className="drop-zone-content">
          {isUploading ? (
            <>
              <div className="upload-icon">⬆️</div>
              <p>Uploading files...</p>
            </>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <p className="drop-zone-text">
                Drag and drop files here or <span className="browse-text">browse</span>
              </p>
              {maxSize && (
                <p className="drop-zone-hint">
                  Maximum file size: {formatFileSize(maxSize)}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {uploadProgress && uploadProgress.size > 0 && (
        <div className="upload-progress-list">
          {Array.from(uploadProgress.entries()).map(([fileName, progress]) => (
            <div key={fileName} className="upload-progress-item">
              <div className="progress-header">
                <span className="file-name">{fileName}</span>
                <span className="file-size">{formatFileSize(progress.fileSize)}</span>
              </div>
              <div className="progress-bar-container">
                <div
                  className={`progress-bar ${progress.status === 'error' ? 'error' : ''} ${progress.status === 'completed' ? 'completed' : ''}`}
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="progress-status">
                {progress.status === 'uploading' && (
                  <span>{progress.percentage}%</span>
                )}
                {progress.status === 'completed' && (
                  <span className="status-completed">✓ Completed</span>
                )}
                {progress.status === 'error' && (
                  <span className="status-error">✗ {progress.error || 'Error'}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
