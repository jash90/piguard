import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/shared/lib/convex'
import { TopNav } from '@/shared/ui/TopNav'

// This dashboard always serves live data — never statically prerender.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'PiGuard Dashboard',
  description: 'Live DNS activity dashboard for your home network',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        <AppProvider>
          <TopNav />
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  )
}
