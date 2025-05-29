'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

type ImageTrailProps = {
  images: string[]
}

function throttle(func: (...args: any[]) => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return (...args: any[]) => {
    if (!timeoutId) {
      func(...args)
      timeoutId = setTimeout(() => {
        timeoutId = null
      }, delay)
    }
  }
}

export default function ImageTrail({ images }: ImageTrailProps) {
  const [trail, setTrail] = useState<{ id: number; src: string; x: number; y: number }[]>([])
  const lastPos = useRef({ x: null as number | null, y: null as number | null })
  const imageIndex = useRef(0)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const { clientX, clientY } = e

      if (lastPos.current.x === null || lastPos.current.y === null) {
        lastPos.current = { x: clientX, y: clientY }
        return
      }

      const dx = clientX - lastPos.current.x
      const dy = clientY - lastPos.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Exclude top-right 200x200 px corner
      if (clientX > window.innerWidth - 200 && clientY < 200) return

      if (distance > 50 && images.length > 0) {
        lastPos.current = { x: clientX, y: clientY }

        const newImage = {
          id: Date.now(),
          src: images[imageIndex.current],
          x: clientX - 150,
          y: clientY - 150,
        }

        imageIndex.current = (imageIndex.current + 1) % images.length

        setTrail((prev) => {
          const updated = [...prev, newImage]
          if (updated.length > 7) updated.shift()
          return updated
        })
      }
    },
    [images]
  )

  const throttledMouseMove = useCallback(throttle(handleMouseMove, 50), [handleMouseMove])

  useEffect(() => {
    window.addEventListener('mousemove', throttledMouseMove)
    return () => window.removeEventListener('mousemove', throttledMouseMove)
  }, [throttledMouseMove])

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {trail.map((img, index) => (
        <img
          key={img.id}
          src={img.src}
          alt=""
          className="absolute"
          style={{
            left: img.x,
            top: img.y,
            width: '300px',
            pointerEvents: 'none',
            zIndex: index + 1,
            objectFit: 'contain',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          onLoad={(e) => {
            e.currentTarget.style.opacity = '1'
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      ))}
    </div>
  )
}
