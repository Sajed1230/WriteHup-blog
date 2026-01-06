'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  bio?: string
  createdAt?: string
}

// Cache user data to avoid unnecessary API calls
let cachedUser: User | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 60000 // 1 minute

export function useAuth() {
  const [user, setUser] = useState<User | null>(cachedUser)
  const [loading, setLoading] = useState(!cachedUser)
  const fetchingRef = useRef(false)

  const fetchUser = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (fetchingRef.current) return
    
    // Use cache if still valid
    const now = Date.now()
    if (cachedUser && (now - cacheTimestamp) < CACHE_DURATION) {
      setUser(cachedUser)
      setLoading(false)
      return
    }

    fetchingRef.current = true
    try {
      const response = await fetch('/api/auth/me', {
        cache: 'no-store',
      })
      if (response.ok) {
        const data = await response.json()
        cachedUser = data.user
        cacheTimestamp = now
        setUser(data.user)
      } else {
        cachedUser = null
        cacheTimestamp = 0
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      cachedUser = null
      cacheTimestamp = 0
      setUser(null)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    fetchUser()
    
    // Listen for storage events to update when user logs in from another tab
    const handleStorageChange = () => {
      cachedUser = null
      cacheTimestamp = 0
      fetchUser()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [fetchUser])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      cachedUser = null
      cacheTimestamp = 0
      setUser(null)
      // Clear cache immediately
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }, [])

  // Export function to clear cache (useful after login/signup)
  const clearCache = useCallback(() => {
    cachedUser = null
    cacheTimestamp = 0
    fetchUser()
  }, [fetchUser])

  return { user, loading, refetch: fetchUser, logout, clearCache }
}
