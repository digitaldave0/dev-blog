---
layout: post
title: "Gemini CLI: Advanced Customization"
description: "Master advanced customization of Gemini CLI, including configuration files, custom tools, and building instruction libraries."
tags: ["gemini", "cli", "customization", "configuration", "tools", "prompts"]
excerpt: >
  Unlock advanced features of Gemini CLI with custom configurations, tool creation, and personalized instruction libraries for enhanced productivity.
author: "owner"
date: 2025-11-17 10:00:00 +0000
---

Welcome to **Part 3** of the Gemini CLI tutorial series. In the [previous post](/posts/gemini-cli-tools-deep-dive/), we explored the built-in tools and how they work.

In this post, we'll dive into **configuration files** (`settings.json` and `.env`) and show you how to customize Gemini CLI to match your specific needs and preferences.

## The `~/.gemini/` Configuration Directory

When you first run Gemini CLI, it creates a configuration directory at `~/.gemini/` (in your home folder). This directory contains all your settings, authentication tokens, and customizations.

Let's explore what's in there:

```bash
ls -la ~/.gemini/
```

You should see files like:

- `config.json` or `settings.json` - Main configuration
- `.env` - Environment variables
- `history` - Conversation history
- `extensions/` - Installed MCP servers and extensions

## Configuration with `settings.json`

The `settings.json` file is where you define how Gemini CLI behaves. Here's what you can configure:

### Example Configuration

```json
{
  "model": "gemini-2.5-pro",
  "theme": "dark",
  "outputFormat": "markdown",
  "defaultContext": "default",
  "sandbox": false,
  "codeExecution": {
    "enabled": true,
    "languages": ["python", "javascript", "bash"]
  },
  "tools": {
    "fileSystem": { "enabled": true, "maxSize": "100mb" },
    "shell": { "enabled": true, "restrictedCommands": ["rm -rf /", "sudo"] },
    "search": { "enabled": true }
  }
}
```

### Key Configuration Options

**Model Selection**

```json
"model": "gemini-2.5-pro"
```

Available models:

- `gemini-2.5-pro` - Latest high-performance model
- `gemini-2.0-flash` - Fast, efficient model
- `gemini-1.5-pro` - Previous generation

**Theme**

```json
"theme": "dark"
```

Options: `dark`, `light`, or a custom theme name

**Output Format**

```json
"outputFormat": "markdown"
```

Options: `markdown`, `text`, `html`, `json`

**Sandbox Mode**

```json
"sandbox": false
```

When `true`, isolates AI operations to prevent dangerous file or shell operations

## Environment Variables with `.env`

The `.env` file stores sensitive information and environment-specific settings:

```bash
# .env file
GEMINI_API_KEY=your-api-key-here
GEMINI_MODEL=gemini-2.5-pro
GEMINI_MAX_TOKENS=8000
GEMINI_TEMPERATURE=0.7
GEMINI_TOP_P=0.95
```

### Key Environment Variables

```bash
# Authentication
GEMINI_API_KEY=your-key         # Gemini API key
GOOGLE_APPLICATION_CREDENTIALS  # Path to GCP service account JSON

# Model Parameters
GEMINI_MODEL=gemini-2.5-pro    # Which model to use
GEMINI_MAX_TOKENS=8000         # Max response length
GEMINI_TEMPERATURE=0.7          # Creativity (0-1, higher = more creative)
GEMINI_TOP_P=0.95              # Diversity (0-1)
GEMINI_TOP_K=40                # Top K tokens to consider

# Behavior
GEMINI_SANDBOX=false            # Enable/disable sandbox
GEMINI_VERBOSE=true             # Show detailed output
GEMINI_CONTEXT_SIZE=50000       # Context window size
```

## Creating Custom Commands (Slash Commands)

Gemini CLI supports custom slash commands. Create them in `~/.gemini/commands/`:

### Example: Custom Summarize Command

Create `~/.gemini/commands/summarize.json`:

```json
{
  "name": "summarize",
  "description": "Summarize text concisely",
  "prompt": "Summarize the following text in 2-3 sentences:\n\n{input}"
}
```

Now use it:

```
/summarize The quick brown fox jumped over the lazy dog...
```

### Example: Custom Code Review Command

Create `~/.gemini/commands/review.json`:

```json
{
  "name": "review",
  "description": "Review code for issues",
  "prompt": "Review the following code for bugs, performance issues, and best practices. Provide specific recommendations:\n\n{input}"
}
```

Use it:

```
/review
[paste your code here]
```

## System Prompts and Instructions

Set default instructions for every conversation:

### Create `~/.gemini/instructions.md`:

```markdown
# System Instructions for Gemini CLI

## You are a helpful coding assistant.

### Guidelines:

- Always provide working code examples
- Explain concepts clearly
- Suggest best practices
- Ask clarifying questions when needed

### Constraints:

- Don't suggest using deprecated libraries
- Always recommend security best practices
- Test code before suggesting it
```

Gemini CLI will use these as baseline instructions for all conversations.

## Managing Multiple Contexts

Separate your work by creating multiple contexts for different projects:

```bash
# List all contexts
/context list

# Create a new context for a project
/context create my-project

# Switch to a context
/context switch my-project

# View current context
/context info
```

Each context maintains its own conversation history and can have different settings.

## Advanced: Programmatic Configuration

You can also configure Gemini CLI programmatically. For example, set a project-specific config:

Create `GEMINI.md` in your project root:

```markdown
# Project Configuration for Gemini CLI

## Model Settings

- Model: gemini-2.5-pro
- Max Tokens: 4000
- Temperature: 0.5

## Project Context

This is a Flask web application project. Consider:

- Python best practices
- Flask framework patterns
- Database migration strategies

## Relevant Files

- app.py - Main Flask application
- requirements.txt - Python dependencies
- config.py - Configuration settings
```

When you launch Gemini CLI from this project:

```bash
gemini
```

It automatically loads the `GEMINI.md` file as context!

## Best Practices for Configuration

1. **Use `.env` for secrets** - Never commit API keys to version control
2. **Create project-specific contexts** - Keep work organized
3. **Set appropriate sandbox settings** - Balance flexibility with safety
4. **Version your configurations** - Commit `settings.json` to git (without secrets)
5. **Document custom commands** - Help your team understand available commands

## Troubleshooting Configuration

**Check current configuration:**

```bash
/config show
```

**Reset to defaults:**

```bash
/config reset
```

**View which config file is being used:**

```
/config path
```

## Part 4 Preview

In **Part 4**, we'll dive deeper into the built-in tools available and show you how to use each one effectively with real-world examples.

In **Part 5**, we'll explore MCP (Model Context Protocol) servers to dramatically expand Gemini CLI's capabilities with integrations like GitHub, Firebase, and Google Workspace.

## Resources

- [Gemini CLI Configuration Docs](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/configuration.md)
- [Official Tutorial Series - Part 3](https://medium.com/google-cloud/gemini-cli-tutorial-series-part-3-configuration-settings-via-settings-json-and-env-files-669c6ab6fd44)
- [GitHub Repository](https://github.com/google-gemini/gemini-cli)
