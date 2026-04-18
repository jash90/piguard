import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { ConvexReactClient } from 'convex/react'
import { ReactNode } from 'react'

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!)

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
  return (
    <ConvexAuthProvider client={convex} storage={storage}>
      {children}
    </ConvexAuthProvider>
  )
}
