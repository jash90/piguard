import { config } from './config.js'
import { execSync } from 'child_process'

let sessionId: string | null = null
let csrfToken: string | null = null

// Authenticate with Pi-hole v6 API
export async function authenticate(): Promise<string> {
  const response = await fetch(`${config.piHoleUrl}/api/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: config.piHolePassword }),
  })

  if (!response.ok) {
    throw new Error(`Pi-hole auth failed: ${response.status}`)
  }

  const data = (await response.json()) as {
    session: { valid: boolean; sid: string; csrf: string }
  }

  if (!data.session.valid) {
    throw new Error('Pi-hole auth invalid')
  }

  sessionId = data.session.sid
  csrfToken = data.session.csrf
  return sessionId
}

// Build authenticated URL
function authUrl(path: string): string {
  const sep = path.includes('?') ? '&' : '?'
  return `${config.piHoleUrl}${path}${sep}sid=${sessionId}`
}

function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
  }
}

// Add a domain to the deny list
// Uses the correct Pi-hole v6 endpoint: POST /api/domains/deny/exact
export async function blockDomain(domain: string): Promise<void> {
  if (!sessionId) await authenticate()

  const response = await fetch(authUrl('/api/domains/deny/exact'), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ domain, comment: 'PiGuard' }),
  })

  if (response.ok) {
    console.log(`[piHole] Blocked via API: ${domain}`)
    return
  }

  if (response.status === 401) {
    await authenticate()
    return blockDomain(domain)
  }

  // API failed, fall back to CLI
  console.warn(`[piHole] API block failed (${response.status}), falling back to CLI`)
  blockDomainCli(domain)
}

// CLI fallback for blocking
function blockDomainCli(domain: string): void {
  try {
    if (config.piHoleDockerContainer) {
      execSync(
        `docker exec ${config.piHoleDockerContainer} pihole deny ${domain}`,
        { stdio: 'pipe' }
      )
    } else {
      execSync(`pihole deny ${domain}`, { stdio: 'pipe' })
    }
    console.log(`[piHole] Blocked via CLI: ${domain}`)
  } catch (error) {
    console.error(`Failed to block ${domain} via CLI:`, error)
  }
}

// Remove a domain from the deny list
// Uses the correct Pi-hole v6 endpoint: DELETE /api/domains/deny/exact/<domain>
export async function unblockDomain(domain: string): Promise<void> {
  if (!sessionId) await authenticate()

  const response = await fetch(
    authUrl(`/api/domains/deny/exact/${encodeURIComponent(domain)}`),
    {
      method: 'DELETE',
      headers: getHeaders(),
    }
  )

  if (response.ok || response.status === 204) {
    console.log(`[piHole] Unblocked via API: ${domain}`)
    return
  }

  if (response.status === 401) {
    await authenticate()
    return unblockDomain(domain)
  }

  // API failed, fall back to CLI
  console.warn(`[piHole] API unblock failed (${response.status}), falling back to CLI`)
  unblockDomainCli(domain)
}

// CLI fallback for unblocking
function unblockDomainCli(domain: string): void {
  try {
    if (config.piHoleDockerContainer) {
      execSync(
        `docker exec ${config.piHoleDockerContainer} pihole allow ${domain}`,
        { stdio: 'pipe' }
      )
    } else {
      execSync(`pihole allow ${domain}`, { stdio: 'pipe' })
    }
    console.log(`[piHole] Unblocked via CLI: ${domain}`)
  } catch (error) {
    console.error(`Failed to unblock ${domain} via CLI:`, error)
  }
}

// Get all currently blocked domains
export async function getBlockedDomains(): Promise<string[]> {
  if (!sessionId) await authenticate()

  const response = await fetch(authUrl('/api/domains/deny/exact'), {
    headers: getHeaders(),
  })

  if (response.status === 401) {
    await authenticate()
    return getBlockedDomains()
  }

  if (!response.ok) return []

  const data = (await response.json()) as {
    domains: Array<{ domain: string }>
  }

  return data.domains.map((d) => d.domain)
}

// Get DNS queries from the API
export async function getQueries(count = 100): Promise<
  Array<{
    domain: string
    clientIp: string
    clientName: string
    status: string
    type: string
    timestamp: number
  }>
> {
  if (!sessionId) await authenticate()

  const response = await fetch(authUrl(`/api/queries?count=${count}`), {
    headers: getHeaders(),
  })

  if (response.status === 401) {
    await authenticate()
    return getQueries(count)
  }

  if (!response.ok) return []

  const data = (await response.json()) as {
    queries: Array<{
      domain: string
      client: { ip: string; name?: string }
      status: string
      type: string
      time: number
    }>
  }

  return data.queries.map((q) => ({
    domain: q.domain,
    clientIp: q.client.ip,
    clientName: q.client.name ?? '',
    status: mapStatus(q.status),
    type: q.type,
    timestamp: q.time,
  }))
}

function mapStatus(status: string): string {
  switch (status) {
    case 'GRAVITY':
    case 'DENYLIST':
    case 'REGEX':
    case 'EXTERNAL_BLOCKED_IP':
    case 'EXTERNAL_BLOCKED_NULL':
    case 'EXTERNAL_BLOCKED_NXRA':
      return 'blocked'
    case 'CACHE':
      return 'cached'
    case 'FORWARDED':
    case 'REPLY':
    default:
      return 'allowed'
  }
}

// Get all network devices
export async function getNetworkDevices(): Promise<
  Array<{
    hwaddr: string
    ip: string
    name?: string
    lastQuery: number
  }>
> {
  if (!sessionId) await authenticate()

  const response = await fetch(authUrl('/api/network'), {
    headers: getHeaders(),
  })

  if (response.status === 401) {
    await authenticate()
    return getNetworkDevices()
  }

  if (!response.ok) return []

  const data = (await response.json()) as {
    network: Array<{
      hwaddr: string
      ip: string
      name?: string
      lastQuery: number
    }>
  }

  return data.network ?? []
}
