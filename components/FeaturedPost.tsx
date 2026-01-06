'use client'

import useSWR from 'swr'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage?: string
  author: {
    name: string
  }
  createdAt: string
}

export default function FeaturedPost() {
  // SWR will cache this data and only refetch when needed
  const { data, isLoading, error } = useSWR('/api/posts/public?limit=1&status=published')
  
  const post: Post | null = data?.posts?.[0] || null
  const loading = isLoading
  
  if (error) {
    console.error('Error fetching featured post:', error)
  }

  if (loading) {
    return (
      <div className="relative h-[650px] md:h-[750px] w-full overflow-hidden mb-20 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </div>
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            <div className="h-8 bg-white/20 rounded-full w-32 mb-5"></div>
            <div className="h-12 bg-white/20 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-white/20 rounded w-full mb-2"></div>
            <div className="h-6 bg-white/20 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div 
      className="relative h-[650px] md:h-[750px] w-full overflow-hidden mb-20 bg-cover bg-center"
      style={{
        backgroundImage: post.featuredImage 
          ? `url(${post.featuredImage})`
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <div className="mb-5">
            <span className="inline-block bg-white/25 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-semibold border border-white/20 shadow-lg">
              Featured
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
            {post.title}
          </h1>
          <p className="text-lg md:text-xl text-white/95 mb-8 max-w-3xl leading-relaxed">
            {post.excerpt || 'Read this featured article to discover more insights and knowledge.'}
          </p>
          <Link 
            href={`/post/${post.slug}`} 
            className="group inline-flex items-center text-white font-semibold text-lg hover:gap-3 transition-all duration-300 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 shadow-lg"
          >
            Read article
            <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
