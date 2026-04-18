import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: 'Activity', tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="blocking"
        options={{ title: 'Blocking', tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="notifications"
        options={{ title: 'Alerts', tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="tips"
        options={{ title: 'Tips', tabBarIcon: () => null }}
      />
    </Tabs>
  )
}
