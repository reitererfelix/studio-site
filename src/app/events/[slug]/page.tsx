import { sanity, urlFor } from '@/lib/sanity'

type Props = {
  params: { slug: string }
}

type EventType = {
  name: string
  images?: { asset: any }[]
  video?: { asset: any }
}

export default async function EventPage({ params }: Props) {
  const event: EventType = await sanity.fetch(
    `*[_type == "event" && slug.current == $slug][0]`,
    { slug: params.slug }
  )

  return (
    <main className="p-6">
      <h1 className="text-xl mb-4">{event.name}</h1>

      {event.images?.map((img, i) => (
        <img
          key={i}
          src={urlFor(img).width(800).url()}
          className="mb-4"
          alt=""
        />
      ))}

      {event.video && (
        <video controls className="w-full mt-4">
          <source src={urlFor(event.video).url()} type="video/mp4" />
        </video>
      )}
    </main>
  )
}

export async function generateStaticParams() {
  const slugs: string[] = await sanity.fetch(
    `*[_type == "event" && defined(slug.current)][].slug.current`
  )

  return slugs.map((slug) => ({ slug }))
}
