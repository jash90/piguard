import { config } from './config.js'
import { authenticate, getNetworkDevices } from './piHoleClient.js'
import { getLogsSince, getMaxId } from './localDb.js'
import { pushDnsEvents, updateSyncCursor } from './convexSync.js'
import { syncRules } from './ruleSync.js'
import { writeInfluxStats } from './influxLogger.js'
import { startMockBridge, stopMockBridge } from './mockBridge.js'

let dnsCursor: number = 0
let isShuttingDown = false

async function main() {
  console.log('PiGuard Bridge starting...')
  console.log(`Convex URL: ${config.convexUrl || '(not set)'}`)

  // Validate config
  if (!config.convexUrl) {
    console.error('CONVEX_URL is required')
    process.exit(1)
  }

  // -----------------------------------------------------------------------
  // Mock mode — generate fake DNS events, no Pi-hole needed
  // -----------------------------------------------------------------------
  if (config.mockMode) {
    console.log('🔧 MOCK MODE — generating fake DNS events')
    process.on('SIGINT', () => { stopMockBridge(); process.exit(0) })
    process.on('SIGTERM', () => { stopMockBridge(); process.exit(0) })
    await startMockBridge()
    return
  }

  // -----------------------------------------------------------------------
  // Real Pi-hole mode
  // -----------------------------------------------------------------------
  console.log(`Pi-hole URL: ${config.piHoleUrl}`)
  console.log(
    `Sync intervals: DNS=${config.dnsLogSyncIntervalMs}ms, Rules=${config.ruleSyncIntervalMs}ms`
  )

  // Authenticate with Pi-hole
  try {
    await authenticate()
    console.log('Authenticated with Pi-hole')
  } catch (error) {
    console.error('Failed to authenticate with Pi-hole:', error)
    console.error('Check PIHOLE_URL and PIHOLE_PASSWORD')
    process.exit(1)
  }

  // Initialize DNS cursor to latest (skip historical logs on first run)
  dnsCursor = getMaxId()
  console.log(`Starting DNS cursor at ID ${dnsCursor}`)

  // Initial rule sync
  await syncRules()

  // Start periodic tasks
  const dnsSyncTimer = setInterval(syncDnsLogs, config.dnsLogSyncIntervalMs)
  const ruleSyncTimer = setInterval(syncRules, config.ruleSyncIntervalMs)
  const heartbeatTimer = setInterval(sendHeartbeat, config.heartbeatIntervalMs)

  // Graceful shutdown
  process.on('SIGINT', () => shutdown(dnsSyncTimer, ruleSyncTimer, heartbeatTimer))
  process.on('SIGTERM', () => shutdown(dnsSyncTimer, ruleSyncTimer, heartbeatTimer))

  console.log('PiGuard Bridge running. Press Ctrl+C to stop.')
}

async function syncDnsLogs() {
  if (isShuttingDown) return

  try {
    const logs = getLogsSince(dnsCursor)

    if (logs.length === 0) return

    console.log(`[dnsSync] Found ${logs.length} new DNS events`)

    // Push in batches of 500
    for (let i = 0; i < logs.length; i += 500) {
      const batch = logs.slice(i, i + 500)
      const result = await pushDnsEvents(batch)

      if (result.ok) {
        // Update cursor to last processed ID
        dnsCursor = batch[batch.length - 1].id
        await updateSyncCursor(String(dnsCursor))
        if (result.blockedCount > 0) {
          console.log(`[dnsSync] ${result.blockedCount} blocked event(s) — notifications triggered`)
        }

        // Write aggregate stats to InfluxDB for Grafana
        const perDevice = new Map<string, number>()
        for (const entry of batch) {
          perDevice.set(entry.clientMac, (perDevice.get(entry.clientMac) ?? 0) + 1)
        }
        await writeInfluxStats({
          totalQueries: batch.length,
          blockedQueries: batch.filter((e) => e.status === 'blocked').length,
          perDevice,
        })
      } else {
        console.error('[dnsSync] Batch push failed, will retry next cycle')
        break
      }
    }
  } catch (error) {
    console.error('[dnsSync] Error:', error)
  }
}

async function sendHeartbeat() {
  if (isShuttingDown) return

  try {
    const devices = await getNetworkDevices()
    const url = `${config.convexUrl.replace('.convex.cloud', '.convex.site')}/device-heartbeat`

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        devices: devices.map((d) => ({
          macAddress: d.hwaddr,
          ipAddress: d.ip,
          hostname: d.name,
          isOnline: Date.now() - d.lastQuery * 1000 < 300000, // 5 min
        })),
      }),
    })
  } catch (error) {
    console.error('[heartbeat] Error:', error)
  }
}

function shutdown(
  dnsTimer: NodeJS.Timeout,
  ruleTimer: NodeJS.Timeout,
  heartbeatTimer: NodeJS.Timeout
) {
  console.log('Shutting down...')
  isShuttingDown = true
  clearInterval(dnsTimer)
  clearInterval(ruleTimer)
  clearInterval(heartbeatTimer)
  process.exit(0)
}

main().catch(console.error)
