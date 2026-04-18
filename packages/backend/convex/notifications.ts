import { action, mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Register a push token for the current user
export const registerToken = mutation({
  args: {
    token: v.string(),
    platform: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not authenticated')

    // Check if token already exists for this user
    const existing = await ctx.db
      .query('push_tokens')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect()

    const existingToken = existing.find((t) => t.token === args.token)

    if (existingToken) {
      // Update
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

// Send push notification for a blocked domain
export const sendBlockedNotification = action({
  args: {
    domain: v.string(),
    category: v.optional(v.string()),
    tip: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tokens = await ctx.runQuery(internal.notifications.getAllTokens)

    if (tokens.length === 0) return

    const messages = tokens.map((t) => ({
      to: t.token,
      sound: 'default' as const,
      title: 'PiGuard: Blocked access',
      body: args.tip
        ? `${args.domain} was blocked. 💡 ${args.tip}`
        : `${args.domain} was blocked from accessing.`,
      data: {
        domain: args.domain,
        category: args.category,
        type: 'blocked',
      },
    }))

    // Send to Expo Push API
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(messages),
    })

    if (!response.ok) {
      console.error('Push notification failed:', await response.text())
    }
  },
})

// Get all push tokens (internal)
export const getAllTokens = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('push_tokens').collect()
  },
})
