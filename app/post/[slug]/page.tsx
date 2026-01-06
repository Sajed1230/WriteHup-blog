import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PostHeader from '@/components/PostHeader'
import PostContent from '@/components/PostContent'
import PostTags from '@/components/PostTags'
import SocialShareButtons from '@/components/SocialShareButtons'
import CommentsSection from '@/components/CommentsSection'
import RelatedPosts from '@/components/RelatedPosts'
import FeaturedVideo from '@/components/FeaturedVideo'
import AutoPlayVideo from '@/components/AutoPlayVideo'
import { serverFetch } from '@/lib/serverFetch'

// Force dynamic rendering to avoid build-time database connection errors
export const dynamic = 'force-dynamic'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage?: string
  images: Array<{ url: string; alt?: string; caption?: string }>
  videos: Array<{ url: string; thumbnail?: string; title?: string }>
  author: {
    name: string
    avatar?: string
  }
  category?: {
    name: string
    slug: string
  }
  tags: Array<{ name: string; slug: string }>
  createdAt: string
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const response = await serverFetch(`/api/posts/${slug}`)

    if (!response.ok) {
      console.error(`Failed to fetch post: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    return data.post
  } catch (error: any) {
    console.error('Error fetching post:', error.message || error)
    return null
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function calculateReadTime(content: string) {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

function isVideoUrl(url: string) {
  return url.includes('video') || url.match(/\.(mp4|webm|ogg)$/i)
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const postUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://writehup.com'}/post/${post.slug}`

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-4 sm:pt-8 pb-8 sm:pb-16">
        {/* Post Header */}
        <div className="animate-fade-in-up animate-delay-100">
          <PostHeader
            title={post.title}
            author={post.author.name}
            date={formatDate(post.createdAt)}
            readTime={calculateReadTime(post.content)}
          />
        </div>

        {/* Featured Media (Image or Video) */}
        {post.featuredImage && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 animate-scale-in animate-delay-200">
            <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
              {isVideoUrl(post.featuredImage) ? (
                <FeaturedVideo
                  src={post.featuredImage}
                  poster={post.videos[0]?.thumbnail}
                  title={post.title}
                />
              ) : (
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </div>
        )}

        {/* Post Content */}
        <div className="animate-fade-in-up animate-delay-300">
          <PostContent content={post.content} />
        </div>

        {/* Additional Images */}
        {post.images && post.images.length > 0 && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 animate-fade-in-up animate-delay-400">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {post.images.map((image, index) => (
                <div key={index} className="rounded-2xl overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt || post.title}
                    className="w-full h-auto"
                  />
                  {image.caption && (
                    <p className="text-sm text-gray-600 mt-2 text-center italic">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Videos */}
        {post.videos && post.videos.length > 0 && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 animate-fade-in-up animate-delay-400">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {post.videos.map((video, index) => (
                <AutoPlayVideo
                  key={index}
                  src={video.url}
                  poster={video.thumbnail}
                  title={video.title}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tags and Categories */}
        <div className="animate-fade-in-up animate-delay-400">
          <PostTags
            tags={post.tags.map(t => t.name)}
            categories={post.category ? [post.category.name] : []}
          />
        </div>

        {/* Social Share Buttons */}
        <div className="animate-fade-in-up animate-delay-400">
          <SocialShareButtons url={postUrl} title={post.title} />
        </div>

        {/* Comments Section */}
        <div className="animate-fade-in-up animate-delay-500">
          <CommentsSection />
        </div>

        {/* Related Posts */}
        <div className="animate-fade-in-up animate-delay-500">
          <RelatedPosts 
            currentPostId={post.id}
            currentPostTags={post.tags.map(t => t.slug)}
            currentPostCategory={post.category?.slug}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
