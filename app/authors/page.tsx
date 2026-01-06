import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { getOptimizedAvatarUrl } from '@/lib/avatarUtils'

// Force dynamic rendering to avoid build-time database connection errors
export const dynamic = 'force-dynamic'

interface Author {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  role: string
  postCount: number
  slug: string
}

async function getAuthors(): Promise<Author[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/authors`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    return data.authors || []
  } catch (error) {
    console.error('Error fetching authors:', error)
    return []
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const gradients = [
  'from-blue-400 to-purple-500',
  'from-pink-400 to-red-500',
  'from-green-400 to-blue-500',
  'from-yellow-400 to-orange-500',
  'from-indigo-400 to-purple-500',
  'from-teal-400 to-green-500',
  'from-rose-400 to-pink-500',
]

export default async function AuthorsPage() {
  const authors = await getAuthors()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12 animate-fade-in-up animate-delay-100">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg">
              Authors
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Our Authors
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Meet the talented writers and creators sharing their knowledge and insights
          </p>
        </div>

        {/* Authors Grid */}
        {authors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-fade-in-up animate-delay-200">
            {authors.map((author, index) => {
              const gradient = gradients[index % gradients.length]
              return (
                <Link
                  key={author.id}
                  href={`/authors/${author.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl font-bold shadow-xl border-4 border-white overflow-hidden`}>
                      {author.avatar ? (
                        <Image
                          src={getOptimizedAvatarUrl(author.avatar, 96)}
                          alt={author.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          unoptimized={false}
                        />
                      ) : (
                        getInitials(author.name)
                      )}
                    </div>
                  </div>
                  <div className="pt-16 pb-6 px-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                      {author.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 break-all">
                      {author.email}
                    </p>
                    {author.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {author.bio}
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{author.postCount} {author.postCount === 1 ? 'article' : 'articles'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        View Profile
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in-up animate-delay-200">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Authors Found</h3>
              <p className="text-gray-600">There are no authors available at the moment.</p>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 animate-fade-in-up animate-delay-300">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{authors.length}</div>
            <div className="text-gray-600">Total Authors</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {authors.reduce((sum, author) => sum + author.postCount, 0)}
            </div>
            <div className="text-gray-600">Total Articles</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {authors.length > 0 ? Math.round(authors.reduce((sum, author) => sum + author.postCount, 0) / authors.length) : 0}
            </div>
            <div className="text-gray-600">Avg Articles per Author</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
