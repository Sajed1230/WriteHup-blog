'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  const isNetworkError = error.message?.includes('fetch') || 
                         error.message?.includes('network') ||
                         error.message?.includes('Network') ||
                         error.message?.includes('Failed to fetch')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl w-full text-center">
          <div className="animate-fade-in-up">
            {/* Error Illustration */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-red-100 to-orange-100 mb-6">
                {isNetworkError ? (
                  <svg 
                    className="w-16 h-16 text-red-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" 
                    />
                  </svg>
                ) : (
                  <svg 
                    className="w-16 h-16 text-red-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {isNetworkError ? 'Network Error' : 'Something Went Wrong'}
            </h1>

            {/* Error Message */}
            <p className="text-lg text-gray-600 mb-2 max-w-md mx-auto">
              {isNetworkError 
                ? "We're having trouble connecting to the server. Please check your internet connection and try again."
                : "An unexpected error occurred. Don't worry, we're working on fixing it."}
            </p>
            
            {error.message && (
              <p className="text-sm text-gray-500 mb-8 mt-4 p-4 bg-gray-100 rounded-lg max-w-md mx-auto">
                {error.message}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={reset}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Go to Homepage
              </Link>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Go Back
              </button>
            </div>

            {/* Network Error Specific Help */}
            {isNetworkError && (
              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl max-w-md mx-auto">
                <h3 className="font-semibold text-blue-900 mb-2">Troubleshooting Tips:</h3>
                <ul className="text-sm text-blue-800 text-left space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Refresh the page</li>
                  <li>• Try again in a few moments</li>
                  <li>• Clear your browser cache if the problem persists</li>
                </ul>
              </div>
            )}

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Need help? Try these pages:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Home
                </Link>
                <Link href="/post" className="text-blue-600 hover:text-blue-700 hover:underline">
                  All Posts
                </Link>
                <Link href="/contact" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

