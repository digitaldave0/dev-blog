---
layout: post
title: "Tmux: A Journey from Beginner to Advanced User"
categories: [Terminal, Tools, Tutorial]
description: "Embark on a comprehensive journey through tmux, from basic terminal multiplexing to advanced productivity techniques."
excerpt: "Master tmux with this step-by-step guide that takes you from novice to power user, covering sessions, windows, panes, and customization."
---

# Tmux: A Journey from Beginner to Advanced User

Welcome to your tmux journey! Whether you're tired of losing work when your terminal closes or want to boost your productivity with multiple terminal sessions, tmux is your gateway to a more powerful command-line experience. This guide will take you from complete beginner to advanced user, building your skills step by step.

## What is Tmux?

Tmux (Terminal Multiplexer) is a tool that allows you to:
- Run multiple terminal sessions within a single window
- Detach from sessions and reattach later (even after rebooting)
- Split your terminal into multiple panes
- Create multiple windows within a session
- Customize your terminal workflow extensively

Think of it as a window manager for your terminal.

## Level 1: Installation and First Steps

### Installing Tmux

On macOS (assuming you're using Homebrew):

```bash
brew install tmux
```

On Ubuntu/Debian:

```bash
sudo apt update && sudo apt install tmux
```

Verify installation:

```bash
tmux -V
```

### Your First Tmux Session

Start tmux:

```bash
tmux
```

You'll see a green bar at the bottom - that's the tmux status bar. You're now in a tmux session!

To exit, type:

```bash
exit
```

Or use the tmux command: `Ctrl-b d` (we'll explain this soon).

## Level 2: Understanding the Basics

Tmux has three main concepts:
- **Sessions**: A collection of windows
- **Windows**: Like tabs in a browser
- **Panes**: Splits within a window

The default prefix key is `Ctrl-b`. All tmux commands start with this.

### Basic Commands

- `Ctrl-b ?` - Show help (press `q` to exit)
- `Ctrl-b d` - Detach from session
- `Ctrl-b :` - Enter command mode

Try this: Start tmux, run `ls`, then detach with `Ctrl-b d`. Your command is still running!

Reattach with:

```bash
tmux attach
```

## Level 3: Working with Windows

Windows are like browser tabs. Create your first window:

```bash
tmux
```

Now create a new window:

```bash
Ctrl-b c
```

Switch between windows:

```bash
Ctrl-b n  # next window
Ctrl-b p  # previous window
Ctrl-b 0  # window 0
Ctrl-b 1  # window 1
```

Rename a window:

```bash
Ctrl-b ,
```

List windows:

```bash
Ctrl-b w
```

## Level 4: Mastering Panes

Panes let you split your terminal. This is where tmux shines!

Start tmux and split vertically:

```bash
Ctrl-b %
```

Split horizontally:

```bash
Ctrl-b "
```

Navigate between panes:

```bash
Ctrl-b ←/→/↑/↓  # arrow keys
```

Or:

```bash
Ctrl-b h/j/k/l  # vim-style navigation
```

Resize panes:

```bash
Ctrl-b :resize-pane -R 10  # resize right by 10
Ctrl-b :resize-pane -L 10  # resize left by 10
Ctrl-b :resize-pane -U 10  # resize up by 10
Ctrl-b :resize-pane -D 10  # resize down by 10
```

Close a pane:

```bash
Ctrl-b x
```

## Level 5: Session Management

Sessions are the top-level container. Create named sessions:

```bash
tmux new -s mysession
```

Detach: `Ctrl-b d`

List sessions:

```bash
tmux ls
```

Attach to a specific session:

```bash
tmux attach -t mysession
```

Kill a session:

```bash
tmux kill-session -t mysession
```

Rename session:

```bash
Ctrl-b $
```

## Level 6: Copy Mode and Scrolling

Tmux has its own copy mode for scrolling and copying text.

Enter copy mode:

```bash
Ctrl-b [
```

Navigate with arrow keys or vim keys (h,j,k,l).

To copy:
1. Navigate to start
2. Press `Space` to start selection
3. Navigate to end
4. Press `Enter` to copy

Paste:

```bash
Ctrl-b ]
```

Exit copy mode: `q` or `Esc`

## Level 7: Customization - Making Tmux Your Own

Create a config file:

```bash
touch ~/.tmux.conf
```

### Basic Customizations

Change prefix to `Ctrl-a` (screen style):

```bash
# In ~/.tmux.conf
unbind C-b
set -g prefix C-a
bind C-a send-prefix
```

Better colors and status bar:

```bash
# Enable 256 colors
set -g default-terminal "screen-256color"

# Status bar
set -g status-bg black
set -g status-fg white
set -g status-left '#[fg=green]#S '
```

Reload config:

```bash
tmux source ~/.tmux.conf
```

### Useful Keybindings

Vim-style pane navigation:

```bash
# Smart pane switching with awareness of Vim splits
bind -n C-h run "(tmux display-message -p '#{pane_current_command}' | grep -iq vim && tmux send-keys C-h) || tmux select-pane -L"
bind -n C-j run "(tmux display-message -p '#{pane_current_command}' | grep -iq vim && tmux send-keys C-j) || tmux select-pane -D"
bind -n C-k run "(tmux display-message -p '#{pane_current_command}' | grep -iq vim && tmux send-keys C-k) || tmux select-pane -U"
bind -n C-l run "(tmux display-message -p '#{pane_current_command}' | grep -iq vim && tmux send-keys C-l) || tmux select-pane -R"
```

Mouse support:

```bash
set -g mouse on
```

## Level 8: Advanced Techniques

### Window and Pane Layouts

Save and restore layouts:

```bash
Ctrl-b :select-layout even-horizontal
Ctrl-b :select-layout even-vertical
Ctrl-b :select-layout main-vertical
```

### Scripting Tmux

Create a development environment script:

```bash
#!/bin/bash
# dev-setup.sh

# Create new session
tmux new-session -d -s dev

# Create windows
tmux new-window -t dev:1 -n 'editor'
tmux new-window -t dev:2 -n 'server'
tmux new-window -t dev:3 -n 'logs'

# Split panes in editor window
tmux select-window -t dev:1
tmux split-window -h
tmux select-pane -t 0
tmux send-keys 'vim' C-m

# Start server in server window
tmux select-window -t dev:2
tmux send-keys 'cd /path/to/project && npm start' C-m

# Attach to session
tmux attach -t dev
```

### Tmux Plugins

Install Tmux Plugin Manager (TPM):

```bash
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

Add to ~/.tmux.conf:

```bash
# List of plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'tmux-plugins/tmux-resurrect'  # Save sessions across reboots

# Initialize TMUX plugin manager
run '~/.tmux/plugins/tpm/tpm'
```

Install plugins: `Ctrl-b I`

## Level 9: Power User Tips

### Nested Tmux Sessions

When you need tmux inside tmux:

```bash
# In inner tmux, use Ctrl-b twice
Ctrl-b Ctrl-b <command>
```

### Pair Programming

Share sessions with others:

```bash
# Start session
tmux new -s pair

# Others join
tmux attach -t pair
```

### Integration with Other Tools

Tmux + Vim:

```bash
# In vim, run commands in tmux panes
:terminal  # Open terminal in vim
:!tmux send-keys -t <pane> '<command>' C-m
```

Tmux + SSH:

```bash
# SSH with tmux
ssh user@host -t tmux attach
```

## Conclusion

You've completed your tmux journey! From basic session management to advanced scripting and plugins, you now have the tools to supercharge your terminal workflow.

### Quick Reference

| Command | Description |
|---------|-------------|
| `tmux` | Start new session |
| `Ctrl-b d` | Detach |
| `tmux attach` | Reattach |
| `Ctrl-b c` | New window |
| `Ctrl-b %` | Vertical split |
| `Ctrl-b "` | Horizontal split |
| `Ctrl-b ?` | Help |

### Next Steps

- Experiment with different layouts
- Set up your ideal development environment
- Explore more plugins at [tmux-plugins](https://github.com/tmux-plugins)
- Read the official [tmux manual](https://man.openbsd.org/OpenBSD-current/man1/tmux.1)

Remember, mastery comes with practice. Start using tmux daily, and you'll wonder how you ever lived without it!

Happy multiplexing! 🚀