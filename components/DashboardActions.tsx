'use client'

import Link from 'next/link'

export default function DashboardActions() {
  const actions = [
    {
      title: 'Create New Post',
      description: 'Start writing a new article and share your thoughts with the world',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      href: '/dashboard/posts/new',
      color: 'bg-gray-900 hover:bg-gray-800',
      iconBg: 'bg-gray-800',
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Manage your content</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-gray-200 p-8 hover:border-gray-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            
            <div className="relative z-10">
              <div className={`w-16 h-16 ${action.iconBg} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                {action.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                {action.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {action.description}
              </p>
              <div className={`inline-flex items-center gap-2 ${action.color} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 group-hover:shadow-xl group-hover:gap-3 group-hover:scale-105`}>
                <span>Get Started</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
