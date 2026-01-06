import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/schemas/User'
import Post from '@/schemas/Post'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Get all authors (users with role 'author' or 'admin')
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Find all users who are authors or admins
    const authors = await User.find({
      role: { $in: ['author', 'admin'] }
    })
      .select('name email avatar bio role')
      .sort({ name: 1 })

    // Get post count for each author
    const authorsWithPostCount = await Promise.all(
      authors.map(async (author) => {
        const postCount = await Post.countDocuments({
          author: author._id,
          status: 'published'
        })

        return {
          id: author._id.toString(),
          name: author.name,
          email: author.email,
          avatar: author.avatar || '',
          bio: author.bio || '',
          role: author.role,
          postCount,
          slug: author.name.toLowerCase().replace(/\s+/g, '-'),
        }
      })
    )

    return NextResponse.json({
      success: true,
      authors: authorsWithPostCount,
    })
  } catch (error: any) {
    console.error('Get authors error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get authors' },
      { status: 500 }
    )
  }
}



