import { ActivityIndicator, ScrollView, Switch, Text, View } from 'react-native'
import { useQuery, useMutation } from 'convex/react'
import { makeFunctionReference } from 'convex/server'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { AwayPlaceholder } from '@/shared/ui/AwayBanner'
import { useNetwork } from '@/shared/lib/network'

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
const setCategoryActiveMutation = makeFunctionReference<'mutation'>('blockRules:setCategoryActive')

const PROTECTION_CATEGORIES: Array<{ value: string; icon: string }> = [
  { value: 'adult_content',      icon: '🔞' },
  { value: 'gambling',           icon: '🎰' },
  { value: 'drugs',              icon: '💊' },
  { value: 'weapons',            icon: '🔫' },
  { value: 'self_harm',          icon: '⚠️' },
  { value: 'violence_gore',      icon: '🩸' },
  { value: 'dating',             icon: '💔' },
  { value: 'cyberbullying_risk', icon: '🗯️' },
  { value: 'proxy_vpn',          icon: '🕵️' },
  { value: 'dark_web',           icon: '🕳️' },
  { value: 'piracy',             icon: '🏴‍☠️' },
  { value: 'crypto_risky',       icon: '📉' },
  { value: 'scam_phishing',      icon: '🎣' },
]

export default function BlockingScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { isConnected, isChecking } = useNetwork()

  const children = useQuery(listChildrenQuery, {}) as ChildProfile[] | undefined
  const platforms = useQuery(listPlatformsQuery, {}) as SocialPlatform[] | undefined
  const rules = useQuery(listRulesQuery, {}) as BlockRule[] | undefined
  const setSocialActive = useMutation(setSocialActiveMutation)
  const setCategoryActive = useMutation(setCategoryActiveMutation)

  const isCategoryBlocked = (value: string, childId?: string): boolean => {
    if (!rules) return false
    return rules.some(
      (r) =>
        r.type === 'category' &&
        r.value === value &&
        r.isActive &&
        r.childProfileId === childId,
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCategoryToggle = (category: string, childId: string | undefined, value: boolean) => {
    setCategoryActive({
      category,
      label: t(`categories.${category}`),
      childProfileId: childId as any,
      isActive: value,
      createdBy: 'parent',
    } as any).catch(console.error)
  }

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

  // Show away placeholder when not connected (and not still checking)
  if (!isConnected && !isChecking) {
    return (
      <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}>
        <View className="px-4 pb-4">
          <Text className="text-2xl font-bold text-gray-900">{t('blocking.title')}</Text>
          <Text className="mt-0.5 text-sm text-gray-400">{t('blocking.subtitle')}</Text>
        </View>
        <AwayPlaceholder title={t('blocking.away.title')} icon="🛡️" />
      </View>
    )
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
        <Text className="text-2xl font-bold text-gray-900">{t('blocking.title')}</Text>
        <Text className="mt-0.5 text-sm text-gray-400">{t('blocking.subtitle')}</Text>
      </View>

      {/* Global rules section */}
      <View
        className="mx-4 mb-4 overflow-hidden rounded-2xl bg-white"
        style={{ elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
      >
        <View className="border-b border-gray-100 px-4 py-3">
          <Text className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {t('blocking.globalRules')}
          </Text>
        </View>
        {renderPlatformRows(undefined)}
      </View>

      {/* Youth protection categories */}
      <View
        className="mx-4 mb-4 overflow-hidden rounded-2xl bg-white"
        style={{ elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
      >
        <View className="border-b border-gray-100 px-4 py-3">
          <Text className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {t('blocking.protectionCategories')}
          </Text>
        </View>
        {PROTECTION_CATEGORIES.map((cat, idx) => (
          <View
            key={cat.value}
            className={`flex-row items-center justify-between px-4 py-3.5 ${
              idx < PROTECTION_CATEGORIES.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <View className="flex-row items-center">
              <Text className="mr-3 text-xl">{cat.icon}</Text>
              <Text className="text-sm text-gray-800">{t(`categories.${cat.value}`)}</Text>
            </View>
            <Switch
              value={isCategoryBlocked(cat.value, undefined)}
              onValueChange={(v) => handleCategoryToggle(cat.value, undefined, v)}
              trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E7EB"
            />
          </View>
        ))}
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
            {t('blocking.noChildren.title')}
          </Text>
          <Text className="mt-1 text-sm text-gray-400">
            {t('blocking.noChildren.description')}
          </Text>
        </View>
      )}
    </ScrollView>
  )
}
