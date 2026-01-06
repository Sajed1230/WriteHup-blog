import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PostCard from '@/components/PostCard'
import AuthorProfile from '@/components/AuthorProfile'
import { serverFetch } from '@/lib/serverFetch'

// Force dynamic rendering to avoid build-time database connection errors
export const dynamic = 'force-dynamic'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage?: string
  category?: {
    name: string
    slug: string
  }
  tags: Array<{ name: string; slug: string }>
  views: number
  likes: number
  createdAt: string
}

interface Author {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  role: string
  postCount: number
  slug: string
}

async function getAuthorData(authorSlug: string): Promise<{ author: Author | null; posts: Post[] }> {
  try {
    const response = await serverFetch(`/api/authors/${authorSlug}`)

    if (!response.ok) {
      return { author: null, posts: [] }
    }

    const data = await response.json()
    return {
      author: data.author || null,
      posts: data.posts || [],
    }
  } catch (error: any) {
    console.error('Error fetching author:', error.message || error)
    return { author: null, posts: [] }
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AuthorPage({ params }: { params: Promise<{ author: string }> | { author: string } }) {
  const resolvedParams = 'then' in params ? await params : params
  const { author, posts } = await getAuthorData(resolvedParams.author)

  if (!author) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Author Profile */}
        <div className="animate-fade-in-up animate-delay-100">
          <AuthorProfile 
            author={{
              name: author.name,
              email: author.email,
              bio: author.bio || `Author and writer sharing insights and experiences.`,
              avatar: author.avatar,
            }}
            postCount={author.postCount}
          />
        </div>

        {/* Author Posts */}
        <div className="mt-16 animate-fade-in-up animate-delay-200">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Posts by {author.name}
            </h2>
            <p className="text-gray-600">
              {author.postCount} {author.postCount === 1 ? 'article' : 'articles'} published
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 animate-fade-in-up animate-delay-300">
              {posts.map((post, index) => (
                <PostCard 
                  key={post.id} 
                  title={post.title}
                  description={post.excerpt || ''}
                  author={author.name}
                  date={formatDate(post.createdAt)}
                  imageUrl={post.featuredImage}
                  index={index}
                  slug={post.slug}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Posts Found</h3>
                <p className="text-gray-600">This author hasn't published any articles yet.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
