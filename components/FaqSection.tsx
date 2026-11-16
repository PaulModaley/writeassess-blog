import { normaliseFaq } from '@/lib/articleExtras'

export default function FaqSection({ faq }: { faq: unknown }) {
  const items = normaliseFaq(faq)
  if (items.length === 0) return null
  return (
    <section className="mt-12" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-semibold text-gray-900 mb-4">
        Frequently asked questions
      </h2>
      <div className="divide-y divide-gray-200 border-y border-gray-200">
        {items.map((q, i) => (
          <details key={i} className="group py-4">
            <summary className="cursor-pointer font-medium text-gray-900 list-none flex justify-between gap-4">
              <span>{q.question}</span>
              <span aria-hidden className="text-gray-400 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-line">{q.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
