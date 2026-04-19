'use client'

import { useQuery } from 'convex/react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { api } from '@/shared/lib/api'
import { Shield, Wifi, Ban, Clock, Users, Monitor, Eye } from 'lucide-react'
import '@/shared/i18n'

interface Device { _id: string; isOnline: boolean }
interface BlockRule { _id: string; isActive: boolean }
interface TopDomain { domain: string; count: number }
interface DnsStats { blockedQueries?: number; topDomains?: TopDomain[] }

export default function AdminDashboard() {
  const { t } = useTranslation()
  const devices = useQuery(api.devices.list) as Device[] | undefined
  const children = useQuery(api.children.listAll)
  const rules = useQuery(api.blockRules.list, {}) as BlockRule[] | undefined
  const stats = useQuery(api.dnsLogs.getStats) as DnsStats | undefined

  const onlineDevices = devices?.filter((d) => d.isOnline).length ?? 0
  const activeRules = rules?.filter((r) => r.isActive).length ?? 0

  const QUICK_ACTIONS: Array<{
    href: string
    titleKey: string
    descKey: string
    Icon: typeof Ban
    iconColor: string
  }> = [
    { href: '/blocklist', titleKey: 'nav.blocklist', descKey: 'dashboard.action.blocklist', Icon: Ban,        iconColor: 'text-red-500' },
    { href: '/children',  titleKey: 'nav.children',  descKey: 'dashboard.action.children',  Icon: Users,      iconColor: 'text-green-500' },
    { href: '/devices',   titleKey: 'nav.devices',   descKey: 'dashboard.action.devices',   Icon: Monitor,    iconColor: 'text-indigo-500' },
    { href: '/watched',   titleKey: 'nav.watched',   descKey: 'dashboard.action.watched',   Icon: Eye,        iconColor: 'text-amber-500' },
    { href: '/schedule',  titleKey: 'nav.schedule',  descKey: 'dashboard.action.schedule',  Icon: Clock,      iconColor: 'text-amber-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-slate-500 mt-1">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Wifi className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('dashboard.stats.devices')}</p>
              <p className="text-2xl font-bold">{devices?.length ?? '—'}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {t('dashboard.stats.devicesOnline', { count: onlineDevices })}
          </p>
        </div>

        <div className="bg-white rounded-lg border p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('dashboard.stats.children')}</p>
              <p className="text-2xl font-bold">{children?.length ?? '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Ban className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('dashboard.stats.blockedToday')}</p>
              <p className="text-2xl font-bold">{stats?.blockedQueries ?? '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('dashboard.stats.activeRules')}</p>
              <p className="text-2xl font-bold">{rules ? activeRules : '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ href, titleKey, descKey, Icon, iconColor }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 bg-white rounded-lg border p-4 hover:bg-slate-50 transition-colors"
            >
              <Icon className={`h-5 w-5 ${iconColor}`} />
              <div>
                <p className="font-medium">{t(titleKey)}</p>
                <p className="text-xs text-slate-500">{t(descKey)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {stats?.topDomains && stats.topDomains.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">{t('dashboard.topDomains')}</h2>
          <div className="bg-white rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-slate-500">
                  <th className="p-3">{t('dashboard.column.domain')}</th>
                  <th className="p-3 text-right">{t('dashboard.column.queries')}</th>
                </tr>
              </thead>
              <tbody>
                {stats.topDomains.slice(0, 10).map((item) => (
                  <tr key={item.domain} className="border-b last:border-0">
                    <td className="p-3 font-mono text-sm">{item.domain}</td>
                    <td className="p-3 text-right font-medium">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
