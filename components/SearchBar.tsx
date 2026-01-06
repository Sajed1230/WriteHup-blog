'use client'

export default function SearchBar() {
  return (
    <div className="relative max-w-3xl w-full">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search posts, topics, authors..."
        className="block w-full pl-14 pr-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all shadow-sm hover:shadow-md placeholder:text-gray-400 text-gray-900"
      />
    </div>
  )
}
