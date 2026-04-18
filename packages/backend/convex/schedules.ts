import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Create a schedule
export const create = mutation({
  args: {
    childProfileId: v.id('children_profiles'),
    daysOfWeek: v.array(v.number()),
    startTime: v.string(),
    endTime: v.string(),
    action: v.string(),
    categories: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('schedules', {
      ...args,
      isActive: true,
    })
  },
})

// Update a schedule
export const update = mutation({
  args: {
    scheduleId: v.id('schedules'),
    daysOfWeek: v.optional(v.array(v.number())),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    action: v.optional(v.string()),
    categories: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {}
    if (args.daysOfWeek !== undefined) updates.daysOfWeek = args.daysOfWeek
    if (args.startTime !== undefined) updates.startTime = args.startTime
    if (args.endTime !== undefined) updates.endTime = args.endTime
    if (args.action !== undefined) updates.action = args.action
    if (args.categories !== undefined) updates.categories = args.categories
    if (args.isActive !== undefined) updates.isActive = args.isActive

    await ctx.db.patch(args.scheduleId, updates)
  },
})

// Delete a schedule
export const remove = mutation({
  args: { scheduleId: v.id('schedules') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.scheduleId)
  },
})

// List schedules for a child
export const getByChild = query({
  args: { childProfileId: v.id('children_profiles') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('schedules')
      .withIndex('by_child', (q) =>
        q.eq('childProfileId', args.childProfileId)
      )
      .collect()
  },
})

// List all active schedules
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('schedules').collect()
    return all.filter((s) => s.isActive)
  },
})
