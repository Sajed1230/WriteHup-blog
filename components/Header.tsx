'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useMemo, memo, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'

const Header = memo(function Header() {
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [isBlogOpen, setIsBlogOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, loading, logout } = useAuth()
  
  
  const handleUserMenuToggle = useCallback(() => {
    setIsUserMenuOpen(prev => !prev)
  }, [])
  
  const handleUserMenuClose = useCallback(() => {
    setIsUserMenuOpen(false)
  }, [])

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])
  
  // Memoize pathname checks to avoid recalculations
  const pathnameChecks = useMemo(() => ({
    isHome: pathname === '/',
    isPostListing: pathname === '/post',
    isPostDetail: pathname?.startsWith('/post/') && pathname !== '/post',
    isPostPage: pathname === '/post' || (pathname?.startsWith('/post/') && pathname !== '/post'),
    isCategoryPage: pathname?.startsWith('/category/'),
    isAuthorsPage: pathname === '/authors' || pathname?.startsWith('/authors/'),
    isAboutPage: pathname === '/about',
    isContactPage: pathname === '/contact',
    isPricingPage: pathname === '/pricing',
    isMorePage: pathname === '/about' || pathname === '/contact' || pathname === '/pricing',
    isLoginPage: pathname === '/login',
    isSignupPage: pathname === '/signup',
  }), [pathname])
  
  const isPostDetailPage = useMemo(() => pathnameChecks.isPostDetail, [pathnameChecks.isPostDetail])

  const headerStyle = useMemo(() => ({ 
    transform: 'translateZ(0)', 
    willChange: 'auto', 
    isolation: 'isolate' as const 
  }), [])

  const logoContainerStyle = useMemo(() => ({ minWidth: '140px' }), [])
  const authContainerStyle = useMemo(() => ({ 
    minWidth: '120px', 
    justifyContent: 'flex-end' as const, 
    visibility: 'visible' as const, 
    opacity: 1 
  }), [])

  const backButtonStyle = useMemo(() => ({ 
    width: isPostDetailPage ? 'auto' : '0', 
    overflow: 'hidden' as const, 
    opacity: isPostDetailPage ? 1 : 0, 
    transition: 'opacity 0.2s' 
  }), [isPostDetailPage])

  const navStyle = useMemo(() => ({ 
    visibility: 'visible' as const, 
    opacity: 1
  }), [])

  const buttonStyle = useMemo(() => ({ 
    visibility: 'visible' as const, 
    opacity: 1 
  }), [])

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm shadow-gray-900/5" style={headerStyle}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 min-h-[80px]">
          {/* Logo and Back Button */}
          <div className="flex items-center gap-4" style={logoContainerStyle}>
            <div style={backButtonStyle}>
              <Link 
                href="/post" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group whitespace-nowrap"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-semibold">Back to Blog</span>
              </Link>
            </div>
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <img 
                src="/logosajed.png" 
                alt="Logo" 
                className="h-10 w-auto transition-opacity duration-300 group-hover:opacity-90"
              />
              <span className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                WriteHup
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1" style={navStyle}>
            <Link 
              href="/" 
              className={`font-semibold text-sm transition-colors duration-200 relative group px-4 py-2 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                pathnameChecks.isHome
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={buttonStyle}
            >
              Home
              {pathnameChecks.isHome && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
              )}
            </Link>
            
            <Link 
              href="/post" 
              className={`font-semibold text-sm transition-colors duration-200 relative group px-4 py-2 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                pathnameChecks.isPostPage
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={buttonStyle}
            >
              Posts
              {pathnameChecks.isPostPage && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
              )}
            </Link>

            <div 
              className="relative" 
              onMouseEnter={() => setIsProductsOpen(true)} 
              onMouseLeave={() => setIsProductsOpen(false)}
              style={{ zIndex: 60 }}
            >
              <button
                className={`font-semibold text-sm flex items-center transition-colors duration-200 relative group px-4 py-2 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  pathnameChecks.isCategoryPage
                    ? 'text-gray-900 bg-gray-100' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Categories
                <svg className={`ml-1.5 h-4 w-4 transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {pathnameChecks.isCategoryPage && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
                )}
              </button>
              {isProductsOpen && (
                <div 
                  className="absolute top-full left-0 mt-0 w-52 bg-white rounded-xl shadow-xl border border-gray-200/80 py-2 backdrop-blur-sm"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                  style={{ 
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '2px',
                    zIndex: 70,
                    animation: 'fadeIn 0.2s ease-out',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    pointerEvents: 'auto',
                    display: 'block',
                    visibility: 'visible',
                    opacity: 1,
                    width: '208px'
                  }}
                >
                  <Link href="/category/tech" className="block px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 transition-colors duration-200 font-medium text-sm">Tech</Link>
                  <Link href="/category/design" className="block px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 transition-colors duration-200 font-medium text-sm">Design</Link>
                  <Link href="/category/programming" className="block px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 transition-colors duration-200 font-medium text-sm">Programming</Link>
                  <Link href="/category/ai" className="block px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 transition-colors duration-200 font-medium text-sm">AI</Link>
                  <Link href="/category/business" className="block px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 transition-colors duration-200 font-medium text-sm">Business</Link>
                  <Link href="/category/productivity" className="block px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 transition-colors duration-200 font-medium text-sm">Productivity</Link>
                </div>
              )}
            </div>

            <Link 
              href="/authors" 
              className={`font-semibold text-sm transition-colors duration-200 relative group px-4 py-2 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                pathnameChecks.isAuthorsPage
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={buttonStyle}
            >
              Authors
              {pathnameChecks.isAuthorsPage && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
              )}
            </Link>

            <div 
              className="relative" 
              onMouseEnter={() => {
                setIsBlogOpen(true)
              }} 
              onMouseLeave={() => {
                setIsBlogOpen(false)
              }}
              style={{ zIndex: 60, position: 'relative' }}
            >
              <button
                className={`font-semibold text-sm flex items-center transition-colors duration-200 px-4 py-2 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  pathnameChecks.isMorePage
                    ? 'text-gray-900 bg-gray-100' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                More
                <svg className={`ml-1.5 h-4 w-4 transition-transform duration-200 ${isBlogOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {pathnameChecks.isMorePage && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
                )}
              </button>
              {isBlogOpen && (
                <div 
                  className="absolute top-full left-0 mt-0 w-48 bg-white rounded-xl shadow-xl border border-gray-200/80 py-2 backdrop-blur-sm"
                  onMouseEnter={() => setIsBlogOpen(true)}
                  onMouseLeave={() => setIsBlogOpen(false)}
                  style={{ 
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '2px',
                    zIndex: 70,
                    animation: 'fadeIn 0.2s ease-out',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    pointerEvents: 'auto',
                    display: 'block',
                    visibility: 'visible',
                    opacity: 1,
                    width: '192px'
                  }}
                >
                  <Link href="/pricing" className="block px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 transition-colors duration-200 font-medium text-sm">Pricing</Link>
                  <Link href="/about" className="block px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 transition-colors duration-200 font-medium text-sm">About us</Link>
                  <Link href="/contact" className="block px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 transition-colors duration-200 font-medium text-sm">Contact</Link>
                </div>
              )}
            </div>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden lg:flex items-center space-x-3" style={authContainerStyle}>
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={handleUserMenuToggle}
                  onBlur={(e) => {
                    // Only close if focus is moving outside the menu
                    const relatedTarget = e.relatedTarget as HTMLElement
                    if (relatedTarget && !e.currentTarget.closest('.relative')?.contains(relatedTarget)) {
                      setTimeout(handleUserMenuClose, 200)
                    }
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg border-2 border-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-gray-300 transition-colors">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold text-sm text-gray-700 group-hover:text-gray-900">
                    {user.name}
                  </span>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200/80 py-2 z-[60] backdrop-blur-sm"
                    style={{ 
                      animation: 'fadeIn 0.2s ease-out',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden'
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    {/* Only show profile link for readers, not authors/admins */}
                    {user.role === 'reader' && (
                      <>
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 transition-colors duration-200 font-medium text-sm"
                          onClick={handleUserMenuClose}
                        >
                          My Profile
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                      </>
                    )}
                    {/* Show dashboard link for authors/admins */}
                    {(user.role === 'author' || user.role === 'admin') && (
                      <>
                        <Link 
                          href="/dashboard" 
                          className="block px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 transition-colors duration-200 font-medium text-sm"
                          onClick={handleUserMenuClose}
                        >
                          Dashboard
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                      </>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        handleUserMenuClose()
                      }}
                      className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium text-sm"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`font-semibold text-sm px-4 py-2 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
                    pathnameChecks.isLoginPage
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  style={buttonStyle}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className={`px-6 py-2.5 rounded-lg font-semibold text-sm border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
                    pathnameChecks.isSignupPage
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg'
                  }`}
                  style={buttonStyle}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button - only visible on mobile/tablet screens, hidden on laptops */}
          <button 
            onClick={handleMobileMenuToggle}
            className="mobile-menu-button flex lg:hidden items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu - only visible on mobile/tablet screens, hidden on laptops */}
        {isMobileMenuOpen && (
          <div className="mobile-menu lg:hidden border-t border-gray-200 bg-white animate-slide-down overflow-hidden">
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Navigation Links */}
              <Link
                href="/"
                onClick={handleMobileMenuClose}
                className={`block px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 animate-fade-in-slide ${
                  pathnameChecks.isHome
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{ animationDelay: '0.1s' }}
              >
                Home
              </Link>
              
              <Link
                href="/post"
                onClick={handleMobileMenuClose}
                className={`block px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 animate-fade-in-slide ${
                  pathnameChecks.isPostPage
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{ animationDelay: '0.15s' }}
              >
                Posts
              </Link>

              {/* Categories Dropdown */}
              <div className="space-y-1 animate-fade-in-slide" style={{ animationDelay: '0.2s' }}>
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    pathnameChecks.isCategoryPage
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>Categories</span>
                  <svg className={`h-4 w-4 transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isProductsOpen && (
                  <div className="pl-4 space-y-1 animate-slide-down">
                    <Link href="/category/tech" onClick={handleMobileMenuClose} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-all duration-200">Tech</Link>
                    <Link href="/category/design" onClick={handleMobileMenuClose} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-all duration-200">Design</Link>
                    <Link href="/category/programming" onClick={handleMobileMenuClose} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-all duration-200">Programming</Link>
                    <Link href="/category/ai" onClick={handleMobileMenuClose} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-all duration-200">AI</Link>
                    <Link href="/category/business" onClick={handleMobileMenuClose} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-all duration-200">Business</Link>
                    <Link href="/category/productivity" onClick={handleMobileMenuClose} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-all duration-200">Productivity</Link>
                  </div>
                )}
              </div>

              <Link
                href="/authors"
                onClick={handleMobileMenuClose}
                className={`block px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 animate-fade-in-slide ${
                  pathnameChecks.isAuthorsPage
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{ animationDelay: '0.25s' }}
              >
                Authors
              </Link>

              {/* More Dropdown */}
              <div className="space-y-1 animate-fade-in-slide" style={{ animationDelay: '0.3s' }}>
                <button
                  onClick={() => setIsBlogOpen(!isBlogOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    pathnameChecks.isMorePage
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>More</span>
                  <svg className={`h-4 w-4 transition-transform duration-300 ${isBlogOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isBlogOpen && (
                  <div className="pl-4 space-y-1 animate-slide-down">
                    <Link href="/pricing" onClick={handleMobileMenuClose} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-all duration-200">Pricing</Link>
                    <Link href="/about" onClick={handleMobileMenuClose} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-all duration-200">About us</Link>
                    <Link href="/contact" onClick={handleMobileMenuClose} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-all duration-200">Contact</Link>
                  </div>
                )}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2 animate-fade-in-slide" style={{ animationDelay: '0.35s' }}>
                {loading ? (
                  <div className="w-full h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                ) : user ? (
                  <>
                    <div className="px-4 py-2">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    {user.role === 'reader' && (
                      <Link
                        href="/profile"
                        onClick={handleMobileMenuClose}
                        className="block px-4 py-3 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        My Profile
                      </Link>
                    )}
                    {(user.role === 'author' || user.role === 'admin') && (
                      <Link
                        href="/dashboard"
                        onClick={handleMobileMenuClose}
                        className="block px-4 py-3 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        handleMobileMenuClose()
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg font-semibold text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={handleMobileMenuClose}
                      className={`block px-4 py-3 rounded-lg font-semibold text-sm text-center transition-all duration-200 ${
                        pathnameChecks.isLoginPage
                          ? 'text-gray-900 bg-gray-100'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={handleMobileMenuClose}
                      className={`block px-4 py-3 rounded-lg font-semibold text-sm text-center transition-all duration-200 ${
                        pathnameChecks.isSignupPage
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
})

export default Header
