import { action, query } from './_generated/server'
import { v } from 'convex/values'

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

// Get a cached tip or generate one
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

    // Generate via AI
    const tip = await generateTip(args.domain, args.category)

    // Cache it (via internal mutation would be ideal but actions can't run mutations directly)
    // For now, return the tip and cache it on next call
    return tip
  },
})

// Get cached tip
export const getCachedTip = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const cached = await ctx.db
      .query('cached_tips')
      .withIndex('by_category', (q) => q.eq('category', args.category))
      .first()

    if (!cached) return null

    // Cache for 24 hours
    const cacheAge = Date.now() - cached.generatedAt
    if (cacheAge > 24 * 60 * 60 * 1000) return null

    return cached.tip
  },
})

// AI tip generation with fallback
async function generateTip(domain: string, category: string): Promise<string> {
  const prompt = `You are a family counseling assistant. A parent's device just blocked access to "${domain}" (category: ${category}). 

Generate a short, empathetic conversation starter the parent can use to talk with their child about this. Keep it to 1-2 sentences, warm but practical. Write in English.

Example: "Your child tried to open Instagram during homework time. You might say: 'I noticed you tried to check Instagram — is everything okay? Let's figure out a good time for that.'"

Your response should be just the tip text, nothing else.`

  try {
    // Try Perplexity/OpenAI API
    const apiKey = process.env.PERPLEXITY_API_KEY ?? process.env.OPENAI_API_KEY
    const apiBase = process.env.PERPLEXITY_API_KEY
      ? 'https://api.perplexity.ai/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'

    if (!apiKey) {
      return FALLBACK_TIPS[category] ?? FALLBACK_TIPS['default']
    }

    const response = await fetch(apiBase, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.PERPLEXITY_API_KEY
          ? 'sonar'
          : 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.error('AI API error:', response.status)
      return FALLBACK_TIPS[category] ?? FALLBACK_TIPS['default']
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>
    }
    return (
      data.choices[0]?.message?.content?.trim() ??
      FALLBACK_TIPS[category] ??
      FALLBACK_TIPS['default']
    )
  } catch {
    return FALLBACK_TIPS[category] ?? FALLBACK_TIPS['default']
  }
}
