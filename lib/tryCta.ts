// Free sample assessment (/try on the main site) as the blog's primary CTA.
// Pure helpers only, so they can run on the server and be tested without React.

export type TryCtaPlacement = 'inline' | 'end' | 'index' | 'header' | 'footer'

const TRY_URL = 'https://www.writeassess.co.uk/try'

export function tryCtaHref(placement: TryCtaPlacement, slug?: string): string {
  const params = new URLSearchParams({
    utm_source: 'blog',
    utm_medium: 'cta',
    utm_campaign: slug || 'blog-index',
    utm_content: placement,
  })
  return `${TRY_URL}?${params.toString()}`
}

export interface TryCtaCopy {
  headline: string
  line: string
}

const STANDARD_LINE =
  'Upload one piece of writing and get a best-fit WTS, EXS or GDS judgement with reasons. No account needed.'

export const DEFAULT_COPY: TryCtaCopy = {
  headline: 'Try WriteAssess on one piece of writing',
  line: 'Get a best-fit WTS, EXS or GDS judgement with reasons. No account needed.',
}

const COPY_BY_CLUSTER: Record<string, TryCtaCopy> = {
  'statutory-writing-assessment': { headline: 'Check a piece against the standard', line: STANDARD_LINE },
  moderation: { headline: 'Get a second opinion before moderation', line: STANDARD_LINE },
  'writing-evidence': { headline: 'See what one piece of writing shows', line: STANDARD_LINE },
  'year-group-assessment': { headline: 'Try it on a piece from your class', line: STANDARD_LINE },
  'teacher-workload': {
    headline: 'See how quickly you get a judgement',
    line: 'Upload one piece of writing and get a best-fit judgement with reasons in about 30 seconds. No account needed.',
  },
  'ai-assisted-assessment': {
    headline: 'See how the AI reaches its judgement',
    line: 'Upload one piece of writing and see the judgement and the reasons behind it. You make the final call. No account needed.',
  },
  'writing-development': {
    headline: 'Find next steps for a piece of writing',
    line: 'Upload one piece and get a best-fit judgement, strengths and next steps. No account needed.',
  },
}

export function copyForCluster(cluster?: string | null): TryCtaCopy {
  return (cluster && COPY_BY_CLUSTER[cluster]) || DEFAULT_COPY
}

interface BlockLike {
  _type?: string
  style?: string
}

// Where to put the mid-article CTA: the index of the H2 closest to the middle of
// the body (by block count), never the first H2, and only when there are 3+ H2s.
// The body is split just before that H2, so a list or section is never cut in two.
// Returns null when the post should get no inline CTA.
export function inlineCtaSplitIndex(blocks: BlockLike[] | null | undefined): number | null {
  if (!blocks?.length) return null
  const h2s = blocks
    .map((b, i) => (b?._type === 'block' && b.style === 'h2' ? i : -1))
    .filter((i) => i >= 0)
  if (h2s.length < 3) return null

  const middle = blocks.length / 2
  let best = h2s[1]
  for (const i of h2s.slice(1)) {
    // On a tie, the earlier H2 wins.
    if (Math.abs(i - middle) < Math.abs(best - middle)) best = i
  }
  return best
}
