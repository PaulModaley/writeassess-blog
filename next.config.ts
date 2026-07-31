import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // All routes are served under /blog on the main domain.
  // next/link and next/image prepend this automatically.
  basePath: '/blog',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default nextConfig
