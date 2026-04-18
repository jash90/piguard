import { action, internalMutation, internalQuery } from './_generated/server'
import { internal } from './_generated/api'
import { v } from 'convex/values'
import { generateAIResponse } from './lib/ai'

// Static fallback tips per category
const FALLBACK_TIPS: Record<string, string> = {
  social_media:
    'Your child tried to access social media. Consider discussing screen time boundaries together.',
  gaming:
    'Your child tried to access a gaming site. Maybe suggest an offline activity you can do together.',
  adult:
    'Inappropriate content was blocked. It might be a good time to check in with your child.',
  streaming:
    'A streaming site was blocked during restricted hours. Talk about balanced media consumption.',
  gambling:
    'A gambling site was blocked. Discuss with your child why these sites are restricted.',
  default:
    'A website was blocked. Consider using this as an opportunity to discuss online safety.',
}

// Get a cached tip or generate one via AI
export const getTip = action({
  args: {
    domain: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    // Check cache first
    const cached = await ctx.runQuery(internal.tips.getCachedTip, {
      category: args.category,
    })
    if (cached) return cached

    // Generate via AI (falls back to static tip on failure)
    const tip = await generateTip(args.domain, args.category)

    // Persist to cache
    await ctx.runMutation(internal.tips.cacheTip, {
      category: args.category,
      tip,
    })

    return tip
  },
})

// Get cached tip (internal)
export const getCachedTip = internalQuery({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const cached = await ctx.db
      .query('cached_tips')
      .withIndex('by_category', (q) => q.eq('category', args.category))
      .first()

    if (!cached) return null

    // Cache TTL: 24 hours
    const cacheAge = Date.now() - cached.generatedAt
    if (cacheAge > 24 * 60 * 60 * 1000) return null

    return cached.tip
  },
})

// Upsert a tip in the cache (internal)
export const cacheTip = internalMutation({
  args: { category: v.string(), tip: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('cached_tips')
      .withIndex('by_category', (q) => q.eq('category', args.category))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, { tip: args.tip, generatedAt: Date.now() })
    } else {
      await ctx.db.insert('cached_tips', {
        category: args.category,
        tip: args.tip,
        generatedAt: Date.now(),
      })
    }
  },
})

// AI tip generation with static fallback
async function generateTip(domain: string, category: string): Promise<string> {
  const prompt = `You are a family counseling assistant. A parent's device just blocked access to "${domain}" (category: ${category}). 

Generate a short, empathetic conversation starter the parent can use to talk with their child about this. Keep it to 1-2 sentences, warm but practical. Write in English.

Example: "Your child tried to open Instagram during homework time. You might say: 'I noticed you tried to check Instagram — is everything okay? Let's figure out a good time for that.'"

Your response should be just the tip text, nothing else.`

  const result = await generateAIResponse(prompt)
  return result ?? (FALLBACK_TIPS[category] ?? FALLBACK_TIPS['default'])
}
