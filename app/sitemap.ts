import type { MetadataRoute } from 'next'
import { client } from '@/sanity/client'
import { allSlugsQuery } from '@/sanity/queries'

// Revalidate the sitemap hourly (same cadence as pages).
export const revalidate = 3600

const BASE = 'https://www.writeassess.co.uk/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs: { slug: string }[] = await client.fetch(allSlugsQuery)

  const postEntries: MetadataRoute.Sitemap = slugs.map(({ slug }) => ({
    url: `${BASE}/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: BASE,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postEntries,
  ]
}
