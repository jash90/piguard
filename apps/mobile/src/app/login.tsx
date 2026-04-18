import { Text, View } from 'react-native'

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl font-bold">PiGuard</Text>
      <Text className="mt-2 text-gray-500">Sign in to continue</Text>
    </View>
  )
}
