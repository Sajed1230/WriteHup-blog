interface PostTagsProps {
  tags: string[]
  categories: string[]
}

'use client'

import Link from 'next/link'

export default function PostTags({ tags, categories }: PostTagsProps) {
  const createCategorySlug = (category: string) => {
    return category.toLowerCase().replace(/\s+/g, '-')
  }

  const createTagSlug = (tag: string) => {
    return encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-b border-gray-200 my-12">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-gray-900">Categories:</span>
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/category/${createCategorySlug(category)}`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {category}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 flex-wrap ml-auto">
          <span className="text-sm font-semibold text-gray-900">Tags:</span>
          {tags.map((tag, index) => (
            <Link
              key={index}
              href={`/tag/${createTagSlug(tag)}`}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
