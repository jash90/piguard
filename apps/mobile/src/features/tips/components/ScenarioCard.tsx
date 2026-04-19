import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import type { ConversationScenario } from '../data/scenarios'

type Props = {
  scenario: ConversationScenario
}

type SectionKey =
  | 'why'
  | 'opening'
  | 'age'
  | 'reactions'
  | 'pitfalls'
  | 'redFlags'
  | 'followUp'

const SECTIONS: Array<{ key: SectionKey; labelKey: string; icon: string }> = [
  { key: 'why',       labelKey: 'tips.section.why',       icon: '🎯' },
  { key: 'opening',   labelKey: 'tips.section.opening',   icon: '💬' },
  { key: 'age',       labelKey: 'tips.section.age',       icon: '🧒' },
  { key: 'reactions', labelKey: 'tips.section.reactions', icon: '🔄' },
  { key: 'pitfalls',  labelKey: 'tips.section.pitfalls',  icon: '🚫' },
  { key: 'redFlags',  labelKey: 'tips.section.redFlags',  icon: '🚩' },
  { key: 'followUp',  labelKey: 'tips.section.followUp',  icon: '📋' },
]

export function ScenarioCard({ scenario }: Props) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionKey>('opening')

  return (
    <View
      className="mb-3 overflow-hidden rounded-2xl bg-white"
      style={{
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
      }}
    >
      <TouchableOpacity
        onPress={() => setIsOpen((v) => !v)}
        activeOpacity={0.8}
      >
        <View className="flex-row items-center p-4">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <Text className="text-xl">{scenario.icon}</Text>
          </View>
          <Text className="flex-1 text-base font-semibold text-gray-900">
            {scenario.label}
          </Text>
          <Text className="text-xs text-gray-400">{isOpen ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View className="border-t border-gray-100">
          {/* Section chips */}
          <View className="flex-row flex-wrap gap-2 bg-gray-50 px-4 py-3">
            {SECTIONS.map((s) => {
              const isActive = activeSection === s.key
              return (
                <TouchableOpacity
                  key={s.key}
                  onPress={() => setActiveSection(s.key)}
                  activeOpacity={0.7}
                  className={`flex-row items-center rounded-full px-3 py-1.5 ${
                    isActive ? 'bg-blue-600' : 'bg-white'
                  }`}
                >
                  <Text className="mr-1 text-xs">{s.icon}</Text>
                  <Text
                    className={`text-xs font-semibold ${
                      isActive ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {t(s.labelKey)}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          <View className="px-4 py-4">
            <SectionBody scenario={scenario} section={activeSection} />
          </View>
        </View>
      )}
    </View>
  )
}

function SectionBody({
  scenario,
  section,
}: {
  scenario: ConversationScenario
  section: SectionKey
}) {
  const { t } = useTranslation()

  if (section === 'why') {
    return <Text className="text-sm leading-6 text-gray-700">{scenario.why}</Text>
  }

  if (section === 'opening') {
    return (
      <View>
        <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {t('tips.opening.header')}
        </Text>
        <View className="rounded-xl bg-blue-50 p-3">
          <Text className="text-sm italic leading-6 text-gray-800">
            {scenario.opening}
          </Text>
        </View>
      </View>
    )
  }

  if (section === 'age') {
    const groups: Array<{ labelKey: string; emoji: string; text: string }> = [
      { labelKey: 'tips.age.younger', emoji: '🧸', text: scenario.ageNotes.younger },
      { labelKey: 'tips.age.tween',   emoji: '🎒', text: scenario.ageNotes.tween },
      { labelKey: 'tips.age.teen',    emoji: '🎧', text: scenario.ageNotes.teen },
    ]
    return (
      <View>
        {groups.map((g, i) => (
          <View
            key={g.labelKey}
            className={i < groups.length - 1 ? 'mb-3' : ''}
          >
            <Text className="mb-1 text-xs font-semibold text-gray-500">
              {g.emoji}  {t(g.labelKey)}
            </Text>
            <Text className="text-sm leading-6 text-gray-700">{g.text}</Text>
          </View>
        ))}
      </View>
    )
  }

  if (section === 'reactions') {
    return (
      <View>
        {scenario.reactions.map((r, i) => (
          <View
            key={r.label}
            className={`rounded-xl bg-gray-50 p-3 ${
              i < scenario.reactions.length - 1 ? 'mb-3' : ''
            }`}
          >
            <Text className="mb-1 text-sm font-bold text-gray-900">
              {r.label}
            </Text>
            <Text className="mb-2 text-xs italic text-gray-500">
              {r.example}
            </Text>
            <View className="mb-2 rounded-lg bg-green-50 p-2">
              <Text className="mb-0.5 text-xs font-semibold text-green-700">
                {t('tips.try')}
              </Text>
              <Text className="text-sm leading-5 text-gray-800">
                {r.parentResponse}
              </Text>
            </View>
            <View className="rounded-lg bg-red-50 p-2">
              <Text className="mb-0.5 text-xs font-semibold text-red-700">
                {t('tips.avoid')}
              </Text>
              <Text className="text-sm leading-5 text-gray-800">
                {r.avoid}
              </Text>
            </View>
          </View>
        ))}
      </View>
    )
  }

  if (section === 'pitfalls') {
    return (
      <View>
        {scenario.pitfalls.map((p, i) => (
          <View
            key={i}
            className={`flex-row ${
              i < scenario.pitfalls.length - 1 ? 'mb-2' : ''
            }`}
          >
            <Text className="mr-2 text-sm text-red-600">•</Text>
            <Text className="flex-1 text-sm leading-6 text-gray-700">{p}</Text>
          </View>
        ))}
      </View>
    )
  }

  if (section === 'redFlags') {
    return (
      <View>
        <View className="mb-3 rounded-lg bg-red-50 p-3">
          <Text className="text-xs font-semibold text-red-700">
            {t('tips.redFlags.warning')}
          </Text>
        </View>
        {scenario.redFlags.map((f, i) => (
          <View
            key={i}
            className={`flex-row ${
              i < scenario.redFlags.length - 1 ? 'mb-2' : ''
            }`}
          >
            <Text className="mr-2 text-sm">🚩</Text>
            <Text className="flex-1 text-sm leading-6 text-gray-700">{f}</Text>
          </View>
        ))}
      </View>
    )
  }

  if (section === 'followUp') {
    return (
      <View>
        <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {t('tips.followUp.header')}
        </Text>
        {scenario.followUp.map((f, i) => (
          <View
            key={i}
            className={`flex-row ${
              i < scenario.followUp.length - 1 ? 'mb-2' : ''
            }`}
          >
            <Text className="mr-2 text-sm text-blue-600">□</Text>
            <Text className="flex-1 text-sm leading-6 text-gray-700">{f}</Text>
          </View>
        ))}
      </View>
    )
  }

  return null
}
