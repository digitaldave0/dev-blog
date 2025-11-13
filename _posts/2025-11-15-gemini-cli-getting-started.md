---
layout: post
title: "Gemini CLI: Getting Started"
description: "Learn the basics of getting started with the Gemini CLI, including installation, authentication, and your first commands."
tags: ["gemini", "cli", "ai", "google", "tutorial", "getting-started"]
excerpt: >
  Discover how to install and set up the Gemini CLI, authenticate with Google, and run your first AI-powered commands in the terminal.
author: "owner"
date: 2025-11-15 10:00:00 +0000
---

Gemini CLI is an open-source AI agent that brings the power of Google's Gemini directly into your terminal. It's designed for both coding tasks and general productivity, comes integrated with various tools, supports MCP (Model Context Protocol) servers, and offers a generous free tier: **60 requests/min and 1,000 requests/day with a personal Google account**.

This is Part 1 of the Gemini CLI tutorial series. In this post, we'll cover installation, authentication, and your first interactive session with Gemini CLI.

## Important Links

Before we dive in, here are the official resources you should bookmark:

- **[Official Announcement Blog Post](https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/)**
- **[GitHub Project](https://github.com/google-gemini/gemini-cli)** - The official repository with latest documentation
- **[Gemini API Key Generator](https://aistudio.google.com/app/apikey)** - For API key authentication

## Cloud Shell Alternative

If you don't want to install Gemini CLI locally, you can use it directly in **Google Cloud Shell**, which comes with Gemini CLI preinstalled. You'll need a Google Cloud Project with billing enabled. This is a great way to test it without local installation.

## Local Installation

The Gemini CLI is a Node.js application, so you'll need **Node.js version 20 or higher** installed on your system.

**Step 1: Verify Node.js Installation**

First, check if you have Node.js 20+ installed:

```bash
node --version
npm --version
```

If you need to install Node.js, visit [nodejs.org](https://nodejs.org/en/download).

**Step 2: Install Gemini CLI Globally**

```bash
npm install -g @google/gemini-cli
```

**Step 3: Verify Installation**

```bash
gemini -v
```

This should display the version number (e.g., `0.4.0`).

## Initial Setup and Authentication

When you run `gemini` for the first time, the CLI will guide you through setup:

```bash
gemini
```

### Theme Selection

You'll first be prompted to select a theme for your terminal interface. Choose one that suits your preferences.

### Authentication Method

Next, you'll choose your authentication method:

**Option 1: Google Login (Recommended for Beginners)**

- Select "Google login" for easy setup
- This opens your browser for Google authentication
- Provides the free tier: 60 requests/min, 1,000 requests/day
- Ideal for personal projects and learning

**Option 2: Gemini API Key**

- Use your personal Gemini API key from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- Gives you higher quotas
- Good for development and testing

**Option 3: Vertex AI**

- For enterprise deployments
- Requires a Google Cloud Project with billing enabled
- Better for production use cases

See the [Authentication documentation](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/authentication.md) for more details.

## Understanding the Gemini CLI Interface

Once authenticated, you'll see the interactive Gemini CLI interface. Notice the status bar at the bottom showing:

- **Current folder** (left side) - The project directory you're working in
- **Current model** (center) - The model being used (e.g., `gemini-2.5-pro`)
- **Context remaining** (right side) - Available context window

### Important: Start from Your Project Directory

Gemini CLI is **project-based**. Always start it from the directory where you want to work:

```bash
# Create a project folder
mkdir gemini-cli-projects
cd gemini-cli-projects

# Then launch Gemini CLI
gemini
```

Don't launch Gemini CLI from your home directory or root folder.

### Essential Commands

Type these commands in the Gemini CLI interface:

- `/help` - View all available commands and keyboard shortcuts
- `/docs` - Access the Gemini CLI documentation
- `/stats` - View session statistics (tokens used, duration, etc.)
- `/tools` - List all built-in tools available to the AI
- `/quit` - Exit Gemini CLI (or press Ctrl-C twice)

### Shell Mode (Passthrough Commands)

You can interact with your system's shell directly by typing `!`:

```bash
! pwd          # Show current working directory
! ls -la       # List files in current directory
! cat file.txt # View file contents
```

Press `ESC` to exit shell mode and return to Gemini mode.

## Your First Task: Using the Tools

Let's explore what tools are available to Gemini CLI. In the CLI, type:

```
/tools
```

You'll see a list of built-in tools available, such as:

- `GoogleSearch` - Search the internet
- File system operations
- Shell command execution
- And more

These tools help Gemini CLI interact with your environment. **Important:** You'll be prompted for permission before any tool is executed—the AI won't perform actions without your approval.

## Your First Prompt

Let's test Gemini CLI with a simple request. Just type a natural language prompt:

```
help me understand what I can do with Gemini CLI
```

Or try something more specific:

```
I need a Python function that validates email addresses
```

The AI will respond and may ask for permission to use tools like file creation or code execution.

## Next Steps

You now have Gemini CLI installed, authenticated, and ready to use!

In **Part 2**, we'll explore command-line options and parameters for launching Gemini CLI with specific configurations.

In **Part 3**, we'll dive into configuration files (`settings.json` and `.env`) to customize Gemini CLI's behavior.

In **Part 4**, we'll explore the built-in tools in depth.

In **Part 5**, we'll integrate MCP servers to extend Gemini CLI's capabilities even further.

## Resources

- [Gemini CLI GitHub Repository](https://github.com/google-gemini/gemini-cli)
- [Official Tutorial Series](https://medium.com/google-cloud/gemini-cli-tutorial-series-77da7d494718)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Hands-on Codelab](https://medium.com/google-cloud/gemini-cli-hands-on-codelab-2f9e04d464e5)
