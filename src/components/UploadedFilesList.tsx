import React from 'react';
import type { UploadedFile } from '../types/upload';
import './UploadedFilesList.css';

interface UploadedFilesListProps {
  files: UploadedFile[];
  onClear?: () => void;
}

export const UploadedFilesList: React.FC<UploadedFilesListProps> = ({
  files,
  onClear,
}) => {
  if (files.length === 0) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="uploaded-files-container">
      <div className="uploaded-files-header">
        <h3>Uploaded Files ({files.length})</h3>
        {onClear && (
          <button onClick={onClear} className="clear-button">
            Clear All
          </button>
        )}
      </div>
      <div className="uploaded-files-list">
        {files.map((file, index) => (
          <div key={index} className="uploaded-file-item">
            <div className="file-icon">📄</div>
            <div className="file-info">
              <div className="file-name">{file.name}</div>
              <div className="file-meta">
                <span>{formatFileSize(file.size)}</span>
                <span className="separator">•</span>
                <span>{formatDate(file.uploadedAt)}</span>
              </div>
            </div>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="view-link"
            >
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
