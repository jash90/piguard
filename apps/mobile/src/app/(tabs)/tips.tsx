import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type TipCategory = {
  key: string
  label: string
  icon: string
  tip: string
}

// Static fallback tips matching the backend's FALLBACK_TIPS map
const TIPS: TipCategory[] = [
  {
    key: 'social_media',
    label: 'Social Media',
    icon: '📱',
    tip: 'Your child tried to access social media. Consider discussing screen time boundaries together. You might say: "I noticed you were checking Instagram — let\'s figure out a good time for that."',
  },
  {
    key: 'gaming',
    label: 'Gaming',
    icon: '🎮',
    tip: "Your child tried to access a gaming site. Maybe suggest an offline activity you can do together. Try: \"I see you were looking for games — want to play something together after dinner?\"",
  },
  {
    key: 'adult',
    label: 'Inappropriate Content',
    icon: '🔞',
    tip: "Inappropriate content was blocked. It might be a good time to check in with your child. You might gently say: \"I want to make sure you're safe online — is there anything you're curious about that we can talk through?\"",
  },
  {
    key: 'streaming',
    label: 'Streaming',
    icon: '📺',
    tip: 'A streaming site was blocked during restricted hours. Talk about balanced media consumption: "Let\'s agree on a good time for watching — maybe after homework?"',
  },
  {
    key: 'gambling',
    label: 'Gambling',
    icon: '🎲',
    tip: 'A gambling site was blocked. Discuss with your child why these sites are restricted: "These sites can be addictive and are designed for adults — let\'s talk about why they\'re off-limits."',
  },
  {
    key: 'default',
    label: 'General Safety',
    icon: '🛡️',
    tip: 'A website was blocked. Use this as an opportunity to discuss online safety: "I noticed something got blocked — let\'s look at it together and figure out if it\'s something useful for you."',
  },
]

export default function TipsScreen() {
  const insets = useSafeAreaInsets()
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (key: string) => {
    setExpanded((prev) => (prev === key ? null : key))
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <View className="px-4 pb-1">
        <Text className="text-2xl font-bold text-gray-900">Conversation Tips</Text>
      </View>
      <Text className="px-4 pb-5 text-sm text-gray-400">
        Tap a category to get advice on talking with your child
      </Text>

      <View className="px-4">
        {TIPS.map((category, idx) => {
          const isOpen = expanded === category.key

          return (
            <View key={category.key} className={idx < TIPS.length - 1 ? 'mb-3' : ''}>
              <TouchableOpacity
                onPress={() => toggle(category.key)}
                activeOpacity={0.8}
              >
                <View
                  className="overflow-hidden rounded-2xl bg-white"
                  style={{
                    elevation: 1,
                    shadowColor: '#000',
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 1 },
                  }}
                >
                  {/* Header row */}
                  <View className="flex-row items-center p-4">
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                      <Text className="text-xl">{category.icon}</Text>
                    </View>
                    <Text className="flex-1 text-base font-semibold text-gray-900">
                      {category.label}
                    </Text>
                    <Text className="text-xs text-gray-400">{isOpen ? '▲' : '▼'}</Text>
                  </View>

                  {/* Expanded tip */}
                  {isOpen && (
                    <View className="border-t border-gray-100 bg-blue-50 px-4 pb-5 pt-4">
                      <Text className="text-sm leading-6 text-gray-700">
                        {category.tip}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}
