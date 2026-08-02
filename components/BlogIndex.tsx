'use client'

import { useState, useMemo } from 'react'
import PostCard from './PostCard'

interface Post {
  _id: string
  title: string
  slug: string
  publishedAt?: string
  excerpt?: string
  mainImage?: { asset: { _ref: string }; alt?: string }
  tags?: string[]
}

export default function BlogIndex({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [posts])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return posts.filter((p) => {
      const matchesTag = !activeTag || p.tags?.includes(activeTag)
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q)
      return matchesTag && matchesQuery
    })
  }, [posts, query, activeTag])

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div>
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search articles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>
      </div>

      {/* Tag filter chips */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              activeTag === null
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                activeTag === tag
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-gray-400 text-center py-20">No articles match your search.</p>
      )}

      {/* Featured post */}
      {featured && (
        <div className="mb-10">
          <PostCard post={featured} featured />
        </div>
      )}

      {/* Post grid */}
      {rest.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
