'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import Image from 'next/image'
import { getOptimizedAvatarUrl } from '@/lib/avatarUtils'

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
  replies?: Comment[]
}

export default function CommentsSection() {
  const params = useParams()
  const slug = params.slug as string
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState<Record<string, string>>({})
  const [submittingReply, setSubmittingReply] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (slug) {
      fetchComments()
    }
  }, [slug])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${slug}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('Please log in to comment')
      return
    }
    if (!newComment.trim()) {
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/posts/${slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      })

      if (response.ok) {
        setNewComment('')
        fetchComments() // Refresh comments
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to post comment')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      alert('Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReplySubmit = async (parentCommentId: string) => {
    const content = replyContent[parentCommentId]?.trim()
    if (!user) {
      alert('Please log in to reply')
      return
    }
    if (!content) {
      return
    }

    setSubmittingReply(prev => ({ ...prev, [parentCommentId]: true }))
    try {
      const response = await fetch(`/api/posts/${slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          parentCommentId,
        }),
      })

      if (response.ok) {
        setReplyContent(prev => ({ ...prev, [parentCommentId]: '' }))
        setReplyingTo(null)
        fetchComments() // Refresh comments
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to post reply')
      }
    } catch (error) {
      console.error('Error posting reply:', error)
      alert('Failed to post reply')
    } finally {
      setSubmittingReply(prev => ({ ...prev, [parentCommentId]: false }))
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200 mt-12">
        <div className="animate-pulse space-y-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border-b border-gray-100 pb-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalComments = comments.reduce((sum, comment) => sum + 1 + (comment.replies?.length || 0), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200 mt-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Comments ({totalComments})</h2>

      {/* Comment Form */}
      <div className="mb-12">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none text-gray-900 placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
            <p className="text-gray-700 mb-4">Please log in to leave a comment</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Log in to Comment
            </Link>
          </div>
        )}
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-8">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-8 last:border-b-0">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                  {comment.author.avatar && comment.author.avatar.trim() ? (
                    <Image
                      src={getOptimizedAvatarUrl(comment.author.avatar, 40)}
                      alt={comment.author.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized={false}
                    />
                  ) : (
                    <span className="text-xs">{getInitials(comment.author.name)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{comment.author.name}</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
                  
                  {/* Reply Button */}
                  {user && (
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium mb-3 transition-colors"
                    >
                      {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                    </button>
                  )}

                  {/* Reply Form */}
                  {replyingTo === comment.id && user && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <textarea
                        value={replyContent[comment.id] || ''}
                        onChange={(e) => setReplyContent(prev => ({ ...prev, [comment.id]: e.target.value }))}
                        placeholder={`Reply to ${comment.author.name}...`}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none text-gray-900 placeholder:text-gray-400 mb-3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReplySubmit(comment.id)}
                          disabled={submittingReply[comment.id] || !replyContent[comment.id]?.trim()}
                          className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submittingReply[comment.id] ? 'Posting...' : 'Post Reply'}
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyContent(prev => ({ ...prev, [comment.id]: '' }))
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-6 ml-6 pl-6 border-l-2 border-gray-200 space-y-6">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                            {reply.author.avatar && reply.author.avatar.trim() ? (
                              <Image
                                src={getOptimizedAvatarUrl(reply.author.avatar, 40)}
                                alt={reply.author.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                unoptimized={false}
                              />
                            ) : (
                              <span className="text-xs">{getInitials(reply.author.name)}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-gray-900">{reply.author.name}</span>
                              <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}
