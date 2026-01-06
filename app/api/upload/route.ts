import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, uploadVideo } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'image' or 'video'
    const folder = formData.get('folder') as string || 'writehup'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate file size (max 10MB for images, 100MB for videos)
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (buffer.length > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed size (${maxSize / 1024 / 1024}MB)` },
        { status: 400 }
      )
    }

    // Validate file type
    if (type === 'image') {
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!validImageTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid image type. Allowed: JPEG, PNG, WebP, GIF' },
          { status: 400 }
        )
      }
    } else if (type === 'video') {
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime']
      if (!validVideoTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid video type. Allowed: MP4, WebM, QuickTime' },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "image" or "video"' },
        { status: 400 }
      )
    }

    // Upload to Cloudinary
    if (type === 'image') {
      const result = await uploadImage(buffer, `${folder}/images`, {
        quality: 80,
      })
      return NextResponse.json({
        success: true,
        url: result.url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
      })
    } else {
      const result = await uploadVideo(buffer, `${folder}/videos`, {
        quality: 'auto',
      })
      return NextResponse.json({
        success: true,
        url: result.url,
        public_id: result.public_id,
        duration: result.duration,
        thumbnail_url: result.thumbnail_url,
      })
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}

// Handle multiple file uploads
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const type = formData.get('type') as string
    const folder = formData.get('folder') as string || 'writehup'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    if (type === 'image') {
      const uploadPromises = files.map(async (file) => {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        return uploadImage(buffer, `${folder}/images`, {
          quality: 80,
        })
      })

      const results = await Promise.all(uploadPromises)

      return NextResponse.json({
        success: true,
        files: results.map((result) => ({
          url: result.url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
        })),
      })
    } else {
      const uploadPromises = files.map(async (file) => {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        return uploadVideo(buffer, `${folder}/videos`, {
          quality: 'auto',
        })
      })

      const results = await Promise.all(uploadPromises)

      return NextResponse.json({
        success: true,
        files: results.map((result) => ({
          url: result.url,
          public_id: result.public_id,
          duration: result.duration,
          thumbnail_url: result.thumbnail_url,
        })),
      })
    }
  } catch (error: any) {
    console.error('Multiple upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}

