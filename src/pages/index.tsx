import { sanity, urlFor } from '@/lib/sanity'

export default async function Home() {
  const events = await sanity.fetch(`*[_type == "event"]{
    name,
    image
  }`)

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <ul className="space-y-4">
        {events.map((event: any, i: number) => (
          <li key={i} className="p-4 rounded bg-gray-100">
            <p className="font-semibold">{event.name}</p>
            {event.image && (
              <img
                src={urlFor(event.image).width(600).url()}
                alt={event.name}
                className="mt-2 rounded shadow"
              />
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
