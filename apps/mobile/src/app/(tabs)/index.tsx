import { FlatList, RefreshControl, Text, View } from 'react-native'
import { useQuery } from 'convex/react'
import { makeFunctionReference } from 'convex/server'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { StatusBadge } from '@/shared/ui/StatusBadge'
import { AwayPlaceholder } from '@/shared/ui/AwayBanner'
import { useNetwork } from '@/shared/lib/network'
import { formatRelativeTime } from '@/shared/lib/format'

type DnsLog = {
  _id: string
  domain: string
  status: string
  timestamp: number
  clientIp: string
}

const getRecentQuery = makeFunctionReference<'query'>('dnsLogs:getRecent')

export default function ActivityScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const logs = useQuery(getRecentQuery, { limit: 50 })
  const { isConnected } = useNetwork()

  const renderItem = ({ item }: { item: DnsLog }) => (
    <View
      className="mx-4 mb-3 rounded-2xl bg-white p-4"
      style={{ elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className="mr-3 flex-1 text-sm font-semibold text-gray-900"
          numberOfLines={1}
        >
          {item.domain}
        </Text>
        <StatusBadge status={item.status} />
      </View>
      <View className="mt-1.5 flex-row items-center">
        <Text className="text-xs text-gray-400">
          {formatRelativeTime(item.timestamp)}
        </Text>
        <Text className="mx-1.5 text-xs text-gray-300">·</Text>
        <Text className="text-xs text-gray-400">{item.clientIp}</Text>
      </View>
    </View>
  )

  return (
    <FlatList
      className="flex-1 bg-gray-50"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 16,
        flexGrow: 1,
      }}
      data={(logs ?? []) as DnsLog[]}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={logs === undefined}
          onRefresh={() => {
            // Convex is reactive — data auto-updates
          }}
          tintColor="#2563EB"
        />
      }
      ListHeaderComponent={
        <View className="px-4 pb-3">
          <Text className="text-2xl font-bold text-gray-900">{t('activity.title')}</Text>
          <Text className="mt-0.5 text-sm text-gray-400">{t('activity.subtitle')}</Text>
        </View>
      }
      ListEmptyComponent={
        !isConnected && logs === undefined ? (
          <AwayPlaceholder title={t('activity.away.title')} icon="📡" />
        ) : logs !== undefined ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-5xl">🔍</Text>
            <Text className="mt-4 text-base font-semibold text-gray-600">
              {t('activity.empty.title')}
            </Text>
            <Text className="mt-1 text-sm text-gray-400">
              {t('activity.empty.description')}
            </Text>
          </View>
        ) : null
      }
    />
  )
}
