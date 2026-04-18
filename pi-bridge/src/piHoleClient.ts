import { config } from './config.js'

let sessionId: string | null = null

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
    session: { valid: boolean; sid: string }
  }

  if (!data.session.valid) {
    throw new Error('Pi-hole auth invalid')
  }

  sessionId = data.session.sid
  return sessionId
}

// Get authenticated headers
function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(sessionId ? { sid: sessionId } : {}),
  }
}

// Add a domain to the blocklist
export async function blockDomain(domain: string): Promise<void> {
  const response = await fetch(
    `${config.piHoleUrl}/api/domains?type=block&domain=${encodeURIComponent(domain)}`,
    {
      method: 'POST',
      headers: getHeaders(),
    }
  )

  if (response.status === 401) {
    // Re-authenticate and retry
    await authenticate()
    await blockDomain(domain)
    return
  }

  if (!response.ok) {
    console.error(`Failed to block ${domain}:`, response.status)
  }
}

// Remove a domain from the blocklist
export async function unblockDomain(domain: string): Promise<void> {
  const response = await fetch(
    `${config.piHoleUrl}/api/domains?type=block&domain=${encodeURIComponent(domain)}`,
    {
      method: 'DELETE',
      headers: getHeaders(),
    }
  )

  if (response.status === 401) {
    await authenticate()
    await unblockDomain(domain)
    return
  }

  if (!response.ok) {
    console.error(`Failed to unblock ${domain}:`, response.status)
  }
}

// Get all currently blocked domains
export async function getBlockedDomains(): Promise<string[]> {
  const response = await fetch(
    `${config.piHoleUrl}/api/domains?type=block`,
    { headers: getHeaders() }
  )

  if (response.status === 401) {
    await authenticate()
    return getBlockedDomains()
  }

  if (!response.ok) {
    console.error('Failed to get blocked domains:', response.status)
    return []
  }

  const data = (await response.json()) as {
    domains: Array<{ domain: string }>
  }

  return data.domains.map((d) => d.domain)
}

// Get all network devices (from Pi-hole network table)
export async function getNetworkDevices(): Promise<
  Array<{
    hwaddr: string
    ip: string
    name?: string
    lastQuery: number
  }>
> {
  const response = await fetch(`${config.piHoleUrl}/api/network`, {
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
