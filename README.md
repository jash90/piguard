# 🛡️ PiGuard

**Parental DNS control built on Raspberry Pi, Convex and applied developmental psychology.**

PiGuard is a self-hosted parental control system for the home network. It pairs a **Pi-hole** DNS sinkhole with a **Convex** backend, a web admin panel, and a mobile app — so a parent can block, monitor and, most importantly, **talk** with their child about what is actually happening online.

> Blocking is the easy part. The hard part is the conversation after. PiGuard ships with 15 full conversation scenarios reviewed against developmental psychology (Piaget, Erikson, attachment theory), covering the reactions children actually have — including neurodivergent kids.

**Repo:** https://github.com/jash90/piguard

---

## Table of contents

- [What you get](#what-you-get)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Features in depth](#features-in-depth)
- [Blocking categories](#blocking-categories)
- [Conversation scenarios](#conversation-scenarios)
- [Internationalisation](#internationalisation)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Documentation](#documentation)
- [License](#license)

---

## What you get

| | |
|---|---|
| 🛡️ **14 blocking categories** | Adult content, gambling, drugs, weapons, self-harm, violence, dating, cyberbullying, VPN, dark web, piracy, crypto, scam, social media — expanded into ~230 concrete domains |
| 👥 **15 conversation scenarios** | PL + EN, each with opening line, pitfalls, 4 age-range notes (6–9 / 10–12 / 13–15 / 16–18), 5 typical child reactions with Try/Avoid, red flags with severity, follow-up plan |
| 📱 **Mobile app** (Expo) | Activity feed, blocking toggles, alerts, conversation tips, away-from-home banner |
| 🖥️ **Admin panel** (Next.js) | Blocklist, watched domains, children profiles, devices, schedules |
| ⚡ **Real-time** | Convex reactive queries — changes propagate admin ↔ mobile without refresh |
| 🔒 **Self-hosted** | All data stays in your house (Pi + Convex local deployment possible) |
| 🇵🇱 **Full Polish UI** | Default locale `pl`, with `en` fallback, including pluralisation |

---

## Architecture

```
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  Admin (web)     │   │  Pi dashboard    │   │  Mobile (Expo)   │
│  Next.js 15      │   │  Next.js 15      │   │  React Native    │
│  blocklist,      │   │  live DNS feed,  │   │  activity, rules,│
│  schedules,      │   │  alerts          │   │  tips, alerts    │
│  children,       │   │                  │   │                  │
│  devices         │   │                  │   │                  │
└────────┬─────────┘   └────────┬─────────┘   └────────┬─────────┘
         │ Convex React hooks     │ Convex React hooks   │ Convex React hooks
         └─────────────┬──────────┴──────────┬───────────┘
                       │                     │
                ┌──────▼─────────────────────▼──┐
                │       Convex backend          │  queries · mutations · actions · cron
                │       @convex-dev/auth        │  email + password
                │       HTTP actions            │  /ping · /block-rules · /dns-events
                └──────────────┬────────────────┘
                               │ HTTP (fetch)
                        ┌──────▼──────┐
                        │  Pi bridge  │  Node.js / TypeScript
                        │  polls      │  Pi-hole FTL SQLite → Convex
                        │  pushes     │  Convex block rules → Pi-hole API
                        └──────┬──────┘
                               │ REST API (Pi-hole v6)
                        ┌──────▼──────┐
                        │   Pi-hole   │  DNS sinkhole in Docker
                        └─────────────┘
```

---

## Tech stack

| Layer | Technology |
|---|---|
| DNS sinkhole | Pi-hole v6 (Docker) |
| Pi bridge | Node.js / TypeScript (+ mock for local dev) |
| Backend | Convex — queries, mutations, actions, cron jobs, HTTP actions |
| Auth | `@convex-dev/auth` (email + password) |
| Web apps | Next.js 15 + Tailwind v4 |
| Mobile app | React Native 0.79 + Expo SDK 53 + NativeWind 4 + Expo Router 5 |
| i18n | i18next + react-i18next (PL default, EN fallback) |
| Push | Expo Push Notifications |
| Monitoring (opt.) | Grafana + InfluxDB |
| Remote access (opt.) | Tailscale VPN |

---

## Quick start

### Prerequisites
- Node.js 22+
- pnpm 10+
- Raspberry Pi 4 with Raspberry Pi OS Lite (optional for full DNS filtering; for local dev you can use the mock bridge)

### 1. Clone and install
```bash
git clone https://github.com/jash90/piguard.git
cd piguard
pnpm install
```

### 2. Start Convex backend (local)
```bash
cd packages/backend
npx convex dev
# Use anonymous local deployment — URL defaults to http://127.0.0.1:3210
```

### 3. Seed test data (optional, for demo)
```bash
cd packages/backend
node --loader tsx convex/seed.ts
# Adds: children profiles, devices, block rules, DNS logs, a schedule
```

### 4. Run the admin
```bash
cd apps/admin
echo "NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210" > .env.local
pnpm dev
# → http://localhost:3000
```

### 5. Run the mobile app
```bash
cd apps/mobile
echo "EXPO_PUBLIC_CONVEX_URL=http://127.0.0.1:3210" > .env
npx expo start --web      # or --ios / --android
# → http://localhost:8081
```

### 6. Add the full set of youth-protection categories
```bash
cd packages/backend
node -e "
  import('convex/browser').then(async ({ ConvexHttpClient }) => {
    const c = new ConvexHttpClient('http://127.0.0.1:3210')
    console.log(await c.mutation('blockRules:seedYouthProtection', {}))
  })"
# → { inserted: 13, skipped: 0, total: 13 }
```

### 7. (Optional) Full Pi deployment
See [`docs/pi-setup.md`](docs/pi-setup.md) and [`docs/local-dev.md`](docs/local-dev.md).

---

## Project structure

```
piguard/
├── apps/
│   ├── admin/           # Next.js — blocklist, children, devices, schedules
│   ├── web/             # Next.js — Pi-hosted live dashboard
│   └── mobile/          # Expo — activity, blocking, alerts, tips
├── packages/
│   └── backend/         # Convex — schema, functions, auth, HTTP actions
├── pi-bridge/           # Node.js — Pi-hole ↔ Convex sync (+ mockBridge for dev)
├── docker/              # Docker Compose — Pi-hole, InfluxDB, Grafana
├── docs/
│   ├── pi-setup.md
│   ├── local-dev.md
│   ├── remote-access.md
│   ├── presentation.md / presentation.pdf     # 15-slide pitch deck
│   └── conversation-scenarios.json            # 15 scenarios × PL/EN, version 2
└── scripts/
    ├── demo.sh                  # starts everything locally
    ├── export-scenarios.ts      # TS → JSON
    └── transform-scenarios.mjs  # JSON v1 → v2 (with severity, ageNotes split)
```

---

## Features in depth

### Admin panel (`apps/admin/`)
- **Blocklist** — create / toggle / delete rules of type `domain`, `keyword`, `social_media`, `category`
- **Watched domains** — get a push notification when the child visits them (without blocking)
- **Children** — profiles with avatar color
- **Devices** — list by MAC/IP, assign to child
- **Schedules** — time-based rules per child (e.g. `22:00 – 07:00 → block_all`)

### Mobile app (`apps/mobile/`)
- **Activity** — real-time DNS feed from the whole household
- **Blocking** — toggle per social platform + per protection category
- **Alerts** — blocked attempts history
- **Tips** — 15 full conversation scenarios with age-adjusted guidance
- **Away-from-home banner** — when outside the home WiFi, data keeps being saved on the backend; the UI tells the parent what is still available

### Backend (`packages/backend/`)
- **Schema** — `devices`, `children_profiles`, `dns_logs`, `block_rules`, `schedules`, `social_platforms`, `push_tokens`, `sync_state`, `cached_tips`, `watched_domains`
- **HTTP actions** — `/ping` (health + CORS), `/block-rules` (expands category rules into concrete domains), `/dns-events` (ingest from Pi bridge), `/device-heartbeat`, `/sync-status`
- **Cron** — `schedulesCron:evaluateSchedules` runs every minute to activate/deactivate time-based rules

### Pi bridge (`pi-bridge/`)
- Reads Pi-hole v6 REST API for DNS logs
- Pushes to Convex in batches with a sync cursor
- Pulls active block rules from `/block-rules` (with category expansion) and applies them via Pi-hole management API
- Mock bridge for local development without a real Pi

---

## Blocking categories

Rules of type `category` expand server-side (in `/block-rules`) into concrete domains from `packages/backend/convex/lib/categories.ts`:

| Key | Label (PL) | Sample domains |
|---|---|---|
| `social_media` | Media społecznościowe | facebook, instagram, tiktok, snapchat, x, reddit |
| `adult_content` | Treści dla dorosłych | pornhub, onlyfans, chaturbate, xhamster |
| `gambling` | Hazard | bet365, pokerstars, stake, fortuna.pl, sts.pl |
| `drugs` | Narkotyki | erowid, bluelight, research-chemicals |
| `weapons` | Broń | gunbroker, armslist, ghostgunner |
| `self_harm` | Samookaleczenia i zaburzenia odżywiania | pro-ana.com, sanctioned-suicide.net |
| `violence_gore` | Przemoc i drastyczne treści | bestgore, liveleak, 8kun, kiwifarms |
| `dating` | Aplikacje randkowe | tinder, bumble, grindr |
| `cyberbullying_risk` | Ryzyko cyberprzemocy | ask.fm, ngl.link, tellonym |
| `proxy_vpn` | VPN / proxy | nordvpn, expressvpn, hola |
| `dark_web` | Dark web / Tor | torproject, tor2web |
| `piracy` | Piractwo | thepiratebay, 1337x, fmovies, z-library |
| `crypto_risky` | Ryzykowne kryptowaluty | pump.fun, dextools |
| `scam_phishing` | Oszustwa i phishing | free-robux-generator, discord-nitro-gift |

**Adding a category:**
1. Add domains to `packages/backend/convex/lib/categories.ts`
2. Convex auto-reloads — the `/block-rules` endpoint picks up new domains on the next fetch

---

## Conversation scenarios

Every blocking category has a full parent conversation script in `docs/conversation-scenarios.json` (also shown inside the mobile **Tips** tab).

**Each scenario contains:**
- `why` — one sentence on why it matters
- `opening` — an **I-message** (not "I saw you…")
- `parentSelfRegulation` — what the parent does before the talk
- `pitfalls` — what not to do
- `ageNotes[]` — 4 age ranges (`6–9`, `10–12`, `13–15`, `16–18`) each with `developmentalContext`
- `reactions[]` — 5 typical child reactions with `parentResponse` + `avoid`
- `neurodivergentNote` — adjustments for ADHD / ASD / anxiety
- `redFlags[]` — objects with `severity` (`low` / `medium` / `high` / `critical`), `action`, `referToSpecialist`
- `followUp[]` — concrete 24–72h plan
- `repairAfterConflict` — what to do after a bad conversation
- `positiveReinforcement` — how to reward openness
- `culturalContext` — local resources (PL: Dyżurnet, 116 111, CBZC; EN: NCMEC, 988, Childline)

**15 scenarios (PL + EN):**
`social_media` · `adult_content` · `gambling` · `drugs` · `self_harm` · `violence_gore` · `dating` · `weapons` · `cyberbullying_risk` · `proxy_vpn` · `dark_web` · `piracy` · `crypto_risky` · `scam_phishing` · `peer_pressure`

---

## Internationalisation

- Default locale: **`pl`** (with full diacritics)
- Fallback locale: **`en`**
- Engine: `i18next` + `react-i18next` on both mobile and admin
- Polish plural rules covered (`_one`, `_few`, `_many`, `_other`)

Locale files:
- `apps/mobile/src/shared/i18n/locales/{pl,en}.json` — ~80 keys
- `apps/admin/src/shared/i18n/locales/{pl,en}.json` — ~120 keys
- `apps/mobile/src/features/tips/data/scenarios.{pl,en}.ts` — full PL/EN scenario copy

---

## Environment variables

See `docker/.env.example` for the full list.

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | apps/admin, apps/web | Convex deployment URL |
| `EXPO_PUBLIC_CONVEX_URL` | apps/mobile | Convex deployment URL |
| `CONVEX_URL` | pi-bridge | Convex deployment URL |
| `PIHOLE_URL` | pi-bridge | Pi-hole API URL |
| `PIHOLE_PASSWORD` | pi-bridge, docker | Pi-hole admin password |
| `PERPLEXITY_API_KEY` | packages/backend | AI tip generation (optional, static fallback otherwise) |
| `INFLUXDB_URL` | pi-bridge | InfluxDB URL (optional) |

---

## Scripts

```bash
# Start everything locally (Convex + admin + mobile + mock Pi bridge)
bash scripts/demo.sh

# Regenerate docs/conversation-scenarios.json from TS sources
node scripts/export-scenarios.ts

# Transform an existing JSON to v2 (age splits, severity-scored flags, etc.)
node scripts/transform-scenarios.mjs

# Type-check all packages
pnpm type-check

# Build admin + web
pnpm build
```

---

## Documentation

- **[docs/pi-setup.md](docs/pi-setup.md)** — Raspberry Pi + Pi-hole + Docker setup
- **[docs/local-dev.md](docs/local-dev.md)** — running everything on localhost
- **[docs/remote-access.md](docs/remote-access.md)** — Tailscale VPN configuration
- **[docs/presentation.md](docs/presentation.md)** / **[docs/presentation.pdf](docs/presentation.pdf)** — 15-slide pitch deck
- **[docs/conversation-scenarios.json](docs/conversation-scenarios.json)** — full PL/EN scenarios (v2 schema)

---

## License

MIT
