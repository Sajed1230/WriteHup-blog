'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface PendingComment {
  id: string
  content: string
  author: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  post: {
    id: string
    title: string
    slug: string
  } | null
  createdAt: string
}

export default function PendingComments() {
  const { user } = useAuth()
  const [comments, setComments] = useState<PendingComment[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (user) {
      fetchPendingComments()
    }
  }, [user])

  const fetchPendingComments = async () => {
    try {
      const response = await fetch('/api/dashboard/pending-comments')
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error fetching pending comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModerate = async (commentId: string, action: 'approve' | 'reject') => {
    setProcessing(prev => ({ ...prev, [commentId]: true }))
    try {
      const response = await fetch(`/api/dashboard/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        // Remove the comment from the list
        setComments(prev => prev.filter(c => c.id !== commentId))
      } else {
        const data = await response.json()
        alert(data.error || `Failed to ${action} comment`)
      }
    } catch (error) {
      console.error(`Error ${action}ing comment:`, error)
      alert(`Failed to ${action} comment`)
    } finally {
      setProcessing(prev => ({ ...prev, [commentId]: false }))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Comments</h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-600">No pending comments to review</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Pending Comments</h2>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                {comment.author.avatar ? (
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(comment.author.name)}
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">{comment.author.name}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-gray-700 mb-3">{comment.content}</p>
                
                {/* Post Link */}
                {comment.post && (
                  <Link
                    href={`/post/${comment.post.slug}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 mb-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {comment.post.title}
                  </Link>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => handleModerate(comment.id, 'approve')}
                    disabled={processing[comment.id]}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {processing[comment.id] ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleModerate(comment.id, 'reject')}
                    disabled={processing[comment.id]}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {processing[comment.id] ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


