import { normaliseTable } from '@/lib/articleExtras'

export default function ComparisonTable({ table }: { table: unknown }) {
  const t = normaliseTable(table)
  if (!t) return null
  return (
    <figure className="my-10 overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        {t.caption && (
          <caption className="caption-top text-left font-semibold text-gray-900 mb-3">{t.caption}</caption>
        )}
        <thead>
          <tr>
            {t.columns.map((c, i) => (
              <th key={i} scope="col" className="border-b-2 border-gray-200 py-2 pr-4 font-semibold text-gray-900">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {t.rows.map((row, r) => (
            <tr key={r} className="border-b border-gray-100 align-top">
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="py-2 pr-4 font-medium text-gray-900">{cell}</th>
                ) : (
                  <td key={i} className="py-2 pr-4 text-gray-700">{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
