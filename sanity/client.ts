import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-07-01',
  // useCdn: false so ISR revalidation always fetches the freshest published data.
  useCdn: false,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source: SanityImageSource) => builder.image(source)
