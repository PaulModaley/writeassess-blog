import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { client, urlFor } from '@/sanity/client'
import { postBySlugQuery, allSlugsQuery } from '@/sanity/queries'
import PostBody from '@/components/PostBody'
import TryCta from '@/components/TryCta'
import { inlineCtaSplitIndex } from '@/lib/tryCta'
import { buildPostJsonLd } from '@/lib/articleExtras'
import ComparisonTable from '@/components/ComparisonTable'
import FaqSection from '@/components/FaqSection'

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

  // One mid-article CTA, just before the H2 nearest the middle (see inlineCtaSplitIndex).
  const splitAt = inlineCtaSplitIndex(post.body)
  const cluster: string | null = post.cluster ?? null

  const heroUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(600).fit('crop').url()
    : null

  const jsonLd = buildPostJsonLd(post, slug, heroUrl)

  return (
    <>
      {jsonLd.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}

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
          {post.lastReviewedAt && (
            <p className="text-sm text-gray-400 -mt-2 mb-3">
              Last checked{' '}
              <time dateTime={post.lastReviewedAt}>
                {format(new Date(post.lastReviewedAt), 'd MMMM yyyy')}
              </time>
            </p>
          )}
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

        {post.body && splitAt !== null ? (
          <>
            <PostBody body={post.body.slice(0, splitAt)} />
            <ComparisonTable table={post.comparisonTable} />
            <div className="my-10">
              <TryCta placement="inline" slug={slug} cluster={cluster} />
            </div>
            <PostBody body={post.body.slice(splitAt)} />
          </>
        ) : (
          <>
            {post.body && <PostBody body={post.body} />}
            <ComparisonTable table={post.comparisonTable} />
          </>
        )}

        <FaqSection faq={post.faq} />

        <div className="mt-14 pt-8 border-t">
          <p className="text-sm text-gray-400 mb-4">
            WriteAssess helps primary school teachers assess writing in seconds using AI — grounded
            in official DfE exemplification criteria.
          </p>
          <TryCta placement="end" slug={slug} cluster={cluster} />
          <p className="mt-4 text-sm">
            <a
              href="https://www.writeassess.co.uk/auth?plan=individual"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Or create a free account
            </a>
          </p>
        </div>
      </article>
    </>
  )
}
