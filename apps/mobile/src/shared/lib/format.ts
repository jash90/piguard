import i18n from '@/shared/i18n'

export function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp
  const diffSecs = Math.floor(diffMs / 1000)

  if (diffSecs < 60) {
    return i18n.t('time.secondsAgo', { count: diffSecs })
  }

  const diffMins = Math.floor(diffSecs / 60)
  if (diffMins < 60) {
    return i18n.t('time.minutesAgo', { count: diffMins })
  }

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) {
    return i18n.t('time.hoursAgo', { count: diffHours })
  }

  const diffDays = Math.floor(diffHours / 24)
  return i18n.t('time.daysAgo', { count: diffDays })
}
