export default function CallToAction() {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-t-3xl mt-20 mb-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
          Let's get started on something great
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Join over 4,000+ startups already growing with WriteHup
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
            Chat to us
          </button>
          <button className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-gray-700/50 transition-all duration-200 border-2 border-gray-700 hover:border-gray-600 shadow-lg hover:shadow-xl hover:scale-105">
            Get started
          </button>
        </div>
      </div>
    </section>
  )
}
