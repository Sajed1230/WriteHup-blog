import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/schemas/User'
import Post from '@/schemas/Post'
import Comment from '@/schemas/Comment'
import { verifyToken } from '@/lib/auth'
import { deleteImage } from '@/lib/cloudinary'

// Force dynamic rendering (uses cookies for authentication)
export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Connect to database
    await connectDB()

    // Find user
    const user = await User.findById(payload.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete avatar from Cloudinary if exists
    if (user.avatar && user.avatar.includes('cloudinary.com')) {
      try {
        const urlParts = user.avatar.split('/')
        const publicIdWithExt = urlParts.slice(-2).join('/').split('.')[0]
        if (publicIdWithExt) {
          await deleteImage(publicIdWithExt)
        }
      } catch (error) {
        console.error('Error deleting avatar:', error)
        // Continue with account deletion even if avatar deletion fails
      }
    }

    // Remove user from other users' following/followers lists
    await User.updateMany(
      { following: payload.userId },
      { $pull: { following: payload.userId } }
    )
    await User.updateMany(
      { followers: payload.userId },
      { $pull: { followers: payload.userId } }
    )

    // Delete all posts by this user
    const userPosts = await Post.find({ author: payload.userId })
    for (const post of userPosts) {
      // Delete post images/videos from Cloudinary if needed
      // Delete comments on this post
      await Comment.deleteMany({ post: post._id })
    }
    await Post.deleteMany({ author: payload.userId })

    // Delete all comments by this user
    await Comment.deleteMany({ author: payload.userId })

    // Delete the user
    await User.findByIdAndDelete(payload.userId)

    // Create response and clear cookie
    const response = NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    })

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete account' },
      { status: 500 }
    )
  }
}



