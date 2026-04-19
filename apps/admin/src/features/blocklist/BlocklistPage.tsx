'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { useTranslation } from 'react-i18next'
import { api } from '@/shared/lib/api'
import { Plus, Trash2, Shield } from 'lucide-react'
import '@/shared/i18n'

type Filter = 'all' | 'active' | 'inactive'

interface BlockRule {
  _id: string
  value: string
  type: string
  isActive: boolean
  childProfileId?: string
  label?: string
}

interface ChildProfile {
  _id: string
  name: string
  avatarColor: string
}

export function BlocklistPage() {
  const { t } = useTranslation()
  const rules = useQuery(api.blockRules.list, {})
  const children = useQuery(api.children.listAll)
  const createRule = useMutation(api.blockRules.create)
  const updateRule = useMutation(api.blockRules.update)
  const removeRule = useMutation(api.blockRules.remove)

  const [filter, setFilter] = useState<Filter>('all')
  const [showModal, setShowModal] = useState(false)
  const [domain, setDomain] = useState('')
  const [ruleType, setRuleType] = useState<'domain' | 'keyword' | 'social_media'>('domain')
  const [selectedChild, setSelectedChild] = useState<string>('')
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)

  const filteredRules = ((rules ?? []) as BlockRule[]).filter((r) => {
    if (filter === 'active') return r.isActive
    if (filter === 'inactive') return !r.isActive
    return true
  })

  async function handleCreate() {
    if (!domain.trim()) return
    setSaving(true)
    try {
      await createRule({
        type: ruleType,
        value: domain.trim(),
        label: label.trim() || undefined,
        childProfileId: selectedChild || undefined,
        createdBy: 'admin',
      })
      setDomain('')
      setLabel('')
      setSelectedChild('')
      setShowModal(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(ruleId: string, current: boolean) {
    await updateRule({ ruleId, isActive: !current })
  }

  async function handleDelete(ruleId: string) {
    if (!confirm(t('blocklist.deleteRule') + '?')) return
    await removeRule({ ruleId })
  }

  function childName(id?: string) {
    if (!id) return t('blocklist.column.allChildren')
    return (children as ChildProfile[] | undefined)?.find((c) => c._id === id)?.name ?? '—'
  }

  function ruleDisplay(rule: BlockRule): string {
    if (rule.type === 'category') {
      return t(`categories.${rule.value}`)
    }
    return rule.value
  }

  function ruleLabel(rule: BlockRule): string {
    if (rule.label) return rule.label
    if (rule.type === 'category') return t(`categories.${rule.value}`)
    return '—'
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield size={24} className="text-blue-600" />
            {t('blocklist.title')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{t('blocklist.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          {t('blocklist.addRule')}
        </button>
      </div>

      <div className="flex gap-1 mb-4 bg-slate-100 rounded-lg p-1 w-fit">
        {(['all', 'active', 'inactive'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
              filter === f
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            {t(`blocklist.filter.${f}`)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {rules === undefined ? (
          <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>
        ) : filteredRules.length === 0 ? (
          <div className="p-8 text-center text-slate-400">{t('blocklist.empty')}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">{t('blocklist.column.value')}</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">{t('blocklist.column.type')}</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">{t('blocklist.column.child')}</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">{t('blocklist.column.label')}</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">{t('blocklist.column.active')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(filteredRules as BlockRule[]).map((rule) => (
                <tr key={rule._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-800">{ruleDisplay(rule)}</td>
                  <td className="px-4 py-3">
                    <TypeBadge type={rule.type} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {childName(rule.childProfileId as string | undefined)}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{ruleLabel(rule)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(rule._id, rule.isActive)}
                      className={[
                        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                        rule.isActive ? 'bg-blue-600' : 'bg-slate-300',
                      ].join(' ')}
                      aria-label={t('blocklist.toggleActive')}
                    >
                      <span
                        className={[
                          'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
                          rule.isActive ? 'translate-x-4.5' : 'translate-x-0.5',
                        ].join(' ')}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(rule._id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      aria-label={t('blocklist.deleteRule')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">{t('blocklist.addRule')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('blocklist.form.type')}</label>
                <select
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value as typeof ruleType)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="domain">{t('blocklist.type.domain')}</option>
                  <option value="keyword">{t('blocklist.type.keyword')}</option>
                  <option value="social_media">{t('blocklist.type.social_media')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('blocklist.form.value')}
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('blocklist.form.valuePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('blocklist.form.label')}
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('blocklist.form.labelPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('blocklist.form.child')}
                </label>
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('blocklist.form.childAll')}</option>
                  {((children ?? []) as ChildProfile[]).map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !domain.trim()}
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? t('common.loading') : t('blocklist.addRule')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TypeBadge({ type }: { type: string }) {
  const { t } = useTranslation()
  const styles: Record<string, string> = {
    domain:       'bg-blue-100 text-blue-700',
    keyword:      'bg-amber-100 text-amber-700',
    social_media: 'bg-purple-100 text-purple-700',
    category:     'bg-emerald-100 text-emerald-700',
  }
  const labelKey = `blocklist.type.${type}`
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        styles[type] ?? 'bg-slate-100 text-slate-600',
      ].join(' ')}
    >
      {t(labelKey)}
    </span>
  )
}
