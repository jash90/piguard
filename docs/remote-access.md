# PiGuard — Remote Access Setup (Tailscale)

## Why Tailscale?

The PiGuard dashboard is hosted on your Raspberry Pi at home. When you're away from home (at work, traveling), you can't reach the Pi's local IP. Tailscale creates a secure VPN mesh so your devices can reach each other from anywhere.

## Step 1 — Install Tailscale on Raspberry Pi

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

Follow the link to authenticate with your Tailscale account (Google, Microsoft, GitHub, etc.).

Note your Pi's Tailscale IP:
```bash
tailscale ip -4
# Example: 100.64.0.1
```

## Step 2 — Install Tailscale on Your Phone

1. Download Tailscale from App Store (iOS) or Play Store (Android)
2. Sign in with the same account
3. Enable the VPN

## Step 3 — Access PiGuard Dashboard

From any device on your Tailscale network:

- **Pi Dashboard**: `http://100.64.0.1:3000` (replace with your Pi's Tailscale IP)
- **Pi-hole Admin**: `http://100.64.0.1:8080/admin`
- **Grafana**: `http://100.64.0.1:3001`

## Step 4 — Optional: Enable HTTPS with Tailscale Funnel

For accessing the dashboard without the Tailscale client (e.g., from a work computer where you can't install apps):

```bash
sudo tailscale funnel 3000
```

This gives you a public HTTPS URL like `https://your-pi-name.tailnet-name.ts.net`.

**Warning**: This exposes your dashboard publicly. Make sure auth is enabled.

## Step 5 — Optional: MagicDNS

Enable MagicDNS in Tailscale admin panel to use friendly names:

- `http://piguard:3000` instead of `http://100.64.0.1:3000`
- `http://pihole:8080/admin` instead of the IP

## Security Notes

- Tailscale traffic is end-to-end encrypted (WireGuard)
- Only devices authenticated to your Tailscale network can reach the Pi
- No ports need to be opened on your router
- The Pi-hole DNS filtering still works for home network devices — Tailscale only provides remote access to the dashboard, not DNS filtering
