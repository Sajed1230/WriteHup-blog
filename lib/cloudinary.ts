import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Verify Cloudinary configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('⚠️ Cloudinary credentials are missing! Avatar uploads will fail.')
}

// Helper function to convert buffer to stream
const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable()
  readable._read = () => {}
  readable.push(buffer)
  readable.push(null)
  return readable
}

// Upload image to Cloudinary
export async function uploadImage(
  file: Buffer | string,
  folder: string = 'writehup/images',
  options?: {
    width?: number
    height?: number
    quality?: number | string
    format?: string
    crop?: string
    gravity?: string
  }
): Promise<{
  url: string
  public_id: string
  width: number
  height: number
  format: string
  bytes: number
}> {
  try {
    // Build upload options - don't include format: 'auto' in upload, use it in URL transformations instead
    const uploadOptions: any = {
      folder,
      resource_type: 'image',
    }

    // Add transformation options (width, height, crop, gravity, quality)
    if (options?.width) uploadOptions.width = options.width
    if (options?.height) uploadOptions.height = options.height
    if (options?.crop) uploadOptions.crop = options.crop
    if (options?.gravity) uploadOptions.gravity = options.gravity
    // Quality: use numeric value or 'auto' for URL transformations, but for uploads use numeric
    if (options?.quality) {
      if (typeof options.quality === 'number') {
        uploadOptions.quality = options.quality
      } else if (options.quality === 'auto') {
        // For uploads, use a default quality instead of 'auto'
        uploadOptions.quality = 80
      }
    }
    // Note: format: 'auto' is not valid for uploads, only for URL transformations
    // Don't include format in upload options

    let result
    if (typeof file === 'string') {
      // If it's a URL, upload from URL
      result = await cloudinary.uploader.upload(file, uploadOptions)
    } else {
      // If it's a buffer, upload from buffer
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error)
            else if (result) {
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
              })
            } else {
              reject(new Error('Upload failed'))
            }
          }
        )
        bufferToStream(file).pipe(stream)
      })
    }

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    }
  } catch (error: any) {
    throw new Error(`Image upload failed: ${error.message}`)
  }
}

// Upload video to Cloudinary
export async function uploadVideo(
  file: Buffer | string,
  folder: string = 'writehup/videos',
  options?: {
    quality?: string
    format?: string
  }
): Promise<{
  url: string
  public_id: string
  format: string
  bytes: number
  duration: number
  thumbnail_url: string
}> {
  try {
    const uploadOptions: any = {
      folder,
      resource_type: 'video',
      ...options,
    }

    let result
    if (typeof file === 'string') {
      // If it's a URL, upload from URL
      result = await cloudinary.uploader.upload(file, uploadOptions)
    } else {
      // If it's a buffer, upload from buffer
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error)
            else if (result) {
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                bytes: result.bytes,
                duration: result.duration || 0,
                thumbnail_url: cloudinary.url(result.public_id, {
                  resource_type: 'video',
                  format: 'jpg',
                }),
              })
            } else {
              reject(new Error('Upload failed'))
            }
          }
        )
        bufferToStream(file).pipe(stream)
      })
    }

    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
      duration: result.duration || 0,
      thumbnail_url: cloudinary.url(result.public_id, {
        resource_type: 'video',
        format: 'jpg',
      }),
    }
  } catch (error: any) {
    throw new Error(`Video upload failed: ${error.message}`)
  }
}

// Delete image from Cloudinary
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    })
  } catch (error: any) {
    throw new Error(`Image deletion failed: ${error.message}`)
  }
}

// Delete video from Cloudinary
export async function deleteVideo(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video',
    })
  } catch (error: any) {
    throw new Error(`Video deletion failed: ${error.message}`)
  }
}

// Generate optimized image URL with transformations
export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number
    height?: number
    quality?: number
    format?: string
  }
): string {
  return cloudinary.url(publicId, {
    ...options,
    secure: true,
  })
}

// Generate video thumbnail URL
export function getVideoThumbnailUrl(
  publicId: string,
  options?: {
    width?: number
    height?: number
  }
): string {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'jpg',
    ...options,
    secure: true,
  })
}

export default cloudinary

