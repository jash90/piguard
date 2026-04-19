import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { ConvexReactClient } from 'convex/react'
import { ReactNode, useMemo } from 'react'
import { useConnection } from '@/shared/lib/connection'

// Simple in-memory storage — works for the session; no persistence on restart.
// Replace with expo-secure-store for production persistent auth.
const _mem: Record<string, string> = {}
const storage = {
  getItem: (key: string) => _mem[key] ?? null,
  setItem: (key: string, value: string) => {
    _mem[key] = value
  },
  removeItem: (key: string) => {
    delete _mem[key]
  },
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const { backendUrl } = useConnection()

  // Re-create the client when the URL changes
  const client = useMemo(() => {
    const url = backendUrl || process.env.EXPO_PUBLIC_CONVEX_URL || 'http://127.0.0.1:3210'
    return new ConvexReactClient(url)
  }, [backendUrl])

  return (
    <ConvexAuthProvider client={client} storage={storage}>
      {children}
    </ConvexAuthProvider>
  )
}
