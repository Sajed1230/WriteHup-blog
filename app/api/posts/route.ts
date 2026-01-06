import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/schemas/Post'
import User from '@/schemas/User'
import Category from '@/schemas/Category'
import Tag from '@/schemas/Tag'
import { verifyToken } from '@/lib/auth'
import { uploadImage, uploadVideo } from '@/lib/cloudinary'

// Force dynamic rendering (uses cookies for authentication)
export const dynamic = 'force-dynamic'

// Create a new post
export async function POST(request: NextRequest) {
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

    // Check if user is author or admin
    const user = await User.findById(payload.userId)
    if (!user || (user.role !== 'author' && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Only authors and admins can create posts' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const status = formData.get('status') as 'draft' | 'published' | 'archived'
    const categoryName = formData.get('category') as string
    const tagsString = formData.get('tags') as string

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    // Check if slug already exists
    const existingPost = await Post.findOne({ slug })
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this title already exists' },
        { status: 400 }
      )
    }

    // Handle featured media upload (image or video)
    let featuredImageUrl = ''
    const featuredMediaFile = formData.get('featuredMedia') as File | null
    const featuredMediaType = formData.get('featuredMediaType') as string || 'image'
    
    if (featuredMediaFile && featuredMediaFile.size > 0) {
      const bytes = await featuredMediaFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      if (featuredMediaType === 'video' || featuredMediaFile.type.startsWith('video/')) {
        // Validate video duration (max 1 minute = 60 seconds)
        // Note: Cloudinary will return duration after upload, but we should validate client-side first
        // For server-side, we'll upload and check duration in the result
        const result = await uploadVideo(buffer, 'writehup/posts', {
          quality: '80',
        })
        
        // Check if video duration exceeds 60 seconds
        if (result.duration && result.duration > 60) {
          return NextResponse.json(
            { error: 'Video must be 1 minute or less. Please upload a shorter video.' },
            { status: 400 }
          )
        }
        
        featuredImageUrl = result.url // Store video URL in featuredImage field
      } else {
        // Upload as image
        const result = await uploadImage(buffer, 'writehup/posts', {
          quality: 80,
        })
        featuredImageUrl = result.url
      }
    }

    // Handle additional files (images and videos)
    const additionalFiles = formData.getAll('additionalFiles') as File[]
    const additionalFileTypes = formData.getAll('additionalFileTypes') as string[]
    const images: Array<{ url: string; alt?: string; caption?: string }> = []
    const videos: Array<{ url: string; thumbnail?: string; title?: string; duration?: number }> = []

    for (let i = 0; i < additionalFiles.length; i++) {
      const file = additionalFiles[i]
      const fileType = additionalFileTypes[i] || 'image'
      
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        if (fileType === 'video' || file.type.startsWith('video/')) {
          const result = await uploadVideo(buffer, 'writehup/posts', {
            quality: '80',
          })
          
          // Check if video duration exceeds 60 seconds
          if (result.duration && result.duration > 60) {
            continue // Skip this video
          }
          
          videos.push({
            url: result.url,
            thumbnail: result.thumbnail_url,
            title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            duration: result.duration || 0,
          })
        } else {
          const result = await uploadImage(buffer, 'writehup/posts', {
            quality: 80,
          })
          
          images.push({
            url: result.url,
            alt: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            caption: '',
          })
        }
      }
    }

    // Handle category
    let categoryId = null
    if (categoryName) {
      let category = await Category.findOne({ name: categoryName })
      if (!category) {
        // Create category if it doesn't exist
        const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        category = new Category({
          name: categoryName,
          slug: categorySlug,
        })
        await category.save()
      }
      categoryId = category._id
    }

    // Handle tags
    const tagIds: any[] = []
    if (tagsString) {
      const tagNames = tagsString.split(',').map(t => t.trim()).filter(t => t)
      for (const tagName of tagNames) {
        let tag = await Tag.findOne({ name: tagName })
        if (!tag) {
          // Create tag if it doesn't exist
          const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          tag = new Tag({
            name: tagName,
            slug: tagSlug,
          })
          await tag.save()
        }
        tagIds.push(tag._id)
      }
    }

    // Create post
    const post = new Post({
      title,
      slug,
      content,
      excerpt: excerpt || '',
      featuredImage: featuredImageUrl,
      images,
      videos,
      author: user._id,
      category: categoryId,
      tags: tagIds,
      status: status || 'draft',
    })

    await post.save()

    return NextResponse.json({
      success: true,
      message: 'Post created successfully',
      post: {
        id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        status: post.status,
      },
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create post error:', error)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    )
  }
}

// Get all posts for the authenticated user
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

    const posts = await Post.find({ author: payload.userId })
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .select('-content') // Don't return full content in list

    return NextResponse.json({
      success: true,
      posts: posts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        status: post.status,
        views: post.views,
        likes: post.likes,
        category: post.category,
        tags: post.tags,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })),
    })
  } catch (error: any) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get posts' },
      { status: 500 }
    )
  }
}

