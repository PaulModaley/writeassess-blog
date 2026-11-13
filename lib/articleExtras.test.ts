import { describe, it, expect } from 'vitest'
import { normaliseTable, normaliseFaq, buildPostJsonLd } from './articleExtras'

describe('normaliseTable', () => {
  it('returns null for undefined', () => {
    expect(normaliseTable(undefined)).toBeNull()
  })
  it('returns null with 0 columns', () => {
    expect(normaliseTable({ caption: 'c', columns: [], rows: [['a']] })).toBeNull()
  })
  it('returns null with 0 rows', () => {
    expect(normaliseTable({ caption: 'c', columns: ['A'], rows: [] })).toBeNull()
  })
  it('pads short rows and truncates long rows to the column count', () => {
    const t = normaliseTable({
      caption: 'Cap',
      columns: ['A', 'B', 'C'],
      rows: [['1', '2'], ['1', '2', '3', '4']],
    })
    expect(t).toEqual({ caption: 'Cap', columns: ['A', 'B', 'C'], rows: [['1', '2', ''], ['1', '2', '3']] })
  })
  it('accepts Sanity rows stored as { cells }', () => {
    const t = normaliseTable({ caption: 'Cap', columns: ['A', 'B'], rows: [{ cells: ['x', 'y'] }] })
    expect(t?.rows).toEqual([['x', 'y']])
  })
  it('uses an empty caption when it is missing', () => {
    expect(normaliseTable({ columns: ['A'], rows: [['x']] })?.caption).toBe('')
  })
})

describe('normaliseFaq', () => {
  it('drops items with an empty question or answer and trims whitespace', () => {
    expect(
      normaliseFaq([
        { question: '  Q1 ', answer: ' A1  ' },
        { question: 'Q2', answer: '   ' },
        { question: '', answer: 'A3' },
        null,
      ]),
    ).toEqual([{ question: 'Q1', answer: 'A1' }])
  })
  it('returns [] for non-arrays', () => {
    expect(normaliseFaq(undefined)).toEqual([])
  })
})

describe('buildPostJsonLd', () => {
  const base = {
    title: 'Title',
    excerpt: 'Excerpt',
    publishedAt: '2026-11-01T09:00:00Z',
  }
  const expectedBlogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Title',
    description: 'Excerpt',
    datePublished: '2026-11-01T09:00:00Z',
    url: 'https://www.writeassess.co.uk/blog/my-slug',
    publisher: { '@type': 'Organization', name: 'WriteAssess', url: 'https://www.writeassess.co.uk' },
  }

  it("returns exactly today's BlogPosting for an old post", () => {
    expect(buildPostJsonLd(base, 'my-slug', null)).toEqual([expectedBlogPosting])
  })
  it('adds image when heroUrl is set', () => {
    expect(buildPostJsonLd(base, 'my-slug', 'https://img/x.jpg')).toEqual([
      { ...expectedBlogPosting, image: 'https://img/x.jpg' },
    ])
  })
  it('uses an empty description when excerpt is missing', () => {
    const [p] = buildPostJsonLd({ ...base, excerpt: undefined }, 'my-slug', null) as any[]
    expect(p.description).toBe('')
  })
  it('adds dateModified from lastReviewedAt', () => {
    const [p] = buildPostJsonLd({ ...base, lastReviewedAt: '2026-12-01T00:00:00Z' }, 'my-slug', null) as any[]
    expect(p.dateModified).toBe('2026-12-01T00:00:00Z')
  })
  it('adds a FAQPage object for valid FAQ items', () => {
    const out = buildPostJsonLd(
      { ...base, faq: [{ question: 'Q1', answer: 'A1' }, { question: 'Q2', answer: 'A2' }, { question: 'Q3', answer: '' }] },
      'my-slug',
      null,
    )
    expect(out).toHaveLength(2)
    expect(out[1]).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Q1', acceptedAnswer: { '@type': 'Answer', text: 'A1' } },
        { '@type': 'Question', name: 'Q2', acceptedAnswer: { '@type': 'Answer', text: 'A2' } },
      ],
    })
  })
  it('adds no FAQPage when every FAQ item is invalid', () => {
    expect(buildPostJsonLd({ ...base, faq: [{ question: 'Q', answer: '' }] }, 'my-slug', null)).toHaveLength(1)
  })
})
