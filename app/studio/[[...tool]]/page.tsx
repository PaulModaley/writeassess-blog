'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

// Re-export Next.js metadata + viewport presets that Sanity Studio needs.
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
