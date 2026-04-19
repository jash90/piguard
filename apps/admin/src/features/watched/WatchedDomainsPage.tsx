'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { useTranslation } from 'react-i18next'
import { api } from '@/shared/lib/api'
import { Eye, EyeOff, Plus, Trash2, AlertTriangle } from 'lucide-react'
import '@/shared/i18n'

interface WatchedDomain {
  _id: string
  domain: string
  label?: string
  childProfileId?: string
  isActive: boolean
}

interface ChildProfile {
  _id: string
  name: string
}

export function WatchedDomainsPage() {
  const { t } = useTranslation()
  const watched = useQuery(api.watched_domains.list)
  const children = useQuery(api.children.listAll)
  const addWatched = useMutation(api.watched_domains.create)
  const removeWatched = useMutation(api.watched_domains.remove)
  const toggleWatched = useMutation(api.watched_domains.update)

  const [newDomain, setNewDomain] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newChildId, setNewChildId] = useState<string>('')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = async () => {
    if (!newDomain.trim()) return
    await addWatched({
      domain: newDomain.trim(),
      label: newLabel.trim() || undefined,
      childProfileId: newChildId || undefined,
      createdBy: 'admin',
    })
    setNewDomain('')
    setNewLabel('')
    setNewChildId('')
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Eye className="h-6 w-6 text-amber-500" />
            {t('watched.title')}
          </h1>
          <p className="text-slate-500 mt-1">{t('watched.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus size={16} />
          {t('watched.addDomain')}
        </button>
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-800">
          <p className="font-medium">{t('watched.infoTitle')}</p>
          <p className="mt-1">{t('watched.infoBody')}</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border p-5 space-y-4">
          <h3 className="font-semibold">{t('watched.addTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('watched.form.domain')} *
              </label>
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder={t('watched.form.domainPlaceholder')}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('watched.form.label')}
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Reddit"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('watched.form.assignChild')}
              </label>
              <select
                value={newChildId}
                onChange={(e) => setNewChildId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('blocklist.form.childAll')}</option>
                {((children as ChildProfile[]) ?? []).map((child) => (
                  <option key={child._id} value={child._id}>
                    {child.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newDomain.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {t('watched.addSubmit')}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-lg text-sm text-slate-600 hover:bg-slate-50"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {!watched ? (
        <div className="text-center py-8 text-slate-400">{t('common.loading')}</div>
      ) : watched.length === 0 ? (
        <div className="text-center py-12">
          <Eye className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">{t('watched.empty')}</p>
          <p className="text-sm text-slate-400 mt-1">
            {t('watched.emptyHint')}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-slate-500">
                <th className="p-3">{t('watched.column.domain')}</th>
                <th className="p-3">{t('watched.column.label')}</th>
                <th className="p-3">{t('watched.column.child')}</th>
                <th className="p-3">{t('watched.column.status')}</th>
                <th className="p-3 text-right">{t('watched.column.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {(watched as WatchedDomain[]).map((w) => (
                <tr key={w._id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-3">
                    <span className="font-mono text-sm">{w.domain}</span>
                  </td>
                  <td className="p-3 text-sm text-slate-600">{w.label || '—'}</td>
                  <td className="p-3 text-sm text-slate-600">
                    {w.childProfileId ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {((children as ChildProfile[]) ?? []).find(
                          (c) => c._id === w.childProfileId,
                        )?.name ?? t('watched.column.unknown')}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">{t('blocklist.column.allChildren')}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() =>
                        toggleWatched({
                          watchedId: w._id,
                          isActive: !w.isActive,
                        })
                      }
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        w.isActive
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {w.isActive ? (
                        <>
                          <Eye size={12} /> {t('watched.status.active')}
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} /> {t('watched.status.paused')}
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => removeWatched({ watchedId: w._id })}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
