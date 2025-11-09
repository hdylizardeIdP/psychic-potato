export const config = {
  aws: {
    bucketName: import.meta.env.VITE_AWS_BUCKET_NAME || '',
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB default
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt'],
  },
};
