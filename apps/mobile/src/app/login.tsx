import { useState, useRef } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useAuthActions } from '@convex-dev/auth/react'
import { useRouter } from 'expo-router'

export default function LoginScreen() {
  const { signIn } = useAuthActions()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const passwordRef = useRef<TextInput>(null)

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await signIn('password', { email: email.trim(), password, flow: 'signIn' })
      router.replace('/(tabs)')
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 items-center justify-center px-6">
        {/* Logo */}
        <View className="mb-10 items-center">
          <Text className="text-6xl">🛡️</Text>
          <Text className="mt-3 text-3xl font-bold text-blue-600">PiGuard</Text>
          <Text className="mt-1 text-base text-gray-500">Parental DNS Protection</Text>
        </View>

        {/* Form card */}
        <View className="w-full rounded-3xl bg-gray-50 p-6">
          {/* Email field */}
          <View className="mb-4">
            <Text className="mb-1.5 text-sm font-semibold text-gray-700">Email</Text>
            <TextInput
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900"
              placeholder="you@example.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>

          {/* Password field */}
          <View className="mb-5">
            <Text className="mb-1.5 text-sm font-semibold text-gray-700">Password</Text>
            <TextInput
              ref={passwordRef}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
            />
          </View>

          {/* Error message */}
          {error ? (
            <View className="mb-4 rounded-xl bg-red-50 px-4 py-2.5">
              <Text className="text-sm text-red-600">{error}</Text>
            </View>
          ) : null}

          {/* Sign in button */}
          <TouchableOpacity
            className="w-full items-center rounded-xl bg-blue-600 py-4"
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-white">Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
