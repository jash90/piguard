import { internalQuery, mutation } from './_generated/server'
import { v } from 'convex/values'

// Register a push token for the current user (called from mobile app)
export const registerToken = mutation({
  args: {
    token: v.string(),
    platform: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not authenticated')

    const existing = await ctx.db
      .query('push_tokens')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect()

    const existingToken = existing.find((t) => t.token === args.token)

    if (existingToken) {
      await ctx.db.patch(existingToken._id, {
        platform: args.platform ?? existingToken.platform,
      })
    } else {
      await ctx.db.insert('push_tokens', {
        userId: identity.subject,
        token: args.token,
        platform: args.platform,
        createdAt: Date.now(),
      })
    }
  },
})

// Get all registered push tokens — internal use only
export const getAllTokens = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('push_tokens').collect()
  },
})
