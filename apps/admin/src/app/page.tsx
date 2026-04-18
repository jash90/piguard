'use client'

import { useQuery } from 'convex/react'
import { api } from '@/shared/lib/api'
import { Shield, Wifi, Ban, Clock, Users, Smartphone, Eye } from 'lucide-react'

export default function AdminDashboard() {
  const devices = useQuery(api.devices.list)
  const children = useQuery(api.children.listAll)
  const rules = useQuery(api.blockRules.list, {})
  const stats = useQuery(api.dnsLogs.getStats)

  const onlineDevices = (devices as any[])?.filter((d: any) => d.isOnline).length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">PiGuard Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Overview of your home network protection
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Wifi className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Devices</p>
              <p className="text-2xl font-bold">{devices?.length ?? '—'}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">{onlineDevices} online</p>
        </div>

        <div className="bg-white rounded-lg border p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Children</p>
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
              <p className="text-sm text-slate-500">Blocked Today</p>
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
              <p className="text-sm text-slate-500">Active Rules</p>
              <p className="text-2xl font-bold">
                {rules?.filter((r: any) => r.isActive).length ?? '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <a
            href="/blocklist"
            className="flex items-center gap-3 bg-white rounded-lg border p-4 hover:bg-slate-50 transition-colors"
          >
            <Ban className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium">Blocklist</p>
              <p className="text-xs text-slate-500">Manage blocked domains</p>
            </div>
          </a>
          <a
            href="/social"
            className="flex items-center gap-3 bg-white rounded-lg border p-4 hover:bg-slate-50 transition-colors"
          >
            <Smartphone className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-medium">Social Media</p>
              <p className="text-xs text-slate-500">Block platforms per child</p>
            </div>
          </a>
          <a
            href="/children"
            className="flex items-center gap-3 bg-white rounded-lg border p-4 hover:bg-slate-50 transition-colors"
          >
            <Users className="h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium">Children</p>
              <p className="text-xs text-slate-500">Manage profiles</p>
            </div>
          </a>
          <a
            href="/devices"
            className="flex items-center gap-3 bg-white rounded-lg border p-4 hover:bg-slate-50 transition-colors"
          >
            <Wifi className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="font-medium">Devices</p>
              <p className="text-xs text-slate-500">Assign to children</p>
            </div>
          </a>
          <a
            href="/watched"
            className="flex items-center gap-3 bg-white rounded-lg border p-4 hover:bg-slate-50 transition-colors"
          >
            <Eye className="h-5 w-5 text-amber-500" />
            <div>
              <p className="font-medium">Watched Domains</p>
              <p className="text-xs text-slate-500">Monitor without blocking</p>
            </div>
          </a>
          <a
            href="/schedule"
            className="flex items-center gap-3 bg-white rounded-lg border p-4 hover:bg-slate-50 transition-colors"
          >
            <Clock className="h-5 w-5 text-amber-500" />
            <div>
              <p className="font-medium">Schedules</p>
              <p className="text-xs text-slate-500">Time-based rules</p>
            </div>
          </a>
        </div>
      </div>

      {/* Top Blocked Domains */}
      {stats?.topDomains && stats.topDomains.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Top Domains Today</h2>
          <div className="bg-white rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-slate-500">
                  <th className="p-3">Domain</th>
                  <th className="p-3 text-right">Queries</th>
                </tr>
              </thead>
              <tbody>
                {stats.topDomains.slice(0, 10).map((item: any) => (
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
