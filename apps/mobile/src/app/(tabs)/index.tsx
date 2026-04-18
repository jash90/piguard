import { ScrollView, Text, View } from 'react-native'

export default function ActivityScreen() {
  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl font-bold">Activity</Text>
      <Text className="mt-2 text-gray-500">Real-time DNS activity feed</Text>
      <View className="mt-4 items-center py-12">
        <Text className="text-gray-400">Connect to Convex to see live data</Text>
      </View>
    </ScrollView>
  )
}
