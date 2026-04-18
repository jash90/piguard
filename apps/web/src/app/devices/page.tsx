'use client'

import { useQuery } from 'convex/react'
import { MonitorSmartphone } from 'lucide-react'
import { api } from '@/shared/lib/api'
import { formatRelativeTime } from '@/shared/lib/format'

export default function DevicesPage() {
  const devices = useQuery(api.devices.list)
  const isLoading = devices === undefined

  const online = devices?.filter((d) => d.isOnline) ?? []
  const offline = devices?.filter((d) => !d.isOnline) ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Devices</h1>
        {!isLoading && (
          <p className="mt-1 text-sm text-gray-500">
            <span className="font-medium text-emerald-600">{online.length} online</span>
            {offline.length > 0 && (
              <> · <span className="text-gray-400">{offline.length} offline</span></>
            )}
          </p>
        )}
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && devices?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 shadow-sm">
          <MonitorSmartphone className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm font-medium text-gray-400">No devices seen yet</p>
          <p className="mt-1 text-xs text-gray-300">
            Devices appear here as they make DNS queries through the Pi
          </p>
        </div>
      )}

      {/* Device grid — online first, offline after */}
      {!isLoading && (devices?.length ?? 0) > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...online, ...offline].map((device) => (
            <div
              key={device._id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Card header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <MonitorSmartphone className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold leading-tight text-gray-900">
                      {device.hostname ?? device.ipAddress}
                    </p>
                    {device.hostname && (
                      <p className="font-mono text-xs text-gray-500">
                        {device.ipAddress}
                      </p>
                    )}
                  </div>
                </div>

                {/* Online/offline badge */}
                <div className="flex shrink-0 items-center gap-1.5 mt-0.5">
                  {device.isOnline ? (
                    <>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-emerald-600">
                        Online
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-gray-400" />
                      <span className="text-xs font-medium text-gray-400">
                        Offline
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Detail rows */}
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">MAC</dt>
                  <dd className="truncate font-mono text-xs text-gray-700">
                    {device.macAddress}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Last seen</dt>
                  <dd className="text-gray-700">
                    {formatRelativeTime(device.lastSeen)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">First seen</dt>
                  <dd className="text-gray-700">
                    {formatRelativeTime(device.firstSeen)}
                  </dd>
                </div>
                {device.childProfileId && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Profile</dt>
                    <dd className="text-xs font-medium text-blue-600">
                      Assigned
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
