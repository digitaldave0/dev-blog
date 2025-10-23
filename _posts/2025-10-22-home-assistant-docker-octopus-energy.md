---
layout: post
title: "Running Home Assistant in Docker with Octopus Energy Integration"
date: 2025-10-22
categories: [home automation, docker, energy monitoring]
---


Home Assistant is an open-source home automation platform that lets you control smart devices, monitor your home, and integrate with various services. In this post, I'll show you how to run Home Assistant using Docker Compose, install HACS (Home Assistant Community Store) for community integrations, and add the Octopus Energy integration to track your electricity and gas usage with beautiful graphs.

## Why Docker?

Running Home Assistant in Docker makes it easy to manage, update, and isolate from your host system. Docker Compose simplifies the setup with a single configuration file.

## Prerequisites

Before we start, ensure you have:

- Docker and Docker Compose installed
- An Octopus Energy account
- Your Octopus API key, account number, and meter details (see below)

### Getting Your Octopus Energy API Key and Details

1. **API Key**: Visit the [Octopus Developer Portal](https://octopus.energy/dashboard/developer/), sign in, and generate a new API key.
2. **Account Number**: Found on your Octopus bill or dashboard.
3. **Electricity Meter Details** (two numbers for smart meters):
   - MPAN (Meter Point Administration Number): On your bill or meter.
   - Serial Number: On the meter itself.
4. **Gas Meter Details** (two numbers for smart meters, if applicable):
   - MPRN (Meter Point Reference Number): On your bill.
   - Serial Number: On the meter.

These details are required for the integration to fetch accurate data.

## Setting Up Home Assistant with Docker Compose

Create a new directory for your Home Assistant setup:

```bash
mkdir hassio
cd hassio
```

Create a `docker-compose.yml` file:

```yaml
version: "3"
services:
  homeassistant:
    image: homeassistant/home-assistant:latest
    container_name: homeassistant
    restart: unless-stopped
    ports:
      - "8123:8123"
    volumes:
      - ./config:/config
      - /etc/localtime:/etc/localtime:ro
    environment:
      - TZ=Europe/London
    privileged: true
```

Start Home Assistant:

```bash
docker-compose up -d
```

Access it at `http://localhost:8123` and complete the initial setup.

## Installing HACS

HACS allows you to easily install community-developed integrations. Download and install it:

```bash
curl -L -o hacs.zip https://github.com/hacs/integration/releases/latest/download/hacs.zip
unzip hacs.zip -d config/custom_components/hacs
docker-compose restart
```

In Home Assistant, you'll now see HACS in the sidebar.

## Adding the Octopus Energy Integration

1. In HACS, go to Settings > Add Custom Repository.
2. Add: `https://github.com/BottlecapDave/HomeAssistant-OctopusEnergy` as an Integration.
3. Install it from HACS > Integrations.
4. Restart Home Assistant.
5. Go to Settings > Devices & Services > Add Integration > Octopus Energy.
6. Enter your API key, account number, and meter details (MPAN, serial numbers, etc.).

## Graphing Your Energy Data

Use the built-in Energy Dashboard:

1. Go to Settings > Dashboards > Energy.
2. Add your electricity and gas sensors from the Octopus integration.
3. View charts for usage, costs, and trends.

## Tips

- The config volume persists your data.
- Update integrations via HACS.
- If issues arise, check logs: `docker-compose logs homeassistant`.

## Conclusion

With this setup, you can monitor your energy usage in real-time. Home Assistant with Octopus Energy provides valuable insights into your consumption patterns. Give it a try and start optimizing your energy use!
