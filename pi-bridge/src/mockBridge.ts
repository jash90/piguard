/**
 * Mock DNS event generator for demo / development.
 *
 * Generates realistic fake DNS queries against the same seed devices that
 * `packages/backend/convex/seed.ts` creates, so the dashboards always have
 * data without a real Pi-hole.
 */

import { config, getConvexHttpUrl } from './config.js'
import { updateSyncCursor } from './convexSync.js'

// ---------------------------------------------------------------------------
// Seed data — mirrors seed.ts devices
// ---------------------------------------------------------------------------
const MOCK_DEVICES = [
  { mac: 'AA:BB:CC:DD:EE:01', ip: '192.168.1.101', hostname: 'iPhone-Emma' },
  { mac: 'AA:BB:CC:DD:EE:02', ip: '192.168.1.102', hostname: 'iPad-Max' },
  { mac: 'AA:BB:CC:DD:EE:03', ip: '192.168.1.103', hostname: 'Gaming-PC' },
  { mac: 'AA:BB:CC:DD:EE:04', ip: '192.168.1.104', hostname: 'MacBook-Parent' },
  { mac: 'AA:BB:CC:DD:EE:05', ip: '192.168.1.105', hostname: 'Smart-TV' },
]

const DOMAINS: { domain: string; status: 'allowed' | 'blocked' | 'cached'; weight: number }[] = [
  // Allowed (high traffic)
  { domain: 'google.com', status: 'allowed', weight: 12 },
  { domain: 'apple.com', status: 'allowed', weight: 10 },
  { domain: 'youtube.com', status: 'allowed', weight: 8 },
  { domain: 'github.com', status: 'allowed', weight: 6 },
  { domain: 'amazon.com', status: 'allowed', weight: 6 },
  { domain: 'wikipedia.org', status: 'allowed', weight: 5 },
  { domain: 'stackoverflow.com', status: 'allowed', weight: 4 },
  { domain: 'netflix.com', status: 'allowed', weight: 5 },
  { domain: 'reddit.com', status: 'allowed', weight: 4 },
  { domain: 'discord.com', status: 'allowed', weight: 4 },
  { domain: 'roblox.com', status: 'allowed', weight: 3 },
  { domain: 'minecraft.net', status: 'allowed', weight: 3 },
  { domain: 'twitch.tv', status: 'allowed', weight: 3 },
  { domain: 'whatsapp.com', status: 'allowed', weight: 5 },
  { domain: 'spotify.com', status: 'allowed', weight: 4 },

  // Blocked (social media block rules)
  { domain: 'tiktok.com', status: 'blocked', weight: 5 },
  { domain: 'instagram.com', status: 'blocked', weight: 4 },
  { domain: 'facebook.com', status: 'blocked', weight: 4 },
  { domain: 'snapchat.com', status: 'blocked', weight: 3 },
  { domain: 'twitter.com', status: 'blocked', weight: 3 },
  { domain: 'pinterest.com', status: 'blocked', weight: 2 },

  // Cached
  { domain: 'google.com', status: 'cached', weight: 8 },
  { domain: 'apple.com', status: 'cached', weight: 6 },
  { domain: 'youtube.com', status: 'cached', weight: 4 },
]

// Build a weighted pool for random selection
const WEIGHTED_POOL: typeof DOMAINS[number][] = []
for (const d of DOMAINS) {
  for (let i = 0; i < d.weight; i++) WEIGHTED_POOL.push(d)
}

const QUERY_TYPES = ['A', 'AAAA', 'HTTPS', 'MX']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ---------------------------------------------------------------------------
// Event generation
// ---------------------------------------------------------------------------

export interface MockDnsEvent {
  macAddress: string
  ipAddress: string
  hostname?: string
  domain: string
  queryType: string
  status: string
  timestamp: number
}

/** Generate a batch of mock DNS events with timestamps spread over the given duration. */
export function generateEvents(count: number, spreadMs: number = 0): MockDnsEvent[] {
  const now = Date.now()
  const events: MockDnsEvent[] = []

  for (let i = 0; i < count; i++) {
    const device = pick(MOCK_DEVICES)
    const domainEntry = pick(WEIGHTED_POOL)
    const offset = spreadMs > 0 ? Math.floor(Math.random() * spreadMs) : 0

    events.push({
      macAddress: device.mac,
      ipAddress: device.ip,
      hostname: device.hostname,
      domain: domainEntry.domain,
      queryType: pick(QUERY_TYPES),
      status: domainEntry.status,
      timestamp: now - offset,
    })
  }

  // Sort by timestamp ascending (oldest first) so cursor updates make sense
  events.sort((a, b) => a.timestamp - b.timestamp)
  return events
}

// ---------------------------------------------------------------------------
// Direct push — maps MockDnsEvent → the /dns-events HTTP API format
// ---------------------------------------------------------------------------

interface PushResult {
  ok: boolean
  count: number
  blockedCount: number
}

async function pushMockEvents(events: MockDnsEvent[]): Promise<PushResult> {
  const url = `${getConvexHttpUrl()}/dns-events`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      events: events.map((e) => ({
        macAddress: e.macAddress,
        ipAddress: e.ipAddress,
        hostname: e.hostname,
        domain: e.domain,
        queryType: e.queryType,
        status: e.status,
        timestamp: e.timestamp,
      })),
    }),
  })

  if (!response.ok) {
    console.error('[mock] Failed to push events:', response.status, await response.text().catch(() => ''))
    return { ok: false, count: 0, blockedCount: 0 }
  }

  return (await response.json()) as PushResult
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

let timer: ReturnType<typeof setInterval> | null = null
let isShuttingDown = false

/** Push a burst of historical events so the dashboard isn't empty on startup. */
async function burst(): Promise<void> {
  const count = config.mockBurstCount
  console.log(`[mock] Generating burst of ${count} historical events…`)

  const events = generateEvents(count, 30 * 60 * 1000) // spread over last 30 min

  // Push in batches of 200
  for (let i = 0; i < events.length; i += 200) {
    if (isShuttingDown) return
    const batch = events.slice(i, i + 200)
    const result = await pushMockEvents(batch)
    if (result.ok) {
      await updateSyncCursor(String(Date.now()))
      console.log(`[mock] Burst batch ${Math.floor(i / 200) + 1}: pushed ${batch.length} events`)
    } else {
      console.error('[mock] Burst batch failed')
    }
  }

  console.log(`[mock] Burst complete — ${count} events loaded`)
}

/** Generate a small batch of recent events every interval. */
async function tick(): Promise<void> {
  if (isShuttingDown) return

  const count = 3 + Math.floor(Math.random() * 8) // 3–10 events per tick
  const events = generateEvents(count, config.mockIntervalMs)

  const result = await pushMockEvents(events)
  if (result.ok) {
    await updateSyncCursor(String(Date.now()))
    console.log(`[mock] Tick: pushed ${count} events (${result.blockedCount} blocked)`)
  } else {
    console.error('[mock] Tick push failed')
  }
}

/** Start the mock bridge. */
export async function startMockBridge(): Promise<void> {
  console.log('[mock] Starting mock bridge…')
  console.log(`[mock] Interval: ${config.mockIntervalMs}ms, Burst: ${config.mockBurstCount} events`)

  // Initial burst of historical data
  await burst()

  // Then steady stream
  timer = setInterval(tick, config.mockIntervalMs)

  console.log('[mock] Running. Press Ctrl+C to stop.')
}

/** Stop the mock bridge. */
export function stopMockBridge(): void {
  isShuttingDown = true
  if (timer) clearInterval(timer)
}
