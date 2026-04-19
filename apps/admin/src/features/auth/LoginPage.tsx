'use client'

import { useState, FormEvent } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import '@/shared/i18n'

export function LoginPage() {
  const { t } = useTranslation()
  const { signIn } = useAuthActions()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn('password', { email, password, flow: 'signIn' })
    } catch {
      setError(t('login.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col items-center mb-6">
          <ShieldCheck size={36} className="text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-slate-800">PiGuard Admin</h1>
          <p className="text-sm text-slate-500 mt-1">{t('login.title')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('login.email')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ty@przyklad.pl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('login.password')}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? t('common.loading') : t('login.submit')}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            {t('login.noAccount')}
          </Link>
        </p>
      </div>
    </div>
  )
}
