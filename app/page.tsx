import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { postsQuery } from '@/sanity/queries'
import PostCard from '@/components/PostCard'

// Revalidate every hour as a fallback; on-demand ISR fires immediately on publish.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'WriteAssess Blog — Insights for Primary School Teachers',
  description:
    'Practical guidance on AI-powered writing assessment, DfE exemplification criteria, and primary school teaching strategies.',
  alternates: { canonical: 'https://www.writeassess.co.uk/blog' },
  openGraph: {
    title: 'WriteAssess Blog',
    description: 'Practical guidance on AI-powered writing assessment for primary teachers.',
    url: 'https://www.writeassess.co.uk/blog',
    type: 'website',
  },
}

export default async function BlogIndexPage() {
  const posts = await client.fetch(postsQuery)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          WriteAssess Blog
        </h1>
        <p className="text-gray-500 text-lg">
          Practical insights on writing assessment, DfE criteria, and primary school teaching.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-20">No posts published yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
