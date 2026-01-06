'use client'

import { useState } from 'react'

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      // In a real app, this would make an API call
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 5000)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 text-center text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Stay Updated
      </h2>
      <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        Get the latest articles, insights, and updates delivered straight to your inbox. Join our newsletter today!
      </p>
      
      {!isSubscribed ? (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              Subscribe
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </form>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-lg font-semibold text-green-400">Successfully subscribed!</p>
            </div>
            <p className="text-gray-300">Thank you for joining our newsletter. Check your inbox for a confirmation email.</p>
          </div>
        </div>
      )}
    </div>
  )
}






