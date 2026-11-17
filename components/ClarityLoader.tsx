'use client'

import { useEffect } from 'react'
import { CLARITY_PROJECT_ID, shouldLoadBlogClarity } from '@/lib/clarity'

export default function ClarityLoader() {
  useEffect(() => {
    let internal = false
    try {
      internal = localStorage.getItem('wa_internal_traffic') === '1'
    } catch {}
    if (!shouldLoadBlogClarity(window.location.pathname, internal)) return
    if (document.querySelector('script[src*="clarity.ms/tag/"]')) return
    const w = window as unknown as { clarity?: ((...a: unknown[]) => void) & { q?: unknown[][] } }
    if (!w.clarity) {
      const fn = ((...a: unknown[]) => { (fn.q = fn.q || []).push(a) }) as ((...a: unknown[]) => void) & { q?: unknown[][] }
      w.clarity = fn
    }
    const s = document.createElement('script')
    s.async = true
    s.src = 'https://www.clarity.ms/tag/' + CLARITY_PROJECT_ID + '?ref=bwt'
    document.head.appendChild(s)
  }, [])
  return null
}
