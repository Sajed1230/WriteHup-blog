'use client'

import { useEffect, useRef } from 'react'

export default function AutoPlayVideo({ src, poster, title }: { src: string; poster?: string; title?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch((error) => {
              console.log('Autoplay prevented:', error)
            })
          } else {
            video.pause()
          }
        })
      },
      {
        threshold: 0.5,
      }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="rounded-2xl overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src}
        controls
        loop
        muted
        playsInline
        className="w-full h-auto"
        poster={poster}
      >
        Your browser does not support the video tag.
      </video>
      {title && (
        <p className="text-sm text-gray-600 mt-2 text-center px-4">{title}</p>
      )}
    </div>
  )
}


