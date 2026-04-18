import { config } from './config.js'

export interface DnsStats {
  totalQueries: number
  blockedQueries: number
  /** Map of clientMac → query count */
  perDevice: Map<string, number>
}

// Write aggregate DNS stats to InfluxDB using the v2 line protocol.
// This is a best-effort call — errors are logged but never thrown.
export async function writeInfluxStats(stats: DnsStats): Promise<void> {
  if (!config.influxDbUrl || !config.influxDbToken) return

  const lines = buildLineProtocol(stats)
  if (lines.length === 0) return

  const url = `${config.influxDbUrl}/api/v2/write?org=${encodeURIComponent(config.influxDbOrg)}&bucket=${encodeURIComponent(config.influxDbBucket)}&precision=ms`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Token ${config.influxDbToken}`,
        'Content-Type': 'text/plain; charset=utf-8',
      },
      body: lines.join('\n'),
    })

    if (!response.ok) {
      console.error('[influx] Write failed:', response.status, await response.text())
    }
  } catch (error) {
    console.error('[influx] Write error:', error)
  }
}

// Build InfluxDB line protocol lines from the stats object.
// Line protocol: measurement[,tag_key=tag_value...] field_key=field_value[,field_key=field_value...] [unix_nanosecond_timestamp]
function buildLineProtocol(stats: DnsStats): string[] {
  const now = Date.now()
  const lines: string[] = []

  // Aggregate totals
  lines.push(
    `dns_stats total=${stats.totalQueries}i,blocked=${stats.blockedQueries}i ${now}`
  )

  // Per-device query counts (tag: mac address)
  for (const [mac, count] of stats.perDevice) {
    const safeMac = mac.replace(/:/g, '_')
    lines.push(`dns_device,mac=${safeMac} queries=${count}i ${now}`)
  }

  return lines
}
