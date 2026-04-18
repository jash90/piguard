import { ActivityIndicator, ScrollView, Switch, Text, View } from 'react-native'
import { useQuery, useMutation } from 'convex/react'
import { makeFunctionReference } from 'convex/server'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ChildProfile = {
  _id: string
  name: string
  avatarColor: string
}

type SocialPlatform = {
  _id: string
  name: string
  domains: string[]
}

type BlockRule = {
  _id: string
  type: string
  value: string
  isActive: boolean
  childProfileId?: string
}

const listChildrenQuery = makeFunctionReference<'query'>('children:list')
const listPlatformsQuery = makeFunctionReference<'query'>('social_platforms:list')
const listRulesQuery = makeFunctionReference<'query'>('blockRules:list')
const setSocialActiveMutation = makeFunctionReference<'mutation'>('blockRules:setSocialMediaActive')

export default function BlockingScreen() {
  const insets = useSafeAreaInsets()

  const children = useQuery(listChildrenQuery, {}) as ChildProfile[] | undefined
  const platforms = useQuery(listPlatformsQuery, {}) as SocialPlatform[] | undefined
  const rules = useQuery(listRulesQuery, {}) as BlockRule[] | undefined
  const setSocialActive = useMutation(setSocialActiveMutation)

  const isBlocked = (platformName: string, childId?: string): boolean => {
    if (!rules) return false
    return rules.some(
      (r) =>
        r.type === 'social_media' &&
        r.value === platformName &&
        r.isActive &&
        r.childProfileId === childId,
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleToggle = (platformName: string, childId: string | undefined, value: boolean) => {
    setSocialActive({
      platformName,
      childProfileId: childId as any,
      isActive: value,
      createdBy: 'parent',
    } as any).catch(console.error)
  }

  if (!children || !platforms) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator color="#2563EB" size="large" />
      </View>
    )
  }

  const renderPlatformRows = (childId?: string) =>
    platforms.map((platform, idx) => (
      <View
        key={platform._id}
        className={`flex-row items-center justify-between px-4 py-3.5 ${
          idx < platforms.length - 1 ? 'border-b border-gray-100' : ''
        }`}
      >
        <Text className="text-sm text-gray-800">{platform.name}</Text>
        <Switch
          value={isBlocked(platform.name, childId)}
          onValueChange={(v) => handleToggle(platform.name, childId, v)}
          trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#E5E7EB"
        />
      </View>
    ))

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <View className="px-4 pb-4">
        <Text className="text-2xl font-bold text-gray-900">Blocking</Text>
        <Text className="mt-0.5 text-sm text-gray-400">Toggle platforms per child</Text>
      </View>

      {/* Global rules section */}
      <View
        className="mx-4 mb-4 overflow-hidden rounded-2xl bg-white"
        style={{ elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
      >
        <View className="border-b border-gray-100 px-4 py-3">
          <Text className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Global Rules
          </Text>
        </View>
        {renderPlatformRows(undefined)}
      </View>

      {/* Per-child sections */}
      {children.map((child) => (
        <View
          key={child._id}
          className="mx-4 mb-4 overflow-hidden rounded-2xl bg-white"
          style={{ elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
        >
          <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
            <View
              className="mr-3 h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: child.avatarColor }}
            >
              <Text className="text-sm font-bold text-white">
                {child.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-sm font-semibold text-gray-700">{child.name}</Text>
          </View>
          {renderPlatformRows(child._id)}
        </View>
      ))}

      {children.length === 0 && (
        <View className="items-center py-16">
          <Text className="text-5xl">👶</Text>
          <Text className="mt-4 text-base font-semibold text-gray-600">
            No child profiles yet
          </Text>
          <Text className="mt-1 text-sm text-gray-400">
            Add profiles in the admin panel
          </Text>
        </View>
      )}
    </ScrollView>
  )
}
