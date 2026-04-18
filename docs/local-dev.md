# PiGuard — Local Development Setup (macOS)

## Quick Start

### 1. Start Pi-hole + InfluxDB + Grafana

```bash
cd docker
docker compose -f docker-compose.dev.yml up -d
```

Wait ~15 seconds for Pi-hole to be healthy:
```bash
docker ps --filter "name=piguard"
```

### 2. Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Pi-hole Admin | http://localhost:8080/admin | Password: `pihole123` |
| InfluxDB | http://localhost:8086 | admin / admin12345678 |
| Grafana | http://localhost:3002 | admin / admin123 |

### 3. Deploy Convex Backend (Local)

Requires Node 22+:
```bash
cd packages/backend
PATH="$HOME/.config/nvm/versions/node/v22.19.0/bin:$PATH" npx convex dev
```

This starts Convex locally at `http://127.0.0.1:3210` (HTTP actions at `:3211`).

### 4. Seed Test Data

```bash
cd packages/backend
PATH="$HOME/.config/nvm/versions/node/v22.19.0/bin:$PATH" npx tsx convex/seed.ts
```

### 5. Configure Environment

```bash
# Admin app
echo "NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210" > apps/admin/.env.local

# Web dashboard
echo "NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210" > apps/web/.env.local

# Mobile app
echo "EXPO_PUBLIC_CONVEX_URL=http://127.0.0.1:3210" > apps/mobile/.env
```

### 6. Start the Web Apps

```bash
# Terminal 1: Admin app (port 3000)
cd apps/admin && pnpm dev

# Terminal 2: Web dashboard (port 3003)
cd apps/web && pnpm dev
```

### 7. Run the Pi Bridge

```bash
cd pi-bridge
PIHOLE_URL=http://localhost:8080 \
PIHOLE_PASSWORD=pihole123 \
PIHOLE_DOCKER_CONTAINER=piguard-pihole-dev \
CONVEX_URL=http://127.0.0.1:3210 \
npx tsx src/main.ts
```

---

## Pi-hole v6 API — Verified Endpoints

### Authentication
```bash
# POST /api/auth — returns session with SID + CSRF
curl -s -X POST http://localhost:8080/api/auth \
  -H 'Content-Type: application/json' \
  -d '{"password":"pihole123"}'
# → { "session": { "valid": true, "sid": "...", "csrf": "..." } }
```

Subsequent requests: pass `?sid=<SID>` as query parameter OR `Sid: <SID>` as header.

### Working Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/queries?count=N` | DNS query log (supports `from`, `until` timestamps) |
| GET | `/api/stats/summary` | Query stats (total, blocked %, unique domains) |
| GET | `/api/domains?type=deny` | List blocked domains |
| GET | `/api/domains?type=allow` | List allowed domains |
| GET | `/api/network` | Network devices table |
| POST | `/api/auth` | Authenticate |

### Broken Endpoints (Pi-hole v6 bug)

| Method | Endpoint | Issue | Workaround |
|--------|----------|-------|------------|
| POST | `/api/domains` | `uri_error: "Specify list to modify more precisely"` | `docker exec <container> pihole deny <domain>` |
| DELETE | `/api/domains/:id` | Same error | `docker exec <container> pihole allow <domain>` |

### DNS Resolution Test
```bash
# Inside the container:
docker exec piguard-pihole-dev dig facebook.com @127.0.0.1 +short
# → 0.0.0.0  (blocked)

docker exec piguard-pihole-dev dig google.com @127.0.0.1 +short
# → 142.250.x.x  (allowed)
```

### Query Log Response Format
```json
{
  "queries": [{
    "id": 17,
    "time": 1776528000.86,
    "type": "A",
    "status": "GRAVITY",        // blocked statuses: GRAVITY, DENYLIST, REGEX
    "domain": "facebook.com",
    "client": { "ip": "192.168.1.5", "name": "hostname" },
    "list_id": null,
    "reply": { "type": "DOMAIN", "time": 0.001 }
  }]
}
```

---

## Port Mapping

| Port | Service | Notes |
|------|---------|-------|
| 3000 | Admin web app | Next.js dev server |
| 3003 | Web dashboard | Pi-hosted activity view |
| 3210 | Convex backend | Local deployment |
| 3211 | Convex HTTP actions | API endpoint |
| 5354 | Pi-hole DNS | Non-standard (5353 is mDNS on macOS) |
| 8080 | Pi-hole Admin UI | |
| 8086 | InfluxDB | |
| 3002 | Grafana | |

## Notes

- Pi-hole DNS runs on port 5354 (not 53) because macOS uses port 5353 for mDNS
- To use Pi-hole as your DNS resolver: `sudo networksetup -setdnsservers Wi-Fi 127.0.0.1` then `sudo networksetup -setdnsservers Wi-Fi empty` to revert
- The Pi bridge's FTL SQLite reader won't work on macOS (the DB is inside Docker) — use the API-based query reader instead
- `POST /api/domains` and `DELETE /api/domains/:id` are broken in Pi-hole v6 — all domain blocking/unblocking uses `docker exec pihole deny/allow` CLI
- Node 22+ required for Convex CLI — use nvm: `PATH="$HOME/.config/nvm/versions/node/v22.19.0/bin:$PATH"`
