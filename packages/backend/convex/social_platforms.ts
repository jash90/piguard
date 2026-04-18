import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Predefined social media platforms with their domains
const PREDEFINED_PLATFORMS = [
  { name: 'Facebook', domains: ['facebook.com', 'fbcdn.net', 'fb.com', 'facebook.net'] },
  { name: 'Instagram', domains: ['instagram.com', 'cdninstagram.com', 'instagr.am'] },
  { name: 'TikTok', domains: ['tiktok.com', 'tiktokcdn.com', 'musical.ly', 'ttwstatic.com'] },
  { name: 'Snapchat', domains: ['snapchat.com', 'snap.com', 'sc-cdn.net'] },
  { name: 'Twitter/X', domains: ['twitter.com', 'x.com', 'twimg.com', 't.co'] },
  { name: 'YouTube', domains: ['youtube.com', 'youtu.be', 'ytimg.com', 'youtubei.googleapis.com', 'youtube-nocookie.com'] },
  { name: 'Discord', domains: ['discord.com', 'discord.gg', 'discordapp.com', 'discordapp.net'] },
  { name: 'Reddit', domains: ['reddit.com', 'redditstatic.com', 'redd.it', 'redditmedia.com'] },
  { name: 'Pinterest', domains: ['pinterest.com', 'pinimg.com', 'pin.it'] },
  { name: 'WhatsApp', domains: ['whatsapp.com', 'whatsapp.net', 'wa.me'] },
  { name: 'Telegram', domains: ['telegram.org', 't.me', 'telegram.me'] },
  { name: 'Twitch', domains: ['twitch.tv', 'ttvnw.net', 'jtvnw.net', 'twitchcdn.net'] },
]

// Seed predefined platforms (idempotent)
export const seedPredefined = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('social_platforms').collect()
    const existingNames = new Set(existing.map((p) => p.name))

    for (const platform of PREDEFINED_PLATFORMS) {
      if (!existingNames.has(platform.name)) {
        await ctx.db.insert('social_platforms', {
          name: platform.name,
          domains: platform.domains,
          isPredefined: true,
        })
      }
    }
  },
})

// Add a custom platform
export const addCustom = mutation({
  args: {
    name: v.string(),
    domains: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('social_platforms', {
      name: args.name,
      domains: args.domains,
      isPredefined: false,
    })
  },
})

// Remove a custom platform (can't remove predefined)
export const removeCustom = mutation({
  args: { platformId: v.id('social_platforms') },
  handler: async (ctx, args) => {
    const platform = await ctx.db.get(args.platformId)
    if (!platform) throw new Error('Platform not found')
    if (platform.isPredefined) throw new Error('Cannot remove predefined platform')
    await ctx.db.delete(args.platformId)
  },
})

// List all platforms
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('social_platforms').collect()
  },
})
