import Link from 'next/link'

export default function SiteHeader() {
  return (
    <header className="border-b bg-white/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="https://www.writeassess.co.uk"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {/* Matches the main app's teal rounded-square logo */}
            <span className="flex items-center justify-center w-7 h-7 rounded-[6px] bg-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </span>
            <span className="font-semibold text-sm text-gray-900">WriteAssess</span>
          </a>
          <span className="text-gray-300">/</span>
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Blog
          </Link>
        </div>
        <a
          href="https://www.writeassess.co.uk/auth"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Sign in →
        </a>
      </div>
    </header>
  )
}
