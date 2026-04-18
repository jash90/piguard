import { ScrollView, Text } from 'react-native'

export default function NotificationsScreen() {
  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl font-bold">Alerts</Text>
      <Text className="mt-2 text-gray-500">Push notification inbox</Text>
    </ScrollView>
  )
}
