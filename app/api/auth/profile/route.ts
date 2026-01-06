import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/schemas/User'
import { verifyToken } from '@/lib/auth'

// Force dynamic rendering (uses cookies for authentication)
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '')

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

    // Find user with populated followers and following
    const user = await User.findById(payload.userId)
      .populate('followers', 'name email avatar')
      .populate('following', 'name email avatar')

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Return user data with followers and following
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      followers: user.followers.map((follower: any) => ({
        id: follower._id.toString(),
        name: follower.name,
        email: follower.email,
        avatar: follower.avatar,
      })),
      following: user.following.map((following: any) => ({
        id: following._id.toString(),
        name: following.name,
        email: following.email,
        avatar: following.avatar,
      })),
      followersCount: user.followers.length,
      followingCount: user.following.length,
      createdAt: user.createdAt,
    }

    return NextResponse.json({
      success: true,
      user: userData,
    })
  } catch (error: any) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get profile' },
      { status: 500 }
    )
  }
}



