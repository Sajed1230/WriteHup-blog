/**
 * Client-side utility functions for uploading files to Cloudinary
 * Use these in your React components
 */

export interface UploadResponse {
  success: boolean
  url: string
  public_id: string
  width?: number
  height?: number
  duration?: number
  thumbnail_url?: string
}

/**
 * Upload a single image or video file
 */
export async function uploadFile(
  file: File,
  type: 'image' | 'video',
  folder?: string
): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)
  if (folder) {
    formData.append('folder', folder)
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Upload failed')
  }

  return response.json()
}

/**
 * Upload multiple files at once
 */
export async function uploadMultipleFiles(
  files: File[],
  type: 'image' | 'video',
  folder?: string
): Promise<UploadResponse[]> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  formData.append('type', type)
  if (folder) {
    formData.append('folder', folder)
  }

  const response = await fetch('/api/upload', {
    method: 'PUT',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Upload failed')
  }

  const data = await response.json()
  return data.files
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  type: 'image' | 'video'
): { valid: boolean; error?: string } {
  // Check file size
  const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024 // 100MB for video, 10MB for image
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSize / 1024 / 1024}MB`,
    }
  }

  // Check file type
  if (type === 'image') {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid image type. Allowed: JPEG, PNG, WebP, GIF',
      }
    }
  } else {
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid video type. Allowed: MP4, WebM, QuickTime',
      }
    }
  }

  return { valid: true }
}



