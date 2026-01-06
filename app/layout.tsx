import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'WriteHup - Your Blog Platform',
  description: 'Discover amazing articles and stories on WriteHup',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="relative font-sans">
        <div className="fixed inset-0 bg-white -z-10"></div>
        {children}
      </body>
    </html>
  )
}
