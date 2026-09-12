import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import SiteHeader from '@/components/SiteHeader'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.writeassess.co.uk'),
  title: {
    default: 'WriteAssess Blog — Insights for Primary School Teachers',
    template: '%s | WriteAssess Blog',
  },
  description:
    'Practical guidance on AI-powered writing assessment, DfE exemplification criteria, and primary school teaching strategies.',
  openGraph: {
    siteName: 'WriteAssess Blog',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-ZM73H91H8F" />
        <Script id="gtag-init">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-ZM73H91H8F');
          `}
        </Script>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased font-sans">
        <SiteHeader />
        <main>{children}</main>
        <footer className="border-t bg-white mt-16 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <span>© {new Date().getFullYear()} WriteAssess</span>
            <nav className="flex gap-6">
              <a href="https://www.writeassess.co.uk" className="hover:text-gray-600 transition-colors">Home</a>
              <a href="https://www.writeassess.co.uk/pricing" className="hover:text-gray-600 transition-colors">Pricing</a>
              <a href="https://www.writeassess.co.uk/privacy" className="hover:text-gray-600 transition-colors">Privacy</a>
              <a href="https://www.writeassess.co.uk/contact" className="hover:text-gray-600 transition-colors">Contact</a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  )
}
