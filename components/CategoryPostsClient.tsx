'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import PostCard from '@/components/PostCard'
import FilterBar from '@/components/FilterBar'
import Pagination from '@/components/Pagination'

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

interface CategoryPostsClientProps {
  initialPosts: Post[]
  totalPosts: number
  categorySlug: string
  type: 'category' | 'tag'
}

export default function CategoryPostsClient({ initialPosts, totalPosts, categorySlug, type }: CategoryPostsClientProps) {
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(false)

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const sortBy = searchParams.get('sort') || 'date'
  const authorFilter = searchParams.get('author') || ''

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const postsPerPage = 9
        const skip = (currentPage - 1) * postsPerPage

        const queryParams = new URLSearchParams({
          [type]: categorySlug,
          limit: postsPerPage.toString(),
          skip: skip.toString(),
        })

        const response = await fetch(`/api/posts/public?${queryParams}`)
        if (response.ok) {
          const data = await response.json()
          let fetchedPosts = data.posts

          if (authorFilter) {
            fetchedPosts = fetchedPosts.filter((post: Post) =>
              post.author.name.toLowerCase().includes(authorFilter.toLowerCase())
            )
          }

          fetchedPosts.sort((a: Post, b: Post) => {
            if (sortBy === 'date') {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            } else if (sortBy === 'popularity') {
              return (b.views + b.likes) - (a.views + a.likes)
            } else if (sortBy === 'author') {
              return a.author.name.localeCompare(b.author.name)
            }
            return 0
          })

          setPosts(fetchedPosts)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [currentPage, sortBy, authorFilter, categorySlug, type])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const authors = Array.from(new Set(posts.map(post => post.author.name))).sort()
  const postsPerPage = 9
  const totalPages = Math.ceil(totalPosts / postsPerPage)

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-pulse">
            <div className="h-52 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {posts.length > 0 && (
        <div className="animate-fade-in-up animate-delay-200 mb-8">
          <FilterBar 
            sortBy={sortBy}
            authors={authors}
            selectedAuthor={authorFilter}
            type={type}
            slug={categorySlug}
          />
        </div>
      )}

      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 animate-fade-in-up animate-delay-300">
            {posts.map((post, index) => (
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

          {totalPages > 1 && (
            <div className="animate-fade-in-up animate-delay-400">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={`/${type}/${categorySlug}`}
                searchParams={{
                  sort: sortBy || undefined,
                  author: authorFilter || undefined,
                }}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 animate-fade-in-up animate-delay-300">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Posts Found</h3>
            <p className="text-gray-600">No posts found in this {type}.</p>
          </div>
        </div>
      )}
    </>
  )
}

