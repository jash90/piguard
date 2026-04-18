// Seed Convex with test data so dashboards have something to display
// Run: cd packages/backend && PATH="$HOME/.config/nvm/versions/node/v22.19.0/bin:$PATH" npx tsx convex/seed.ts

const CONVEX_URL = 'http://127.0.0.1:3211' // HTTP actions URL (convex.site equivalent for local)

async function main() {
  console.log('Seeding Convex with test data...\n')

  // 1. Seed predefined social platforms
  console.log('1. Seeding social platforms...')
  let resp = await fetch(`${CONVEX_URL}/dns-events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seed: true }),
  })
  // This won't work via HTTP action, let's use the API directly

  // Use the Convex client instead
  const { ConvexHttpClient } = await import('convex/browser')
  const client = new ConvexHttpClient('http://127.0.0.1:3210')

  // Seed platforms
  const platforms = [
    { name: 'Facebook', domains: ['facebook.com', 'fbcdn.net', 'fb.com'] },
    { name: 'Instagram', domains: ['instagram.com', 'cdninstagram.com'] },
    { name: 'TikTok', domains: ['tiktok.com', 'tiktokcdn.com'] },
    { name: 'Snapchat', domains: ['snapchat.com', 'sc-cdn.net'] },
    { name: 'Twitter/X', domains: ['twitter.com', 'x.com', 'twimg.com'] },
    { name: 'YouTube', domains: ['youtube.com', 'youtu.be', 'ytimg.com'] },
    { name: 'Discord', domains: ['discord.com', 'discordapp.com'] },
    { name: 'Reddit', domains: ['reddit.com', 'redd.it'] },
    { name: 'Pinterest', domains: ['pinterest.com', 'pinimg.com'] },
    { name: 'WhatsApp', domains: ['whatsapp.com', 'whatsapp.net'] },
    { name: 'Telegram', domains: ['telegram.org', 't.me'] },
    { name: 'Twitch', domains: ['twitch.tv', 'ttvnw.net'] },
  ]

  for (const p of platforms) {
    try {
      await client.mutation('social_platforms:seedPredefined', {})
      console.log('   Platforms seeded')
      break
    } catch (e: any) {
      if (e.message?.includes('already exists') || e.message?.includes('unique')) {
        // Already seeded
      }
    }
  }
  // Seed predefined handles the list above

  // 2. Create test devices
  console.log('\n2. Creating test devices...')
  const devices = [
    { mac: 'AA:BB:CC:DD:EE:01', ip: '192.168.1.101', hostname: 'iPhone-Emma' },
    { mac: 'AA:BB:CC:DD:EE:02', ip: '192.168.1.102', hostname: 'iPad-Max' },
    { mac: 'AA:BB:CC:DD:EE:03', ip: '192.168.1.103', hostname: 'Gaming-PC' },
    { mac: 'AA:BB:CC:DD:EE:04', ip: '192.168.1.104', hostname: 'MacBook-Parent' },
    { mac: 'AA:BB:CC:DD:EE:05', ip: '192.168.1.105', hostname: 'Smart-TV' },
  ]

  const deviceIds: string[] = []
  for (const d of devices) {
    const id = await client.mutation('devices:findOrCreate', {
      macAddress: d.mac,
      ipAddress: d.ip,
      hostname: d.hostname,
      timestamp: Date.now(),
    })
    deviceIds.push(id as string)
    console.log(`   Device: ${d.hostname} -> ${id}`)
  }

  // 3. Create child profiles
  console.log('\n3. Creating child profiles...')
  const child1 = await client.mutation('children:create', {
    name: 'Emma',
    avatarColor: '#3B82F6',
    _parentId: 'seed-user',
  })
  console.log(`   Child: Emma -> ${child1}`)

  const child2 = await client.mutation('children:create', {
    name: 'Max',
    avatarColor: '#10B981',
    _parentId: 'seed-user',
  })
  console.log(`   Child: Max -> ${child2}`)

  // 4. Assign devices to children
  console.log('\n4. Assigning devices...')
  await client.mutation('devices:assignToChild', {
    deviceId: deviceIds[0] as any,
    childProfileId: child1 as any,
  })
  await client.mutation('devices:assignToChild', {
    deviceId: deviceIds[1] as any,
    childProfileId: child2 as any,
  })
  await client.mutation('devices:assignToChild', {
    deviceId: deviceIds[2] as any,
    childProfileId: child2 as any,
  })
  console.log('   iPhone-Emma -> Emma, iPad-Max -> Max, Gaming-PC -> Max')

  // 5. Create DNS logs (simulating last 30 minutes of activity)
  console.log('\n5. Creating DNS logs...')
  const domains = [
    { domain: 'google.com', status: 'allowed' },
    { domain: 'youtube.com', status: 'allowed' },
    { domain: 'tiktok.com', status: 'blocked' },
    { domain: 'instagram.com', status: 'blocked' },
    { domain: 'facebook.com', status: 'blocked' },
    { domain: 'reddit.com', status: 'allowed' },
    { domain: 'twitter.com', status: 'blocked' },
    { domain: 'github.com', status: 'allowed' },
    { domain: 'netflix.com', status: 'allowed' },
    { domain: 'roblox.com', status: 'allowed' },
    { domain: 'minecraft.net', status: 'allowed' },
    { domain: 'discord.com', status: 'allowed' },
    { domain: 'snapchat.com', status: 'blocked' },
    { domain: 'amazon.com', status: 'allowed' },
    { domain: 'wikipedia.org', status: 'allowed' },
    { domain: 'stackoverflow.com', status: 'allowed' },
    { domain: 'twitch.tv', status: 'allowed' },
    { domain: 'pinterest.com', status: 'blocked' },
    { domain: 'whatsapp.com', status: 'allowed' },
    { domain: 'apple.com', status: 'allowed' },
  ]

  const queryTypes = ['A', 'AAAA', 'HTTPS']
  let logCount = 0
  const now = Date.now()

  // Generate 200 log entries spread over last 30 minutes
  for (let i = 0; i < 200; i++) {
    const deviceIdx = Math.floor(Math.random() * devices.length)
    const domainInfo = domains[Math.floor(Math.random() * domains.length)]
    const timestamp = now - Math.floor(Math.random() * 30 * 60 * 1000) // last 30 min

    await client.mutation('dnsLogs:insert', {
      deviceId: deviceIds[deviceIdx] as any,
      domain: domainInfo.domain,
      clientIp: devices[deviceIdx].ip,
      queryType: queryTypes[Math.floor(Math.random() * queryTypes.length)],
      status: domainInfo.status,
      timestamp,
    })
    logCount++
  }
  console.log(`   Created ${logCount} DNS log entries`)

  // 6. Create block rules
  console.log('\n6. Creating block rules...')
  const blockedPlatforms = ['TikTok', 'Instagram', 'Facebook', 'Snapchat', 'Twitter/X', 'Pinterest']
  for (const name of blockedPlatforms) {
    await client.mutation('blockRules:create', {
      type: 'social_media',
      value: name,
      label: name,
      createdBy: 'seed',
    })
  }
  console.log(`   Created ${blockedPlatforms.length} social media block rules`)

  // 7. Create schedule
  console.log('\n7. Creating schedule...')
  await client.mutation('schedules:create', {
    childProfileId: child1 as any,
    daysOfWeek: [0, 1, 2, 3, 4],
    startTime: '22:00',
    endTime: '07:00',
    action: 'block_all',
  })
  await client.mutation('schedules:create', {
    childProfileId: child2 as any,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    startTime: '21:00',
    endTime: '08:00',
    action: 'block_categories',
    categories: ['social_media'],
  })
  console.log('   Created 2 schedules (weekday bedtime for Emma, social media limit for Max)')

  console.log('\n=== Seed complete! ===')
  console.log('Refresh http://localhost:3000/blocklist to see the data.')
  console.log('Refresh http://localhost:3003 to see the dashboard.')
}

main().catch(console.error)
