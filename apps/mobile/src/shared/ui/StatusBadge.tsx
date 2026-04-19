import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

type Status = 'blocked' | 'allowed' | 'cached'

interface StatusBadgeProps {
  status: Status | string
}

const STYLES: Record<Status, { bg: string; text: string; labelKey: string }> = {
  blocked: { bg: 'bg-red-100',   text: 'text-red-700',   labelKey: 'activity.status.blocked' },
  allowed: { bg: 'bg-green-100', text: 'text-green-700', labelKey: 'activity.status.allowed' },
  cached:  { bg: 'bg-gray-100',  text: 'text-gray-500',  labelKey: 'activity.status.cached' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation()
  const s = STYLES[status as Status] ?? STYLES.cached

  return (
    <View className={`rounded-full px-2.5 py-0.5 ${s.bg}`}>
      <Text className={`text-xs font-semibold ${s.text}`}>{t(s.labelKey)}</Text>
    </View>
  )
}
