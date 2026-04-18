import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
