import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/shared/lib/convex'
import { Sidebar } from '@/shared/ui/Sidebar'

export const metadata: Metadata = {
  title: 'PiGuard Admin',
  description: 'Parental DNS control — manage blocklists, social media, and schedules',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <AppProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-6 min-h-screen">{children}</main>
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
