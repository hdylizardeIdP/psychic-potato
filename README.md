# psychic-potato

A secure React + TypeScript application for uploading files to Amazon S3 using presigned URLs.

## Features

- 🔒 **Secure Upload**: Uses AWS S3 presigned URLs for secure file uploads
- 📤 **Drag & Drop**: Intuitive drag-and-drop interface
- 📊 **Progress Tracking**: Real-time upload progress for each file
- ✅ **File Validation**: Configurable file size and type restrictions
- 🎨 **Modern UI**: Clean and responsive design
- ⚡ **Fast**: Built with Vite for optimal performance
- 🔧 **TypeScript**: Fully typed for better development experience

## Prerequisites

- Node.js (v16 or higher)
- AWS Account with S3 bucket configured
- AWS IAM user with S3 upload permissions

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/hdylizardeIdP/psychic-potato.git
   cd psychic-potato
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure AWS credentials**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your AWS credentials:
   ```env
   VITE_AWS_BUCKET_NAME=your-bucket-name
   VITE_AWS_REGION=us-east-1
   VITE_AWS_ACCESS_KEY_ID=your-access-key-id
   VITE_AWS_SECRET_ACCESS_KEY=your-secret-access-key
   ```

4. **Configure S3 CORS**
   
   Add the following CORS configuration to your S3 bucket:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["PUT", "POST", "GET"],
       "AllowedOrigins": ["http://localhost:5173"],
       "ExposeHeaders": []
     }
   ]
   ```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. Open the application in your browser
2. Drag and drop files onto the upload area, or click to browse
3. Files will be automatically uploaded to your S3 bucket
4. Monitor upload progress for each file
5. View uploaded files with links to access them

## Configuration

### Upload Settings

Edit `src/config/config.ts` to customize upload settings:

```typescript
export const config = {
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt'],
  },
};
```

### Security Best Practices

- **Never commit your `.env` file** - It contains sensitive AWS credentials
- Use IAM roles with minimal required permissions for S3 uploads
- Consider using temporary credentials via AWS STS
- Set appropriate CORS policies on your S3 bucket
- Configure bucket policies to restrict access
- Enable S3 bucket encryption
- Use presigned URLs with short expiration times

## Architecture

```
src/
├── components/          # React components
│   ├── FileUpload.tsx  # Drag & drop upload component
│   └── UploadedFilesList.tsx  # Display uploaded files
├── services/           # Business logic
│   └── s3UploadService.ts  # S3 upload operations
├── hooks/              # Custom React hooks
│   └── useS3Upload.ts  # Upload state management
├── types/              # TypeScript type definitions
│   └── upload.ts       # Upload-related types
├── config/             # Configuration
│   └── config.ts       # App configuration
└── App.tsx            # Main application component
```

## Technologies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **AWS SDK** - S3 client and presigned URL generation
- **CSS3** - Styling

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
