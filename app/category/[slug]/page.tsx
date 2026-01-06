import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoryPostsClient from '@/components/CategoryPostsClient'

// Force dynamic rendering to avoid build-time database connection errors
export const dynamic = 'force-dynamic'

interface Category {
  id: string
  name: string
  slug: string
  description: string
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage?: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  category?: {
    name: string
    slug: string
  }
  tags: Array<{ name: string; slug: string }>
  views: number
  likes: number
  createdAt: string
}

async function getCategory(slug: string): Promise<Category | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/categories/${slug}`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.category
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

async function getInitialPosts(slug: string): Promise<{ posts: Post[]; total: number }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const queryParams = new URLSearchParams({
      category: slug,
      limit: '9',
      skip: '0',
    })
    const response = await fetch(`${baseUrl}/api/posts/public?${queryParams}`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      return { posts: [], total: 0 }
    }
    
    const data = await response.json()
    return {
      posts: data.posts || [],
      total: data.total || 0,
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], total: 0 }
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [category, { posts, total }] = await Promise.all([
    getCategory(params.slug),
    getInitialPosts(params.slug),
  ])

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Header */}
        <div className="mb-12 animate-fade-in-up animate-delay-100">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg">
              Category
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            {category.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mb-4">
            {category.description}
          </p>
          <p className="text-gray-500 font-medium">
            {total} {total === 1 ? 'post' : 'posts'} found
          </p>
        </div>

        {/* Posts with Client-side Filtering */}
        <CategoryPostsClient 
          initialPosts={posts}
          totalPosts={total}
          categorySlug={params.slug}
          type="category"
        />
      </main>

      <Footer />
    </div>
  )
}
