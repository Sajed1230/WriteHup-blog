'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DashboardStats from '@/components/DashboardStats'
import DashboardActions from '@/components/DashboardActions'
import PendingComments from '@/components/PendingComments'
import { useAuth } from '@/hooks/useAuth'

interface DashboardData {
  authorName: string
  stats: {
    totalPosts: number
    draftPosts: number
    publishedPosts: number
    pendingComments: number
    followers: number
    following: number
  }
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
        return
      }
      if (user.role !== 'author' && user.role !== 'admin') {
        router.push('/')
        return
      }
      fetchDashboardData()
    }
  }, [user, authLoading, router])

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile for followers/following
      const profileResponse = await fetch('/api/auth/profile')
      const profileData = profileResponse.ok ? await profileResponse.json() : null

      // Fetch posts
      const postsResponse = await fetch('/api/posts')
      const postsData = postsResponse.ok ? await postsResponse.json() : { posts: [] }

      const posts = postsData.posts || []
      const totalPosts = posts.length
      const draftPosts = posts.filter((p: any) => p.status === 'draft').length
      const publishedPosts = posts.filter((p: any) => p.status === 'published').length

      // Fetch pending comments
      const commentsResponse = await fetch('/api/dashboard/pending-comments')
      const commentsData = commentsResponse.ok ? await commentsResponse.json() : { count: 0 }
      const pendingComments = commentsData.count || 0

      setDashboardData({
        authorName: user?.name || 'Author',
        stats: {
          totalPosts,
          draftPosts,
          publishedPosts,
          pendingComments,
          followers: profileData?.user?.followersCount || 0,
          following: profileData?.user?.followingCount || 0,
        },
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-in-up animate-delay-100">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  👋
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">Dashboard</p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    Welcome back, {dashboardData.authorName}!
                  </h1>
                </div>
              </div>
              <p className="text-white/90 text-base sm:text-lg max-w-2xl">
                Here's an overview of your blog activity and quick actions to manage your content.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-12 animate-fade-in-up animate-delay-200">
          <DashboardStats stats={dashboardData.stats} />
        </div>

        {/* Action Buttons */}
        <div className="animate-fade-in-up animate-delay-300">
          <DashboardActions />
        </div>

        {/* Pending Comments Section */}
        <div className="mt-12 animate-fade-in-up animate-delay-400">
          <PendingComments />
        </div>

        {/* More Features Section */}
        <div className="mt-12 animate-fade-in-up animate-delay-400">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-6 sm:p-8 md:p-12 border-2 border-gray-200 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3 sm:mb-4">
                I Can Add More Features
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium">
                Let me know what features you'd like to add to your dashboard!
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}