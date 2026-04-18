import { Text, View } from 'react-native'

type Status = 'blocked' | 'allowed' | 'cached'

interface StatusBadgeProps {
  status: Status | string
}

const STYLES: Record<Status, { bg: string; text: string; label: string }> = {
  blocked: { bg: 'bg-red-100', text: 'text-red-700', label: 'Blocked' },
  allowed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Allowed' },
  cached: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Cached' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const s = STYLES[status as Status] ?? STYLES.cached

  return (
    <View className={`rounded-full px-2.5 py-0.5 ${s.bg}`}>
      <Text className={`text-xs font-semibold ${s.text}`}>{s.label}</Text>
    </View>
  )
}
