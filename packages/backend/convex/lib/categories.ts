// Category definitions for domain matching
// Used by the Pi bridge to tag DNS logs with categories
// and by block_rules (type='category') to expand categories into domains

export const CATEGORIES: Record<string, string[]> = {
  social_media: [
    'facebook.com', 'fbcdn.net', 'fb.com',
    'instagram.com', 'cdninstagram.com',
    'tiktok.com', 'tiktokcdn.com', 'musical.ly',
    'snapchat.com', 'sc-cdn.net',
    'twitter.com', 'x.com', 'twimg.com',
    'reddit.com', 'redd.it',
    'pinterest.com', 'pinimg.com',
    'tumblr.com', 'threads.net',
    'bereal.com',
  ],

  gaming: [
    'twitch.tv', 'steam.com', 'steampowered.com',
    'epicgames.com', 'roblox.com', 'minecraft.net',
    'playstation.com', 'xbox.com', 'nintendo.com',
    'fortnite.com', 'leagueoflegends.com',
  ],

  streaming: [
    'youtube.com', 'youtu.be', 'ytimg.com',
    'netflix.com', 'nflxvideo.net', 'nflximg.net',
    'disneyplus.com', 'hbomax.com', 'hulu.com',
    'primevideo.com', 'spotify.com', 'scdn.co',
  ],

  // Adult / pornography — large real-world lists come from Pi-hole blocklists;
  // this is a seed list for obvious top-traffic domains
  adult_content: [
    'pornhub.com', 'xvideos.com', 'xnxx.com',
    'xhamster.com', 'redtube.com', 'youporn.com',
    'tube8.com', 'spankbang.com', 'onlyfans.com',
    'fansly.com', 'manyvids.com', 'chaturbate.com',
    'stripchat.com', 'cam4.com', 'livejasmin.com',
    'bongacams.com', 'camsoda.com', 'myfreecams.com',
    'brazzers.com', 'bangbros.com', 'naughtyamerica.com',
    'hentai-foundry.com', 'rule34.xxx', 'e-hentai.org',
    'nhentai.net', 'motherless.com', 'efukt.com',
    'literotica.com', 'asstr.org',
  ],

  // Gambling — casinos, sports betting, lotteries, fantasy sports
  gambling: [
    'bet365.com', 'pokerstars.com', '888casino.com', '888sport.com', '888poker.com',
    'williamhill.com', 'betfair.com', 'betway.com',
    'unibet.com', 'bwin.com', 'ladbrokes.com', 'paddypower.com',
    'draftkings.com', 'fanduel.com', 'betmgm.com',
    'caesars.com', 'mgmresorts.com', 'borgataonline.com',
    'pokerstars.pl', 'totolotek.pl', 'fortuna.pl', 'sts.pl',
    'lvbet.pl', 'betclic.pl', 'forbet.pl',
    'lotto.pl', 'totalizator.pl',
    'pokerstars.net', 'partypoker.com', 'ggpoker.com',
    'stake.com', 'roobet.com', 'bc.game',
    'rollbit.com', 'duelbits.com', 'betonline.ag',
    'bovada.lv', 'mybookie.ag',
    'sportsbet.io', 'cloudbet.com',
    'slots.lv', 'cafecasino.lv',
  ],

  // Drugs — drug sale, legal highs, normalising use
  drugs: [
    'silkroadmarkets.net', 'dreadforum.net',
    'dancesafe.org', 'erowid.org',
    'bluelight.org', 'drugs-forum.com',
    'legalhighs.com', 'kratomcrazy.com',
    'researchchemicals.co', 'buy-weed-online.com',
    'justweedcbd.com', 'buy-shrooms-online.com',
  ],

  // Weapons — firearms sale, DIY weapons, dangerous objects for minors
  weapons: [
    'gunbroker.com', 'armslist.com', 'budsgunshop.com',
    'cheaperthandirt.com', 'palmettostatearmory.com',
    'atlanticfirearms.com', 'guns.com',
    'ak-47.net', 'ghostgunner.net',
    'knifecenter.com', 'bladehq.com',
  ],

  // Self-harm / pro-ana / suicide ideation communities
  self_harm: [
    'pro-ana.com', 'myproana.com', 'proanatips.com',
    'thinspo.com', 'ana-boot-camp.com',
    'sanctioned-suicide.net', 'suicidegirls.com',
  ],

  // Violence / gore / shock sites / extremist content
  violence_gore: [
    'bestgore.com', 'liveleak.com', 'documentingreality.com',
    'theync.com', 'goregrish.com', 'ogrish.com',
    'rotten.com', 'crazyshit.com',
    'stormfront.org', 'dailystormer.name',
    '8kun.top', '8chan.moe', '4chan.org', '4channel.org',
    'kiwifarms.net',
  ],

  // Dating apps — generally inappropriate for minors
  dating: [
    'tinder.com', 'bumble.com', 'hinge.co',
    'grindr.com', 'match.com', 'okcupid.com',
    'plentyoffish.com', 'pof.com', 'badoo.com',
    'happn.com', 'zoosk.com', 'eharmony.com',
    'ashleymadison.com', 'adultfriendfinder.com',
    'sugardaddy.com', 'seeking.com',
  ],

  // Anonymous Q&A / cyberbullying hotbeds
  cyberbullying_risk: [
    'ask.fm', 'sarahah.com', 'ngl.link',
    'tellonym.me', 'yolo.live', 'whisper.sh',
    'saraha.com',
  ],

  // VPN / proxy — used to bypass filtering
  proxy_vpn: [
    'hidemyass.com', 'protonvpn.com', 'nordvpn.com',
    'expressvpn.com', 'surfshark.com', 'cyberghostvpn.com',
    'tunnelbear.com', 'windscribe.com', 'mullvad.net',
    'hide.me', 'vpnbook.com', 'freevpn.com',
    'hola.org', 'zenmate.com',
    'kproxy.com', 'proxysite.com', 'croxyproxy.com',
    'crackedproxy.com', 'whoer.net',
  ],

  // Anonymising networks / dark-web gateways
  dark_web: [
    'torproject.org', 'tor2web.org', 'onion.to', 'onion.ws',
    'i2p.net', 'getmonero.org',
  ],

  // Piracy / illegal file sharing
  piracy: [
    'thepiratebay.org', '1337x.to', 'rarbg.to',
    'yts.mx', 'eztv.re', 'kickasstorrents.cr',
    'nyaa.si', 'limetorrents.info',
    'fmovies.to', 'putlocker.is', 'solarmovie.pe',
    '123movies.net', 'gostream.site',
    'zlibrary-global.se', 'libgen.is', 'sci-hub.se',
    'soap2day.to', 'flixtor.to',
  ],

  // Cryptocurrency trading / high-risk speculation aimed at minors
  crypto_risky: [
    'binance.com', 'kraken.com', 'coinbase.com',
    'kucoin.com', 'bybit.com', 'bitget.com',
    'pump.fun', 'dextools.io', 'dexscreener.com',
    'memecoin.com',
  ],

  // Scam / phishing bait commonly targeted at teens
  scam_phishing: [
    'free-robux-generator.com', 'freerobux.org',
    'free-vbucks.com', 'freefortnitevbucks.com',
    'freesteamgames.com', 'free-nitro.xyz',
    'discord-nitro-gift.com', 'steamcommunity-gift.com',
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

export function getDomainsForCategory(category: string): string[] {
  return CATEGORIES[category] ?? []
}

export function listCategories(): string[] {
  return Object.keys(CATEGORIES)
}
