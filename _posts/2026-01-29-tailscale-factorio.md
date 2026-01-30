---
layout: post
title: "Secure Factorio Server with Tailscale and Docker"
date: 2026-01-29
categories: [gaming, docker, networking]
---

Running a private game server for friends doesn't have to mean opening ports to the internet. Here's how I set up a secure Factorio server using Tailscale and Docker Compose.

## The Setup

By using Tailscale's Docker container alongside Factorio, I created a zero-configuration VPN connection that only my friends can access. No port forwarding, no firewall rules, no security headaches.

The key is the `network_mode: service:tailscale` setting, which routes all Factorio traffic through the Tailscale network. This means the game server is only accessible via my Tailscale network - not exposed to the public internet.
I can then easily create share links to this container limiting access while giving friends a seamless experience.

## Why This Works

- **Secure by default**: Only devices on your Tailscale network can connect
- **No port forwarding**: Your home IP stays private
- **Dead simple**: Friends just need Tailscale installed and access to your machine
- **Works anywhere**: Host on a VPS, home server, or even your laptop

## The Docker Compose

```yaml
services:
  tailscale:
    image: tailscale/tailscale:stable
    container_name: tailscale
    hostname: factorio-spaceage-vps
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun:/dev/net/tun
    volumes:
      - ./tailscale/state:/var/lib/tailscale
    environment:
      TS_AUTHKEY: ${TS_AUTHKEY}
      TS_STATE_DIR: /var/lib/tailscale
      TS_EXTRA_ARGS: --accept-dns=true

  factorio:
    image: factoriotools/factorio:2.0.73-rootless
    container_name: factorio
    restart: unless-stopped
    depends_on:
      - tailscale
    network_mode: service:tailscale
    volumes:
      - ./home:/factorio
    environment:
      TZ: America/Toronto
      SAVE_NAME: space-age
      AUTOSAVE_INTERVAL: 5
```

Just run `docker compose up -d` and share your Tailscale hostname with friends. They connect directly through WireGuard - secure, private, and incredibly easy.

This same pattern works for any game server: Minecraft, Valheim, Terraria, you name it. Tailscale + Docker = the easiest way to host private game servers.
