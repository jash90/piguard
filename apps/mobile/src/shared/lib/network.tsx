import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { ConvexReactClient } from 'convex/react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NetworkState {
  /** Is the backend reachable over the current network? */
  isConnected: boolean
  /** Are we currently checking reachability? */
  isChecking: boolean
  /** When was the backend last confirmed reachable? (ms timestamp, null = never) */
  lastConnected: number | null
  /** Trigger an immediate re-check */
  checkNow: () => void
}

const NetworkContext = createContext<NetworkState>({
  isConnected: false,
  isChecking: true,
  lastConnected: null,
  checkNow: () => {},
})

export const useNetwork = () => useContext(NetworkContext)

// ---------------------------------------------------------------------------
// Reachability check
// ---------------------------------------------------------------------------

async function pingBackend(httpUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)

    const res = await fetch(`${httpUrl}/ping`, {
      method: 'GET',
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) return false
    const data = await res.json()
    return data.ok === true
  } catch {
    return false
  }
}

/** Derive the HTTP action URL from the Convex URL. */
function toHttpUrl(convexUrl: string): string {
  // .convex.cloud → .convex.site
  // http://127.0.0.1:3210 → http://127.0.0.1:3211 (local dev convention)
  if (convexUrl.includes('.convex.cloud')) {
    return convexUrl.replace('.convex.cloud', '.convex.site')
  }
  // Local dev: assume port+1 for HTTP actions
  try {
    const url = new URL(convexUrl)
    const port = parseInt(url.port, 10)
    if (!isNaN(port)) {
      url.port = String(port + 1)
    }
    return url.toString().replace(/\/$/, '')
  } catch {
    return convexUrl
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

const CHECK_INTERVAL = 10_000 // 10 seconds

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [lastConnected, setLastConnected] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL ?? ''
  const httpUrl = toHttpUrl(convexUrl)

  const check = useCallback(async () => {
    setIsChecking(true)
    const reachable = await pingBackend(httpUrl)
    setIsConnected(reachable)
    if (reachable) setLastConnected(Date.now())
    setIsChecking(false)
  }, [httpUrl])

  useEffect(() => {
    // Initial check
    check()

    // Periodic checks
    intervalRef.current = setInterval(check, CHECK_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [check])

  return (
    <NetworkContext.Provider
      value={{ isConnected, isChecking, lastConnected, checkNow: check }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
