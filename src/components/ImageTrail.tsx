/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

export type ImageTrailProps = {
  images: string[]
}

function throttle(func: (e: MouseEvent) => void, delay: number): (e: MouseEvent) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return (e: MouseEvent) => {
    if (!timeoutId) {
      func(e)
      timeoutId = setTimeout(() => {
        timeoutId = null
      }, delay)
    }
  }
}

export default function ImageTrail({ images }: ImageTrailProps) {
  const [trail, setTrail] = useState<{ id: number; src: string; x: number; y: number }[]>([])
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const imageIndex = useRef(0)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const { clientX, clientY } = e
      if (!lastPos.current) {
        lastPos.current = { x: clientX, y: clientY }
        return
      }
      const dx = clientX - lastPos.current.x
      const dy = clientY - lastPos.current.y
      const distance = Math.hypot(dx, dy)

      // Exclude top-right 200×200px corner
      if (clientX > window.innerWidth - 200 && clientY < 200) return

      if (distance > 50 && images.length) {
        lastPos.current = { x: clientX, y: clientY }
        const newImage = {
          id: Date.now(),
          src: images[imageIndex.current],
          x: clientX - 150,
          y: clientY - 150,
        }
        imageIndex.current = (imageIndex.current + 1) % images.length
        setTrail((prev) => {
          const next = [...prev, newImage]
          return next.length > 7 ? next.slice(1) : next
        })
      }
    },
    [images]
  )

  useEffect(() => {
    const throttled = throttle(handleMouseMove, 50)
    window.addEventListener('mousemove', throttled)
    return () => window.removeEventListener('mousemove', throttled)
  }, [handleMouseMove])

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {trail.map((img, idx) => (
        <img
          key={img.id}
          src={img.src}
          style={{
            position: 'absolute',
            left: img.x,
            top: img.y,
            width: 300,
            pointerEvents: 'none',
            zIndex: idx + 1,
            objectFit: 'contain',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          onLoad={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.opacity = '1'
          }}
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
          alt=""
        />
      ))}
    </div>
  )
}
