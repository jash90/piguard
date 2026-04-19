import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConnectionState {
  /** The backend URL currently in use (may be the env default or user-configured). */
  backendUrl: string
  /** Has the user gone through the setup screen? */
  isConfigured: boolean
  /** Save a new backend URL and mark as configured. */
  setBackendUrl: (url: string) => Promise<void>
  /** Reset to defaults (shows setup screen again). */
  resetConfig: () => Promise<void>
}

const ConnectionContext = createContext<ConnectionState>({
  backendUrl: '',
  isConfigured: false,
  setBackendUrl: async () => {},
  resetConfig: async () => {},
})

export const useConnection = () => useContext(ConnectionContext)

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY_URL = 'piguard_backend_url'
const STORAGE_KEY_CONFIGURED = 'piguard_configured'

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [backendUrl, setBackendUrlState] = useState(
    process.env.EXPO_PUBLIC_CONVEX_URL ?? ''
  )
  const [isConfigured, setIsConfigured] = useState(false)

  // Load saved config on mount
  useEffect(() => {
    ;(async () => {
      try {
        const [savedUrl, savedConfigured] = await AsyncStorage.multiGet([
          STORAGE_KEY_URL,
          STORAGE_KEY_CONFIGURED,
        ])

        if (savedUrl[1]) {
          setBackendUrlState(savedUrl[1])
        }
        if (savedConfigured[1] === 'true') {
          setIsConfigured(true)
        }
      } catch {
        // AsyncStorage might not be available in some environments
      }
    })()
  }, [])

  const setBackendUrl = useCallback(async (url: string) => {
    const clean = url.trim().replace(/\/$/, '')
    setBackendUrlState(clean)
    await AsyncStorage.multiSet([
      [STORAGE_KEY_URL, clean],
      [STORAGE_KEY_CONFIGURED, 'true'],
    ])
    setIsConfigured(true)
  }, [])

  const resetConfig = useCallback(async () => {
    await AsyncStorage.multiRemove([STORAGE_KEY_URL, STORAGE_KEY_CONFIGURED])
    setBackendUrlState(process.env.EXPO_PUBLIC_CONVEX_URL ?? '')
    setIsConfigured(false)
  }, [])

  return (
    <ConnectionContext.Provider
      value={{ backendUrl, isConfigured, setBackendUrl, resetConfig }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}
