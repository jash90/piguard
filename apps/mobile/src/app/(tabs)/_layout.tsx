import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useNetwork } from '@/shared/lib/network'
import { AwayBanner } from '@/shared/ui/AwayBanner'

export default function TabLayout() {
  const { t } = useTranslation()
  const { isConnected, isChecking } = useNetwork()

  return (
    <>
      {/* Show banner when disconnected (not during initial check) */}
      {!isConnected && !isChecking && <AwayBanner />}

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2563EB',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#F3F4F6',
            borderTopWidth: 1,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: { color: '#111827', fontWeight: '700' },
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.activity'),
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="blocking"
          options={{
            title: t('tabs.blocking'),
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="shield-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: t('tabs.alerts'),
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="notifications-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="tips"
          options={{
            title: t('tabs.tips'),
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bulb-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  )
}
