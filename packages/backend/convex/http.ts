import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { internal } from './_generated/api'
import { getCategoryForDomain, getDomainsForCategory } from './lib/categories'

const http = httpRouter()

// Health-check endpoint — used by mobile app to detect if backend is reachable
http.route({
  path: '/ping',
  method: 'GET',
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({ ok: true, timestamp: Date.now() }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }),
})

http.route({
  path: '/ping',
  method: 'OPTIONS',
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }),
})

// Bulk DNS log ingestion from Pi bridge
http.route({
  path: '/dns-events',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const body = (await request.json()) as {
      events: Array<{
        macAddress: string
        ipAddress: string
        hostname?: string
        domain: string
        queryType: string
        status: string
        timestamp: number
      }>
    }

    if (!body.events || !Array.isArray(body.events)) {
      return new Response(JSON.stringify({ error: 'Missing events array' }), {
        status: 400,
      })
    }

    // Collect unique blocked domains for notification (deduplicated within batch)
    const blockedDomains = new Map<string, string | undefined>() // domain → category

    for (const event of body.events) {
      // Find or create device by MAC address
      const device = await ctx.runMutation(internal.devices.findOrCreate, {
        macAddress: event.macAddress,
        ipAddress: event.ipAddress,
        hostname: event.hostname,
        timestamp: event.timestamp,
      })

      // Insert DNS log entry
      await ctx.runMutation(internal.dnsLogs.insert, {
        deviceId: device,
        domain: event.domain,
        clientIp: event.ipAddress,
        queryType: event.queryType,
        status: event.status,
        timestamp: event.timestamp,
      })

      // Track blocked domains for notifications
      if (event.status === 'blocked' && !blockedDomains.has(event.domain)) {
        const category = getCategoryForDomain(event.domain) ?? undefined
        blockedDomains.set(event.domain, category)
      }

      // Also check watched domains — notify parent even if NOT blocked
      if (event.status !== 'blocked') {
        const watched = await ctx.runQuery(internal.watched_domains.checkMatch, {
          domain: event.domain,
        })
        for (const w of watched) {
          await ctx.runAction(internal.notifications.notifyOnWatched, {
            domain: event.domain,
            label: w.label,
            childProfileId: w.childProfileId ?? undefined,
          })
        }
      }
    }

    // Fire notifications for each unique blocked domain (debouncing is handled inside)
    for (const [domain, category] of blockedDomains) {
      await ctx.runAction(internal.notifications.notifyOnBlocked, { domain, category })
    }

    return new Response(
      JSON.stringify({
        ok: true,
        count: body.events.length,
        blockedCount: blockedDomains.size,
      })
    )
  }),
})

// Active block rules for Pi bridge to sync
http.route({
  path: '/block-rules',
  method: 'GET',
  handler: httpAction(async (ctx) => {
    const rules = await ctx.runQuery(internal.blockRules.getActive)

    // Expand social_media rules into concrete domains
    const expandedDomains: string[] = []
    const plainDomains: string[] = []

    for (const rule of rules) {
      if (rule.type === 'social_media') {
        // Look up the platform's domains
        const platform = await ctx.runQuery(
          internal.blockRules.getPlatformByName,
          { name: rule.value }
        )
        if (platform) {
          expandedDomains.push(...platform.domains)
        }
      } else if (rule.type === 'domain') {
        plainDomains.push(rule.value)
      } else if (rule.type === 'category') {
        expandedDomains.push(...getDomainsForCategory(rule.value))
      }
    }

    return new Response(
      JSON.stringify({
        domains: [...new Set([...plainDomains, ...expandedDomains])],
        rules,
      })
    )
  }),
})

// Device heartbeat
http.route({
  path: '/device-heartbeat',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const body = (await request.json()) as {
      devices: Array<{
        macAddress: string
        ipAddress: string
        hostname?: string
        isOnline: boolean
      }>
    }

    for (const device of body.devices) {
      await ctx.runMutation(internal.devices.updateStatus, {
        macAddress: device.macAddress,
        ipAddress: device.ipAddress,
        hostname: device.hostname,
        isOnline: device.isOnline,
      })
    }

    return new Response(JSON.stringify({ ok: true }))
  }),
})

// Sync status
http.route({
  path: '/sync-status',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const body = (await request.json()) as {
      key: string
      value: string
    }

    await ctx.runMutation(internal.dnsLogs.updateSyncCursor, {
      key: body.key,
      value: body.value,
    })

    return new Response(JSON.stringify({ ok: true }))
  }),
})

export default http
