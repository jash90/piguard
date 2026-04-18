# PiGuard — Parental DNS Control System

PiGuard is a parental DNS control system for the home network. It uses a Raspberry Pi running Pi-hole v6 as a DNS sinkhole, with a Convex backend for real-time monitoring, blocklist management, and push notifications.

Built for **HackCarpathia** (12-day hackathon).

## Architecture

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

## Tech Stack

| Layer | Technology |
|---|---|
| DNS Sinkhole | Pi-hole v6 (Docker) |
| Pi Bridge Script | Node.js / TypeScript |
| Backend | Convex (queries, mutations, actions, cronJobs) |
| Auth | @convex-dev/auth (email + password) |
| Web Apps | Next.js 15 + Tailwind CSS v4 + Convex React |
| Mobile App | React Native + Expo SDK 53 + NativeWind |
| Push Notifications | Expo Push Notifications |
| Monitoring | Grafana + InfluxDB |
| Remote Access | Tailscale VPN |
| Deployment | Docker Compose on Raspberry Pi |

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10+
- A [Convex](https://convex.dev) account
- Raspberry Pi 4 with Raspberry Pi OS Lite

### 1. Set up the monorepo

```bash
git clone <repo-url>
cd piguard
pnpm install
```

### 2. Deploy the Convex backend

```bash
cd packages/backend
npx convex dev
# Follow the prompts to create/link your Convex project
# Copy the deployment URL (e.g., https://happy-animal-123.convex.cloud)
```

### 3. Set up the Raspberry Pi

See [docs/pi-setup.md](docs/pi-setup.md) for full instructions.

```bash
# On the Pi
cd docker
cp .env.example .env
# Edit .env with your settings
docker compose up -d
```

### 4. Configure the Pi bridge

```bash
cd pi-bridge
cp ../docker/.env.example .env
# Set CONVEX_URL and PIHOLE_PASSWORD
pnpm dev
```

### 5. Run the web apps

```bash
# Admin app (for managing blocklists)
cd apps/admin
echo "NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud" > .env.local
pnpm dev

# Pi Dashboard (for monitoring)
cd apps/web
echo "NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud" > .env.local
pnpm dev
```

### 6. Run the mobile app

```bash
cd apps/mobile
echo "EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud" > .env
npx expo start
```

## Project Structure

```
piguard/
├── apps/
│   ├── admin/          # Admin panel (blocklists, social media, schedules)
│   ├── web/            # Pi-hosted dashboard (live activity, alerts)
│   └── mobile/         # Expo mobile app (activity feed, blocking, tips)
├── packages/
│   └── backend/        # Convex project (schema, functions, auth, HTTP actions)
├── pi-bridge/          # Pi-side daemon (syncs Pi-hole ↔ Convex)
├── docker/             # Docker Compose configs (Pi-hole, InfluxDB, Grafana)
└── docs/               # Setup guides
```

## Features

### Admin Panel (`apps/admin/`)
- Domain blocklist management (add, remove, enable/disable)
- Social media platform blocking (predefined: Facebook, TikTok, Instagram, etc.)
- Custom platform addition with associated domains
- Child profile management with device assignment
- Time-based access schedules (e.g., "block all after 10 PM")

### Pi Dashboard (`apps/web/`)
- Real-time DNS query monitoring
- Device status (online/offline)
- Blocked attempt feed
- Dashboard stats (queries today, blocked count, top domains)

### Mobile App (`apps/mobile/`)
- Real-time activity feed
- Quick-toggle blocking per child profile
- Push notifications on blocked access
- AI-generated conversation tips for parents

### Pi Bridge (`pi-bridge/`)
- Reads Pi-hole's FTL SQLite database for DNS logs
- Syncs logs to Convex in batches
- Pulls block rules from Convex and applies to Pi-hole
- Writes aggregate stats to InfluxDB for Grafana

### Notifications
- Push notifications via Expo when blocked access is detected
- AI-generated conversation tips (Perplexity/OpenAI with static fallback)
- Debounced: max 1 notification per domain per 60 seconds

## Environment Variables

See `docker/.env.example` for all required variables.

Key variables:
| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | apps/admin, apps/web | Convex deployment URL |
| `EXPO_PUBLIC_CONVEX_URL` | apps/mobile | Convex deployment URL |
| `CONVEX_URL` | pi-bridge | Convex deployment URL |
| `PIHOLE_URL` | pi-bridge | Pi-hole API URL |
| `PIHOLE_PASSWORD` | pi-bridge, docker | Pi-hole admin password |
| `PERPLEXITY_API_KEY` | packages/backend (Convex env) | AI tip generation |
| `INFLUXDB_URL` | pi-bridge | InfluxDB URL (optional) |

## Documentation

- [Pi Setup Guide](docs/pi-setup.md) — Raspberry Pi + Pi-hole + Docker setup
- [Remote Access](docs/remote-access.md) — Tailscale VPN configuration

## License

MIT
