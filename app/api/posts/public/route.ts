import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/schemas/Post'
import Category from '@/schemas/Category'
import Tag from '@/schemas/Tag'
import User from '@/schemas/User'

// Get all published posts (public API - no authentication required)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = parseInt(searchParams.get('skip') || '0', 10)
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')

    // Build query
    const query: any = { status: 'published' }

    if (category) {
      // Find category by slug
      const categoryDoc = await Category.findOne({ slug: category })
      if (categoryDoc) {
        query.category = categoryDoc._id
      }
    }

    if (tag) {
      // Find tag by slug
      const tagDoc = await Tag.findOne({ slug: tag })
      if (tagDoc) {
        query.tags = tagDoc._id
      }
    }

    // Fetch posts
    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('-content') // Don't return full content in list

    const total = await Post.countDocuments(query)

    return NextResponse.json({
      success: true,
      posts: posts.map(post => {
        const postAuthor = post.author && typeof post.author === 'object' && 'name' in post.author
          ? post.author as any
          : null
        const postCategory = post.category && typeof post.category === 'object' && 'name' in post.category
          ? post.category as any
          : null

        return {
          id: post._id.toString(),
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage,
          author: postAuthor ? {
            id: postAuthor._id.toString(),
            name: postAuthor.name,
            email: postAuthor.email || '',
            avatar: postAuthor.avatar || '',
          } : {
            id: '',
            name: 'Unknown',
            email: '',
            avatar: '',
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
        }
      }),
      total,
      limit,
      skip,
    })
  } catch (error: any) {
    console.error('Get public posts error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get posts' },
      { status: 500 }
    )
  }
}

