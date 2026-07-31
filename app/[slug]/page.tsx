import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { client, urlFor } from '@/sanity/client'
import { postBySlugQuery, allSlugsQuery } from '@/sanity/queries'
import PostBody from '@/components/PostBody'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

// Pre-render all published slugs at build time; new posts are ISR-added at first request.
export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(allSlugsQuery)
  return slugs.map(({ slug }) => ({ slug }))
}

// Dynamic metadata per post.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await client.fetch(postBySlugQuery, { slug })
  if (!post) return {}

  const seoTitle = post.seo?.title || post.title
  const seoDescription = post.seo?.description || post.excerpt || ''
  const ogImageSrc = post.seo?.ogImage || post.mainImage
  const ogImageUrl = ogImageSrc
    ? urlFor(ogImageSrc).width(1200).height(630).fit('crop').url()
    : undefined

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: `https://www.writeassess.co.uk/blog/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `https://www.writeassess.co.uk/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      siteName: 'WriteAssess Blog',
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await client.fetch(postBySlugQuery, { slug })

  if (!post) notFound()

  const heroUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(600).fit('crop').url()
    : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    datePublished: post.publishedAt,
    url: `https://www.writeassess.co.uk/blog/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'WriteAssess',
      url: 'https://www.writeassess.co.uk',
    },
    ...(heroUrl && { image: heroUrl }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6">
          <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{post.title}</span>
        </nav>

        <header className="mb-8">
          <time
            className="text-sm text-gray-400 block mb-3"
            dateTime={post.publishedAt}
          >
            {format(new Date(post.publishedAt), 'd MMMM yyyy')}
          </time>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-gray-500 leading-relaxed">{post.excerpt}</p>
          )}
        </header>

        {heroUrl && (
          <div className="mb-10 rounded-xl overflow-hidden">
            <Image
              src={heroUrl}
              alt={post.mainImage?.alt || post.title}
              width={1200}
              height={600}
              className="w-full object-cover"
              priority
            />
          </div>
        )}

        {post.body && <PostBody body={post.body} />}

        <div className="mt-14 pt-8 border-t">
          <p className="text-sm text-gray-400 mb-4">
            WriteAssess helps primary school teachers assess writing in seconds using AI — grounded
            in official DfE exemplification criteria.
          </p>
          <a
            href="https://www.writeassess.co.uk/auth?plan=individual"
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Try WriteAssess free →
          </a>
        </div>
      </article>
    </>
  )
}
