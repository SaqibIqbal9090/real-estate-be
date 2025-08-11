# S3 Image Upload Setup

This guide explains how to set up and use the S3 signed URL functionality for image uploads.

## Environment Variables Required

Add the following environment variables to your `.env` file:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-s3-bucket-name
```

## API Endpoints

### 1. Generate Multiple Signed URLs
**POST** `/properties/upload/signed-url`

Generate signed URLs for multiple files at once.

**Request Body:**
```json
{
  "files": [
    {
      "fileName": "property-image-1.jpg",
      "contentType": "image/jpeg"
    },
    {
      "fileName": "property-image-2.png",
      "contentType": "image/png"
    }
  ],
  "expiresIn": 3600
}
```

**Response:**
```json
{
  "message": "Signed URLs generated successfully",
  "signedUrls": [
    {
      "signedUrl": "https://your-bucket.s3.amazonaws.com/properties/1234567890-abc123.jpg?...",
      "fileKey": "properties/1234567890-abc123.jpg",
      "originalName": "property-image-1.jpg"
    },
    {
      "signedUrl": "https://your-bucket.s3.amazonaws.com/properties/1234567890-def456.png?...",
      "fileKey": "properties/1234567890-def456.png",
      "originalName": "property-image-2.png"
    }
  ]
}
```

### 2. Generate Single Signed URL
**POST** `/properties/upload/single-signed-url`

Generate a signed URL for a single file.

**Request Body:**
```json
{
  "fileName": "property-image.jpg",
  "contentType": "image/jpeg",
  "expiresIn": 3600
}
```

**Response:**
```json
{
  "message": "Signed URL generated successfully",
  "signedUrl": "https://your-bucket.s3.amazonaws.com/properties/1234567890-abc123.jpg?...",
  "fileKey": "properties/1234567890-abc123.jpg"
}
```

## Usage Flow

1. **Frontend requests signed URL**: Call one of the endpoints above with file information
2. **Backend generates signed URL**: Returns a pre-signed URL that allows direct upload to S3
3. **Frontend uploads directly to S3**: Use the signed URL to upload the file directly to S3
4. **Use fileKey in property creation**: Store the `fileKey` in your property data for later retrieval

## Frontend Example (JavaScript)

```javascript
// Step 1: Get signed URL from backend
const response = await fetch('/properties/upload/single-signed-url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    fileName: file.name,
    contentType: file.type
  })
});

const { signedUrl, fileKey } = await response.json();

// Step 2: Upload directly to S3
await fetch(signedUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': file.type
  }
});

// Step 3: Use fileKey in property creation
const propertyData = {
  // ... other property data
  images: [fileKey] // Store the S3 file key
};
```

## Security Notes

- Signed URLs expire after the specified time (default: 1 hour)
- Only authenticated users can generate signed URLs
- File keys are generated with timestamps and random strings for uniqueness
- Files are stored in the `properties/` folder in S3 for organization

## S3 Bucket Configuration

Make sure your S3 bucket has the following CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

And appropriate bucket policies for your use case. 