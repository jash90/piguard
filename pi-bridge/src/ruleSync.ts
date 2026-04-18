import { getConvexHttpUrl } from './config.js'
import * as piHole from './piHoleClient.js'

let lastSyncedDomains: Set<string> = new Set()

export async function syncRules(): Promise<void> {
  console.log('[ruleSync] Fetching active block rules from Convex...')

  const url = `${getConvexHttpUrl()}/block-rules`

  const response = await fetch(url)
  if (!response.ok) {
    console.error('[ruleSync] Failed to fetch rules:', response.status)
    return
  }

  const data = (await response.json()) as {
    domains: string[]
  }

  const newDomains = new Set(data.domains)

  // Domains to add (in Convex but not in Pi-hole)
  const toBlock = newDomains.difference(lastSyncedDomains)
  for (const domain of toBlock) {
    await piHole.blockDomain(domain)
    console.log(`[ruleSync] Blocked: ${domain}`)
  }

  // Domains to remove (in Pi-hole but no longer in Convex)
  const toUnblock = lastSyncedDomains.difference(newDomains)
  for (const domain of toUnblock) {
    await piHole.unblockDomain(domain)
    console.log(`[ruleSync] Unblocked: ${domain}`)
  }

  lastSyncedDomains = newDomains
  console.log(
    `[ruleSync] Synced. Total blocked: ${newDomains.size}, Added: ${toBlock.size}, Removed: ${toUnblock.size}`
  )
}
