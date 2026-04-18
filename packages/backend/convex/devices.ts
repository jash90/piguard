import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Find or create a device by MAC address
export const findOrCreate = mutation({
  args: {
    macAddress: v.string(),
    ipAddress: v.string(),
    hostname: v.optional(v.string()),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('devices')
      .withIndex('by_mac', (q) => q.eq('macAddress', args.macAddress))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        ipAddress: args.ipAddress,
        hostname: args.hostname ?? existing.hostname,
        lastSeen: args.timestamp,
      })
      return existing._id
    }

    return await ctx.db.insert('devices', {
      macAddress: args.macAddress,
      ipAddress: args.ipAddress,
      hostname: args.hostname,
      childProfileId: undefined,
      firstSeen: args.timestamp,
      lastSeen: args.timestamp,
      isOnline: true,
    })
  },
})

// Update device online status
export const updateStatus = mutation({
  args: {
    macAddress: v.string(),
    ipAddress: v.string(),
    hostname: v.optional(v.string()),
    isOnline: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('devices')
      .withIndex('by_mac', (q) => q.eq('macAddress', args.macAddress))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        ipAddress: args.ipAddress,
        hostname: args.hostname ?? existing.hostname,
        isOnline: args.isOnline,
        lastSeen: Date.now(),
      })
    }
  },
})

// Assign device to a child profile
export const assignToChild = mutation({
  args: {
    deviceId: v.id('devices'),
    childProfileId: v.optional(v.id('children_profiles')),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.deviceId, {
      childProfileId: args.childProfileId,
    })
  },
})

// List all devices
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('devices').collect()
  },
})

// Get devices assigned to a child
export const getByChild = query({
  args: { childProfileId: v.id('children_profiles') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('devices')
      .withIndex('by_child', (q) =>
        q.eq('childProfileId', args.childProfileId)
      )
      .collect()
  },
})
