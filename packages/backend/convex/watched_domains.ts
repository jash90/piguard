import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// List all watched domains
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('watched_domains').collect()
  },
})

// Get active watched domains (used by notification system)
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('watched_domains')
      .withIndex('by_active', (q) => q.eq('isActive', true))
      .collect()
  },
})

// Add a watched domain
export const create = mutation({
  args: {
    domain: v.string(),
    label: v.optional(v.string()),
    childProfileId: v.optional(v.id('children_profiles')),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('watched_domains', {
      domain: args.domain,
      label: args.label ?? args.domain,
      childProfileId: args.childProfileId,
      isActive: true,
      notifyParent: true,
      createdBy: args.createdBy,
      createdAt: Date.now(),
    })
  },
})

// Update a watched domain (toggle active, change label, reassign child)
export const update = mutation({
  args: {
    watchedId: v.id('watched_domains'),
    domain: v.optional(v.string()),
    label: v.optional(v.string()),
    childProfileId: v.optional(v.id('children_profiles')),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { watchedId, ...updates } = args
    const clean: Record<string, any> = {}
    if (updates.domain !== undefined) clean.domain = updates.domain
    if (updates.label !== undefined) clean.label = updates.label
    if (updates.childProfileId !== undefined) clean.childProfileId = updates.childProfileId
    if (updates.isActive !== undefined) clean.isActive = updates.isActive
    await ctx.db.patch(watchedId, clean)
  },
})

// Delete a watched domain
export const remove = mutation({
  args: { watchedId: v.id('watched_domains') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.watchedId)
  },
})

// Check if a domain matches any watched domain (for notifications)
// Called from the DNS log ingestion pipeline
export const checkMatch = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const active = await ctx.db
      .query('watched_domains')
      .withIndex('by_active', (q) => q.eq('isActive', true))
      .collect()

    return active.filter((w) => {
      // Exact match or subdomain match
      return (
        w.domain === args.domain ||
        args.domain.endsWith('.' + w.domain)
      )
    })
  },
})
