import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('Test upload - File received:', {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log('Test upload - Buffer created, size:', buffer.length)

    const result = await uploadImage(buffer, 'writehup/avatars', {
      width: 400,
      height: 400,
      quality: 80,
      crop: 'fill',
      gravity: 'face',
    })

    console.log('Test upload - Success:', result.url)

    return NextResponse.json({
      success: true,
      url: result.url,
      public_id: result.public_id,
    })
  } catch (error: any) {
    console.error('Test upload - Error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Upload failed',
        details: error.stack,
      },
      { status: 500 }
    )
  }
}

