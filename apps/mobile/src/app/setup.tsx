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
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useConnection } from '@/shared/lib/connection'

export default function SetupScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { setBackendUrl, backendUrl: defaultUrl } = useConnection()

  const [url, setUrl] = useState(defaultUrl || 'http://192.168.1.')
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState('')
  const abortRef = useRef(false)

  /** Derive HTTP action URL from Convex URL. */
  function toHttpUrl(convexUrl: string): string {
    if (convexUrl.includes('.convex.cloud')) {
      return convexUrl.replace('.convex.cloud', '.convex.site')
    }
    try {
      const u = new URL(convexUrl)
      const port = parseInt(u.port, 10)
      if (!isNaN(port)) u.port = String(port + 1)
      return u.toString().replace(/\/$/, '')
    } catch {
      return convexUrl
    }
  }

  /** Test if the given URL reaches a live PiGuard backend. */
  async function testUrl(testUrl: string): Promise<boolean> {
    try {
      const httpUrl = toHttpUrl(testUrl)
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      const res = await fetch(`${httpUrl}/ping`, { signal: controller.signal })
      clearTimeout(timeout)
      if (!res.ok) return false
      const data = await res.json()
      return data.ok === true
    } catch {
      return false
    }
  }

  /** Manually connect to the entered URL. */
  const handleConnect = async () => {
    if (!url.trim()) {
      setError(t('setup.error.empty'))
      return
    }

    setTesting(true)
    setError('')

    const ok = await testUrl(url.trim())
    if (ok) {
      await setBackendUrl(url.trim())
      router.replace('/(tabs)')
    } else {
      setError(t('setup.error.unreachable'))
    }
    setTesting(false)
  }

  /** Scan the local network for the backend. */
  const handleScan = async () => {
    setScanning(true)
    setError('')
    abortRef.current = false

    // Extract subnet from current URL
    const match = url.match(/^(http:\/\/)(\d+\.\d+\.\d+)\./)
    if (!match) {
      setError(t('setup.error.invalidPrefix'))
      setScanning(false)
      return
    }

    const prefix = match[2]
    const protocol = match[1]

    // Try common ports: 3210 (Convex local), 3000, 3001, 3003
    const ports = [3210, 3000, 3001, 3003]

    for (let host = 1; host <= 254 && !abortRef.current; host++) {
      for (const port of ports) {
        if (abortRef.current) break
        const candidate = `${protocol}${prefix}.${host}:${port}`
        setScanProgress(t('setup.scanProgress', { host: `${prefix}.${host}`, port }))

        const ok = await testUrl(candidate)
        if (ok) {
          setUrl(candidate)
          setScanning(false)
          setScanProgress('')
          // Auto-connect
          await setBackendUrl(candidate)
          router.replace('/(tabs)')
          return
        }
      }
    }

    if (!abortRef.current) {
      setError(t('setup.error.notFound'))
    }
    setScanning(false)
    setScanProgress('')
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
      >
        {/* Logo */}
        <View className="mb-8 items-center">
          <Text className="text-6xl">📡</Text>
          <Text className="mt-3 text-3xl font-bold text-blue-600">PiGuard</Text>
          <Text className="mt-1 text-base text-gray-500">{t('setup.brand.subtitle')}</Text>
        </View>

        {/* Setup card */}
        <View className="w-full rounded-3xl bg-gray-50 p-6">
          <Text className="mb-1 text-sm font-semibold text-gray-700">
            {t('setup.urlLabel')}
          </Text>
          <Text className="mb-3 text-xs text-gray-400">
            {t('setup.urlHelp')}
          </Text>

          <TextInput
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 font-mono text-sm text-gray-900"
            placeholder="http://192.168.1.100:3210"
            placeholderTextColor="#9CA3AF"
            value={url}
            onChangeText={setUrl}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!testing && !scanning}
          />

          {/* Error */}
          {error ? (
            <View className="mt-3 rounded-xl bg-red-50 px-4 py-2.5">
              <Text className="text-sm text-red-600">{error}</Text>
            </View>
          ) : null}

          {/* Scan progress */}
          {scanning && scanProgress ? (
            <View className="mt-3 rounded-xl bg-blue-50 px-4 py-2.5">
              <Text className="text-sm text-blue-600">{scanProgress}</Text>
            </View>
          ) : null}

          {/* Connect button */}
          <TouchableOpacity
            className="mt-4 w-full items-center rounded-xl bg-blue-600 py-4"
            onPress={handleConnect}
            disabled={testing || scanning}
            activeOpacity={0.85}
          >
            {testing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-white">
                {t('setup.connect')}
              </Text>
            )}
          </TouchableOpacity>

          {/* Scan button */}
          <TouchableOpacity
            className="mt-3 w-full items-center rounded-xl border border-blue-200 bg-blue-50 py-3.5"
            onPress={handleScan}
            disabled={scanning}
            activeOpacity={0.85}
          >
            {scanning ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="#2563EB" size="small" />
                <Text className="ml-2 text-sm font-semibold text-blue-600">
                  {t('setup.scanning')}
                </Text>
              </View>
            ) : (
              <Text className="text-sm font-semibold text-blue-600">
                {t('setup.scan')}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Hint */}
        <View className="mt-6 rounded-2xl bg-gray-50 px-5 py-4">
          <Text className="text-xs font-semibold text-gray-500">{t('setup.hint.title')}</Text>
          <Text className="mt-1 text-xs text-gray-400 leading-5">
            {t('setup.hint.body')}{'\n'}
            <Text className="font-mono text-gray-500">ipconfig</Text> (Windows) /{' '}
            <Text className="font-mono text-gray-500">ifconfig</Text> (macOS/Linux)
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
