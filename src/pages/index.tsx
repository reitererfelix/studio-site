// pages/index.tsx
import { sanity, urlFor } from '@/lib/sanity'

type Event = {
  _id: string
  name: string
  image: {
    _type: string
    asset: { _ref: string; _type: string }
  }
}

type Props = {
  events: Event[]
}

export default function Home({ events }: Props) {
  return (
    <main className="bg-white px-[12px] py-8 text-[12px] font-reddit">
      <div
        className="grid justify-center gap-x-3 gap-y-12 sm:gap-x-[85px] sm:gap-y-[85px]"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          alignItems: 'start',
        }}
      >
        {events.map((event, index) => {
          const displayIndex = (events.length - index).toString().padStart(2, '0')

          return (
            <div
              key={event._id}
              className="group w-full max-w-[250px] mx-auto"
            >
              <div className="flex gap-2 mb-3 whitespace-nowrap overflow-visible">
              <span>{displayIndex}.</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {event.name}
              </span>
            </div>
              <img
                src={urlFor(event.image).width(600).url()}
                alt={event.name}
                className="w-full h-auto object-contain"
              />
            </div>
          )
        })}
      </div>
    </main>
  )
}

export async function getStaticProps() {
  const events: Event[] = await sanity.fetch(`*[_type == "event"] | order(_createdAt desc)`)

  return {
    props: {
      events,
    },
    revalidate: 60, // optional: regenerate at most every 60s
  }
}
