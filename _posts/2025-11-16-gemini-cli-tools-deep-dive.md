---
layout: post
title: "Gemini CLI: A Deep Dive into the Tools Command"
description: "Explore the tools command in Gemini CLI, learn to list, use, and create custom tools for extending functionality."
tags: ["gemini", "cli", "tools", "ai", "automation", "extensions"]
excerpt: >
  Dive deep into the tools command of Gemini CLI. Learn how to list available tools, install extensions, create custom tools, and build powerful workflows.
author: "owner"
date: 2025-11-16 10:00:00 +0000
---

Welcome to **Part 2** of the Gemini CLI tutorial series. In the [previous post](/posts/gemini-cli-getting-started/), we covered installation, authentication, and your first interactive session.

**In this post, we explore THE POWER CENTER of Gemini CLI—where the real magic happens.**

In this post, we'll explore the **`/tools` command** in depth—the real power center of Gemini CLI. This is where you discover what capabilities the AI can access to interact with your environment.

## The Real Power: What Makes Gemini CLI Special

Most AI chatbots can only talk. Gemini CLI can **act**. With tools, the AI becomes your development partner that can:

- **Create entire projects** from a single description
- **Modify your code** across multiple files
- **Run commands** on your computer
- **Deploy applications** to servers
- **Generate documentation** automatically
- **Write and run tests** without manual setup

And here's the key: **You control every action.** The AI proposes, explains, and waits for your approval before executing anything.

## Understanding Tools in Gemini CLI

Tools are built-in capabilities that allow Gemini CLI to:

- **Execute shell commands** on your system
- **Read and write files** in your project
- **Search the internet** with Google Search
- **Run custom scripts and applications**
- **Interact with external APIs and services**

**Important:** Before any tool is executed, Gemini CLI will ask for your permission. The AI won't perform any actions without your explicit approval—you maintain full control.

## Listing All Available Tools

To see what tools are available in your Gemini CLI installation, simply run:

```
/tools
```

This displays all the built-in tools you can use. These may include:

- **FileSystem tools** - Read, write, and modify files
- **Shell/Command tools** - Execute system commands
- **GoogleSearch** - Internet search capability
- **Code Execution tools** - Run Python, JavaScript, etc.
- And more depending on your Gemini CLI version

## Using Tools Interactively

When you ask Gemini CLI to do something that requires a tool, it will:

1. **Identify** which tool(s) are needed
2. **Propose** the action it wants to take
3. **Request** your permission to execute

### Example: Creating and Running Code

Let's ask Gemini CLI to create a Python script:

```
Create a Python script that displays "Hello, Gemini!" and save it as hello.py
```

The AI might respond:

- "I'll create a Python file for you"
- Show the code it plans to write
- Ask for permission to use the WriteFile tool

You can then:

- **Allow** - Execute this operation
- **Allow Always** - Execute without asking again
- **Deny** - Skip this operation

### Example: Running Shell Commands

Try asking:

```
What's the current directory structure? Show me the output of ls -la
```

Gemini CLI will:

- Plan to use the shell command tool
- Show you the command it wants to run
- Ask for permission
- Execute and show you the results

## The Shell Mode (Passthrough Commands)

Within Gemini CLI, you can run raw shell commands by typing `!`:

```
! pwd              # Show current directory
! ls -la           # List files
! git status       # Check git status
! npm list         # Show installed packages
```

Press `ESC` to return to Gemini mode.

## Real-World Example: Using GoogleSearch Tool

Ask Gemini CLI:

```
What are the latest developments in AI? Search for recent news and summarize the top 3 results.
```

Gemini CLI will:

- Use the GoogleSearch tool to find recent AI news
- Compile the results
- Provide you with a summary

## Building Projects with Tools

Here's where tools become incredibly powerful. Let's build a simple Flask web application:

```
Create a Python Flask application that displays current weather for multiple cities using the OpenWeatherMap API. Include a search form to add new cities and display temperature, humidity, and weather description.
```

When you make this request, Gemini CLI will:

1. **Plan the directory structure** - Create folders for your project
2. **Create the Flask app** (`app.py`) - Write Python code
3. **Create templates** (`templates/index.html`) - Write HTML
4. **Identify dependencies** - Recognize Flask, requests are needed
5. **Install packages** - Ask permission to run `pip install`
6. **Set up virtual environment** - Create and configure Python venv
7. **Run the application** - Start your Flask server

**All with your permission at each step.**

The generated app.py might look like:

```python
import flask
import requests
import os

app = flask.Flask(__name__)
API_KEY = os.environ.get('OPENWEATHER_API_KEY')

def get_weather(city):
    """Fetches weather data for a given city from OpenWeatherMap API."""
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        'q': city,
        'appid': API_KEY,
        'units': 'metric'
    }
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching weather data: {e}")
        return None

@app.route('/')
def index():
    """Renders the index page with weather data."""
    cities = flask.request.args.getlist('cities')
    if not cities:
        cities = ['New York', 'London', 'Tokyo']

    weather_data = []
    for city in cities:
        data = get_weather(city)
        if data:
            weather_data.append(data)

    return flask.render_template('index.html', weather_data=weather_data, cities=cities)

if __name__ == '__main__':
    app.run(debug=True, port=7000)
```

And the HTML template:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weather Dashboard</title>
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
    />
  </head>
  <body>
    <div class="container">
      <h1 class="mt-5">Weather Dashboard</h1>

      <form method="get" class="mb-4">
        <div class="form-group">
          <input
            type="text"
            name="cities"
            placeholder="Add city (e.g., Paris, Sydney)"
            class="form-control"
          />
          <button type="submit" class="btn btn-primary mt-2">Add City</button>
        </div>
      </form>

      <div class="row mt-3">
        {% for weather in weather_data %}
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">
                {{ weather.name }}, {{ weather.sys.country }}
              </h5>
              <p class="card-text">
                <strong>Temperature:</strong> {{ weather.main.temp }}°C<br />
                <strong>Humidity:</strong> {{ weather.main.humidity }}%<br />
                <strong>Condition:</strong> {{ weather.weather[0].main }}<br />
                <strong>Description:</strong> {{ weather.weather[0].description
                }}
              </p>
            </div>
          </div>
        </div>
        {% endfor %}
      </div>
    </div>
  </body>
</html>
```

Once running, you'd access it at `http://127.0.0.1:7000`

## Tips for Working with Tools

1. **Be specific in your requests** - Provide context and details
2. **Review proposed actions** - Check what the AI plans to do before approving
3. **Iterate and refine** - If the output isn't quite right, ask the AI to modify
4. **Use shell mode to verify** - Use `!` commands to check file contents or system state
5. **Provide feedback** - If a tool execution has issues, explain what went wrong

## Tool Execution Patterns

### Pattern 1: Create and Test

```
1. Ask Gemini CLI to create code/files
2. Review and approve each step
3. Use shell mode to verify results
```

### Pattern 2: Debug and Fix

```
1. Show Gemini CLI an error message
2. Let it analyze and propose fixes
3. Approve the corrected code
```

### Pattern 3: Automate Workflow

```
1. Describe your workflow to Gemini CLI
2. Let it use multiple tools in sequence
3. Approve each tool invocation
```

## What's Next

In **Part 3**, we'll explore configuration files (`settings.json` and `.env`) to customize Gemini CLI's behavior and set up custom rules.

In **Part 4**, we'll examine all built-in tools in greater detail.

In **Part 5**, we'll integrate MCP (Model Context Protocol) servers to dramatically expand capabilities.

## Resources

- [Gemini CLI Tools Documentation](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/commands.md)
- [Official Tutorial Series - Part 2](https://medium.com/google-cloud/gemini-cli-tutorial-series-part-2-gemini-cli-command-line-parameters-e64e21b157be)
- [Part 4: Built-in Tools](https://medium.com/google-cloud/gemini-cli-tutorial-series-part-4-built-in-tools-c591befa59ba)
- [GitHub Repository](https://github.com/google-gemini/gemini-cli)
