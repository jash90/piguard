# PiGuard — Local Mock Mode + Mobile Network Awareness

## Context

The system is a demo/mock for HackCarpathia. It currently requires a real Pi-hole to generate DNS data. The mobile app points to `127.0.0.1:3210` (local Convex), which only works on the simulator — not on a real phone over WiFi. The user wants:

1. **Mock mode** — generate realistic DNS traffic without Pi-hole so the full demo works on any laptop
2. **Local WiFi connectivity** — mobile app connects to the backend via the host's WiFi IP (e.g., `192.168.x.x:3210`)
3. **Network-aware visibility** — when the parent's phone leaves the home WiFi, the app shows "not connected to home network" instead of DNS logs, but the backend keeps logging
4. **Backend persistence** — DNS logs continue being saved regardless of whether the parent is connected

## Approach

### 1. Mock Pi-Bridge (`pi-bridge/src/mockBridge.ts`)

Create a new mock bridge that replaces the real Pi-hole bridge. It generates realistic fake DNS events on a configurable interval and pushes them to Convex via the same `/dns-events` HTTP endpoint. This replaces `localDb.ts` (which reads Pi-hole's SQLite) with an in-memory generator.

The mock bridge:
- Generates events for the same test devices as `seed.ts` (iPhone-Emma, iPad-Max, Gaming-PC, etc.)
- Produces a mix of blocked/allowed/cached statuses with realistic domains
- Runs on a configurable interval (default: 5 seconds)
- Supports a "burst" mode to generate lots of historical data on startup
- Uses the existing `pushDnsEvents()` from `convexSync.ts` — no changes to the Convex backend

### 2. Network Detection in Mobile App

Add a **network connectivity layer** in the mobile app:

- **Backend reachability check** — periodically ping the Convex backend URL. If it's reachable → on home network. If not → away from home.
- **Network status store** — a simple React context that exposes `{ isConnected: boolean, isChecking: boolean }`
- **UI adaptation** — all tabs show real data when connected; when disconnected, they show a friendly "You're away from home — connect to your home WiFi to see activity" banner. The backend continues saving logs independently.

### 3. Local IP Configuration

Make the mobile app configurable with the host's WiFi IP:
- `.env` uses `EXPO_PUBLIC_CONVEX_URL=http://192.168.x.x:3210` (replacing `127.0.0.1`)
- Add a **connection setup screen** that auto-detects the backend on common local IPs, or lets the user type it in manually
- The setup screen stores the URL in AsyncStorage for persistence

### 4. Startup Script (`scripts/demo.sh`)

A single script that:
1. Starts Convex local backend (`npx convex dev` in `packages/backend`)
2. Seeds the database
3. Starts the mock bridge (`pi-bridge`)
4. Starts the web dashboard (`apps/web`)
5. Prints the WiFi IP to configure the mobile app

## Files to Modify/Create

| File | Action | Purpose |
|------|--------|---------|
| `pi-bridge/src/mockBridge.ts` | **Create** | Mock DNS event generator |
| `pi-bridge/src/main.ts` | **Edit** | Add `--mock` flag to switch between real Pi-hole and mock mode |
| `pi-bridge/src/config.ts` | **Edit** | Add mock mode config flag |
| `apps/mobile/src/shared/lib/network.tsx` | **Create** | Network reachability context + hook |
| `apps/mobile/src/shared/lib/connection.tsx` | **Create** | Backend URL config + auto-discovery |
| `apps/mobile/src/app/_layout.tsx` | **Edit** | Wrap with network + connection providers |
| `apps/mobile/src/app/(tabs)/_layout.tsx` | **Edit** | Add connection banner |
| `apps/mobile/src/app/(tabs)/index.tsx` | **Edit** | Show disconnected state when away |
| `apps/mobile/src/app/(tabs)/blocking.tsx` | **Edit** | Show disconnected state when away |
| `apps/mobile/src/app/(tabs)/notifications.tsx` | **Edit** | Show disconnected state when away |
| `apps/mobile/src/app/(tabs)/tips.tsx` | **Edit** | Show disconnected state when away |
| `apps/mobile/src/app/setup.tsx` | **Create** | Backend URL setup screen |
| `apps/mobile/.env` | **Edit** | Update with placeholder WiFi IP |
| `apps/mobile/app.json` | **Edit** | Add setup route |
| `packages/backend/convex/http.ts` | **Edit** | Add `/ping` health-check endpoint for reachability |
| `scripts/demo.sh` | **Create** | One-command demo launcher |

## Reuse

- **`pi-bridge/src/convexSync.ts`** → `pushDnsEvents()` and `updateSyncCursor()` — the mock bridge reuses these directly
- **`packages/backend/convex/lib/categories.ts`** → `CATEGORIES` map and `getCategoryForDomain()` — used by mock bridge to generate categorized events
- **`packages/backend/convex/http.ts`** → existing `/dns-events` endpoint — mock bridge targets this, no backend changes needed for data flow
- **`apps/mobile/src/shared/lib/format.ts`** → `formatRelativeTime()` — already exists, reused as-is
- **`apps/mobile/src/shared/ui/StatusBadge.tsx`** → already exists, reused as-is
- **`packages/backend/convex/seed.ts`** → device/profile seed data used as reference for mock data

## Steps

### Phase 1 — Mock Bridge ✅
- [x] Create `pi-bridge/src/mockBridge.ts` with DNS event generator
- [x] Update `pi-bridge/src/config.ts` — add `MOCK_MODE` env var
- [x] Update `pi-bridge/src/main.ts` — when `MOCK_MODE=true`, run mock bridge instead of Pi-hole polling

### Phase 2 — Backend Health-Check ✅
- [x] Add `GET /ping` endpoint to `packages/backend/convex/http.ts`

### Phase 3 — Mobile App: Network Awareness ✅
- [x] Create `apps/mobile/src/shared/lib/network.tsx` — network reachability context
- [x] Create `apps/mobile/src/shared/lib/connection.tsx` — backend URL config + persistence
- [x] Create `apps/mobile/src/app/setup.tsx` — connection setup screen with network scanning

### Phase 4 — Mobile App: Disconnected UI ✅
- [x] Update `apps/mobile/src/app/_layout.tsx` — wrap with NetworkProvider + ConnectionProvider
- [x] Create `AwayBanner` + `AwayPlaceholder` components
- [x] Update tab layout to show banner when disconnected
- [x] Update Activity, Blocking, Notifications tabs with disconnected states

### Phase 5 — Demo Script ✅
- [x] Create `scripts/demo.sh` — one-command demo launcher
- [x] Add `"demo"` script to root `package.json`

## Verification

1. **Mock bridge works**: Run `MOCK_MODE=true pnpm --filter @piguard/pi-bridge dev` → DNS events appear in Convex and show up on the web dashboard at `localhost:3003`
2. **Mobile connects over WiFi**: Set `EXPO_PUBLIC_CONVEX_URL=http://<wifi-ip>:3210` → launch Expo on physical device → app shows live data
3. **Network detection**: Turn off WiFi on phone → app shows "away from home" banner within ~15 seconds → turn WiFi back on → data loads again
4. **Backend persists**: While phone is disconnected, mock bridge still runs → events saved → when phone reconnects, all events appear in the feed
5. **Setup screen**: Open app for first time → shows setup screen → enter IP → connects → redirects to main tabs
6. **Full demo**: Run `pnpm demo` → everything starts → scan QR code → working app in < 2 minutes
