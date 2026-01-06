'use client'

import { useMemo } from 'react'
import useSWR from 'swr'
import PostCard from './PostCard'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage?: string
  author: {
    name: string
  }
  views: number
  likes: number
  createdAt: string
}

export default function TrendingPosts() {
  // SWR will cache this data and only refetch when needed
  const { data, isLoading, error } = useSWR('/api/posts/public?limit=3&status=published')
  
  // Sort by views + likes (popularity) and take top 3
  const trendingPosts = useMemo(() => {
    if (!data?.posts) return []
    return (data.posts as Post[])
      .sort((a: Post, b: Post) => (b.views + b.likes) - (a.views + a.likes))
      .slice(0, 3)
  }, [data?.posts])
  
  const loading = isLoading
  
  if (error) {
    console.error('Error fetching trending posts:', error)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <section className="mb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Trending Posts</h2>
            </div>
            <p className="text-gray-600 text-lg">Most read articles this week</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-pulse">
              <div className="h-52 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (trendingPosts.length === 0) {
    return null
  }

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Trending Posts</h2>
          </div>
          <p className="text-gray-600 text-lg">Most read articles this week</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {trendingPosts.map((post, index) => (
          <PostCard 
            key={post.id} 
            title={post.title}
            description={post.excerpt || ''}
            author={post.author.name}
            date={formatDate(post.createdAt)}
            imageUrl={post.featuredImage}
            index={index}
            slug={post.slug}
          />
        ))}
      </div>
    </section>
  )
}
