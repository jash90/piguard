'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { useTranslation } from 'react-i18next'
import { api } from '@/shared/lib/api'
import { Clock, Plus, Trash2, Pencil, X, Check } from 'lucide-react'
import '@/shared/i18n'

interface Schedule {
  _id: string
  daysOfWeek: number[]
  startTime: string
  endTime: string
  action: string
  isActive: boolean
}

interface ChildProfile {
  _id: string
  name: string
  avatarColor: string
}

const DAY_KEYS = ['schedule.days.mon', 'schedule.days.tue', 'schedule.days.wed', 'schedule.days.thu', 'schedule.days.fri', 'schedule.days.sat', 'schedule.days.sun']
const DAY_VALUES = [1, 2, 3, 4, 5, 6, 0]

type Action = 'block' | 'allow' | 'limit'

interface ScheduleFormState {
  daysOfWeek: number[]
  startTime: string
  endTime: string
  action: Action
}

const EMPTY_FORM: ScheduleFormState = {
  daysOfWeek: [],
  startTime: '08:00',
  endTime: '18:00',
  action: 'block',
}

export function SchedulePage() {
  const { t } = useTranslation()
  const children = useQuery(api.children.listAll)
  const [selectedChild, setSelectedChild] = useState<string>('')

  const schedules = useQuery(
    api.schedules.getByChild,
    selectedChild ? { childProfileId: selectedChild } : 'skip',
  )

  const createSchedule = useMutation(api.schedules.create)
  const updateSchedule = useMutation(api.schedules.update)
  const removeSchedule = useMutation(api.schedules.remove)

  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState<ScheduleFormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<ScheduleFormState>(EMPTY_FORM)

  async function handleCreate() {
    if (!selectedChild || form.daysOfWeek.length === 0) return
    setSaving(true)
    try {
      await createSchedule({
        childProfileId: selectedChild,
        daysOfWeek: form.daysOfWeek,
        startTime: form.startTime,
        endTime: form.endTime,
        action: form.action,
      })
      setForm(EMPTY_FORM)
      setShowAdd(false)
    } finally {
      setSaving(false)
    }
  }

  function startEdit(s: Schedule) {
    setEditId(s._id)
    setEditForm({
      daysOfWeek: s.daysOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      action: s.action as Action,
    })
  }

  async function handleSaveEdit() {
    if (!editId) return
    await updateSchedule({
      scheduleId: editId as string,
      daysOfWeek: editForm.daysOfWeek,
      startTime: editForm.startTime,
      endTime: editForm.endTime,
      action: editForm.action,
    })
    setEditId(null)
  }

  async function handleToggleActive(scheduleId: string, current: boolean) {
    await updateSchedule({ scheduleId, isActive: !current })
  }

  async function handleDelete(scheduleId: string) {
    if (!confirm(t('schedule.deleteConfirm'))) return
    await removeSchedule({ scheduleId })
  }

  function formatDays(days: number[]) {
    return days
      .slice()
      .sort((a, b) => DAY_VALUES.indexOf(a) - DAY_VALUES.indexOf(b))
      .map((d) => t(DAY_KEYS[DAY_VALUES.indexOf(d)]))
      .join(', ')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Clock size={24} className="text-blue-600" />
            {t('schedule.title')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{t('schedule.subtitle')}</p>
        </div>
        {selectedChild && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            {t('schedule.add')}
          </button>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t('schedule.selectChild')}
        </label>
        {children === undefined ? (
          <p className="text-sm text-slate-400">{t('common.loading')}</p>
        ) : children.length === 0 ? (
          <p className="text-sm text-slate-500">
            {t('schedule.noChildren')}{' '}
            <a href="/children" className="text-blue-600 hover:underline">
              {t('schedule.goToChildren')}
            </a>
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {((children as ChildProfile[]) ?? []).map((c) => (
              <button
                key={c._id}
                onClick={() => setSelectedChild(c._id)}
                className={[
                  'flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors',
                  selectedChild === c._id
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                ].join(' ')}
              >
                <span
                  className="w-5 h-5 rounded-full inline-block"
                  style={{ backgroundColor: c.avatarColor }}
                />
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedChild && (
        <>
          {schedules === undefined ? (
            <div className="text-center py-10 text-slate-400">{t('schedule.loading')}</div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-10 text-slate-400">{t('schedule.empty')}</div>
          ) : (
            <div className="space-y-3">
              {((schedules as Schedule[]) ?? []).map((s) => {
                const isEditing = editId === s._id
                return (
                  <div
                    key={s._id}
                    className="bg-white rounded-xl border border-slate-200 p-4"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <ScheduleFormFields value={editForm} onChange={setEditForm} />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditId(null)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <X size={14} /> {t('common.cancel')}
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                          >
                            <Check size={14} /> {t('common.save')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <p className="font-medium text-slate-800">
                            {s.startTime} – {s.endTime}
                          </p>
                          <p className="text-sm text-slate-500">{formatDays(s.daysOfWeek)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <ActionBadge action={s.action} />
                          <button
                            onClick={() => handleToggleActive(s._id, s.isActive)}
                            className={[
                              'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                              s.isActive ? 'bg-blue-600' : 'bg-slate-300',
                            ].join(' ')}
                          >
                            <span
                              className={[
                                'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
                                s.isActive ? 'translate-x-4.5' : 'translate-x-0.5',
                              ].join(' ')}
                            />
                          </button>
                          <button
                            onClick={() => startEdit(s)}
                            className="text-slate-400 hover:text-blue-600"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">{t('schedule.add')}</h2>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <ScheduleFormFields value={form} onChange={setForm} />
            {form.daysOfWeek.length === 0 && (
              <p className="text-xs text-red-500 mt-2">{t('schedule.daysRequired')}</p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || form.daysOfWeek.length === 0}
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? t('common.loading') : t('schedule.add')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ScheduleFormFields({
  value,
  onChange,
}: {
  value: ScheduleFormState
  onChange: (v: ScheduleFormState) => void
}) {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{t('schedule.form.days')}</label>
        <div className="flex flex-wrap gap-2">
          {DAY_KEYS.map((dayKey, i) => {
            const dayVal = DAY_VALUES[i]
            const active = value.daysOfWeek.includes(dayVal)
            return (
              <button
                key={dayKey}
                onClick={() =>
                  onChange({
                    ...value,
                    daysOfWeek: value.daysOfWeek.includes(dayVal)
                      ? value.daysOfWeek.filter((d) => d !== dayVal)
                      : [...value.daysOfWeek, dayVal],
                  })
                }
                className={[
                  'w-11 h-9 rounded-lg text-sm font-medium border transition-colors',
                  active
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50',
                ].join(' ')}
              >
                {t(dayKey)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('schedule.startTime')}</label>
          <input
            type="time"
            value={value.startTime}
            onChange={(e) => onChange({ ...value, startTime: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('schedule.endTime')}</label>
          <input
            type="time"
            value={value.endTime}
            onChange={(e) => onChange({ ...value, endTime: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('schedule.form.action')}</label>
        <select
          value={value.action}
          onChange={(e) => onChange({ ...value, action: e.target.value as Action })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="block">{t('schedule.action.blockDesc')}</option>
          <option value="allow">{t('schedule.action.allowDesc')}</option>
          <option value="limit">{t('schedule.action.limitDesc')}</option>
        </select>
      </div>
    </div>
  )
}

function ActionBadge({ action }: { action: string }) {
  const { t } = useTranslation()
  const styles: Record<string, string> = {
    block: 'bg-red-100 text-red-700',
    allow: 'bg-green-100 text-green-700',
    limit: 'bg-amber-100 text-amber-700',
  }
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        styles[action] ?? 'bg-slate-100 text-slate-600',
      ].join(' ')}
    >
      {t(`schedule.action.${action}`)}
    </span>
  )
}
