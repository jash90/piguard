import { FlatList, Text, View } from 'react-native'
import { useQuery } from 'convex/react'
import { makeFunctionReference } from 'convex/server'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { formatRelativeTime } from '@/shared/lib/format'

type DnsLog = {
  _id: string
  domain: string
  status: string
  timestamp: number
  clientIp: string
}

const getBlockedQuery = makeFunctionReference<'query'>('dnsLogs:getBlocked')

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets()
  const logs = useQuery(getBlockedQuery, { limit: 50 })

  const renderItem = ({ item }: { item: DnsLog }) => (
    <View
      className="mx-4 mb-3 rounded-2xl bg-white p-4"
      style={{ elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
    >
      <View className="flex-row items-center">
        <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-red-100">
          <Text className="text-base">🚫</Text>
        </View>
        <View className="flex-1">
          <Text
            className="text-sm font-semibold text-gray-900"
            numberOfLines={1}
          >
            {item.domain}
          </Text>
          <Text className="mt-0.5 text-xs text-gray-400">
            {item.clientIp} · {formatRelativeTime(item.timestamp)}
          </Text>
        </View>
        <View className="ml-2 rounded-full bg-red-100 px-2.5 py-0.5">
          <Text className="text-xs font-semibold text-red-700">Blocked</Text>
        </View>
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
      ListHeaderComponent={
        <View className="px-4 pb-3">
          <Text className="text-2xl font-bold text-gray-900">Alerts</Text>
          <Text className="mt-0.5 text-sm text-gray-400">Blocked DNS attempts</Text>
        </View>
      }
      ListEmptyComponent={
        logs !== undefined ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-5xl">✅</Text>
            <Text className="mt-4 text-base font-semibold text-gray-600">
              No blocked attempts
            </Text>
            <Text className="mt-1 text-sm text-gray-400">
              All DNS queries are currently allowed
            </Text>
          </View>
        ) : null
      }
    />
  )
}
