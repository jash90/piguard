'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/shared/lib/api'
import { Share2, Plus, X } from 'lucide-react'

interface SocialPlatform {
  _id: string
  name: string
  domains: string[]
  isActive?: boolean
}

interface ChildProfile {
  _id: string
  name: string
}

export function SocialMediaPage() {
  const platforms = useQuery(api.social_platforms.list, {})
  const children = useQuery(api.children.list, {})
  const seedPlatforms = useMutation(api.social_platforms.seedPredefined)
  const addCustom = useMutation(api.social_platforms.addCustom)
  const toggleSocial = useMutation(api.blockRules.setSocialMediaActive)

  const [selectedChild, setSelectedChild] = useState<string>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDomains, setNewDomains] = useState('')
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)

  async function handleToggle(platformName: string, currentlyActive: boolean) {
    setToggling(platformName)
    try {
      await toggleSocial({
        platformName,
        childProfileId: selectedChild || undefined,
        isActive: !currentlyActive,
        createdBy: 'admin',
      })
    } finally {
      setToggling(null)
    }
  }

  async function handleAddCustom() {
    if (!newName.trim() || !newDomains.trim()) return
    setSaving(true)
    try {
      await addCustom({
        name: newName.trim(),
        domains: newDomains
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean),
      })
      setNewName('')
      setNewDomains('')
      setShowAddForm(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleSeed() {
    await seedPlatforms({})
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Share2 size={24} className="text-blue-600" />
            Social Media
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Block social media platforms per child or globally
          </p>
        </div>
        <div className="flex gap-2">
          {(!platforms || platforms.length === 0) && (
            <button
              onClick={handleSeed}
              className="text-sm px-3 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Load Defaults
            </button>
          )}
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Custom
          </button>
        </div>
      </div>

      {/* Child filter */}
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium text-slate-600">Filter by child:</label>
        <select
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All children</option>
          {((children ?? []) as ChildProfile[]).map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Platform grid */}
      {platforms === undefined ? (
        <div className="text-center py-12 text-slate-400">Loading…</div>
      ) : platforms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 mb-3">No platforms yet.</p>
          <button
            onClick={handleSeed}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Load predefined platforms
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {((platforms as SocialPlatform[]) ?? []).map((platform) => {
            const isBlocked = platform.isActive ?? false
            const isLoading = toggling === platform.name
            return (
              <div
                key={platform._id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">{platform.name}</h3>
                  <button
                    onClick={() => handleToggle(platform.name, isBlocked)}
                    disabled={isLoading}
                    className={[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50',
                      isBlocked ? 'bg-red-500' : 'bg-slate-300',
                    ].join(' ')}
                    aria-label={isBlocked ? 'Unblock' : 'Block'}
                  >
                    <span
                      className={[
                        'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                        isBlocked ? 'translate-x-6' : 'translate-x-1',
                      ].join(' ')}
                    />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(platform.domains ?? []).slice(0, 4).map((d: string) => (
                    <span
                      key={d}
                      className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded"
                    >
                      {d}
                    </span>
                  ))}
                  {(platform.domains ?? []).length > 4 && (
                    <span className="text-xs text-slate-400 px-2 py-0.5">
                      +{(platform.domains ?? []).length - 4} more
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {(platform.domains ?? []).length} domain
                  {(platform.domains ?? []).length !== 1 ? 's' : ''} ·{' '}
                  <span className={isBlocked ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                    {isBlocked ? 'Blocked' : 'Allowed'}
                  </span>
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Custom Platform Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Add Custom Platform</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. TikTok"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Domains <span className="text-slate-400 font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={newDomains}
                  onChange={(e) => setNewDomains(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tiktok.com, tiktok.net"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustom}
                disabled={saving || !newName.trim() || !newDomains.trim()}
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Adding…' : 'Add Platform'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
