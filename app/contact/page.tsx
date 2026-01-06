import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import ContactInfo from '@/components/ContactInfo'
import ContactMap from '@/components/ContactMap'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-300">
              Have a question or want to collaborate? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Contact Form */}
              <div className="animate-fade-in-up animate-delay-100">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Send us a Message
                </h2>
                <p className="text-gray-600 mb-6 sm:mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                <ContactForm />
              </div>

              {/* Contact Information */}
              <div className="animate-fade-in-up animate-delay-200">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Contact Information
                </h2>
                <p className="text-gray-600 mb-6 sm:mb-8">
                  You can also reach us through these channels:
                </p>
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center animate-fade-in-up animate-delay-300">
              Find Us
            </h2>
            <div className="animate-scale-in animate-delay-400">
              <ContactMap />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
