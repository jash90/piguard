# PiGuard — Implementation Plan

## Context

PiGuard is a parental DNS control system for the home network, built for HackCarpathia (12-day hackathon). It uses a Raspberry Pi running Pi-hole v6 as a DNS sinkhole, with Convex as the backend replacing a traditional NestJS server. Parents get a web dashboard and mobile app to monitor DNS activity, manage blocklists, schedule access, and receive push notifications when blocked domains are hit.

The repo is currently empty (only `CLAUDE.md` and `AGENTS.md` exist). Everything is greenfield.

## Approach

### Architecture

Two web apps + one mobile app, all backed by the same Convex deployment:

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Admin Web App   │  │  Pi Web App      │  │  Expo Mobile App  │
│  (blocklists,    │  │  (live dashboard, │  │  (parent phone)   │
│   social media,  │  │   notifications)  │  │                   │
│   categories)    │  │  hosted on Pi     │  │                   │
└────────┬─────────┘  └────────┬─────────┘  └────────┬──────────┘
         │ Convex React hooks    │ Convex React hooks   │ Convex React hooks
         └───────────┬───────────┴──────────┬──────────┘
                     │                      │
              ┌──────▼──────────────────────▼──┐
              │        Convex Backend           │  queries, mutations, actions, cronJobs
              │   @convex-dev/auth              │  email+password auth
              │   HTTP actions for Pi bridge    │
              └──────────────┬──────────────────┘
                             │ HTTP (fetch)
                      ┌──────▼──────┐
                      │  Pi Bridge   │  Node.js script on Raspberry Pi
                      │  reads local  │  polls Pi-hole → pushes to Convex
                      │  DNS DB       │  pulls block rules → applies to Pi-hole
                      └──────┬──────┘
                             │ REST API
                      ┌──────▼──────┐
                      │  Pi-hole v6  │  DNS sinkhole (Docker on Pi)
                      └─────────────┘
```

**Data flow for DNS logs:** Pi-hole → local SQLite DB on Pi → Pi bridge periodically syncs → Convex `dns_logs` table

### Key Decisions

1. **Monorepo** using Turborepo + pnpm workspace. The Convex project lives at `packages/backend/`, shared by all three apps.
2. **Two separate web apps:**
   - `apps/admin` — blocklist management, social media account blocking, domain categories. Deployed to Vercel (or any host accessible to parents).
   - `apps/web` — live activity dashboard + notification sender. Hosted on the Raspberry Pi itself.
3. **Pi bridge script** in Node.js/TypeScript. Runs as a persistent process on the Pi. Reads Pi-hole's local DNS database (not real-time streaming — periodic sync).
4. **Auth: `@convex-dev/auth`** with the password provider for email+password authentication. No third-party auth service needed.
5. **Domain categorization is manual** — parents use the admin panel to add specific websites and social media platforms to block lists. No auto-categorization.
6. **Conversation tips are AI-generated** — Convex action calls an AI API (Perplexity or similar) with a prepared example/prompt template. Falls back to static tips if AI is unavailable.
7. **InfluxDB + Grafana** deferred to Phase 6 — Convex handles operational data.
8. **Package manager: pnpm**.

## Monorepo Structure

```
piguard/
├── apps/
│   ├── admin/                  # Admin web app (blocklists, categories, social media)
│   │   │                        # Deployed to Vercel or accessible host
│   │   ├── src/
│   │   │   ├── app/            # TanStack Router routes
│   │   │   ├── features/
│   │   │   │   ├── auth/       # Login, signup (email+password via Convex Auth)
│   │   │   │   ├── blocklist/  # Add/remove domains, manage categories
│   │   │   │   ├── social/     # Social media platform blocking (facebook, tiktok, etc.)
│   │   │   │   ├── children/   # Child profile management
│   │   │   │   ├── devices/    # Device → child assignment
│   │   │   │   └── schedule/   # Time-based access rules
│   │   │   └── shared/         # UI primitives, hooks
│   │   ├── package.json
│   │   └── next.config.ts
│   │
│   ├── web/                    # Pi-hosted web app (live dashboard, notifications)
│   │   │                        # Served from Raspberry Pi via Caddy/nginx
│   │   ├── src/
│   │   │   ├── app/            # TanStack Router routes
│   │   │   ├── features/
│   │   │   │   ├── auth/       # Login (same Convex Auth)
│   │   │   │   ├── dashboard/  # Overview stats, live activity
│   │   │   │   ├── dns-logs/   # DNS query history per device
│   │   │   │   ├── devices/    # Device status (online/offline)
│   │   │   │   └── alerts/     # Blocked attempt feed + notification history
│   │   │   └── shared/
│   │   ├── package.json
│   │   └── next.config.ts
│   │
│   └── mobile/                 # React Native + Expo (parent phone)
│       ├── src/
│       │   ├── app/            # Expo Router file-based routes
│       │   ├── features/
│       │   │   ├── auth/       # Login (same Convex Auth)
│       │   │   ├── activity/   # Real-time activity feed
│       │   │   ├── blocking/   # Quick-toggle blocking per child
│       │   │   ├── notifications/ # Push notification inbox
│       │   │   └── tips/       # Conversation tips per category
│       │   └── shared/
│       ├── app.json
│       └── package.json
│
├── packages/
│   └── backend/                # Convex project (THE backend)
│       ├── convex/
│       │   ├── schema.ts       # Table definitions
│       │   ├── auth.config.ts  # Convex Auth config (email+password)
│       │   ├── auth.ts         # Auth provider setup
│       │   ├── crons.ts        # Scheduled blocking rules
│       │   ├── http.ts         # HTTP actions for Pi bridge
│       │   ├── devices.ts      # Queries & mutations
│       │   ├── dnsLogs.ts      # Queries & mutations
│       │   ├── blockRules.ts   # Queries & mutations
│       │   ├── schedules.ts    # Queries & mutations
│       │   ├── children.ts     # Child profile CRUD
│       │   ├── notifications.ts # Push notification actions
│       │   ├── tips.ts         # AI-generated conversation tips
│       │   └── lib/
│       │       ├── push.ts     # Expo push notification sender
│       │       ├── ai.ts       # AI API integration for tips
│       │       └── categories.ts # Category + social media platform definitions
│       ├── convex.json
│       └── package.json
│
├── pi-bridge/                  # Runs on Raspberry Pi (daemon)
│   ├── src/
│   │   ├── main.ts             # Entry point, polling loop
│   │   ├── piHoleClient.ts     # Pi-hole v6 API client
│   │   ├── localDb.ts          # SQLite read from Pi-hole's FTL database
│   │   ├── convexSync.ts       # Push DNS events to Convex HTTP actions
│   │   ├── ruleSync.ts         # Pull block rules from Convex → apply to Pi-hole
│   │   └── config.ts           # Pi-hole URL, Convex URL, sync interval
│   ├── package.json
│   └── tsconfig.json
│
├── docker/                     # Docker Compose configs for Pi
│   ├── docker-compose.yml      # Pi-hole + InfluxDB + Grafana + web app
│   ├── Caddyfile               # Reverse proxy for web app on Pi
│   └── .env.example
│
├── CLAUDE.md
├── AGENTS.md
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Convex Schema Design

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // Devices on the home network
  devices: defineTable({
    macAddress: v.string(),        // unique identifier from Pi-hole
    ipAddress: v.string(),
    hostname: v.optional(v.string()),
    childProfileId: v.optional(v.id('children_profiles')),
    firstSeen: v.number(),         // timestamp
    lastSeen: v.number(),
    isOnline: v.boolean(),
  }).index('by_child', ['childProfileId'])
    .index('by_mac', ['macAddress']),

  // Child profiles created by parents
  children_profiles: defineTable({
    name: v.string(),
    avatarColor: v.string(),       // UI color for identification
    parentId: v.string(),          // parent user identifier
    defaultBlockCategories: v.optional(v.array(v.string())),
  }),

  // DNS query log entries (high-volume)
  dns_logs: defineTable({
    deviceId: v.id('devices'),
    domain: v.string(),
    clientIp: v.string(),
    queryType: v.string(),         // A, AAAA, CNAME, etc.
    status: v.string(),            // blocked, allowed, cached
    category: v.optional(v.string()),
    timestamp: v.number(),
  }).index('by_device', ['deviceId'])
    .index('by_timestamp', ['timestamp'])
    .index('by_device_timestamp', ['deviceId', 'timestamp']),

  // Blocking rules (managed from admin panel)
  block_rules: defineTable({
    childProfileId: v.optional(v.id('children_profiles')),  // null = global
    type: v.string(),              // 'domain', 'social_media', 'category'
    value: v.string(),             // domain name, platform name, or category label
    label: v.optional(v.string()), // human-readable label (e.g., 'Facebook', 'TikTok')
    isActive: v.boolean(),
    createdBy: v.string(),
    createdAt: v.number(),
  }).index('by_child', ['childProfileId'])
    .index('by_type', ['type'])
    .index('by_type_value', ['type', 'value']),

  // Time-based access schedules
  schedules: defineTable({
    childProfileId: v.id('children_profiles'),
    daysOfWeek: v.array(v.number()), // 0-6
    startTime: v.string(),          // '22:00'
    endTime: v.string(),            // '06:00'
    action: v.string(),             // 'block_all', 'block_categories'
    categories: v.optional(v.array(v.string())),
    isActive: v.boolean(),
  }).index('by_child', ['childProfileId']),

  // Social media platforms (predefined + custom)
  social_platforms: defineTable({
    name: v.string(),              // 'Facebook', 'TikTok', 'Instagram', etc.
    domains: v.array(v.string()),  // ['facebook.com', 'fbcdn.net', 'fb.com']
    iconUrl: v.optional(v.string()),
    isPredefined: v.boolean(),     // true = shipped with app, false = user-added
  }),

  // Push notification tokens
  push_tokens: defineTable({
    userId: v.string(),
    token: v.string(),              // Expo push token
    platform: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_user', ['userId']),

  // Sync cursor — tracks last Pi-hole log offset
  sync_state: defineTable({
    key: v.string(),
    value: v.string(),
  }).index('by_key', ['key']),
})
```

## Files to Create

Since this is greenfield, everything is new:

| Component | Path | Purpose |
|-----------|------|---------|
| Monorepo root | `turbo.json`, `pnpm-workspace.yaml`, `package.json` | Workspace config |
| Convex schema | `packages/backend/convex/schema.ts` | All table definitions |
| Convex auth | `packages/backend/convex/auth.config.ts`, `auth.ts` | Email+password via @convex-dev/auth |
| Convex crons | `packages/backend/convex/crons.ts` | Schedule enforcement cron |
| Convex HTTP actions | `packages/backend/convex/http.ts` | Pi bridge endpoints |
| Convex queries/mutations | `packages/backend/convex/{devices,dnsLogs,blockRules,schedules,children,notifications,tips}.ts` | Business logic |
| Convex helpers | `packages/backend/convex/lib/{push,ai,categories}.ts` | Shared logic |
| Pi bridge | `pi-bridge/src/{main,piHoleClient,localDb,convexSync,ruleSync,config}.ts` | Pi-side daemon |
| Admin web app | `apps/admin/` (full scaffold) | Next.js — blocklist + social media management |
| Pi web app | `apps/web/` (full scaffold) | Next.js — live dashboard + notifications, hosted on Pi |
| Mobile app | `apps/mobile/` (full scaffold) | Expo — parent phone app |
| Docker | `docker/docker-compose.yml`, `Caddyfile` | Pi-hole, InfluxDB, Grafana, web app, reverse proxy |

## Steps

### Phase 1 — Foundation & Infrastructure (Days 1–2)

- [ ] Initialize git repo, set up monorepo with Turborepo + pnpm workspace
- [ ] Create `packages/backend/` — run `pnpx convex init`, add schema
- [ ] Create `docker/docker-compose.yml` with Pi-hole v6 + InfluxDB services
- [ ] Configure Pi-hole as DHCP/DNS (document steps in `docs/pi-setup.md`)
- [ ] Verify Pi-hole API access from dev machine (`curl` auth flow, DNS logs endpoint)
- [ ] Create `docker/.env.example` with all required env vars

### Phase 2 — Convex Backend & Pi Bridge (Days 3–4)

- [ ] Install `@convex-dev/auth` in `packages/backend/`, configure email+password provider in `auth.config.ts` and `auth.ts`
- [ ] Implement `packages/backend/convex/schema.ts` with all tables above
- [ ] Write `packages/backend/convex/devices.ts` — mutations for register/update, query for list/by-child
- [ ] Write `packages/backend/convex/dnsLogs.ts` — mutation for bulk ingest, query for per-device history with pagination
- [ ] Write `packages/backend/convex/blockRules.ts` — CRUD mutations, query to get active rules by child/global
- [ ] Write `packages/backend/convex/schedules.ts` — CRUD mutations for time-based rules
- [ ] Write `packages/backend/convex/children.ts` — child profile CRUD
- [ ] Write `packages/backend/convex/social_platforms.ts` — CRUD for social media platform definitions
- [ ] Write `packages/backend/convex/http.ts` — HTTP actions:
  - `POST /dns-events` — bulk DNS log ingestion from Pi bridge
  - `GET /block-rules` — active rules for Pi bridge to sync (returns domains grouped by type)
  - `POST /device-heartbeat` — device online status updates
  - `POST /sync-status` — bridge reports last synced timestamp
- [ ] Write `packages/backend/convex/crons.ts` — cron job runs every minute: evaluates active schedules, updates block_rules isActive flags
- [ ] Write `packages/backend/convex/lib/categories.ts` — predefined social media platform list with their associated domains (Facebook, Instagram, TikTok, Snapchat, Twitter/X, YouTube, Discord, Reddit, etc.)
- [ ] Scaffold `pi-bridge/` — Node.js/TypeScript project
- [ ] Implement `pi-bridge/src/piHoleClient.ts` — Pi-hole v6 API client (session auth, domain management, enable/disable)
- [ ] Implement `pi-bridge/src/localDb.ts` — read Pi-hole's FTL SQLite database for DNS logs since last sync (not real-time — periodic query)
- [ ] Implement `pi-bridge/src/convexSync.ts` — push DNS events to Convex HTTP action in batches, track cursor
- [ ] Implement `pi-bridge/src/ruleSync.ts` — poll Convex for block rule changes, apply to Pi-hole via API
- [ ] Implement `pi-bridge/src/main.ts` — polling loop (configurable interval, e.g., 30s for DNS logs, 60s for rules), exponential backoff, graceful shutdown

### Phase 3 — Admin Panel + Pi Dashboard (Days 5–6)

**Admin app (`apps/admin/`):**
- [ ] Scaffold Next.js + TanStack Router + Tailwind + Shadcn
- [ ] Install `convex` + `@convex-dev/auth/react`, configure providers
- [ ] Build `features/auth/` — login + signup pages (email+password)
- [ ] Build `features/blocklist/` — add/remove blocked domains, bulk import, enable/disable toggle
- [ ] Build `features/social/` — social media platform management:
  - Predefined platforms with icons (TikTok, Instagram, Facebook, Snapchat, YouTube, etc.)
  - Custom platform addition (user adds name + domains)
  - Per-child toggle to block/unblock each platform
- [ ] Build `features/children/` — child profile CRUD with device assignment
- [ ] Build `features/devices/` — device list from Pi-hole, assign to child profiles
- [ ] Build `features/schedule/` — weekly schedule grid, day/time range picker, block-all or block-categories action

**Pi dashboard (`apps/web/`):**
- [ ] Scaffold Next.js + TanStack Router + Tailwind + Shadcn
- [ ] Install `convex` + `@convex-dev/auth/react`, configure providers
- [ ] Build `features/auth/` — login page (same auth)
- [ ] Build `features/dashboard/` — overview: queries today, blocked count, top domains, active alerts
- [ ] Build `features/dns-logs/` — DNS query history per device, filter by status, category badges
- [ ] Build `features/devices/` — device list with online/offline status, last seen
- [ ] Build `features/alerts/` — blocked attempt feed, notification history
- [ ] Add Caddy reverse proxy config in `docker/Caddyfile` to serve this app from Pi

### Phase 4 — Notifications + AI Tips (Days 7–8)

- [ ] Write `packages/backend/convex/notifications.ts` — action that triggers when new blocked DNS logs are ingested
- [ ] Write `packages/backend/convex/lib/push.ts` — Expo Push API integration (`fetch` to `https://exp.host/--/api/v2/push/send`)
- [ ] Write `packages/backend/convex/push_tokens.ts` — mutation to register/update Expo push tokens
- [ ] Write `packages/backend/convex/tips.ts` — action that generates conversation tips:
  - Takes domain + category as input
  - Calls AI API (Perplexity or OpenAI) with a prepared prompt template and example
  - Falls back to a static tip if AI call fails
  - Caches generated tips per category in Convex (avoid re-generating for same category)
- [ ] Write `packages/backend/convex/lib/ai.ts` — AI API client wrapper
- [ ] Enrich push notifications with:
  - Domain name + category label
  - AI-generated conversation tip for the parent
- [ ] Optional: add Ntfy.sh as self-hosted fallback notification channel
- [ ] Wire notification triggers into the Pi bridge's DNS log sync (after ingest, check for blocked entries)

### Phase 5 — Mobile App (Days 9–10)

- [ ] Scaffold `apps/mobile/` — Expo SDK latest, Expo Router, Uniwind/Tailwind
- [ ] Install `convex` package, configure `ConvexProvider`
- [ ] Build `features/activity/` — real-time activity feed using `useQuery` on DNS logs
- [ ] Build `features/blocking/` — quick-toggle blocking per child profile, domain list
- [ ] Build `features/notifications/` — push notification registration, inbox view
- [ ] Build `features/tips/` — conversation tip library organized by domain category
- [ ] Configure `expo-notifications` for push notification handling
- [ ] Build bottom tab navigation with Expo Router

### Phase 6 — Polish & Remote Access (Days 11–12)

- [ ] Set up Tailscale on Pi for remote access (document in `docs/remote-access.md`)
- [ ] Add Grafana dashboard to `docker/docker-compose.yml` connected to InfluxDB
- [ ] Add InfluxDB write to Pi bridge (`pi-bridge/src/influxLogger.ts`) for aggregate traffic stats
- [ ] End-to-end testing across devices (phone, laptop, tablet on WiFi)
- [ ] Polish UI — loading states, error states, empty states across web + mobile
- [ ] Prepare demo scenario and presentation

## Verification

### Phase 1
- [ ] `docker compose up` starts Pi-hole + InfluxDB without errors
- [ ] Pi-hole admin panel accessible at `http://pi.hole/admin`
- [ ] DNS queries from network devices appear in Pi-hole query log
- [ ] `curl -X POST http://pi.hole/api/auth` returns session ID

### Phase 2
- [ ] `pnpx convex dev` runs without errors, schema deployed
- [ ] Convex dashboard shows all tables with correct columns
- [ ] Pi bridge connects to Pi-hole API and Convex, starts forwarding DNS events
- [ ] DNS events appear in Convex `dns_logs` table in real-time
- [ ] Block rule created in Convex appears in Pi-hole domain blocklist

### Phase 3
- [ ] Web dashboard loads at `http://localhost:3000`
- [ ] Device list shows all network devices from Pi-hole
- [ ] DNS log view updates in real-time without page refresh
- [ ] Adding a blocked domain in the UI → rule syncs to Pi-hole → domain is blocked
- [ ] Schedule creation works — "block all after 10 PM" creates schedule entry

### Phase 4
- [ ] Blocking a domain from a child's device triggers a push notification
- [ ] Notification includes domain name, category, and conversation tip
- [ ] Notification arrives on Expo mobile app

### Phase 5
- [ ] `pnpx expo start` launches mobile app in simulator
- [ ] Activity feed shows real-time DNS queries
- [ ] Toggling blocking on a child profile immediately takes effect
- [ ] Push notifications arrive and open the correct screen

### Phase 6
- [ ] Tailscale VPN allows dashboard access from outside the home network
- [ ] Grafana shows traffic visualization charts from InfluxDB
- [ ] Full demo scenario works end-to-end: child device → blocked → parent notified → parent reviews → adjusts rules

## Resolved Decisions

| Question | Decision |
|----------|----------|
| Auth | `@convex-dev/auth` with email+password provider |
| Pi-hole log streaming | Not real-time — Pi bridge reads local FTL SQLite DB periodically |
| Domain categorization | Manual admin panel for adding websites and social media accounts |
| Conversation tips | AI-generated via external API, with prepared prompt template + example; static fallback |
| Web hosting | Two apps: admin on Vercel (or any host), Pi dashboard hosted on Raspberry Pi |

## Remaining Questions

1. **AI API for tips** — Perplexity API, OpenAI API, or another? Need an API key either way. Which do you have access to?
2. **Social media blocking granularity** — Block entire platforms (e.g., all of facebook.com) or specific features (e.g., Instagram feed but not DMs)? Blocking entire domains is simpler and recommended for MVP.
3. **Pi dashboard auth requirement** — Should the Pi-hosted dashboard require login, or is it OK to be open within the home network (behind Tailscale for remote)?
