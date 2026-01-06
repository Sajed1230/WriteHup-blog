import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/schemas/Post'
import Comment from '@/schemas/Comment'
import User from '@/schemas/User'
import { verifyToken } from '@/lib/auth'

// Force dynamic rendering (uses cookies for authentication)
export const dynamic = 'force-dynamic'

// Approve or reject a comment
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> | { commentId: string } }
) {
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

    const resolvedParams = 'then' in params ? await params : params
    const { action } = await request.json() // 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Use "approve" or "reject"' },
        { status: 400 }
      )
    }

    // Find the comment
    const comment = await Comment.findById(resolvedParams.commentId)
      .populate('post', 'author')

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Verify the comment belongs to a post by this author
    const post = comment.post && typeof comment.post === 'object' && 'author' in comment.post
      ? comment.post as any
      : null

    if (!post || post.author.toString() !== payload.userId) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only moderate comments on your own posts.' },
        { status: 403 }
      )
    }

    if (action === 'approve') {
      comment.isApproved = true
      await comment.save()
      return NextResponse.json({
        success: true,
        message: 'Comment approved successfully',
      })
    } else {
      // Reject - delete the comment
      await Comment.findByIdAndDelete(resolvedParams.commentId)
      return NextResponse.json({
        success: true,
        message: 'Comment rejected and deleted',
      })
    }
  } catch (error: any) {
    console.error('Moderate comment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to moderate comment' },
      { status: 500 }
    )
  }
}

