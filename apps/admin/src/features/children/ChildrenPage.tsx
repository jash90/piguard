'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/shared/lib/api'
import { Users, Plus, Pencil, Trash2, X, Check } from 'lucide-react'

interface ChildProfile {
  _id: string
  name: string
  avatarColor: string
}

interface Device {
  _id: string
  childProfileId?: string
}

const AVATAR_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
]

export function ChildrenPage() {
  const children = useQuery(api.children.list, {})
  const devices = useQuery(api.devices.list, {})
  const createChild = useMutation(api.children.create)
  const updateChild = useMutation(api.children.update)
  const removeChild = useMutation(api.children.remove)

  // Add form state
  const [showAdd, setShowAdd] = useState(false)
  const [addName, setAddName] = useState('')
  const [addColor, setAddColor] = useState(AVATAR_COLORS[0])
  const [saving, setSaving] = useState(false)

  // Edit state
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')

  function deviceCount(childId: string) {
    return ((devices ?? []) as Device[]).filter((d) => d.childProfileId === childId).length
  }

  async function handleCreate() {
    if (!addName.trim()) return
    setSaving(true)
    try {
      await createChild({ name: addName.trim(), avatarColor: addColor })
      setAddName('')
      setAddColor(AVATAR_COLORS[0])
      setShowAdd(false)
    } finally {
      setSaving(false)
    }
  }

  function startEdit(child: { _id: string; name: string; avatarColor: string }) {
    setEditId(child._id)
    setEditName(child.name)
    setEditColor(child.avatarColor)
  }

  async function handleSaveEdit() {
    if (!editId || !editName.trim()) return
    await updateChild({ profileId: editId as string, name: editName.trim(), avatarColor: editColor })
    setEditId(null)
  }

  async function handleDelete(profileId: string) {
    if (!confirm('Delete this child profile? Devices will be unassigned.')) return
    await removeChild({ profileId })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users size={24} className="text-blue-600" />
            Children
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage child profiles</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Child
        </button>
      </div>

      {/* Child cards */}
      {children === undefined ? (
        <div className="text-center py-12 text-slate-400">Loading…</div>
      ) : children.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No children yet. Add one to get started.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {((children as ChildProfile[]) ?? []).map((child) => {
            const isEditing = editId === child._id
            return (
              <div
                key={child._id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4"
              >
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex flex-wrap gap-2">
                      {AVATAR_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setEditColor(c)}
                          className={[
                            'w-7 h-7 rounded-full border-2 transition-all',
                            editColor === c
                              ? 'border-slate-700 scale-110'
                              : 'border-transparent',
                          ].join(' ')}
                          style={{ backgroundColor: c }}
                          aria-label={`Color ${c}`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditId(null)}
                        className="flex-1 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        <X size={14} className="inline mr-1" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                      >
                        <Check size={14} className="inline mr-1" />
                        Save
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
                        style={{ backgroundColor: child.avatarColor }}
                      >
                        {child.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{child.name}</p>
                        <p className="text-xs text-slate-400">
                          {deviceCount(child._id)} device
                          {deviceCount(child._id) !== 1 ? 's' : ''} assigned
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => startEdit(child)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(child._id)}
                        className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg border border-red-200 text-sm text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add Child Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Add Child</h2>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Alice"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Avatar Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setAddColor(c)}
                      className={[
                        'w-8 h-8 rounded-full border-2 transition-all',
                        addColor === c
                          ? 'border-slate-700 scale-110'
                          : 'border-transparent',
                      ].join(' ')}
                      style={{ backgroundColor: c }}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
                {/* Preview */}
                <div className="mt-3 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: addColor }}
                  >
                    {addName[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm text-slate-600">{addName || 'Child name'}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !addName.trim()}
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Adding…' : 'Add Child'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
