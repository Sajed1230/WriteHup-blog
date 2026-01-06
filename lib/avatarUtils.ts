/**
 * Client-side utility functions for uploading user avatars
 */

export interface AvatarUploadResponse {
  success: boolean
  message: string
  avatar: string
  public_id: string
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<AvatarUploadResponse> {
  // Validate file first
  const validation = validateAvatarFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('userId', userId)

  const response = await fetch('/api/upload/avatar', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Avatar upload failed')
  }

  return response.json()
}

/**
 * Validate avatar file before upload
 */
export function validateAvatarFile(
  file: File
): { valid: boolean; error?: string } {
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Avatar size must be less than 5MB',
    }
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid image type. Allowed: JPEG, PNG, WebP',
    }
  }

  return { valid: true }
}

/**
 * Get optimized avatar URL from Cloudinary
 */
export function getOptimizedAvatarUrl(
  avatarUrl: string,
  size: number = 200
): string {
  if (!avatarUrl || !avatarUrl.trim()) {
    return avatarUrl
  }

  // If it's already a Cloudinary URL, optimize it
  if (avatarUrl.includes('cloudinary.com')) {
    try {
      // Check if URL already has transformations
      const urlObj = new URL(avatarUrl)
      const pathParts = urlObj.pathname.split('/')
      
      // Find the index of 'upload' to get the transformations and public_id
      const uploadIndex = pathParts.indexOf('upload')
      if (uploadIndex !== -1 && uploadIndex < pathParts.length - 1) {
        // Extract public_id (everything after upload/transformations/)
        const afterUpload = pathParts.slice(uploadIndex + 1)
        const publicIdWithExt = afterUpload.join('/')
        
        // Client-side: construct optimized URL
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        if (!cloudName) {
          console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set')
          return avatarUrl // Return original URL if Cloudinary is not configured
        }
        return `https://res.cloudinary.com/${cloudName}/image/upload/w_${size},h_${size},c_fill,g_face,q_auto,f_auto/${publicIdWithExt}`
      }
    } catch (error) {
      console.error('Error optimizing avatar URL:', error)
      // If URL parsing fails, return original
      return avatarUrl
    }
  }
  
  // Return original URL if not Cloudinary
  return avatarUrl
}

