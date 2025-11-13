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

The Gemini CLI is a powerful, open-source AI agent that brings the capabilities of Google's Gemini models directly into your terminal. It's designed to be your personal AI assistant, helping you with a wide range of tasks, from writing code and documentation to automating your workflows.

This is the first post in our "Ultimate Guide to the Gemini CLI" series. In this post, we'll cover the basics of getting started with the Gemini CLI, including installation, configuration, and your first commands.

## Installation

The Gemini CLI is a Node.js application, so you'll need to have Node.js (version 18 or higher) installed on your system.

You can install the Gemini CLI using one of the following methods:

**Using `npx` (no global installation required):**

```bash
npx https://github.com/google-gemini/gemini-cli
```

**Installing globally with `npm`:**

```bash
npm install -g @google/gemini-cli
```

**Installing globally with Homebrew (macOS/Linux):**

```bash
brew install gemini-cli
```

## Authentication

After installing the Gemini CLI, you'll need to authenticate it with your Google account. The first time you run the `gemini` command, it will guide you through the authentication process.

You have a few options for authentication:

- **Personal Google Account:** This is the easiest way to get started and provides a generous free tier.
- **API Key:** You can use a Gemini API key for authentication.
- **Vertex AI:** For enterprise use cases, you can configure the Gemini CLI to use Vertex AI with a Google Cloud Project.

## Your First Commands

Once you're authenticated, you can start using the Gemini CLI. The CLI is project-based, which means you should run it from the root directory of your project.

To start the Gemini CLI, simply run the `gemini` command:

```bash
gemini
```

This will start an interactive chat session where you can interact with the Gemini model using natural language.

### The `generate` Command

The `generate` command is the most basic command in the Gemini CLI. It allows you to generate text based on a prompt.

Here's an example:

```
> generate "Write a short story about a robot who discovers music."
```

The Gemini model will then generate a story for you.

### The `tools` Command

The `tools` command is where the real power of the Gemini CLI lies. It allows you to extend the functionality of the CLI by integrating it with other scripts, APIs, and services.

We'll cover the `tools` command in detail in the next post in this series.

## Configuration

The Gemini CLI can be configured using the `~/.gemini/config.toml` file. This file allows you to customize various aspects of the CLI's behavior, such as the default model, output format, and more.

Here's an example of what a `config.toml` file might look like:

```toml
# The default model to use for generation
default_model = "gemini-pro"

# The default output format for commands
output_format = "text"
```

## Conclusion

In this post, we've covered the basics of getting started with the Gemini CLI. You've learned how to install and authenticate the CLI, and you've run your first commands.

In the next post in this series, we'll take a deep dive into the `tools` command and show you how to extend the functionality of the Gemini CLI with your own custom tools.

Stay tuned!
