'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ShieldCheck,
  Users,
  Monitor,
  Clock,
  Menu,
  X,
  LayoutDashboard,
  Eye,
} from 'lucide-react'
import '@/shared/i18n'

const NAV_ITEMS = [
  { href: '/',          labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/blocklist', labelKey: 'nav.blocklist', icon: ShieldCheck },
  { href: '/watched',   labelKey: 'nav.watched',   icon: Eye },
  { href: '/children',  labelKey: 'nav.children',  icon: Users },
  { href: '/devices',   labelKey: 'nav.devices',   icon: Monitor },
  { href: '/schedule',  labelKey: 'nav.schedule',  icon: Clock },
]

export function Sidebar() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isLoginPage = pathname === '/login' || pathname === '/signup'
  if (isLoginPage) return null

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden rounded-lg bg-white shadow p-2 border border-slate-200"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={[
          'fixed left-0 top-0 z-40 h-full w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200',
          'md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100">
          <ShieldCheck size={24} className="text-blue-600" />
          <span className="text-lg font-bold text-slate-800">PiGuard</span>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
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
                {t(labelKey)}
              </Link>
            )
          })}
        </nav>

        <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-400">
          {t('nav.version')}
        </div>
      </aside>
    </>
  )
}
