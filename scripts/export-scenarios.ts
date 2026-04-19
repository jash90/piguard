// Export conversation scenarios (PL + EN) to a single JSON file.
// Run: npx tsx scripts/export-scenarios.ts
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

async function main() {
  const plMod = await import('../apps/mobile/src/features/tips/data/scenarios.pl')
  const enMod = await import('../apps/mobile/src/features/tips/data/scenarios.en')

  const out = {
    $schema: 'https://piguard.local/schemas/conversation-scenarios.json',
    description:
      'Parent conversation scenarios grouped by blocking category. Each scenario has: why, opening, pitfalls, age-appropriate notes, child reactions with parent replies, red flags and follow-up actions.',
    version: 1,
    languages: ['pl', 'en'],
    scenarios: {
      pl: plMod.SCENARIOS_PL,
      en: enMod.SCENARIOS_EN,
    },
  }

  const outPath = resolve(process.cwd(), 'docs/conversation-scenarios.json')
  writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8')
  console.log(
    `Wrote ${outPath}\n  PL scenarios: ${out.scenarios.pl.length}\n  EN scenarios: ${out.scenarios.en.length}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
