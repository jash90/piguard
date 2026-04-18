import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Insert a single DNS log entry
export const insert = mutation({
  args: {
    deviceId: v.id('devices'),
    domain: v.string(),
    clientIp: v.string(),
    queryType: v.string(),
    status: v.string(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('dns_logs', {
      deviceId: args.deviceId,
      domain: args.domain,
      clientIp: args.clientIp,
      queryType: args.queryType,
      status: args.status,
      timestamp: args.timestamp,
    })
  },
})

// Update sync cursor
export const updateSyncCursor = mutation({
  args: {
    key: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('sync_state')
      .withIndex('by_key', (q) => q.eq('key', args.key))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value })
    } else {
      await ctx.db.insert('sync_state', { key: args.key, value: args.value })
    }
  },
})

// Get DNS logs for a specific device (paginated)
export const getByDevice = query({
  args: {
    deviceId: v.id('devices'),
    limit: v.optional(v.number()),
    beforeTimestamp: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100

    if (args.beforeTimestamp) {
      return await ctx.db
        .query('dns_logs')
        .withIndex('by_device_timestamp', (q) =>
          q
            .eq('deviceId', args.deviceId)
            .lt('timestamp', args.beforeTimestamp!)
        )
        .order('desc')
        .take(limit)
        .collect()
    }

    return await ctx.db
      .query('dns_logs')
      .withIndex('by_device', (q) => q.eq('deviceId', args.deviceId))
      .order('desc')
      .take(limit)
      .collect()
  },
})

// Get recent DNS logs across all devices
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 200
    return await ctx.db
      .query('dns_logs')
      .withIndex('by_timestamp')
      .order('desc')
      .take(limit)
      .collect()
  },
})

// Get blocked DNS logs (for alerts)
export const getBlocked = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100
    return await ctx.db
      .query('dns_logs')
      .withIndex('by_status_timestamp', (q) =>
        q.eq('status', 'blocked')
      )
      .order('desc')
      .take(limit)
      .collect()
  },
})

// Get stats for dashboard
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000

    const recentLogs = await ctx.db
      .query('dns_logs')
      .withIndex('by_timestamp', (q) => q.gte('timestamp', oneDayAgo))
      .collect()

    const totalQueries = recentLogs.length
    const blockedQueries = recentLogs.filter(
      (log) => log.status === 'blocked'
    ).length

    // Top domains
    const domainCounts = new Map<string, number>()
    for (const log of recentLogs) {
      domainCounts.set(log.domain, (domainCounts.get(log.domain) ?? 0) + 1)
    }
    const topDomains = [...domainCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([domain, count]) => ({ domain, count }))

    return {
      totalQueries,
      blockedQueries,
      topDomains,
    }
  },
})
