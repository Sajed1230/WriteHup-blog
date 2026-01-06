'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface FilterBarProps {
  sortBy: string
  authors: string[]
  selectedAuthor?: string
  type: 'category' | 'tag'
  slug: string
}

export default function FilterBar({ sortBy, authors, selectedAuthor, type, slug }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // Reset to page 1 when filtering
    router.push(`/${type}/${slug}?${params.toString()}`)
  }

  return (
    <div className="mb-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-semibold text-gray-900">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-gray-900 font-medium cursor-pointer"
          >
            <option value="date">Date (Newest First)</option>
            <option value="popularity">Popularity</option>
            <option value="author">Author (A-Z)</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-semibold text-gray-900">Filter by author:</label>
          <select
            value={selectedAuthor || 'all'}
            onChange={(e) => updateFilter('author', e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-gray-900 font-medium cursor-pointer min-w-[180px]"
          >
            <option value="all">All Authors</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}






