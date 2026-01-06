import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/schemas/User'
import { verifyToken } from '@/lib/auth'
import mongoose from 'mongoose'

// Force dynamic rendering (uses cookies for authentication)
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (userId === payload.userId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Get current user and target user
    const currentUser = await User.findById(payload.userId)
    const targetUser = await User.findById(userId)

    if (!currentUser || !targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already following
    const isFollowing = currentUser.following.some(
      (id: any) => id.toString() === userId
    )

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id: any) => id.toString() !== userId
      )
      targetUser.followers = targetUser.followers.filter(
        (id: any) => id.toString() !== payload.userId
      )
      await currentUser.save()
      await targetUser.save()

      return NextResponse.json({
        success: true,
        message: 'Unfollowed successfully',
        following: false,
      })
    } else {
      // Follow
      currentUser.following.push(new mongoose.Types.ObjectId(userId))
      targetUser.followers.push(new mongoose.Types.ObjectId(payload.userId))
      await currentUser.save()
      await targetUser.save()

      return NextResponse.json({
        success: true,
        message: 'Followed successfully',
        following: true,
      })
    }
  } catch (error: any) {
    console.error('Follow error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to follow/unfollow' },
      { status: 500 }
    )
  }
}


