'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  bio?: string
  followers: Array<{
    id: string
    name: string
    email: string
    avatar?: string
  }>
  following: Array<{
    id: string
    name: string
    email: string
    avatar?: string
  }>
  followersCount: number
  followingCount: number
  createdAt: string
}

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!authUser && !loading) {
      router.push('/login')
      return
    }

    // Block authors and admins from accessing profile page
    if (authUser && (authUser.role === 'author' || authUser.role === 'admin')) {
      router.push('/dashboard')
      return
    }

    fetchProfile()
  }, [authUser, loading, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
      } else {
        if (response.status === 401) {
          router.push('/login')
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setDeleting(true)
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      })

      if (response.ok) {
        // Account deleted, redirect to home
        window.location.href = '/'
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete account')
        setDeleting(false)
        setShowDeleteConfirm(false)
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account. Please try again.')
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Banner */}
            <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
              <div className="absolute -bottom-12 sm:-bottom-16 md:-bottom-20 left-4 sm:left-6 md:left-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt={profile.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                      {getInitials(profile.name)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {profile.name}
                  </h1>
                  <p className="text-gray-600 mb-4">{profile.email}</p>
                  {profile.bio && (
                    <p className="text-gray-700 max-w-2xl">{profile.bio}</p>
                  )}
                  {!profile.bio && (
                    <p className="text-gray-400 italic">No bio yet. Add one to tell people about yourself!</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{profile.followersCount}</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{profile.followingCount}</div>
                    <div className="text-sm text-gray-600">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Following Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Following ({profile.followingCount})</h2>
            {profile.following.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.following.map((following) => (
                  <div
                    key={following.id}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      {following.avatar ? (
                        <img 
                          src={following.avatar} 
                          alt={following.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {getInitials(following.name)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{following.name}</p>
                      <p className="text-sm text-gray-500 truncate">{following.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Not following anyone yet</p>
            )}
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Actions</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => logout()}
                className="w-full md:w-auto px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Log Out
              </button>

              {!showDeleteConfirm ? (
                <button
                  onClick={handleDeleteAccount}
                  className="w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-4 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-red-800 font-semibold">
                    ⚠️ Are you sure you want to delete your account?
                  </p>
                  <p className="text-red-700 text-sm">
                    This action cannot be undone. All your posts, comments, and data will be permanently deleted.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {deleting ? 'Deleting...' : 'Yes, Delete Account'}
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false)
                        setDeleting(false)
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-2 pb-4 border-b border-gray-200">
                <span className="text-sm font-semibold text-gray-600 w-32">Role:</span>
                <span className="text-gray-900 font-medium capitalize">{profile.role}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 pb-4 border-b border-gray-200">
                <span className="text-sm font-semibold text-gray-600 w-32">Member Since:</span>
                <span className="text-gray-900">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

