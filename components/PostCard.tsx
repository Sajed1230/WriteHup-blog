'use client'

import Link from 'next/link'
import { memo, useMemo } from 'react'

interface PostCardProps {
  title: string
  description: string
  author: string
  date: string
  imageUrl?: string
  index?: number
  slug?: string
}

const gradients = [
  'from-blue-400 to-purple-500',
  'from-pink-400 to-red-500',
  'from-green-400 to-blue-500',
  'from-yellow-400 to-orange-500',
  'from-indigo-400 to-purple-500',
  'from-teal-400 to-green-500',
  'from-rose-400 to-pink-500',
  'from-cyan-400 to-blue-500',
]

const PostCard = memo(function PostCard({ title, description, author, date, imageUrl, index = 0, slug = 'breaking-into-product-design' }: PostCardProps) {
  const gradient = useMemo(() => gradients[index % gradients.length], [index])
  
  const authorSlug = useMemo(() => author.toLowerCase().replace(/\s+/g, '-'), [author])
  
  return (
    <article className="group cursor-pointer h-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        <Link href={`/post/${slug}`} className="block flex-1 flex flex-col">
          {/* Image */}
          <div className={`relative h-52 bg-gradient-to-br ${gradient} overflow-hidden`}>
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-white/80 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors line-clamp-2 leading-snug">
              {title}
            </h3>
            <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed flex-1">
              {description}
            </p>
          </div>
        </Link>
        <div className="px-6 pb-6">
          <div className="flex items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
            <Link 
              href={`/authors/${authorSlug}`}
              className="font-medium hover:text-gray-900 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {author}
            </Link>
            <span className="mx-2">•</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </article>
  )
})

export default PostCard