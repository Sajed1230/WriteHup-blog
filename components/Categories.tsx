'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const categories = [
  { name: 'All', slug: 'all' },
  { name: 'Tech', slug: 'tech' },
  { name: 'AI', slug: 'ai' },
  { name: 'Programming', slug: 'programming' },
  { name: 'Design', slug: 'design' },
  { name: 'Business', slug: 'business' },
  { name: 'Productivity', slug: 'productivity' },
]

export default function Categories() {
  const pathname = usePathname()
  const isCategoryPage = pathname?.startsWith('/category/')

  const handleCategoryClick = (slug: string, e: React.MouseEvent) => {
    if (slug === 'all') {
      e.preventDefault()
      // Navigate to post listing page instead
      window.location.href = '/post'
    }
  }

  return (
    <div className="mb-16">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const href = category.slug === 'all' ? '/post' : `/category/${category.slug}`
          const isActive = isCategoryPage && pathname?.includes(category.slug)
          
          return (
            <Link
              key={category.name}
              href={href}
              onClick={(e) => handleCategoryClick(category.slug, e)}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {category.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
