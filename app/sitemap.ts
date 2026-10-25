import type { MetadataRoute } from 'next'
import { client } from '@/sanity/client'
import { allSlugsQuery } from '@/sanity/queries'

// Revalidate the sitemap hourly (same cadence as pages).
export const revalidate = 3600

const BASE = 'https://www.writeassess.co.uk/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs: { slug: string; updatedAt?: string }[] = await client.fetch(allSlugsQuery)

  // lastmod tells Google and Bing which posts are new or changed, so they
  // recrawl those first when they re-read the sitemap.
  const postEntries: MetadataRoute.Sitemap = slugs.map(({ slug, updatedAt }) => ({
    url: `${BASE}/${slug}`,
    ...(updatedAt ? { lastModified: new Date(updatedAt) } : {}),
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
