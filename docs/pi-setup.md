# PiGuard — Raspberry Pi Setup Guide

## Prerequisites

- Raspberry Pi 4 (2GB+ RAM recommended)
- Raspberry Pi OS Lite (64-bit)
- MicroSD card (16GB+)
- Network access (Ethernet preferred)

## Step 1 — Base OS

1. Flash Raspberry Pi OS Lite 64-bit using Raspberry Pi Imager
2. Enable SSH during imaging (Advanced options)
3. Boot the Pi, find its IP on your router
4. SSH in: `ssh pi@<PI_IP>`
5. Update: `sudo apt update && sudo apt upgrade -y`

## Step 2 — Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker pi

# Install Docker Compose v2 (usually included)
docker compose version
```

## Step 3 — PiGuard Services

```bash
# Clone the repo
git clone <repo-url> /home/pi/piguard
cd /home/pi/piguard

# Copy and edit environment
cp docker/.env.example docker/.env
nano docker/.env

# Start all services
cd docker
docker compose up -d
```

### Configure .env

Key values to set:

- `PIHOLE_PASSWORD` — set a strong password for Pi-hole admin
- `PI_IP` — your Pi's IP address (e.g., `192.168.1.100`)
- `CONVEX_URL` — your Convex deployment URL

## Step 4 — Configure DNS

### Option A: Pi as DHCP server (recommended)

1. In Pi-hole admin (`http://<PI_IP>:8080/admin`), enable DHCP under Settings → DHCP
2. Disable DHCP on your router
3. Set Pi-hole as upstream DNS in Pi-hole settings

### Option B: Point router DNS to Pi-hole

1. In your router's DHCP settings, set the primary DNS to your Pi's IP
2. Leave secondary DNS blank or set to Pi's IP again
3. Restart DHCP on the router or renew client leases

## Step 5 — Verify Pi-hole

1. Open `http://<PI_IP>:8080/admin`
2. Log in with the password from `.env`
3. From another device, run: `nslookup google.com <PI_IP>`
4. Check Pi-hole query log — you should see the query

## Step 6 — Pi Bridge

The Pi bridge reads Pi-hole's FTL database and syncs with Convex.

```bash
cd /home/pi/piguard/pi-bridge

# Install dependencies
pnpm install

# Create .env
cat > .env <<EOF
CONVEX_URL=https://your-deployment.convex.cloud
PIHOLE_URL=http://localhost
PIHOLE_PASSWORD=your_password
FTL_DB_PATH=/home/pi/piguard/docker/data/pihole/etc-pihole/pihole-FTL.db
EOF

# Run (development)
pnpm dev

# Or build and run as service
pnpm build
```

### Run as systemd service

```bash
sudo tee /etc/systemd/system/piguard-bridge.service <<EOF
[Unit]
Description=PiGuard Bridge
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/piguard/pi-bridge
ExecStart=/usr/bin/node dist/main.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable piguard-bridge
sudo systemctl start piguard-bridge
```
