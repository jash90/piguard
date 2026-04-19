import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNetwork } from '@/shared/lib/network'

export function AwayBanner() {
  const { t } = useTranslation()
  const { isConnected, isChecking, checkNow } = useNetwork()

  if (isConnected || isChecking) return null

  return (
    <View className="mx-4 mb-3 overflow-hidden rounded-2xl bg-amber-50 border border-amber-200">
      <View className="flex-row items-start p-4">
        <Text className="mr-3 text-2xl">🏠</Text>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-amber-800">
            {t('away.title')}
          </Text>
          <Text className="mt-0.5 text-xs text-amber-600 leading-4">
            {t('away.description')}
          </Text>
          <TouchableOpacity
            onPress={checkNow}
            className="mt-2 self-start rounded-lg bg-amber-100 px-3 py-1.5"
            activeOpacity={0.7}
          >
            <Text className="text-xs font-semibold text-amber-700">
              {t('common.retry')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export function AwayPlaceholder({ title, icon }: { title: string; icon: string }) {
  const { t } = useTranslation()
  const { isChecking, checkNow } = useNetwork()

  if (isChecking) return null

  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="text-6xl">{icon}</Text>
      <Text className="mt-5 text-lg font-bold text-gray-600">{title}</Text>
      <Text className="mt-2 text-center text-sm text-gray-400 leading-5">
        {t('away.placeholder.description')}
      </Text>
      <TouchableOpacity
        onPress={checkNow}
        className="mt-5 rounded-xl bg-blue-600 px-6 py-3"
        activeOpacity={0.85}
      >
        <Text className="text-sm font-semibold text-white">{t('common.retry')}</Text>
      </TouchableOpacity>
    </View>
  )
}
