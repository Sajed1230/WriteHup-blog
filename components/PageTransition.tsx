'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Reset visibility when pathname changes
    setIsVisible(false)
    
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div className={isVisible ? 'animate-fade-in' : 'opacity-0'}>
      {children}
    </div>
  )
}






