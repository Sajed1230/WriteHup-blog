# Cloudinary Setup Guide

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Once logged in, go to your Dashboard

## Step 2: Get Your Credentials

From your Cloudinary Dashboard, you'll find:
- **Cloud Name** - Your unique cloud identifier
- **API Key** - Your API key
- **API Secret** - Your secret key (keep this secure!)

## Step 3: Update Environment Variables

Open `.env.local` and replace the placeholder values:

```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## Step 4: Test the Setup

You can test the upload functionality by:

1. Starting your dev server: `npm run dev`
2. Using the upload API endpoint: `POST /api/upload`
3. Or use the client-side utilities from `lib/uploadUtils.ts`

## Usage Examples

### Server-Side Upload

```typescript
import { uploadImage, uploadVideo } from '@/lib/cloudinary'

// Upload image
const imageResult = await uploadImage(buffer, 'writehup/images')
console.log(imageResult.url) // Cloudinary URL

// Upload video
const videoResult = await uploadVideo(buffer, 'writehup/videos')
console.log(videoResult.url) // Cloudinary URL
```

### Client-Side Upload

```typescript
import { uploadFile, validateFile } from '@/lib/uploadUtils'

// Validate file first
const validation = validateFile(file, 'image')
if (!validation.valid) {
  console.error(validation.error)
  return
}

// Upload file
const result = await uploadFile(file, 'image', 'writehup')
console.log(result.url) // Cloudinary URL
```

### React Component Example

```typescript
'use client'
import { useState } from 'react'
import { uploadFile, validateFile } from '@/lib/uploadUtils'

export default function ImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    const validation = validateFile(file, 'image')
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    // Upload
    setUploading(true)
    try {
      const result = await uploadFile(file, 'image')
      setImageUrl(result.url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {uploading && <p>Uploading...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  )
}
```

## API Endpoints

### POST /api/upload
Upload a single file

**Form Data:**
- `file`: File to upload
- `type`: 'image' or 'video'
- `folder`: (optional) Folder path in Cloudinary

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "public_id": "writehup/images/xyz",
  "width": 1920,
  "height": 1080
}
```

### PUT /api/upload
Upload multiple files

**Form Data:**
- `files`: Array of files
- `type`: 'image' or 'video'
- `folder`: (optional) Folder path in Cloudinary

## File Limits

- **Images**: Max 10MB
- **Videos**: Max 100MB
- **Allowed Image Types**: JPEG, PNG, WebP, GIF
- **Allowed Video Types**: MP4, WebM, QuickTime

## Features

✅ Automatic image optimization
✅ Automatic format conversion
✅ Video thumbnail generation
✅ Secure uploads
✅ File validation
✅ Multiple file upload support

## Security Notes

- Never expose your API Secret in client-side code
- Always validate files before upload
- Use environment variables for credentials
- Consider adding authentication to upload endpoints



