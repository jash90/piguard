// Category definitions for domain matching
// Used by the Pi bridge to tag DNS logs with categories
export const CATEGORIES: Record<string, string[]> = {
  social_media: [
    'facebook.com', 'fbcdn.net', 'fb.com',
    'instagram.com', 'cdninstagram.com',
    'tiktok.com', 'tiktokcdn.com',
    'snapchat.com', 'sc-cdn.net',
    'twitter.com', 'x.com', 'twimg.com',
    'reddit.com', 'redd.it',
    'pinterest.com', 'pinimg.com',
  ],
  gaming: [
    'twitch.tv', 'steam.com', 'steampowered.com',
    'epicgames.com', 'roblox.com', 'minecraft.net',
    'playstation.com', 'xbox.com', 'nintendo.com',
  ],
  streaming: [
    'youtube.com', 'youtu.be', 'ytimg.com',
    'netflix.com', 'nflxvideo.net', 'nflximg.net',
    'disneyplus.com', 'hbomax.com', 'hulu.com',
    'primevideo.com', 'spotify.com', 'scdn.co',
  ],
  adult: [
    // Intentionally minimal — real lists should use Pi-hole's built-in blocklists
    'pornhub.com', 'xvideos.com', 'xnxx.com',
    'xhamster.com', 'redtube.com',
  ],
  gambling: [
    'bet365.com', 'pokerstars.com', '888casino.com',
    'williamhill.com', 'betfair.com',
  ],
}

// Reverse lookup: domain suffix → category
const domainToCategory = new Map<string, string>()
for (const [category, domains] of Object.entries(CATEGORIES)) {
  for (const domain of domains) {
    domainToCategory.set(domain, category)
  }
}

export function getCategoryForDomain(domain: string): string | null {
  // Check exact match first, then progressively shorter suffixes
  const parts = domain.split('.')
  for (let i = 0; i < parts.length - 1; i++) {
    const suffix = parts.slice(i).join('.')
    if (domainToCategory.has(suffix)) {
      return domainToCategory.get(suffix)!
    }
  }
  return null
}
