'use client'

import { useMemo, memo } from 'react'
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
  createdAt: string
}

const LatestPosts = memo(function LatestPosts() {
  // SWR will cache this data and only refetch when needed
  const { data, isLoading, error } = useSWR('/api/posts/public?limit=8')
  
  const posts: Post[] = data?.posts || []
  const loading = isLoading
  
  if (error) {
    console.error('Error fetching posts:', error)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const formattedPosts = useMemo(() => {
    return posts.map((post, index) => ({
      ...post,
      formattedDate: formatDate(post.createdAt),
      index
    }))
  }, [posts, formatDate])

  if (loading) {
    return (
      <section className="mb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Recent blog posts</h2>
            <p className="text-gray-600">Discover the latest articles and insights</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse">
              <div className="h-52 bg-gray-200 rounded-t-2xl"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Recent blog posts</h2>
          <p className="text-gray-600">Discover the latest articles and insights</p>
        </div>
      </div>
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {formattedPosts.map((post) => (
              <PostCard
                key={post.id}
                title={post.title}
                description={post.excerpt || ''}
                author={post.author.name}
                date={post.formattedDate}
                imageUrl={post.featuredImage}
                slug={post.slug}
                index={post.index}
              />
            ))}
          </div>
          <div className="flex justify-center mt-14">
            <button className="px-8 py-3.5 bg-white text-gray-700 font-semibold hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md">
              Load more posts
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No posts available yet. Check back soon!</p>
        </div>
      )}
    </section>
  )
})

export default LatestPosts
