import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Sanity webhook handler for on-demand ISR.
//
// In Sanity Dashboard → API → Webhooks, add:
//   URL:     https://www.writeassess.co.uk/blog/api/revalidate?secret=YOUR_SECRET
//   Trigger: Create, Update, Delete on post documents
//   HTTP:    POST
//
// Set SANITY_REVALIDATE_SECRET as an env var in the Vercel blog project.
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  let slug: string | undefined

  try {
    const body = await req.json()
    slug = body?.slug?.current || body?.result?.slug?.current
  } catch {
    // Body may be empty on delete events — revalidate everything.
  }

  // Always revalidate the index (post list may have changed).
  revalidatePath('/')

  if (slug) {
    revalidatePath(`/${slug}`)
  }

  return NextResponse.json({ revalidated: true, slug: slug ?? 'all' })
}
