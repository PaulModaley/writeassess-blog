import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { urlFor } from '@/sanity/client'

interface Post {
  _id: string
  title: string
  slug: string
  publishedAt?: string
  excerpt?: string
  mainImage?: { asset: { _ref: string }; alt?: string }
  tags?: string[]
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
      {label}
    </span>
  )
}

export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage)
        .width(featured ? 1200 : 800)
        .height(featured ? 500 : 420)
        .fit('crop')
        .url()
    : null

  const dateStr = post.publishedAt
    ? format(new Date(post.publishedAt), 'd MMMM yyyy')
    : null

  if (featured) {
    return (
      <article className="group rounded-2xl border border-gray-100 overflow-hidden bg-white hover:shadow-lg transition-shadow sm:flex">
        {imageUrl ? (
          <Link href={`/${post.slug}`} className="block sm:w-1/2 overflow-hidden bg-gray-100 aspect-[16/9] sm:aspect-auto flex-shrink-0">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              width={1200}
              height={500}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          </Link>
        ) : (
          <div className="sm:w-1/2 bg-gradient-to-br from-primary/10 to-primary/5 flex-shrink-0" />
        )}
        <div className="flex flex-col justify-center p-6 sm:p-8">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag) => <Tag key={tag} label={tag} />)}
            </div>
          )}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-primary transition-colors">
            <Link href={`/${post.slug}`}>{post.title}</Link>
          </h2>
          {post.excerpt && (
            <p className="text-gray-500 leading-relaxed mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between">
            {dateStr && (
              <time className="text-sm text-gray-400" dateTime={post.publishedAt}>
                {dateStr}
              </time>
            )}
            <Link
              href={`/${post.slug}`}
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Read article →
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex flex-col rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow bg-white">
      {imageUrl ? (
        <Link href={`/${post.slug}`} className="block overflow-hidden aspect-[16/9] bg-gray-100">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            width={800}
            height={420}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </Link>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-primary/5" />
      )}
      <div className="flex flex-col flex-1 p-5">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.tags.slice(0, 3).map((tag) => <Tag key={tag} label={tag} />)}
          </div>
        )}
        {dateStr && (
          <time className="text-xs text-gray-400 mb-2" dateTime={post.publishedAt}>
            {dateStr}
          </time>
        )}
        <h2 className="font-semibold text-gray-900 leading-snug mb-2 group-hover:text-primary transition-colors">
          <Link href={`/${post.slug}`}>{post.title}</Link>
        </h2>
        {post.excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <Link
          href={`/${post.slug}`}
          className="mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Read more →
        </Link>
      </div>
    </article>
  )
}
