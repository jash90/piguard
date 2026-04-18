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

### 3. Deploy Convex Backend

```bash
cd packages/backend
npx convex dev
```

Follow the prompts to create your Convex project. Copy the deployment URL.

### 4. Configure Environment

```bash
# Admin app
echo "NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud" > apps/admin/.env.local

# Web dashboard
echo "NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud" > apps/web/.env.local

# Mobile app
echo "EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud" > apps/mobile/.env
```

### 5. Start the Web Apps

```bash
# Terminal 1: Admin app
cd apps/admin && pnpm dev

# Terminal 2: Web dashboard
cd apps/web && pnpm dev
```

### 6. Test Pi-hole API

```bash
# Authenticate
curl -s -X POST http://localhost:8080/api/auth \
  -H 'Content-Type: application/json' \
  -d '{"password":"pihole123"}'

# Block a domain (via CLI since v6 API POST has issues)
docker exec piguard-pihole-dev pihole deny example.com

# List blocked domains
SID="<from auth response>"
curl -s "http://localhost:8080/api/domains?type=deny&sid=$SID"

# Generate DNS queries
docker exec piguard-pihole-dev dig google.com @127.0.0.1

# View query log
curl -s "http://localhost:8080/api/queries?sid=$SID"

# Run the integration test
cd pi-bridge
PIHOLE_URL=http://localhost:8080 \
PIHOLE_PASSWORD=pihole123 \
PIHOLE_DOCKER_CONTAINER=piguard-pihole-dev \
npx tsx src/test-pihole.ts
```

## Port Mapping

| Port | Service | Notes |
|------|---------|-------|
| 3000 | Admin web app | Next.js dev server |
| 3000 | Web dashboard | Change in next.config if running both |
| 5354 | Pi-hole DNS | Mapped to non-standard port (5353 is mDNS on macOS) |
| 8080 | Pi-hole Admin UI | |
| 8086 | InfluxDB | |
| 3002 | Grafana | |

## Notes

- Pi-hole DNS runs on port 5354 (not 53) because macOS uses port 5353 for mDNS
- To use Pi-hole as your DNS resolver: `sudo networksetup -setdnsservers Wi-Fi 127.0.0.1` then `sudo networksetup -setdnsservers Wi-Fi empty` to revert
- The Pi bridge's FTL SQLite reader won't work on macOS (the DB is inside Docker) — use the API-based query reader instead
- The POST /api/domains endpoint in Pi-hole v6 has a known issue — use `pihole deny` CLI as fallback
