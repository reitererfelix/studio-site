'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { sanity, urlFor } from '@/lib/sanity'

const ImageTrail = dynamic(() => import('@/components/ImageTrail'), { ssr: false })

export default function HomePage() {
  const [showAbout, setShowAbout] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  // Fetch images from Sanity
  useEffect(() => {
    async function fetchImages() {
      const query = `*[_type == "event" && defined(image)]{ image }`
      try {
        const data: Array<{ image: SanityImageSource }> = await sanity.fetch(query)
        const urls = data
          .filter((doc) => Boolean(doc.image))
          .map((doc) => urlFor(doc.image).width(300).url()!)
        setImageUrls(urls)
      } catch (err) {
        console.error('Failed to fetch images from Sanity:', err)
      }
    }
    fetchImages()
  }, [])

  return (
    <main className="relative w-screen h-screen bg-white text-[#0000ff] overflow-hidden">
      {/* Toggle Button */}
      <div
        className={`absolute top-[12px] right-[12px] text-[14px] font-reddit cursor-pointer z-50 ${
          showAbout ? 'text-white' : 'text-[#0000ff]'
        }`}
        onClick={() => setShowAbout((v) => !v)}
      >
        {showAbout ? '[ CLOSE ]' : '[ ? ]'}
      </div>

      {/* Main Layer */}
      {!showAbout && (
        <>
          <ImageTrail images={imageUrls} />
          <div className="flex items-center justify-center w-full h-full p-[12px] pointer-events-none">
            <h1 className="text-[64px] font-chantilly">mulipan</h1>
          </div>
        </>
      )}

      {/* About Overlay */}
      {showAbout && (
        <div className="absolute inset-0 bg-[#0000ff] text-white z-40 p-[12px]">
          {/* Centered Title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 className="text-[64px] font-chantilly">mulipan</h1>
          </div>

          {/* About Text – Top Left */}
          <div className="absolute top-[12px] left-[12px] w-1/2 text-[14px] font-reddit text-left max-w-[600px]">
            <div>[ ABOUT ]</div>
            <p>
              This is the about section. You can write your studio’s story, values,
              and creative approach here. It supports multiple lines of text and you
              can easily expand it into rich content later.
            </p>
          </div>

          {/* Contact Info – Bottom Left */}
          <div className="absolute bottom-[12px] left-[12px] text-[14px] font-reddit flex gap-x-12 items-end">
            <div className="flex flex-col justify-end">
              <div>mulipan</div>
              <div>Reindorfgasse 12/4</div>
              <div>1150 Vienna</div>
              <div>office@mulipan.com</div>
            </div>
            <div className="flex flex-col justify-end">
              <div>Fabian Krempus</div>
              <div>fabian@mulipan.com</div>
            </div>
            <div className="flex flex-col justify-end">
              <div>Felix Reiterer</div>
              <div>felix@mulipan.com</div>
            </div>
          </div>
        </div>
      )}
    </main>
)
}
