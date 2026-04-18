import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
