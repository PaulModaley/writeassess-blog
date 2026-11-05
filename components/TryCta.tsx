'use client'

// Server-rendered like any client component: the link works without JavaScript.
// JS is only used to send the click event to GA.

import type { ReactNode } from 'react'
import { copyForCluster, DEFAULT_COPY, tryCtaHref, type TryCtaPlacement } from '@/lib/tryCta'

interface TrackedProps {
  placement: TryCtaPlacement
  slug?: string
  cluster?: string | null
}

function trackClick(placement: TryCtaPlacement, cluster?: string | null) {
  // No personal data: placement, cluster and the page path only.
  window.gtag?.('event', 'try_cta_click', {
    placement,
    cluster: cluster || undefined,
    page_path: window.location.pathname,
  })
}

// Plain text link, for the header and footer.
export function TryLink({ placement, slug, cluster, className, children }: TrackedProps & { className?: string; children: ReactNode }) {
  return (
    <a href={tryCtaHref(placement, slug)} onClick={() => trackClick(placement, cluster)} className={className}>
      {children}
    </a>
  )
}

interface TryCtaProps extends TrackedProps {
  variant?: 'card' | 'compact'
}

export default function TryCta({ placement, slug, cluster, variant = 'card' }: TryCtaProps) {
  const copy = placement === 'index' ? DEFAULT_COPY : copyForCluster(cluster)
  const href = tryCtaHref(placement, slug)
  const onClick = () => trackClick(placement, cluster)

  if (variant === 'compact') {
    return (
      <aside
        aria-label="Free sample assessment"
        className="rounded-xl border border-[#b3eaf3] bg-[#eaf8fb] px-4 py-3 sm:px-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
      >
        <p className="text-sm text-gray-700 sm:flex-1">
          <span className="font-semibold text-gray-900">{copy.headline}.</span>{' '}
          <span className="hidden sm:inline">{copy.line}</span>
          <span className="sm:hidden">No account needed.</span>
        </p>
        <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1 shrink-0">
          <a
            href={href}
            onClick={onClick}
            className="inline-flex items-center justify-center whitespace-nowrap bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Try a free assessment
          </a>
          <span className="text-xs text-gray-500">One free try per email address.</span>
        </div>
      </aside>
    )
  }

  return (
    <aside
      aria-label="Free sample assessment"
      className="not-prose rounded-xl border border-[#b3eaf3] bg-[#eaf8fb] p-5 sm:p-6"
    >
      {/* A <p>, not a heading, so the CTA doesn't enter the article's heading outline. */}
      <p className="text-lg font-semibold text-gray-900 mb-1">{copy.headline}</p>
      <p className="text-sm sm:text-base text-gray-600 mb-4">{copy.line}</p>
      <a
        href={href}
        onClick={onClick}
        className="inline-flex w-full sm:w-auto items-center justify-center bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Try a free assessment
      </a>
      <p className="mt-2 text-xs text-gray-500">One free try per email address.</p>
    </aside>
  )
}
