import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/schemas/Post'
import Comment from '@/schemas/Comment'
import User from '@/schemas/User'
import { verifyToken } from '@/lib/auth'

// Force dynamic rendering (uses cookies for authentication)
export const dynamic = 'force-dynamic'

// Get pending comments for author's posts
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value ||
                  request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    await connectDB()

    // Get all posts by this author
    const authorPosts = await Post.find({ author: payload.userId })
    const postIds = authorPosts.map(post => post._id)

    // Get pending comments for these posts
    const pendingComments = await Comment.find({
      post: { $in: postIds },
      isApproved: false,
    })
      .populate('author', 'name email avatar')
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })

    const comments = pendingComments.map(comment => {
      const commentAuthor = comment.author && typeof comment.author === 'object' && 'name' in comment.author
        ? comment.author as any
        : null
      const commentPost = comment.post && typeof comment.post === 'object' && 'title' in comment.post
        ? comment.post as any
        : null

      return {
        id: comment._id.toString(),
        content: comment.content,
        author: commentAuthor ? {
          id: commentAuthor._id.toString(),
          name: commentAuthor.name,
          email: commentAuthor.email || '',
          avatar: commentAuthor.avatar || '',
        } : {
          id: '',
          name: 'Unknown',
          email: '',
          avatar: '',
        },
        post: commentPost ? {
          id: commentPost._id.toString(),
          title: commentPost.title,
          slug: commentPost.slug,
        } : null,
        createdAt: comment.createdAt,
      }
    })

    return NextResponse.json({
      success: true,
      comments,
      count: comments.length,
    })
  } catch (error: any) {
    console.error('Get pending comments error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get pending comments' },
      { status: 500 }
    )
  }
}

