import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TeamMember from '@/components/TeamMember'
import NewsletterCTA from '@/components/NewsletterCTA'

const teamMembers = [
  {
    name: 'Frankie Sullivan',
    role: 'Founder & CEO',
    bio: 'Product design advocate and entrepreneur. Passionate about making design accessible to everyone.',
    avatar: 'FS',
    social: {
      twitter: 'https://twitter.com/frankiesullivan',
      linkedin: 'https://linkedin.com/in/frankiesullivan',
    },
  },
  {
    name: 'Sarah Johnson',
    role: 'Editor-in-Chief',
    bio: 'Content strategist and writer with over 10 years of experience in tech publishing.',
    avatar: 'SJ',
    social: {
      twitter: 'https://twitter.com/sarahjohnson',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
    },
  },
  {
    name: 'Mike Chen',
    role: 'Technical Lead',
    bio: 'Full-stack developer and architect. Ensures our platform runs smoothly and scales efficiently.',
    avatar: 'MC',
    social: {
      twitter: 'https://twitter.com/mikechen',
      github: 'https://github.com/mikechen',
    },
  },
  {
    name: 'Emma Davis',
    role: 'Design Director',
    bio: 'UX designer and design systems expert. Creates beautiful, user-friendly experiences.',
    avatar: 'ED',
    social: {
      twitter: 'https://twitter.com/emmadavis',
      linkedin: 'https://linkedin.com/in/emmadavis',
    },
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              About WriteHup
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed">
              A platform dedicated to sharing knowledge, insights, and stories from the world of technology, design, and innovation.
            </p>
          </div>
        </section>

        {/* Company Description */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up animate-delay-100">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Who We Are
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  WriteHup is a modern blog platform that brings together talented writers, designers, developers, and thought leaders to share their expertise and insights. We believe in the power of knowledge sharing and creating a community where ideas can flourish.
                </p>
                <p>
                  Founded in 2022, WriteHup has grown into a trusted source for high-quality content covering topics ranging from web development and design to business strategy and productivity. Our mission is to make valuable knowledge accessible to everyone, regardless of their background or experience level.
                </p>
                <p>
                  We're more than just a blog—we're a community of learners, creators, and innovators who are passionate about sharing what they know and learning from others.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up animate-delay-200">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-blue-100">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-4">
                To democratize knowledge and make valuable insights accessible to everyone. We believe that great ideas should be shared, not hoarded.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're committed to creating a platform where writers can share their expertise, readers can discover new perspectives, and the entire community can grow together. Whether you're just starting your journey or you're a seasoned professional, WriteHup is here to support your learning and growth.
              </p>
            </div>
          </div>
        </section>

        {/* Values/Stats Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center animate-fade-in-up animate-delay-300">
              What We've Achieved
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 animate-fade-in-up animate-delay-400">
              <div className="text-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="text-5xl font-bold text-gray-900 mb-4">4,000+</div>
                <div className="text-lg text-gray-600">Active Readers</div>
              </div>
              <div className="text-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="text-5xl font-bold text-gray-900 mb-4">500+</div>
                <div className="text-lg text-gray-600">Published Articles</div>
              </div>
              <div className="text-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="text-5xl font-bold text-gray-900 mb-4">50+</div>
                <div className="text-lg text-gray-600">Expert Contributors</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-in-up animate-delay-300">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The passionate people behind WriteHup, dedicated to creating great content and building a thriving community.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 animate-fade-in-up animate-delay-400">
              {teamMembers.map((member, index) => (
                <TeamMember key={index} {...member} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsletterCTA />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
