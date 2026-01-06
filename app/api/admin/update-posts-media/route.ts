import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/schemas/Post'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Get all published posts
    const posts = await Post.find({ status: 'published' })

    // Update each post with images and videos based on category
    const updates = posts.map(async (post) => {
      const categoryName = post.category?.toString() || ''
      let images: any[] = []
      let videos: any[] = []

      // Add images and videos based on post title/category
      if (post.title.includes('Next.js') || post.title.includes('React')) {
        images = [
          {
            url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
            alt: 'Next.js development environment',
            caption: 'Modern development setup with Next.js',
          },
          {
            url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
            alt: 'Code editor with React',
            caption: 'Writing React components',
          },
        ]
      } else if (post.title.includes('Design') || post.title.includes('UI')) {
        images = [
          {
            url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
            alt: 'UI Design examples',
            caption: 'Beautiful interface designs',
          },
        ]
        videos = [
          {
            url: 'https://res.cloudinary.com/dhxvbeuah/video/upload/v1/writehup/videos/sample-video-1min.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
            title: 'UI Design Tutorial',
            duration: 45,
          },
        ]
      } else if (post.title.includes('Python') || post.title.includes('Data Science')) {
        images = [
          {
            url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop',
            alt: 'Python code',
            caption: 'Python programming',
          },
          {
            url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
            alt: 'Data visualization',
            caption: 'Data analysis with Python',
          },
        ]
      } else if (post.title.includes('AI') || post.title.includes('Artificial Intelligence')) {
        videos = [
          {
            url: 'https://res.cloudinary.com/dhxvbeuah/video/upload/v1/writehup/videos/ai-future-demo.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
            title: 'AI Future Overview',
            duration: 55,
          },
        ]
      } else if (post.title.includes('Startup') || post.title.includes('Business')) {
        images = [
          {
            url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop',
            alt: 'Startup team',
            caption: 'Building a successful team',
          },
          {
            url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
            alt: 'Business growth',
            caption: 'Scaling your business',
          },
        ]
      } else if (post.title.includes('Productivity')) {
        images = [
          {
            url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
            alt: 'Productive workspace',
            caption: 'Organized workspace for better productivity',
          },
        ]
        videos = [
          {
            url: 'https://res.cloudinary.com/dhxvbeuah/video/upload/v1/writehup/videos/productivity-tips.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
            title: 'Productivity Tips for Developers',
            duration: 50,
          },
        ]
      }

      // Update post with images and videos
      post.images = images
      post.videos = videos
      await post.save()

      return {
        title: post.title,
        slug: post.slug,
        imagesCount: images.length,
        videosCount: videos.length,
      }
    })

    const results = await Promise.all(updates)

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${results.length} posts with images and videos`,
      results,
    })
  } catch (error: any) {
    console.error('Error updating posts:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update posts' },
      { status: 500 }
    )
  }
}



