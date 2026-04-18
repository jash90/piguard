'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  ShieldCheck,
  Users,
  Monitor,
  Clock,
  Share2,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/blocklist', label: 'Blocklist', icon: ShieldCheck },
  { href: '/social', label: 'Social Media', icon: Share2 },
  { href: '/children', label: 'Children', icon: Users },
  { href: '/devices', label: 'Devices', icon: Monitor },
  { href: '/schedule', label: 'Schedules', icon: Clock },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isLoginPage =
    pathname === '/login' || pathname === '/signup'
  if (isLoginPage) return null

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden rounded-lg bg-white shadow p-2 border border-slate-200"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          'fixed left-0 top-0 z-40 h-full w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200',
          'md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100">
          <ShieldCheck size={24} className="text-blue-600" />
          <span className="text-lg font-bold text-slate-800">PiGuard</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={[
                  'flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors',
                  active
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                ].join(' ')}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-400">
          PiGuard Admin v1.0
        </div>
      </aside>
    </>
  )
}
