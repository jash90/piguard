import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { getScenarios, ScenarioCard } from '@/features/tips'

export default function TipsScreen() {
  const { t, i18n } = useTranslation()
  const insets = useSafeAreaInsets()
  // Read i18n.language so changes trigger a re-render when language changes.
  void i18n.language
  const scenarios = getScenarios()

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <View className="px-4 pb-1">
        <Text className="text-2xl font-bold text-gray-900">
          {t('tips.title')}
        </Text>
      </View>
      <Text className="px-4 pb-5 text-sm text-gray-400">
        {t('tips.subtitle')}
      </Text>

      <View className="px-4">
        {scenarios.map((s) => (
          <ScenarioCard key={s.key} scenario={s} />
        ))}
      </View>

      <View className="mx-4 mt-4 rounded-2xl bg-blue-50 p-4">
        <Text className="mb-1 text-sm font-bold text-blue-900">
          {t('tips.reminder.title')}
        </Text>
        <Text className="text-xs leading-5 text-blue-800">
          {t('tips.reminder.body')}
        </Text>
      </View>
    </ScrollView>
  )
}
