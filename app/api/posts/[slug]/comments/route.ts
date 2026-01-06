import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/schemas/Post'
import Comment from '@/schemas/Comment'
import { verifyToken } from '@/lib/auth'

// Get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    await connectDB()

    const resolvedParams = 'then' in params ? await params : params
    const post = await Post.findOne({ slug: resolvedParams.slug, status: 'published' })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Get top-level comments (no parentComment)
    const topLevelComments = await Comment.find({
      post: post._id,
      isApproved: true,
      parentComment: null,
    })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })

    // Get all replies
    const allReplies = await Comment.find({
      post: post._id,
      isApproved: true,
      parentComment: { $ne: null },
    })
      .populate('author', 'name email avatar')
      .sort({ createdAt: 1 })

    // Group replies by parent comment
    const repliesByParent: Record<string, any[]> = {}
    allReplies.forEach(reply => {
      const parentId = reply.parentComment?.toString()
      if (parentId) {
        if (!repliesByParent[parentId]) {
          repliesByParent[parentId] = []
        }
        const replyAuthor = reply.author && typeof reply.author === 'object' && 'name' in reply.author 
          ? reply.author as any 
          : null
        if (replyAuthor) {
          repliesByParent[parentId].push({
            id: reply._id.toString(),
            content: reply.content,
            author: {
              id: replyAuthor._id.toString(),
              name: replyAuthor.name,
              avatar: replyAuthor.avatar && replyAuthor.avatar.trim() ? replyAuthor.avatar : undefined,
            },
            createdAt: reply.createdAt,
          })
        }
      }
    })

    return NextResponse.json({
      success: true,
      comments: topLevelComments.map(comment => {
        const commentAuthor = comment.author && typeof comment.author === 'object' && 'name' in comment.author
          ? comment.author as any
          : null
        return {
          id: comment._id.toString(),
          content: comment.content,
          author: commentAuthor ? {
            id: commentAuthor._id.toString(),
            name: commentAuthor.name,
            avatar: commentAuthor.avatar && commentAuthor.avatar.trim() ? commentAuthor.avatar : undefined,
          } : {
            id: '',
            name: 'Unknown',
            avatar: undefined,
          },
          createdAt: comment.createdAt,
          replies: repliesByParent[comment._id.toString()] || [],
        }
      }),
    })
  } catch (error: any) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get comments' },
      { status: 500 }
    )
  }
}

// Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
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
    const post = await Post.findOne({ slug: resolvedParams.slug, status: 'published' })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const { content, parentCommentId } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    // Validate parent comment if provided
    let parentComment = null
    if (parentCommentId) {
      parentComment = await Comment.findOne({
        _id: parentCommentId,
        post: post._id,
        isApproved: true,
      })
      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        )
      }
    }

    const comment = new Comment({
      content: content.trim(),
      author: payload.userId,
      post: post._id,
      parentComment: parentCommentId || null,
      isApproved: false, // Require moderation - comments need approval
    })

    await comment.save()

    // Add comment to post's comments array
    if (!post.comments) {
      post.comments = []
    }
    post.comments.push(comment._id)
    await post.save()

    // Populate author for response
    await comment.populate('author', 'name email avatar')

    const commentAuthor = comment.author && typeof comment.author === 'object' && 'name' in comment.author
      ? comment.author as any
      : null

    return NextResponse.json({
      success: true,
      message: 'Comment posted successfully',
      comment: {
        id: comment._id.toString(),
        content: comment.content,
        author: commentAuthor ? {
          id: commentAuthor._id.toString(),
          name: commentAuthor.name,
          avatar: commentAuthor.avatar && commentAuthor.avatar.trim() ? commentAuthor.avatar : undefined,
        } : {
          id: '',
          name: 'Unknown',
          avatar: undefined,
        },
        createdAt: comment.createdAt,
      },
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create comment' },
      { status: 500 }
    )
  }
}

