'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { FileText } from 'lucide-react'
import { api } from '@/shared/lib/api'
import { StatusBadge } from '@/shared/ui/StatusBadge'
import { formatRelativeTime } from '@/shared/lib/format'

type StatusFilter = 'all' | 'blocked' | 'allowed' | 'cached'

const INITIAL_COUNT = 50
const PAGE_SIZE = 50

export default function DnsLogsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [displayCount, setDisplayCount] = useState(INITIAL_COUNT)

  // Convex reactive query — auto-updates when backend data changes
  const logs = useQuery(api.dnsLogs.getRecent, { limit: 200 })
  const devices = useQuery(api.devices.list)

  const deviceMap = new Map(devices?.map((d) => [d._id, d]) ?? [])
  const isLoading = logs === undefined

  const filtered =
    logs?.filter((log) =>
      statusFilter === 'all' ? true : log.status === statusFilter
    ) ?? []

  const visible = filtered.slice(0, displayCount)
  const hasMore = filtered.length > displayCount

  const getDeviceLabel = (deviceId: string) => {
    const d = deviceMap.get(deviceId)
    return d ? (d.hostname ?? d.ipAddress) : `${deviceId.slice(0, 8)}…`
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DNS Logs</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isLoading
              ? 'Loading…'
              : `${filtered.length.toLocaleString()} queries`}
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as StatusFilter)
            setDisplayCount(INITIAL_COUNT)
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-44"
        >
          <option value="all">All statuses</option>
          <option value="blocked">Blocked</option>
          <option value="allowed">Allowed</option>
          <option value="cached">Cached</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                  Time
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                /* Skeleton rows */
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="h-4 w-52 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
                    </td>
                  </tr>
                ))
              ) : visible.length === 0 ? (
                /* Empty state */
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <FileText className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                    <p className="text-sm font-medium text-gray-400">
                      No DNS queries yet
                    </p>
                    <p className="mt-1 text-xs text-gray-300">
                      DNS activity will stream in here automatically
                    </p>
                  </td>
                </tr>
              ) : (
                visible.map((log) => (
                  <tr
                    key={log._id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="max-w-[240px] truncate px-6 py-4 font-mono text-sm font-medium text-gray-900">
                      {log.domain}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">
                      {getDeviceLabel(log.deviceId)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs uppercase text-gray-400">
                      {log.queryType}
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

        {/* Load more */}
        {hasMore && (
          <div className="border-t border-gray-100 px-6 py-4 text-center">
            <button
              onClick={() => setDisplayCount((c) => c + PAGE_SIZE)}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Load {Math.min(PAGE_SIZE, filtered.length - displayCount)} more
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
