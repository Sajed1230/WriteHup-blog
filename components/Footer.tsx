import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Product */}
          <div>
            <h3 className="text-white font-bold mb-5 text-lg">Product</h3>
            <ul className="space-y-3.5">
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Overview</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Solutions</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Tutorials</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Releases</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-5 text-lg">Company</h3>
            <ul className="space-y-3.5">
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">About us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Press</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">News</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Media kit</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-5 text-lg">Resources</h3>
            <ul className="space-y-3.5">
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Newsletter</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Events</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Help centre</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Tutorials</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Support</Link></li>
            </ul>
          </div>

          {/* Use cases */}
          <div>
            <h3 className="text-white font-bold mb-5 text-lg">Use cases</h3>
            <ul className="space-y-3.5">
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Startups</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Enterprise</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Government</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">SaaS centre</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Marketplaces</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Ecommerce</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold mb-5 text-lg">Social</h3>
            <ul className="space-y-3.5">
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Twitter</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">LinkedIn</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Facebook</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">GitHub</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">AngelList</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Dribbble</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-5 text-lg">Legal</h3>
            <ul className="space-y-3.5">
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Terms</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Privacy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Cookies</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Licenses</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Settings</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-10 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
              WriteHup
            </Link>
          </div>
          <div className="text-sm text-gray-400">
            © 2024 WriteHup. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
