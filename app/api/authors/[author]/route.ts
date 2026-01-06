import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/schemas/User'
import Post from '@/schemas/Post'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Get a single author by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ author: string }> | { author: string } }
) {
  try {
    await connectDB()

    // Handle both sync and async params (Next.js 14+)
    const resolvedParams = 'then' in params ? await params : params
    
    // Try to find author by name (slug format)
    const authorSlug = resolvedParams.author.toLowerCase().replace(/-/g, ' ')
    const authorName = authorSlug
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    // Find author by name (case-insensitive)
    const author = await User.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${authorName}$`, 'i') } },
        { name: { $regex: new RegExp(authorSlug, 'i') } },
      ],
      role: { $in: ['author', 'admin'] }
    })
      .select('name email avatar bio role')

    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      )
    }

    // Get author's published posts
    const posts = await Post.find({
      author: author._id,
      status: 'published'
    })
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .select('-content')

    return NextResponse.json({
      success: true,
      author: {
        id: author._id.toString(),
        name: author.name,
        email: author.email,
        avatar: author.avatar || '',
        bio: author.bio || '',
        role: author.role,
        postCount: posts.length,
        slug: author.name.toLowerCase().replace(/\s+/g, '-'),
      },
      posts: posts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        category: post.category && typeof post.category === 'object' && 'name' in post.category ? {
          name: (post.category as any).name,
          slug: (post.category as any).slug,
        } : null,
        tags: post.tags.map((tag: any) => ({
          name: tag.name,
          slug: tag.slug,
        })),
        views: post.views,
        likes: post.likes,
        createdAt: post.createdAt,
      })),
    })
  } catch (error: any) {
    console.error('Get author error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get author' },
      { status: 500 }
    )
  }
}

