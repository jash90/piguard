import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ConvexClientProvider } from '@/shared/lib/convex'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ConvexClientProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
      </ConvexClientProvider>
    </SafeAreaProvider>
  )
}
