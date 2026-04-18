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

// Append sid to URL
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

// Add a domain to the denylist
// Uses docker exec CLI as fallback because the POST /api/domains endpoint
// has a known issue with the "list" parameter in some Pi-hole v6 versions
export async function blockDomain(domain: string): Promise<void> {
  // Try API first
  try {
    const response = await fetch(
      authUrl('/api/domains?type=deny&kind=exact'),
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ domains: [domain], comment: 'PiGuard' }),
      }
    )

    if (response.ok) {
      console.log(`[piHole] Blocked via API: ${domain}`)
      return
    }

    // If API fails with uri_error, fall back to CLI
    if (response.status === 400) {
      return blockDomainCli(domain)
    }

    if (response.status === 401) {
      await authenticate()
      return blockDomain(domain)
    }

    console.error(`Failed to block ${domain}: ${response.status}`)
  } catch {
    return blockDomainCli(domain)
  }
}

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

// Remove a domain from the denylist
export async function unblockDomain(domain: string): Promise<void> {
  // Find the domain ID first
  const domains = await getBlockedDomainsRaw()
  const match = domains.find((d) => d.domain === domain)

  if (!match) return

  const response = await fetch(authUrl(`/api/domains/${match.id}`), {
    method: 'DELETE',
    headers: getHeaders(),
  })

  if (response.status === 401) {
    await authenticate()
    return unblockDomain(domain)
  }

  if (!response.ok) {
    console.error(`Failed to unblock ${domain}:`, response.status)
  } else {
    console.log(`[piHole] Unblocked: ${domain}`)
  }
}

// Get all currently blocked domains (raw with IDs)
async function getBlockedDomainsRaw(): Promise<
  Array<{ id: number; domain: string }>
> {
  const response = await fetch(authUrl('/api/domains?type=deny'), {
    headers: getHeaders(),
  })

  if (response.status === 401) {
    await authenticate()
    return getBlockedDomainsRaw()
  }

  if (!response.ok) return []

  const data = (await response.json()) as {
    domains: Array<{ id: number; domain: string }>
  }

  return data.domains
}

// Get all currently blocked domain names
export async function getBlockedDomains(): Promise<string[]> {
  const raw = await getBlockedDomainsRaw()
  return raw.map((d) => d.domain)
}

// Get DNS queries from the API
export async function getQueries(count = 100): Promise<
  Array<{
    domain: string
    clientIp: string
    status: string
    type: string
    timestamp: number
  }>
> {
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
      client: { ip: string }
      status: string
      type: string
      time: number
    }>
  }

  return data.queries.map((q) => ({
    domain: q.domain,
    clientIp: q.client.ip,
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
