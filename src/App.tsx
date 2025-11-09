import { useState, useMemo } from 'react';
import { FileUpload } from './components/FileUpload';
import { UploadedFilesList } from './components/UploadedFilesList';
import { S3UploadService } from './services/s3UploadService';
import { useS3Upload } from './hooks/useS3Upload';
import { config } from './config/config';
import './App.css';

function App() {
  const [configError, setConfigError] = useState<string | null>(null);

  const uploadService = useMemo(() => {
    try {
      // Validate required configuration
      if (!config.aws.bucketName || !config.aws.accessKeyId || !config.aws.secretAccessKey) {
        setConfigError(
          'AWS credentials not configured. Please set up your .env file with AWS credentials.'
        );
        return null;
      }

      return new S3UploadService({
        bucketName: config.aws.bucketName,
        region: config.aws.region,
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
        maxFileSize: config.upload.maxFileSize,
        allowedFileTypes: config.upload.allowedFileTypes,
      });
    } catch {
      setConfigError('Failed to initialize S3 upload service');
      return null;
    }
  }, []);

  const {
    uploadFiles,
    uploadProgress,
    uploadedFiles,
    isUploading,
    error,
    clearUploadedFiles,
  } = useS3Upload(uploadService!);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      await uploadFiles(files);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔒 Secure S3 Upload</h1>
        <p className="subtitle">Upload files securely to Amazon S3 with presigned URLs</p>
      </header>

      <main className="app-main">
        {configError ? (
          <div className="config-error">
            <div className="error-icon">⚠️</div>
            <h2>Configuration Required</h2>
            <p>{configError}</p>
            <div className="error-instructions">
              <p>To get started:</p>
              <ol>
                <li>Copy .env.example to .env</li>
                <li>Add your AWS credentials to the .env file</li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </div>
        ) : (
          <>
            <FileUpload
              onFilesSelected={handleFilesSelected}
              multiple={true}
              maxSize={config.upload.maxFileSize}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <UploadedFilesList
              files={uploadedFiles}
              onClear={clearUploadedFiles}
            />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Built with React + TypeScript • Powered by AWS S3
        </p>
      </footer>
    </div>
  );
}

export default App;
