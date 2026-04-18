import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Create a child profile
export const create = mutation({
  args: {
    name: v.string(),
    avatarColor: v.string(),
    defaultBlockCategories: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not authenticated')

    return await ctx.db.insert('children_profiles', {
      name: args.name,
      avatarColor: args.avatarColor,
      parentId: identity.subject,
      defaultBlockCategories: args.defaultBlockCategories,
    })
  },
})

// Update a child profile
export const update = mutation({
  args: {
    profileId: v.id('children_profiles'),
    name: v.optional(v.string()),
    avatarColor: v.optional(v.string()),
    defaultBlockCategories: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not authenticated')

    const profile = await ctx.db.get(args.profileId)
    if (!profile || profile.parentId !== identity.subject) {
      throw new Error('Not authorized')
    }

    const updates: Record<string, unknown> = {}
    if (args.name !== undefined) updates.name = args.name
    if (args.avatarColor !== undefined) updates.avatarColor = args.avatarColor
    if (args.defaultBlockCategories !== undefined)
      updates.defaultBlockCategories = args.defaultBlockCategories

    await ctx.db.patch(args.profileId, updates)
  },
})

// Delete a child profile
export const remove = mutation({
  args: { profileId: v.id('children_profiles') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not authenticated')

    const profile = await ctx.db.get(args.profileId)
    if (!profile || profile.parentId !== identity.subject) {
      throw new Error('Not authorized')
    }

    // Unassign all devices from this profile
    const devices = await ctx.db
      .query('devices')
      .withIndex('by_child', (q) =>
        q.eq('childProfileId', args.profileId)
      )
      .collect()

    for (const device of devices) {
      await ctx.db.patch(device._id, { childProfileId: undefined })
    }

    await ctx.db.delete(args.profileId)
  },
})

// List all children profiles for current user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    return await ctx.db
      .query('children_profiles')
      .filter((q) => q.eq(q.field('parentId'), identity.subject))
      .collect()
  },
})

// Get a single profile
export const get = query({
  args: { profileId: v.id('children_profiles') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.profileId)
  },
})
