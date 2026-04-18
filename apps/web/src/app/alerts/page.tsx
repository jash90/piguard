'use client'

import { useQuery } from 'convex/react'
import { AlertTriangle } from 'lucide-react'
import { api } from '@/shared/lib/api'
import { formatRelativeTime } from '@/shared/lib/format'

export default function AlertsPage() {
  const blocked = useQuery(api.dnsLogs.getBlocked, { limit: 100 })
  const devices = useQuery(api.devices.list)

  const isLoading = blocked === undefined
  const deviceMap = new Map(devices?.map((d) => [d._id, d]) ?? [])

  const getDeviceLabel = (deviceId: string) => {
    const d = deviceMap.get(deviceId)
    return d ? (d.hostname ?? d.ipAddress) : `${deviceId.slice(0, 8)}…`
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
        <p className="mt-1 text-sm text-gray-500">
          {isLoading
            ? 'Loading…'
            : `${(blocked?.length ?? 0).toLocaleString()} blocked attempts`}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-red-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-red-100 bg-red-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-red-500">
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-red-500">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-red-500">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-red-500">
                  Time
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                /* Skeleton rows */
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="h-4 w-52 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
                    </td>
                  </tr>
                ))
              ) : !blocked?.length ? (
                /* Empty state */
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                    <p className="text-sm font-medium text-gray-400">
                      No blocked attempts
                    </p>
                    <p className="mt-1 text-xs text-gray-300">
                      Blocked DNS queries will appear here in real time
                    </p>
                  </td>
                </tr>
              ) : (
                blocked.map((log) => (
                  <tr
                    key={log._id}
                    className="transition-colors hover:bg-red-50/40"
                  >
                    <td className="max-w-[240px] truncate px-6 py-4 font-mono text-sm font-semibold text-red-700">
                      {log.domain}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">
                      {getDeviceLabel(log.deviceId)}
                    </td>
                    <td className="px-6 py-4">
                      {log.category ? (
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                          {log.category}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-xs text-gray-400">
                      {formatRelativeTime(log.timestamp)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
