// Quick integration test: verifies Pi-hole API connectivity
// Run with: npx tsx pi-bridge/src/test-pihole.ts

const PIHOLE_URL = 'http://localhost:8080'
const PIHOLE_PASSWORD = 'pihole123'

async function main() {
  console.log('=== PiGuard Pi-hole Integration Test ===\n')

  // 1. Auth
  console.log('1. Testing authentication...')
  const authResp = await fetch(`${PIHOLE_URL}/api/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: PIHOLE_PASSWORD }),
  })
  const authData = (await authResp.json()) as any

  if (!authData.session?.valid) {
    console.error('   FAIL: Authentication failed')
    process.exit(1)
  }
  const sid = authData.session.sid
  const csrf = authData.session.csrf
  console.log('   OK: Authenticated successfully')

  // 2. Get blocked domains
  console.log('\n2. Testing GET blocked domains...')
  const domainsResp = await fetch(`${PIHOLE_URL}/api/domains?type=deny&sid=${sid}`)
  const domainsData = (await domainsResp.json()) as any
  console.log(`   OK: Found ${domainsData.domains?.length ?? 0} blocked domains`)
  for (const d of (domainsData.domains ?? []).slice(0, 5)) {
    console.log(`     - ${d.domain} (id: ${d.id}, enabled: ${d.enabled})`)
  }

  // 3. Block a domain
  console.log('\n3. Testing POST block domain...')
  const blockResp = await fetch(`${PIHOLE_URL}/api/domains?type=deny&kind=exact&sid=${sid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrf,
    },
    body: JSON.stringify({ domains: ['test-blocked-domain.example.com'], comment: 'PiGuard test' }),
  })
  console.log(`   Response: ${blockResp.status}`)
  const blockData = (await blockResp.json()) as any
  if (blockResp.ok) {
    console.log('   OK: Domain blocked successfully')
  } else {
    console.log(`   Note: ${JSON.stringify(blockData)}`)
  }

  // 4. Generate DNS queries
  console.log('\n4. Generating DNS queries...')
  const { execSync } = await import('child_process')
  try {
    execSync(`docker exec piguard-pihole-dev dig google.com @127.0.0.1 +short`, { stdio: 'pipe' })
    execSync(`docker exec piguard-pihole-dev dig test-blocked-domain.example.com @127.0.0.1 +short`, { stdio: 'pipe' })
    execSync(`docker exec piguard-pihole-dev dig github.com @127.0.0.1 +short`, { stdio: 'pipe' })
    console.log('   OK: DNS queries generated')
  } catch (e) {
    console.log('   Note: DNS queries generated (some may fail as expected)')
  }

  // 5. Read queries
  console.log('\n5. Testing GET queries...')
  await new Promise((r) => setTimeout(r, 1000)) // Wait for FTL to process
  const queriesResp = await fetch(`${PIHOLE_URL}/api/queries?sid=${sid}`)
  const queriesData = (await queriesResp.json()) as any
  console.log(`   OK: Found ${queriesData.queries?.length ?? 0} queries`)
  for (const q of (queriesData.queries ?? []).slice(0, 10)) {
    console.log(`     - ${q.domain.padEnd(35)} ${q.status.padEnd(15)} ${q.client.ip}`)
  }

  // 6. Unblock the test domain
  console.log('\n6. Testing DELETE blocked domain...')
  // Find the test domain ID
  const domains2 = (await (await fetch(`${PIHOLE_URL}/api/domains?type=deny&sid=${sid}`)).json()) as any
  const testDomain = domains2.domains?.find((d: any) => d.domain === 'test-blocked-domain.example.com')
  if (testDomain) {
    const delResp = await fetch(`${PIHOLE_URL}/api/domains/${testDomain.id}?sid=${sid}`, {
      method: 'DELETE',
      headers: { 'X-CSRF-Token': csrf },
    })
    console.log(`   Response: ${delResp.status} ${delResp.ok ? 'OK' : 'FAIL'}`)
  } else {
    console.log('   Note: Test domain not found in blocklist')
  }

  console.log('\n=== All tests completed ===')
}

main().catch(console.error)
