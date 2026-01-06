import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/schemas/Post'
import User from '@/schemas/User'
import Category from '@/schemas/Category'
import Tag from '@/schemas/Tag'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Get a single post by slug (public API)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    await connectDB()

    const resolvedParams = 'then' in params ? await params : params
    const post = await Post.findOne({ slug: resolvedParams.slug, status: 'published' })
      .populate('author', 'name email avatar bio')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Increment views
    post.views = (post.views || 0) + 1
    await post.save()

    const postAuthor = post.author && typeof post.author === 'object' && 'name' in post.author
      ? post.author as any
      : null
    const postCategory = post.category && typeof post.category === 'object' && 'name' in post.category
      ? post.category as any
      : null

    return NextResponse.json({
      success: true,
      post: {
        id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        images: post.images,
        videos: post.videos,
        author: postAuthor ? {
          id: postAuthor._id.toString(),
          name: postAuthor.name,
          email: postAuthor.email || '',
          avatar: postAuthor.avatar || '',
          bio: postAuthor.bio || '',
        } : {
          id: '',
          name: 'Unknown',
          email: '',
          avatar: '',
          bio: '',
        },
        category: postCategory ? {
          name: postCategory.name,
          slug: postCategory.slug,
        } : null,
        tags: post.tags.map((tag: any) => {
          const tagObj = tag && typeof tag === 'object' && 'name' in tag ? tag : null
          return tagObj ? {
            name: tagObj.name,
            slug: tagObj.slug,
          } : { name: '', slug: '' }
        }).filter((tag: any) => tag.name),
        views: post.views,
        likes: post.likes,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    })
  } catch (error: any) {
    console.error('Get post error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get post' },
      { status: 500 }
    )
  }
}


