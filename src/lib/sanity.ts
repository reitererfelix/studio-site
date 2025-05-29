// lib/sanity.ts
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const sanity = createClient({
  projectId: 'etgmoar1',
  dataset: 'production',
  apiVersion: '2023-12-01',
  useCdn: false, // important: disable during dev for freshest content
})

const builder = imageUrlBuilder(sanity)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
