'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@/shared/lib/api'
import { Monitor } from 'lucide-react'

interface Device {
  _id: string
  hostname?: string
  ipAddress: string
  macAddress: string
  isOnline: boolean
  childProfileId?: string
}

interface ChildProfile {
  _id: string
  name: string
}

export function DevicesPage() {
  const devices = useQuery(api.devices.list, {})
  const children = useQuery(api.children.listAll)
  const assignDevice = useMutation(api.devices.assignToChild)

  async function handleAssign(deviceId: string, childProfileId: string) {
    await assignDevice({
      deviceId,
      childProfileId: childProfileId || undefined,
    })
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Monitor size={24} className="text-blue-600" />
          Devices
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          View network devices and assign them to child profiles
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {devices === undefined ? (
          <div className="p-8 text-center text-slate-400">Loading…</div>
        ) : devices.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No devices discovered yet. Devices appear when they connect through PiGuard.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Hostname</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">IP Address</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">MAC Address</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Assigned To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {((devices as Device[]) ?? []).map((device) => (
                  <tr key={device._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <span
                          className={[
                            'inline-block w-2.5 h-2.5 rounded-full',
                            device.isOnline ? 'bg-green-500' : 'bg-slate-300',
                          ].join(' ')}
                        />
                        <span
                          className={
                            device.isOnline ? 'text-green-700' : 'text-slate-400'
                          }
                        >
                          {device.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {device.hostname ?? <span className="text-slate-400 italic">Unknown</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">{device.ipAddress}</td>
                    <td className="px-4 py-3 font-mono text-slate-500 text-xs">
                      {device.macAddress}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={device.childProfileId ?? ''}
                        onChange={(e) =>
                          handleAssign(device._id as string, e.target.value)
                        }
                        className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="">Unassigned</option>
                        {((children ?? []) as ChildProfile[]).map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {devices !== undefined && devices.length > 0 && (
        <div className="mt-4 flex gap-4 text-sm text-slate-500">
          <span>
            <span className="font-medium text-green-600">
              {(devices as Device[]).filter((d) => d.isOnline).length}
            </span>{' '}
            online
          </span>
          <span>
            <span className="font-medium text-slate-600">
              {(devices as Device[]).filter((d) => d.childProfileId).length}
            </span>{' '}
            assigned
          </span>
          <span>
            <span className="font-medium text-slate-600">{devices.length}</span> total
          </span>
        </div>
      )}
    </div>
  )
}
