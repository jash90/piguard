import { internalAction, internalMutation } from './_generated/server'
import { internal } from './_generated/api'
import { v } from 'convex/values'
import { sendPushNotifications } from './lib/push'

// One notification per domain per minute maximum
const DEBOUNCE_MS = 60 * 1000

// Triggered by http.ts after a blocked DNS event is persisted.
// Debounces, fetches a conversation tip, and sends push notifications.
export const notifyOnBlocked = internalAction({
  args: {
    domain: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Atomic debounce check — skip if already notified recently
    const allowed = await ctx.runMutation(internal.notifications.checkAndSetDebounce, {
      domain: args.domain,
    })
    if (!allowed) return

    // Get a conversation tip (cached or AI-generated)
    const category = args.category ?? 'default'
    const tip = await ctx.runAction(internal.tips.getTip, {
      domain: args.domain,
      category,
    })

    // Fetch all registered push tokens
    const tokens = await ctx.runQuery(internal.push_tokens.getAllTokens)
    if (tokens.length === 0) return

    await sendPushNotifications(
      tokens.map((t) => ({
        to: t.token,
        sound: 'default' as const,
        title: 'PiGuard: Blocked access',
        body: `${args.domain} was blocked. 💡 ${tip}`,
        data: {
          domain: args.domain,
          category: args.category,
          type: 'blocked',
        },
      }))
    )
  },
})

// Atomically check and record the last notification timestamp for a domain.
// Returns true when the notification should be sent, false when debounced.
export const checkAndSetDebounce = internalMutation({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const key = `notif_last_${args.domain}`
    const now = Date.now()

    const existing = await ctx.db
      .query('sync_state')
      .withIndex('by_key', (q) => q.eq('key', key))
      .first()

    if (existing) {
      const lastSent = parseInt(existing.value, 10)
      if (now - lastSent < DEBOUNCE_MS) return false
      await ctx.db.patch(existing._id, { value: String(now) })
    } else {
      await ctx.db.insert('sync_state', { key, value: String(now) })
    }

    return true
  },
})
