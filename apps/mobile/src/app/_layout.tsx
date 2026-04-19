import '../global.css'
import '@/shared/i18n'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ConvexClientProvider } from '@/shared/lib/convex'
import { ConnectionProvider } from '@/shared/lib/connection'
import { NetworkProvider } from '@/shared/lib/network'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ConnectionProvider>
        <ConvexClientProvider>
          <NetworkProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="setup" options={{ headerShown: false }} />
            </Stack>
          </NetworkProvider>
        </ConvexClientProvider>
      </ConnectionProvider>
    </SafeAreaProvider>
  )
}
