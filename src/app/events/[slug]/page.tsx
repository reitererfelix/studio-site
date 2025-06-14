/* eslint-disable @typescript-eslint/no-explicit-any */
import { sanity, urlFor } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

// Dynamic Event Page: route = /events/[slug]
export default async function EventPage(props: any) {
  const slug = props.params.slug
  const event = await sanity.fetch(
    `*[_type == "event" && slug.current == $slug][0]`,
    { slug }
  )
  if (!event) notFound()

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      {/* Back Link */}
      <Link
        href="/"
        className="absolute top-[12px] right-[12px] text-[14px] font-reddit"
      >
        [ BACK ]
      </Link>

      {/* Image row with horizontal scroll */}
      {event.image && (
        <div className="relative w-full mb-4 overflow-x-auto scroll-smooth">
          <div className="flex gap-4 px-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="flex-shrink-0">
                <Image
                  src={urlFor(event.image).width(800).url()!}
                  alt={event.name}
                  width={800}
                  height={600}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Title Below */}
      <h1 className="text-2xl font-semibold text-center">{event.name}</h1>
    </main>
  )
}

export async function generateStaticParams() {
  const slugs: string[] = await sanity.fetch(
    `*[_type == "event" && defined(slug.current)][].slug.current`
  )
  return slugs.map((slug) => ({ slug }))
}
