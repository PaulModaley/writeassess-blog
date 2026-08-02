export const postsQuery = `
  *[_type == "post" && defined(slug.current) && (!defined(publishedAt) || publishedAt <= now())]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage,
    tags
  }
`

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage,
    body,
    tags,
    seo
  }
`

export const allSlugsQuery = `
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`
