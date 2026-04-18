import { ScrollView, Text } from 'react-native'

export default function BlockingScreen() {
  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl font-bold">Blocking</Text>
      <Text className="mt-2 text-gray-500">Quick-toggle blocking per child</Text>
    </ScrollView>
  )
}
