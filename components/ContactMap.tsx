'use client'

export default function ContactMap() {
  // Using an embedded Google Maps iframe
  // In a real app, you might want to use a mapping library like Leaflet or Google Maps API
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509041!2d-122.41941548468147!3d37.774929279759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter%20HQ!5e0!3m2!1sen!2sus!4v1234567890"

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <div className="relative w-full h-[400px] md:h-[500px] bg-gray-200">
        {/* Placeholder map - In production, replace with actual map embed */}
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />
        {/* Fallback for when map doesn't load */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center pointer-events-none">
          <div className="text-center p-8">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-600 font-medium">123 Innovation Street</p>
            <p className="text-gray-500">San Francisco, CA 94102</p>
          </div>
        </div>
      </div>
    </div>
  )
}






