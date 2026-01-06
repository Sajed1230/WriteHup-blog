'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getOptimizedAvatarUrl } from '@/lib/avatarUtils'

interface AuthorData {
  name: string
  email?: string
  bio: string
  avatar?: string
  social?: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
}

interface AuthorProfileProps {
  author: AuthorData
  postCount: number
}

export default function AuthorProfile({ author, postCount }: AuthorProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header Banner */}
      <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
        <div className="absolute -bottom-16 left-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white overflow-hidden">
            {author.avatar ? (
              <Image
                src={getOptimizedAvatarUrl(author.avatar, 128)}
                alt={author.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
                unoptimized={false}
              />
            ) : (
              getInitials(author.name)
            )}
          </div>
        </div>
      </div>

      <div className="pt-20 p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Author Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {author.name}
            </h1>
            
            {author.email && (
              <p className="text-lg text-gray-500 mb-6 break-all">
                <svg className="w-5 h-5 inline-block mr-2 align-middle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {author.email}
              </p>
            )}
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl">
              {author.bio}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 flex-1">
                <div className="text-3xl font-bold text-gray-900 mb-1">{postCount}</div>
                <div className="text-sm text-gray-600 font-medium">Articles</div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div className="bg-gray-50 rounded-xl p-4 flex-1">
                <div className="text-3xl font-bold text-gray-900 mb-1">Active</div>
                <div className="text-sm text-gray-600 font-medium">Writer</div>
              </div>
            </div>

            {/* Social Links */}
            {author.social && (
              <div className="flex items-center gap-3 mb-8">
                {author.social.twitter && (
                  <a
                    href={author.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-200 group"
                    aria-label="Twitter"
                  >
                    <svg className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                )}
                {author.social.linkedin && (
                  <a
                    href={author.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-200 group"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
                {author.social.github && (
                  <a
                    href={author.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-900 hover:text-white flex items-center justify-center transition-all duration-200 group"
                    aria-label="GitHub"
                  >
                    <svg className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
                {author.social.website && (
                  <a
                    href={author.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-purple-500 hover:text-white flex items-center justify-center transition-all duration-200 group"
                    aria-label="Website"
                  >
                    <svg className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                  isFollowing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                }`}
              >
                {isFollowing ? '✓ Following' : '+ Follow Author'}
              </button>
              <button
                onClick={() => setShowContactModal(true)}
                className="px-8 py-3.5 rounded-xl font-semibold bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal (Simple implementation) */}
      {showContactModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowContactModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact {author.name}</h3>
            {author.email && (
              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">Email:</p>
                <a 
                  href={`mailto:${author.email}`}
                  className="text-blue-600 hover:text-blue-700 break-all"
                >
                  {author.email}
                </a>
              </div>
            )}
            <p className="text-gray-600 mb-6">
              {author.email 
                ? 'You can reach out through their email above or social links.'
                : 'You can reach out to this author through their social links above.'}
            </p>
            <button
              onClick={() => setShowContactModal(false)}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
