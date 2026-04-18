'use client'

import { useQuery } from 'convex/react'
import { Activity, Shield, MonitorSmartphone, Bell } from 'lucide-react'
import { api } from '@/shared/lib/api'
import { StatCard } from '@/shared/ui/StatCard'

export default function DashboardPage() {
  const stats = useQuery(api.dnsLogs.getStats)
  const devices = useQuery(api.devices.list)

  const isLoading = stats === undefined || devices === undefined
  const onlineCount = devices?.filter((d) => d.isOnline).length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Live DNS activity for your home network · last 24 hours
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Queries Today"
          value={stats?.totalQueries ?? 0}
          icon={Activity}
          color="blue"
          loading={isLoading}
        />
        <StatCard
          title="Blocked"
          value={stats?.blockedQueries ?? 0}
          icon={Shield}
          color="red"
          loading={isLoading}
        />
        <StatCard
          title="Devices Online"
          value={onlineCount ?? 0}
          icon={MonitorSmartphone}
          color="green"
          loading={isLoading}
        />
        <StatCard
          title="Active Alerts"
          value={stats?.blockedQueries ?? 0}
          icon={Bell}
          color="amber"
          loading={isLoading}
        />
      </div>

      {/* Top domains table */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Top Queried Domains (last 24 h)
        </h2>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="h-4 w-56 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : !stats?.topDomains.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Activity className="mb-3 h-8 w-8 opacity-40" />
              <p className="text-sm font-medium">No DNS queries yet</p>
              <p className="mt-1 text-xs text-gray-300">
                Queries will appear here once the Pi-bridge is running
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="w-12 px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                    Queries
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.topDomains.map(({ domain, count }, idx) => (
                  <tr
                    key={domain}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-400">{idx + 1}</td>
                    <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">
                      {domain}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      {count.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
