---
title: 'Installing OpenClaw: From Binary to Container'
description: >-
  A step-by-step walkthrough of the OpenClaw installation process, covering
  containerized deployment and local source builds for advanced customization.
pubDate: 2026-04-27T00:00:00.000Z
tags:
  - openclaw
  - installation
  - devops
heroImage: >-
  https://picsum.photos/seed/2026-04-27-openclaw-installation-walkthrough/800/400
---

# Installing OpenClaw: From Binary to Daemon

OpenClaw simplifies the deployment of autonomous agents by providing a streamlined installation process for all major operating systems. The official installer handles environment detection and dependency checks automatically.

## The One-Liner Installer

The most efficient way to install OpenClaw is via the official remote script. This will download the binary and set up the `openclaw` command in your terminal.

### macOS / Linux / WSL2
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### Windows (PowerShell)
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

## Post-Installation Verification

After the script completes, you should verify the installation by checking the version and the status of the background gateway.

```bash
# Check version
openclaw --version

# Check the gateway status
openclaw gateway status
```

## Advanced Installation: Source Build

If you are a developer looking to extend OpenClaw or build custom tools, you can install it from source. Note that you will still need **Node.js 22** and `npm` installed.

1. **Clone the Repo:**
   ```bash
   git clone https://github.com/openclaw/openclaw.git
   cd openclaw
   ```

2. **Install & Link:**
   ```bash
   npm install
   npm link
   ```

Using `npm link` allows you to run the local version of the `openclaw` CLI anywhere on your system while you develop new features.

In our next article, we will tackle the critical task of securing your OpenClaw deployment.
