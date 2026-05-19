---
title: 'Installing OpenClaw: From Binary to Container'
description: >-
  A step-by-step walkthrough of the OpenClaw installation process, covering
  containerized deployment and local source builds for advanced customization.
pubDate: 2026-04-27T00:00:00.000Z
tags:
  - devops
  - installation
  - openclaw
heroImage: >-
  https://picsum.photos/seed/2026-04-27-openclaw-installation-walkthrough/800/400
---
With your hardware isolated and ready, it’s time to perform the actual installation. OpenClaw’s onboarding is famously smooth, but there are several critical decisions you’ll need to make during the process.

## The Installation One-Liner

Open your terminal on your dedicated machine and run the following command. This handles environment detection, Node.js validation, and the initial binary download.

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

## Navigating the Onboarding Wizard

Once the installer finishes, you’ll be dropped into a Terminal UI (TUI). Use your arrow keys to navigate and the spacebar to select your preferences.

### 1. Picking Your "Brain" (The Model)
We recommend starting with **Claude Opus 4.6** or **Codex 5.4**. These are currently the most reliable models for the complex reasoning required to follow multi-step autonomous instructions.
- **API Keys:** It is highly recommended to use an API key rather than a browser-based subscription. This ensures stability and avoids potential bans associated with automated usage on personal accounts.

### 2. Choosing Your Channels
While the terminal is great for setup, you’ll want a more natural interface for daily use. **Telegram** is the gold standard for OpenClaw. It’s simple to set up via `@BotFather` and allows you to chat with your agent from your phone as if they were a teammate.

### 3. Enabling "Hooks"
Hooks are the specialized tools that give your agent its "meta-cognition."
- **Session Memory:** (Must-have) Allows the agent to remember context across conversations.
- **Web Search:** Gives your agent internet access for real-time research.
- **Skill Bundling:** Start with the `gog` skill (for Google suite access) and the `summarize` skill.

## The TUI (Terminal UI) Experience

After the onboarding "hatches" your agent, you’ll see the TUI. This is where you’ll see your agent’s status, active cron jobs, and recent logs. If the TUI doesn't start automatically, or if you need to re-configure, you can always run:

```bash
openclaw onboard --install-daemon
```

## Verification: "Hello, World!"

To ensure the gateway is active and listening for your commands, run:
```bash
openclaw gateway status
```

In the next article, we will go deep into the "Security vs. Autonomy" trade-off and how to harden your new assistant.
