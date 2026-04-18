export const config = {
  // Pi-hole API
  piHoleUrl: process.env.PIHOLE_URL ?? 'http://pi.hole',
  piHolePassword: process.env.PIHOLE_PASSWORD ?? '',
  piHoleDockerContainer: process.env.PIHOLE_DOCKER_CONTAINER ?? '', // e.g. 'piguard-pihole-dev'

  // Convex
  convexUrl: process.env.CONVEX_URL ?? '',
  convexHttpUrl: '', // Derived from convexUrl at runtime

  // Sync intervals
  dnsLogSyncIntervalMs: parseInt(
    process.env.DNS_SYNC_INTERVAL ?? '30000',
    10
  ),
  ruleSyncIntervalMs: parseInt(
    process.env.RULE_SYNC_INTERVAL ?? '60000',
    10
  ),
  heartbeatIntervalMs: parseInt(
    process.env.HEARTBEAT_INTERVAL ?? '60000',
    10
  ),

  // Pi-hole FTL database path
  ftlDbPath:
    process.env.FTL_DB_PATH ??
    '/etc/pihole/pihole-FTL.db',

  // InfluxDB v2 (optional — for Grafana dashboards)
  influxDbUrl: process.env.INFLUXDB_URL ?? '',
  influxDbToken: process.env.INFLUXDB_TOKEN ?? '',
  influxDbOrg: process.env.INFLUXDB_ORG ?? 'piguard',
  influxDbBucket: process.env.INFLUXDB_BUCKET ?? 'dns_stats',
}

// Derive HTTP action URL from Convex URL
export function getConvexHttpUrl(): string {
  if (config.convexHttpUrl) return config.convexHttpUrl
  // Convex URL looks like: https://happy-animal-123.convex.cloud
  // HTTP actions are at: https://happy-animal-123.convex.site
  config.convexHttpUrl = config.convexUrl.replace(
    '.convex.cloud',
    '.convex.site'
  )
  return config.convexHttpUrl
}
