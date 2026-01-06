'use client'

import Link from 'next/link'

interface PostHeaderProps {
  title: string
  author: string
  date: string
  readTime?: string
}

export default function PostHeader({ title, author, date, readTime = '5 min read' }: PostHeaderProps) {
  const authorSlug = author.toLowerCase().replace(/\s+/g, '-')

  return (
    <header className="mb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          <div className="flex items-center gap-3">
            <Link 
              href={`/authors/${authorSlug}`} 
              className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg hover:opacity-80 transition-opacity"
            >
              {author.charAt(0)}
            </Link>
            <div>
              <Link 
                href={`/authors/${authorSlug}`}
                className="font-semibold text-gray-900 hover:text-gray-700 transition-colors block"
              >
                {author}
              </Link>
              <p className="text-sm text-gray-500">{date} • {readTime}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}