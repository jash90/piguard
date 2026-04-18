import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Get all active block rules
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('block_rules')
      .withIndex('by_active', (q) => q.eq('isActive', true))
      .collect()
  },
})

// Get platform by name (for expanding social_media rules into domains)
export const getPlatformByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const platforms = await ctx.db.query('social_platforms').collect()
    return platforms.find((p) => p.name === args.name) ?? null
  },
})

// Create a block rule
export const create = mutation({
  args: {
    childProfileId: v.optional(v.id('children_profiles')),
    type: v.string(),
    value: v.string(),
    label: v.optional(v.string()),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('block_rules', {
      childProfileId: args.childProfileId,
      type: args.type,
      value: args.value,
      label: args.label,
      isActive: true,
      createdBy: args.createdBy,
      createdAt: Date.now(),
    })
  },
})

// Update a block rule
export const update = mutation({
  args: {
    ruleId: v.id('block_rules'),
    isActive: v.optional(v.boolean()),
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {}
    if (args.isActive !== undefined) updates.isActive = args.isActive
    if (args.label !== undefined) updates.label = args.label
    await ctx.db.patch(args.ruleId, updates)
  },
})

// Delete a block rule
export const remove = mutation({
  args: { ruleId: v.id('block_rules') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.ruleId)
  },
})

// List all block rules (optionally filtered by child)
export const list = query({
  args: {
    childProfileId: v.optional(v.id('children_profiles')),
  },
  handler: async (ctx, args) => {
    if (args.childProfileId) {
      const childRules = await ctx.db
        .query('block_rules')
        .withIndex('by_child', (q) =>
          q.eq('childProfileId', args.childProfileId)
        )
        .collect()
      const globalRules = await ctx.db
        .query('block_rules')
        .withIndex('by_child', (q) => q.eq('childProfileId', undefined))
        .collect()
      return [...globalRules, ...childRules]
    }
    return await ctx.db.query('block_rules').collect()
  },
})

// Bulk set active state for all rules of a social media platform
export const setSocialMediaActive = mutation({
  args: {
    platformName: v.string(),
    childProfileId: v.optional(v.id('children_profiles')),
    isActive: v.boolean(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    // Find existing rule for this platform + child
    const existing = await ctx.db
      .query('block_rules')
      .withIndex('by_type_value', (q) =>
        q.eq('type', 'social_media').eq('value', args.platformName)
      )
      .collect()

    const matchingRule = existing.find(
      (r) => r.childProfileId === args.childProfileId
    )

    if (matchingRule) {
      await ctx.db.patch(matchingRule._id, { isActive: args.isActive })
    } else {
      await ctx.db.insert('block_rules', {
        childProfileId: args.childProfileId,
        type: 'social_media',
        value: args.platformName,
        label: args.platformName,
        isActive: args.isActive,
        createdBy: args.createdBy,
        createdAt: Date.now(),
      })
    }
  },
})
