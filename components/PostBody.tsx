import { PortableText, type PortableTextComponents, type PortableTextBlock } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/sanity/client'

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      const url = urlFor(value).width(1200).url()
      return (
        <figure className="my-8">
          <Image
            src={url}
            alt={value.alt || ''}
            width={1200}
            height={700}
            className="rounded-lg w-full"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-400">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-primary underline underline-offset-2 hover:text-primary/80"
      >
        {children}
      </a>
    ),
  },
}

export default function PostBody({ body }: { body: PortableTextBlock[] }) {
  return (
    <div className="prose prose-gray max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary prose-img:rounded-lg">
      <PortableText value={body} components={components} />
    </div>
  )
}
