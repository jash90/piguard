import { ScrollView, Text } from 'react-native'

export default function TipsScreen() {
  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl font-bold">Conversation Tips</Text>
      <Text className="mt-2 text-gray-500">
        AI-generated tips for talking with your child
      </Text>
    </ScrollView>
  )
}
