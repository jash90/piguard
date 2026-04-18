import { getConvexHttpUrl } from './config.js'
import { type DnsLogEntry } from './localDb.js'

export interface PushDnsEventsResult {
  ok: boolean
  count: number
  blockedCount: number
}

export async function pushDnsEvents(events: DnsLogEntry[]): Promise<PushDnsEventsResult> {
  const url = `${getConvexHttpUrl()}/dns-events`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      events: events.map((e) => ({
        macAddress: e.clientMac,
        ipAddress: e.clientIp,
        domain: e.domain,
        queryType: e.queryType,
        status: e.status,
        timestamp: e.timestamp * 1000, // Convert to ms
      })),
    }),
  })

  if (!response.ok) {
    console.error('Failed to push DNS events:', response.status)
    return { ok: false, count: 0, blockedCount: 0 }
  }

  const result = (await response.json()) as PushDnsEventsResult
  return result
}

export async function updateSyncCursor(value: string): Promise<void> {
  const url = `${getConvexHttpUrl()}/sync-status`

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'dns_log_cursor', value }),
  })
}

export async function getSyncCursor(): Promise<string | null> {
  // For simplicity, store cursor locally in a file
  // In production this would be fetched from Convex
  return null
}
