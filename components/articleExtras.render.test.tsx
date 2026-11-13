import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ComparisonTable from './ComparisonTable'
import FaqSection from './FaqSection'

describe('ComparisonTable', () => {
  it('renders nothing for a missing table', () => {
    expect(renderToStaticMarkup(<ComparisonTable table={undefined} />)).toBe('')
  })
  it('renders caption, headers and padded Sanity rows', () => {
    const html = renderToStaticMarkup(
      <ComparisonTable table={{ caption: 'Options', columns: ['Approach', 'Time', 'Cost'], rows: [{ cells: ['By hand', '10 min'] }] }} />,
    )
    expect(html).toContain('<caption')
    expect(html).toContain('Options')
    expect((html.match(/<th scope="col"/g) || []).length).toBe(3)
    expect(html).toContain('<th scope="row" class="py-2 pr-4 font-medium text-gray-900">By hand</th>')
    expect((html.match(/<td /g) || []).length).toBe(2)
  })
})

describe('FaqSection', () => {
  it('renders nothing when every item is invalid', () => {
    expect(renderToStaticMarkup(<FaqSection faq={[{ question: 'Q', answer: ' ' }]} />)).toBe('')
  })
  it('renders a heading and one details element per valid item', () => {
    const html = renderToStaticMarkup(
      <FaqSection faq={[{ question: 'Q1', answer: 'A1' }, { question: 'Q2', answer: 'A2' }]} />,
    )
    expect(html).toContain('Frequently asked questions')
    expect((html.match(/<details/g) || []).length).toBe(2)
  })
})
