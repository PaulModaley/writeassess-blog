'use client'

import { useEffect, useRef, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

// The initial pageview is already sent by the gtag('config', ...) call in
// the root layout on first load. This only needs to report subsequent
// client-side navigations between blog pages (Link clicks), since those
// never trigger a fresh document load that gtag.js would pick up on its own.
// useSearchParams() requires a Suspense boundary in the App Router, hence
// the wrapper component below.
function AnalyticsPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (typeof window.gtag !== 'function') return

    const query = searchParams.toString()
    window.gtag('event', 'page_view', {
      page_path: query ? `${pathname}?${query}` : pathname,
      page_title: document.title,
      page_location: window.location.href,
    })
  }, [pathname, searchParams])

  return null
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsPageView />
    </Suspense>
  )
}
