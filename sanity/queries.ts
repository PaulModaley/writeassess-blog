export const postsQuery = `
  *[_type == "post" && defined(slug.current) && publishedAt <= now()]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage
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
    seo
  }
`

export const allSlugsQuery = `
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`
