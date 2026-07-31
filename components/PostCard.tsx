import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { urlFor } from '@/sanity/client'

interface Post {
  _id: string
  title: string
  slug: string
  publishedAt: string
  excerpt?: string
  mainImage?: { asset: { _ref: string }; alt?: string }
}

export default function PostCard({ post }: { post: Post }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(800).height(420).fit('crop').url()
    : null

  return (
    <article className="group flex flex-col rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow bg-white">
      {imageUrl && (
        <Link href={`/${post.slug}`} className="block overflow-hidden aspect-[16/9] bg-gray-100">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            width={800}
            height={420}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </Link>
      )}
      <div className="flex flex-col flex-1 p-5">
        <time className="text-xs text-gray-400 mb-2" dateTime={post.publishedAt}>
          {format(new Date(post.publishedAt), 'd MMMM yyyy')}
        </time>
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
