#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# PiGuard Demo Launcher
#
# Starts everything needed for a full local demo:
#   1. Convex local backend
#   2. Seed data (devices, profiles, DNS logs)
#   3. Mock DNS bridge (generates fake traffic)
#   4. Web dashboard
#
# Usage:  bash scripts/demo.sh
# =============================================================================

BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m'

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PIDS=()

cleanup() {
  echo ""
  echo -e "${YELLOW}Shutting down…${NC}"
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null
  echo -e "${GREEN}Done.${NC}"
}
trap cleanup EXIT INT TERM

echo -e "${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${BOLD}║       PiGuard Demo Launcher          ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""

# ---- Detect WiFi IP --------------------------------------------------------
WIFI_IP=""
if [[ "$(uname)" == "Darwin" ]]; then
  # macOS
  WIFI_IP=$(ipconfig getifaddr en0 2>/dev/null || echo "")
  if [[ -z "$WIFI_IP" ]]; then
    WIFI_IP=$(ifconfig en0 2>/dev/null | grep "inet " | awk '{print $2}')
  fi
else
  # Linux
  WIFI_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "")
fi

# ---- Step 1: Start Convex local backend ------------------------------------
echo -e "${BLUE}[1/5]${NC} Starting Convex local backend…"

cd "$ROOT_DIR/packages/backend"

# Ensure .env.local exists
if [[ ! -f .env.local ]]; then
  cat > .env.local << 'EOF'
CONVEX_URL=http://127.0.0.1:3210
CONVEX_SITE_URL=http://127.0.0.1:3211
EOF
fi

npx convex dev --once --typecheck disable &
CONVEX_PID=$!
PIDS+=("$CONVEX_PID")

# Wait for Convex to be ready
echo "       Waiting for Convex to start…"
for i in $(seq 1 60); do
  if curl -s http://127.0.0.1:3211/ping 2>/dev/null | grep -q '"ok"'; then
    echo -e "       ${GREEN}Convex is ready!${NC}"
    break
  fi
  sleep 1
done

# ---- Step 2: Seed data -----------------------------------------------------
echo -e "${BLUE}[2/5]${NC} Seeding test data…"
cd "$ROOT_DIR/packages/backend"
npx tsx convex/seed.ts 2>&1 || echo "       (Seed may have partially run before — that's OK)"
echo -e "       ${GREEN}Seed complete.${NC}"

# ---- Step 3: Start Convex dev (watch mode) ---------------------------------
echo -e "${BLUE}[3/5]${NC} Starting Convex dev server (watch mode)…"
cd "$ROOT_DIR/packages/backend"
npx convex dev --typecheck disable &
CONVEX_WATCH_PID=$!
PIDS+=("$CONVEX_WATCH_PID")
sleep 3

# ---- Step 4: Start mock bridge ---------------------------------------------
echo -e "${BLUE}[4/5]${NC} Starting mock DNS bridge…"
cd "$ROOT_DIR/pi-bridge"
MOCK_MODE=true CONVEX_URL=http://127.0.0.1:3210 npx tsx src/main.ts &
MOCK_PID=$!
PIDS+=("$MOCK_PID")
sleep 2

# ---- Step 5: Start web dashboard -------------------------------------------
echo -e "${BLUE}[5/5]${NC} Starting web dashboard…"
cd "$ROOT_DIR/apps/web"
if [[ ! -f .env.local ]]; then
  echo "NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210" > .env.local
fi
npx next dev --port 3003 &
WEB_PID=$!
PIDS+=("$WEB_PID")

# ---- Print summary ---------------------------------------------------------
echo ""
echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       PiGuard Demo is Running!       ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BOLD}Web Dashboard:${NC}  http://localhost:3003"
echo ""
if [[ -n "$WIFI_IP" ]]; then
  echo -e "  ${BOLD}📱 Mobile App:${NC}"
  echo -e "     Set your .env to: ${YELLOW}EXPO_PUBLIC_CONVEX_URL=http://${WIFI_IP}:3210${NC}"
  echo -e "     Or enter this URL in the app setup screen."
  echo ""
fi
echo -e "  Mock DNS events are being generated every 5 seconds."
echo -e "  The dashboard will show live data within seconds."
echo ""
echo -e "  Press ${BOLD}Ctrl+C${NC} to stop everything."
echo ""

# Wait for all processes
wait
