import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import Categories from '@/components/Categories'
import TrendingPosts from '@/components/TrendingPosts'
import LatestPosts from '@/components/LatestPosts'
import CallToAction from '@/components/CallToAction'
import Footer from '@/components/Footer'

export default function PostListingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search Bar */}
        <div className="mb-16 flex justify-center animate-fade-in-up animate-delay-100">
          <SearchBar />
        </div>

        {/* Categories */}
        <div className="animate-fade-in-up animate-delay-200">
          <Categories />
        </div>

        {/* Trending Posts */}
        <div className="animate-fade-in-up animate-delay-300">
          <TrendingPosts />
        </div>

        {/* Latest Posts */}
        <div className="animate-fade-in-up animate-delay-400">
          <LatestPosts />
        </div>
      </main>

      {/* Call to Action */}
      <div className="animate-fade-in-up animate-delay-500">
        <CallToAction />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
