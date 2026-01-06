import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, deleteImage } from '@/lib/cloudinary'
import connectDB from '@/lib/mongodb'
import User from '@/schemas/User'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid image type. Allowed: JPEG, PNG, WebP' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB for avatars)
    const maxSize = 5 * 1024 * 1024 // 5MB
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    if (buffer.length > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed size (5MB)' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Find user
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete old avatar from Cloudinary if exists
    if (user.avatar && user.avatar.includes('cloudinary.com')) {
      try {
        // Extract public_id from URL if it's a Cloudinary URL
        const urlParts = user.avatar.split('/')
        const publicIdWithExt = urlParts.slice(-2).join('/').split('.')[0]
        if (publicIdWithExt) {
          await deleteImage(publicIdWithExt)
        }
      } catch (error) {
        // If deletion fails, continue with upload
        console.error('Error deleting old avatar:', error)
      }
    }

    // Upload new avatar to Cloudinary
    const result = await uploadImage(buffer, 'writehup/avatars', {
      width: 400,
      height: 400,
      quality: 80,
      crop: 'fill',
      gravity: 'face', // Auto-detect face for better cropping
    })

    // Update user avatar in database
    user.avatar = result.url
    await user.save()

    return NextResponse.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatar: result.url,
      public_id: result.public_id,
    })
  } catch (error: any) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Avatar upload failed' },
      { status: 500 }
    )
  }
}

