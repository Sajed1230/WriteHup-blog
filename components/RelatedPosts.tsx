'use client'

import { useState, useEffect } from 'react'
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
  createdAt: string
}

interface RelatedPostsProps {
  currentPostId?: string
  currentPostTags?: string[]
  currentPostCategory?: string
}

export default function RelatedPosts({ 
  currentPostId, 
  currentPostTags = [],
  currentPostCategory 
}: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelatedPosts()
  }, [currentPostId, currentPostTags, currentPostCategory])

  const fetchRelatedPosts = async () => {
    setLoading(true)
    try {
      // Fetch posts by category or tags
      let queryParams = 'limit=4&status=published'
      
      if (currentPostCategory) {
        queryParams += `&category=${currentPostCategory}`
      } else if (currentPostTags.length > 0) {
        queryParams += `&tag=${currentPostTags[0]}`
      }

      const response = await fetch(`/api/posts/public?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        // Filter out current post and limit to 4
        let posts = (data.posts || []).filter((post: Post) => post.id !== currentPostId).slice(0, 4)
        setRelatedPosts(posts)
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200 mt-12">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Related Posts</h2>
          <p className="text-gray-600">You might also like these articles</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[...Array(4)].map((_, i) => (
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

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200 mt-12">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Related Posts</h2>
        <p className="text-gray-600">You might also like these articles</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {relatedPosts.map((post, index) => (
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
