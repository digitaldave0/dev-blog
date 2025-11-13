---
title: "The Ultimate Guide to the Gemini CLI: Advanced Customization"
date: 2025-11-17
---

Welcome to the third post in our "Ultimate Guide to the Gemini CLI" series. In the [previous post](/2025-11-16-gemini-cli-tools-deep-dive), we took a deep dive into the `tools` command. In this post, we'll explore some advanced customization techniques that will take your Gemini CLI experience to the next level.

We'll cover:

*   The `~/.gemini/` directory and its configuration files.
*   Creating your own custom tool commands.
*   Building a library of your own instructions and prompts.

## The `~/.gemini/` Directory: Your Configuration Hub

The `~/.gemini/` directory is the heart of your Gemini CLI configuration. It's where the CLI stores its settings, context, and extensions. Let's take a look at some of the key files and directories you'll find here.

### `config.toml`: The Main Configuration File

This file contains the main configuration for the Gemini CLI. You can use it to customize various aspects of the CLI's behavior, such as the default model, output format, and more.

Here's an example of what a `config.toml` file might look like:

```toml
# The default model to use for generation
default_model = "gemini-pro"

# The default output format for commands
output_format = "text"
```

### `context.json`: Storing Your Conversation History

The `context.json` file is where the Gemini CLI stores your conversation history. This allows you to maintain context between commands and have more natural, multi-turn conversations with the model.

You can also create and manage multiple contexts, which is useful for separating different projects or tasks.

### The `extensions` Directory: Adding New Tools

The `extensions` directory is where the Gemini CLI stores installed tool extensions. When you run `gemini extensions install`, the extension's files are downloaded and placed in this directory.

## Creating Custom Tool Commands

One of the most powerful features of the Gemini CLI is the ability to create your own custom tool commands. This allows you to integrate the CLI with your own scripts and workflows, effectively extending its functionality to do almost anything you can imagine.

### The `commands` Directory: Your Custom Tool Hub

To create custom tools, you'll need to create a `commands` or `tools` directory. The Gemini CLI will automatically discover and register any executable files in this directory as custom tools.

You can create this directory anywhere on your system and then tell the Gemini CLI where to find it by setting the `GEMINI_TOOLS_PATH` environment variable. For simplicity, you can create it inside your `~/.gemini/` directory:

```bash
mkdir ~/.gemini/commands
```

### Creating a Simple Custom Tool

Let's create a simple "hello world" tool.

1.  **Create a script:**

    Create a file named `hello` in your `~/.gemini/commands` directory:

    ```bash
    #!/bin/bash
    echo "Hello from my custom tool!"
    ```

2.  **Make it executable:**

    ```bash
    chmod +x ~/.gemini/commands/hello
    ```

Now, you can run your custom tool from the Gemini CLI:

```bash
gemini tools hello
```

And you'll see the output:

```
Hello from my custom tool!
```

### A More Advanced Example: A Tool with Arguments

Let's create a tool that takes an argument.

1.  **Create a script:**

    Create a file named `greet` in your `~/.gemini/commands` directory:

    ```bash
    #!/bin/bash
    echo "Hello, $1!"
    ```

2.  **Make it executable:**

    ```bash
    chmod +x ~/.gemini/commands/greet
    ```

Now you can use your `greet` tool with an argument:

```bash
gemini tools greet "World"
```

The output will be:

```
Hello, World!
```

## Building a Library of Your Own Instructions

As you use the Gemini CLI more and more, you'll likely find yourself using the same prompts and instructions over and over again. To save time and effort, you can create a library of your own custom instructions.

### The `prompts` Directory: Your Instruction Library

You can create a `prompts` directory inside your `~/.gemini/` directory to store your custom prompts. Each prompt can be a simple text file.

```bash
mkdir ~/.gemini/prompts
```

### Creating a Custom Prompt

Let's create a prompt for summarizing text.

Create a file named `summarize.txt` in your `~/.gemini/prompts` directory with the following content:

```
Summarize the following text in a few sentences:
```

### Using Your Custom Prompt

Now, you can use your custom prompt with the `generate` command by referencing the file:

```bash
gemini generate --prompt ~/.gemini/prompts/summarize.txt "Your long text here..."
```

This will insert the content of your `summarize.txt` file into the prompt, saving you from having to type it out every time.

## Next Steps

In the next post in this series, we'll explore how to integrate the Gemini CLI with your development workflow. We'll look at how to use the Gemini CLI with Git, shell scripts, and other development tools.

Stay tuned!
