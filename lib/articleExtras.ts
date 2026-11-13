// Helpers for the AI-visibility strand fields on a post: the comparison
// table, the FAQ and the page's JSON-LD. Old posts without these fields
// produce exactly the JSON-LD they always had.

export interface NormalisedTable {
  caption: string
  columns: string[]
  rows: string[][]
}

export interface FaqItem {
  question: string
  answer: string
}

export interface PostLike {
  title: string
  excerpt?: string | null
  publishedAt: string
  lastReviewedAt?: string | null
  faq?: unknown
}

const str = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v))

// Accepts rows as string[] (model output) or { cells: string[] } (Sanity).
export function normaliseTable(t: unknown): NormalisedTable | null {
  if (!t || typeof t !== 'object') return null
  const obj = t as { caption?: unknown; columns?: unknown; rows?: unknown }
  const columns = Array.isArray(obj.columns) ? obj.columns.map(str) : []
  if (columns.length === 0) return null
  const rawRows = Array.isArray(obj.rows) ? obj.rows : []
  const rows = rawRows
    .map((r) => {
      const cells = Array.isArray(r) ? r : r && typeof r === 'object' && Array.isArray((r as { cells?: unknown }).cells) ? (r as { cells: unknown[] }).cells : null
      if (!cells) return null
      const out = cells.slice(0, columns.length).map(str)
      while (out.length < columns.length) out.push('')
      return out
    })
    .filter((r): r is string[] => r !== null)
  if (rows.length === 0) return null
  return { caption: str(obj.caption), columns, rows }
}

export function normaliseFaq(f: unknown): FaqItem[] {
  if (!Array.isArray(f)) return []
  return f
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const question = str((item as { question?: unknown }).question).trim()
      const answer = str((item as { answer?: unknown }).answer).trim()
      return question && answer ? { question, answer } : null
    })
    .filter((x): x is FaqItem => x !== null)
}

export function buildPostJsonLd(post: PostLike, slug: string, heroUrl: string | null): object[] {
  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    datePublished: post.publishedAt,
    ...(post.lastReviewedAt && { dateModified: post.lastReviewedAt }),
    url: `https://www.writeassess.co.uk/blog/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'WriteAssess',
      url: 'https://www.writeassess.co.uk',
    },
    ...(heroUrl && { image: heroUrl }),
  }
  const out: object[] = [blogPosting]
  const faq = normaliseFaq(post.faq)
  if (faq.length > 0) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((q) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: q.answer },
      })),
    })
  }
  return out
}
