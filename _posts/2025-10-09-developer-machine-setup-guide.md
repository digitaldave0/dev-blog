---
layout: post
title: "Secure Developer Machine Setup Guide: Complete Environment with Security Best Practices"
description: "Comprehensive guide to setting up a secure development machine with Git SSH, Bash aliases, Terraform, AWS CLI, VS Code configuration, and package management across macOS, Windows WSL, and Ubuntu LTS. Includes security-first approach with authentication, access control, and ongoing security maintenance."
tags: [devops, setup, git, bash, terraform, aws, cli, vscode, development, security, cybersecurity, devsecops]
icon: �️
excerpt: >
  Set up a secure development environment from the ground up! This comprehensive guide covers Git with SSH keys, Bash configuration, Terraform and AWS CLI setup, VS Code security configuration, and package management across macOS, Windows WSL, and Ubuntu LTS. Includes security-first practices, credential management, vulnerability scanning, and ongoing security maintenance to protect your development environment and production systems.
---

Setting up a new development machine can be overwhelming, but having the right tools configured properly makes all the difference in productivity. This guide will walk you through setting up a complete development environment optimized for DevOps, cloud development, and infrastructure automation.

**Security First Approach**: This guide emphasizes security best practices throughout the setup process. Every tool and configuration choice includes security considerations to protect your development environment, code, and cloud resources.

Whether you're on macOS, Windows with WSL, or Ubuntu LTS, this guide covers everything you need to get started with Git, Bash, Terraform, and AWS CLI.

## Prerequisites

Before we begin, ensure you have:

- A fresh installation of your operating system
- Administrator/root access
- Internet connection
- Basic command-line familiarity

## Security Foundations

### Why Security Matters in Development

Your development environment is the gateway to production systems. A compromised development machine can lead to:
- **Data breaches** through exposed credentials
- **Malware infection** of production systems
- **Unauthorized access** to cloud resources
- **Code injection** vulnerabilities in deployed applications

**Security Principle**: "Secure the development environment to secure production."

### Core Security Practices

1. **Least Privilege**: Use minimal required permissions
2. **Defense in Depth**: Multiple security layers
3. **Zero Trust**: Verify everything, trust nothing
4. **Secure Defaults**: Start with security enabled
5. **Regular Updates**: Patch known vulnerabilities
6. **Credential Management**: Never store secrets in code

### Security Tools We'll Configure

- **SSH Keys**: Secure authentication without passwords
- **GPG**: Code signing and commit verification
- **AWS IAM**: Least privilege access management
- **VS Code Security**: Secure coding practices
- **Firewall Rules**: Network access control
- **Backup Encryption**: Protect sensitive data

## 1. System Updates and Package Managers

### macOS

```bash
# Update macOS
sudo softwareupdate -i -a

# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Update Homebrew
brew update
```

### Windows WSL (Ubuntu)

```bash
# Update Ubuntu packages
sudo apt update && sudo apt upgrade -y

# Install essential build tools
sudo apt install -y build-essential curl wget git unzip
```

### Ubuntu LTS

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y build-essential curl wget git unzip software-properties-common
```

#### Security Considerations for System Updates

**Why we update immediately:**
- **Patch known vulnerabilities** before they can be exploited
- **Close security gaps** in the operating system
- **Prevent malware infection** through unpatched software

**Security best practices:**
- **Enable automatic updates** where possible
- **Review changelogs** for security implications
- **Test updates** in development before production
- **Maintain backup** before major system updates

**Package manager security:**
- **Verify package signatures** (built into apt, Homebrew)
- **Use official repositories** only
- **Avoid unsigned packages** from untrusted sources
- **Regularly audit installed packages** for vulnerabilities

## 2. Git Setup with SSH

### Generate SSH Key (All Platforms)

```bash
# Generate a new SSH key pair
ssh-keygen -t ed25519 -C "your.email@example.com" -f ~/.ssh/id_ed25519 -N ""

# Start the SSH agent
eval "$(ssh-agent -s)"

# Add your SSH private key to the agent
ssh-add ~/.ssh/id_ed25519
```

### Copy Public Key to Clipboard

**macOS:**

```bash
# Copy to clipboard
pbcopy < ~/.ssh/id_ed25519.pub
```

**Windows WSL:**

```bash
# Copy to clipboard (requires xclip)
sudo apt install -y xclip
xclip -sel clip < ~/.ssh/id_ed25519.pub
```

**Ubuntu:**

```bash
# Copy to clipboard (requires xclip)
sudo apt install -y xclip
xclip -sel clip < ~/.ssh/id_ed25519.pub
```

### Configure Git

```bash
# Set your Git configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch to main
git config --global init.defaultBranch main

# Enable credential helper
git config --global credential.helper store

# Set up useful aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```

### Test SSH Connection

```bash
# Test GitHub connection
ssh -T git@github.com

# Test GitLab connection (if using GitLab)
ssh -T git@gitlab.com
```

#### Security Considerations for Git and SSH

**SSH Key Security:**
- **Use Ed25519 keys** (more secure than RSA, faster)
- **Protect private keys** with strong passphrases
- **Never share private keys** or commit them to repositories
- **Use different keys** for different services (GitHub, GitLab, servers)
- **Regularly rotate keys** (annually or when compromised)

**Why SSH over passwords:**
- **No password transmission** over network
- **Cryptographic authentication** (mathematically secure)
- **Prevents brute force attacks**
- **Supports certificate authorities** for enterprise

**Git Security Best Practices:**
- **Sign commits with GPG** for authenticity verification
- **Use .gitignore** to prevent credential leaks
- **Avoid storing secrets** in Git history
- **Regular security audits** of repositories
- **Enable branch protection** rules in organizations

**Credential Management:**
- **Never store passwords** in Git config
- **Use SSH agents** with proper timeouts
- **Implement credential helpers** securely
- **Regular credential rotation**

## 3. Bash Configuration with Aliases and Completion

### Create Bash Profile (All Platforms)

```bash
# Create or edit .bashrc
touch ~/.bashrc
```

Add the following to your `~/.bashrc`:

```bash
# Enable bash completion
if [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
fi

# Set history settings
export HISTSIZE=10000
export HISTFILESIZE=20000
export HISTCONTROL=ignoredups:ignorespace
shopt -s histappend

# Set editor
export EDITOR=nano
export VISUAL=nano

# Set PATH
export PATH="$HOME/bin:$HOME/.local/bin:$PATH"

# Custom aliases
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias ls='ls --color=auto'
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'
alias gd='git diff'
alias gb='git branch'

# Terraform aliases
alias tf='terraform'
alias tfi='terraform init'
alias tfp='terraform plan'
alias tfa='terraform apply'
alias tfd='terraform destroy'

# AWS aliases
alias aws-whoami='aws sts get-caller-identity'

# Navigation aliases
alias dev='cd ~/dev'
alias docs='cd ~/Documents'
alias dl='cd ~/Downloads'

# Utility functions
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# Set prompt
PS1='\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '

# Load additional configurations
if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi
```

### Platform-Specific Bash Setup

**macOS:**

```bash
# Add to ~/.bash_profile
echo 'if [ -f ~/.bashrc ]; then . ~/.bashrc; fi' >> ~/.bash_profile

# Install bash-completion
brew install bash-completion

# Add to ~/.bashrc
echo '[ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion' >> ~/.bashrc
```

**Windows WSL:**

```bash
# Install bash-completion
sudo apt install -y bash-completion

# Source bashrc in bash_profile
echo 'if [ -f ~/.bashrc ]; then . ~/.bashrc; fi' >> ~/.bash_profile
```

**Ubuntu:**

```bash
# Install bash-completion (usually pre-installed)
sudo apt install -y bash-completion

# Ensure completion is loaded
echo '. /etc/bash_completion' >> ~/.bashrc
```

#### Security Considerations for Bash Configuration

**Shell Security Best Practices:**
- **Limit command history** to prevent credential leaks
- **Use secure PATH** settings (avoid world-writable directories)
- **Implement session timeouts** for idle terminals
- **Avoid storing secrets** in environment variables
- **Use strong aliases** that don't expose sensitive information

**Why secure shell configuration:**
- **Command history attacks**: Malicious actors can extract credentials from bash_history
- **PATH hijacking**: Attackers can place malicious binaries in PATH
- **Environment variable exposure**: Secrets in env vars can be leaked
- **Session hijacking**: Idle sessions can be taken over

**Security-focused aliases and functions:**
- **Audit commands**: Log sensitive operations
- **Safe file operations**: Prevent accidental overwrites
- **Credential validation**: Check for exposed secrets
- **Network security**: Use secure connection defaults

**History security:**
- **Exclude sensitive commands** from history
- **Encrypt history files** when possible
- **Regular history cleanup** of old entries
- **Monitor history access** for suspicious activity

## 4. Terraform Installation and Setup

### macOS

```bash
# Install Terraform using Homebrew
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Verify installation
terraform version
```

### Windows WSL

```bash
# Download and install Terraform
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com jammy main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# Verify installation
terraform version
```

### Ubuntu LTS

```bash
# Add HashiCorp repository
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# Verify installation
terraform version
```

### Terraform Configuration

```bash
# Create Terraform directory
mkdir -p ~/.terraform.d

# Create CLI configuration file
cat > ~/.terraform.d/credentials.tfrc.json << EOF
{
  "credentials": {
    "app.terraform.io": {
      "token": "your-terraform-cloud-token-here"
    }
  }
}
EOF

# Set environment variables
echo 'export TF_CLI_CONFIG_FILE=~/.terraform.d/credentials.tfrc.json' >> ~/.bashrc

# Initialize terraform autocomplete
terraform -install-autocomplete
```

#### Security Considerations for Terraform

**Infrastructure as Code Security:**
- **Never commit secrets** to Terraform state or code
- **Use remote state** with proper access controls
- **Implement state locking** to prevent concurrent modifications
- **Regular state backups** with encryption

**Why secure Terraform setup:**
- **State file exposure**: Contains all infrastructure secrets
- **Provider credentials**: Can compromise cloud accounts
- **Configuration drift**: Unauthorized infrastructure changes
- **Supply chain attacks**: Malicious Terraform providers

**Terraform Cloud Security:**
- **Use Terraform Cloud** for remote execution
- **Implement workspace permissions** (least privilege)
- **Enable Sentinel policies** for governance
- **Use private registries** for modules
- **Regular token rotation** for API access

**Local Development Security:**
- **Isolated environments** for testing
- **State encryption** at rest
- **Audit logging** of all operations
- **Version pinning** for providers and modules
- **Code signing** for critical infrastructure

**Credential Management:**
- **Environment variables** over config files
- **Short-lived tokens** instead of long-term keys
- **Multi-factor authentication** for cloud accounts
- **Regular credential audits** and rotation

## 5. AWS CLI Installation and Configuration

### macOS

```bash
# Install AWS CLI v2
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Verify installation
aws --version
```

### Windows WSL

```bash
# Download and install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version
```

### Ubuntu LTS

```bash
# Download and install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version
```

### AWS CLI Configuration

```bash
# Configure AWS CLI
aws configure

# You'll be prompted for:
# AWS Access Key ID: [your-access-key]
# AWS Secret Access Key: [your-secret-key]
# Default region name: us-east-1
# Default output format: json

# Set up AWS CLI completion
echo 'complete -C aws_completer aws' >> ~/.bashrc

# Create AWS profile for different environments
aws configure --profile dev
aws configure --profile staging
aws configure --profile prod

# Set default profile
echo 'export AWS_PROFILE=dev' >> ~/.bashrc
```

#### Security Considerations for AWS CLI

**AWS Credential Security:**
- **Never store credentials** in version control
- **Use IAM roles** instead of access keys when possible
- **Implement MFA** for all AWS accounts
- **Regular credential rotation** (every 90 days)
- **Use temporary credentials** with STS

**Why secure AWS setup:**
- **Account compromise**: Attackers can access all cloud resources
- **Data breaches**: Exposed S3 buckets, databases, etc.
- **Financial loss**: Unauthorized resource usage
- **Compliance violations**: SOX, HIPAA, GDPR breaches

**AWS CLI Security Best Practices:**
- **Profile-based configuration** for different environments
- **Environment variables** over config files for CI/CD
- **AWS Vault** or similar tools for credential management
- **Regular audit** of AWS access and usage
- **Least privilege principle** for all IAM policies

**Multi-Account Strategy:**
- **Separate AWS accounts** for dev/staging/prod
- **Cross-account roles** with limited permissions
- **Account boundaries** to contain breaches
- **Centralized logging** with CloudTrail
- **Resource tagging** for cost and security tracking

**Network Security:**
- **VPC-only resources** where possible
- **Security groups** with minimal required access
- **HTTPS-only communication**
- **API Gateway** for external access control

## 6. Visual Studio Code Setup and Configuration

Visual Studio Code is the most popular code editor for DevOps and cloud development. This section covers installation, essential extensions, workspace configuration, and productivity settings.

### Installation

#### macOS

```bash
# Install VS Code using Homebrew
brew install --cask visual-studio-code

# Or download from official website
# https://code.visualstudio.com/download

# Verify installation
code --version
```

#### Windows

```powershell
# Download and install from official website
# https://code.visualstudio.com/download

# Or use Chocolatey (if installed)
choco install vscode

# Verify installation
code --version
```

#### Windows WSL

```bash
# Install VS Code on Windows, then install WSL extension
# The WSL extension allows you to use VS Code on Windows to edit files in WSL

# From Windows PowerShell/Command Prompt:
code --install-extension ms-vscode-remote.remote-wsl
```

### Essential Extensions for DevOps & Cloud Development

Install these extensions for a complete development environment:

```bash
# Core Development
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension ms-python.python
code --install-extension ms-vscode.vscode-json

# DevOps & Infrastructure as Code
code --install-extension hashicorp.terraform
code --install-extension hashicorp.hcl
code --install-extension ms-azuretools.vscode-docker
code --install-extension ms-vscode.vscode-yaml
code --install-extension redhat.vscode-yaml
code --install-extension ms-kubernetes-tools.vscode-kubernetes-tools

# Cloud Providers
code --install-extension amazonwebservices.aws-toolkit-vscode
code --install-extension ms-azuretools.vscode-azurefunctions
code --install-extension googlecloudtools.cloudcode

# Git & Version Control
code --install-extension eamodio.gitlens
code --install-extension github.copilot
code --install-extension github.copilot-chat
code --install-extension github.vscode-pull-request-github

# Terminal & Shell
code --install-extension ms-vscode.vscode-terminal-here
code --install-extension tyriar.shell-launcher

# Productivity & UI
code --install-extension ms-vscode.vscode-icons
code --install-extension pkief.material-icon-theme
code --install-extension dracula-theme.theme-dracula
code --install-extension github.github-vscode-theme

# Code Quality & Linting
code --install-extension ms-vscode.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-python.black-formatter
code --install-extension hashicorp.terraform-ls

# Documentation & Markdown
code --install-extension yzhang.markdown-all-in-one
code --install-extension davidanson.vscode-markdownlint

# Remote Development
code --install-extension ms-vscode-remote.remote-ssh
code --install-extension ms-vscode-remote.remote-containers
code --install-extension ms-vscode-remote.remote-wsl
```

### VS Code Settings Configuration

Create comprehensive settings for optimal DevOps development:

#### User Settings (settings.json)

**macOS:** `Cmd + Shift + P` → "Preferences: Open User Settings (JSON)"
**Windows:** `Ctrl + Shift + P` → "Preferences: Open User Settings (JSON)"

```json
{
  // Editor Configuration
  "editor.fontSize": 14,
  "editor.fontFamily": "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
  "editor.fontLigatures": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": true,
  "editor.trimAutoWhitespace": true,
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.minimap.enabled": true,
  "editor.renderWhitespace": "boundary",
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  "editor.suggestSelection": "first",

  // Terminal Configuration
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.fontFamily": "'JetBrains Mono', 'Fira Code', monospace",
  "terminal.integrated.shell.osx": "/bin/zsh",
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
  "terminal.integrated.shell.linux": "/bin/bash",
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.defaultProfile.linux": "bash",

  // File Associations
  "files.associations": {
    "*.tf": "terraform",
    "*.tfvars": "terraform",
    "*.hcl": "hcl",
    "Dockerfile*": "dockerfile",
    "*.yml": "yaml",
    "*.yaml": "yaml"
  },

  // Exclude Files
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/.terraform": true,
    "**/*.tfstate*": true,
    "**/.aws": true
  },

  // Search Configuration
  "search.exclude": {
    "**/node_modules": true,
    "**/.terraform": true,
    "**/*.tfstate*": true,
    "**/dist": true,
    "**/build": true
  },

  // Git Configuration
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "git.autofetch": true,
  "gitlens.showWelcomeOnInstall": false,
  "gitlens.showWhatsNewAfterUpgrades": false,

  // Terraform Configuration
  "terraform.languageServer.enable": true,
  "terraform.languageServer.args": ["serve"],
  "terraform.experimentalFeatures.validateOnSave": true,

  // Python Configuration
  "python.defaultInterpreterPath": "python3",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "python.formatting.blackArgs": ["--line-length", "88"],

  // Docker Configuration
  "docker.showStartPage": false,

  // AWS Configuration
  "aws.profile": "dev",
  "aws.telemetry": false,

  // Theme and Appearance
  "workbench.iconTheme": "material-icon-theme",
  "workbench.colorTheme": "GitHub Dark",
  "workbench.preferredDarkColorTheme": "GitHub Dark",
  "workbench.preferredLightColorTheme": "GitHub Light",

  // Window Configuration
  "window.zoomLevel": 0,
  "window.restoreWindows": "all",

  // Workspace Configuration
  "workbench.editor.enablePreview": false,
  "workbench.editor.showTabs": "multiple",
  "workbench.editor.tabCloseButton": "left",

  // Extensions Configuration
  "extensions.ignoreRecommendations": false,
  "extensions.showRecommendationsOnlyOnDemand": false,

  // Telemetry (optional)
  "telemetry.telemetryLevel": "off",

  // Security
  "security.workspace.trust.enabled": true,
  "security.workspace.trust.banner": "always"
}
```

### Workspace-Specific Configuration

Create `.vscode` directory in your project root with these files:

#### .vscode/settings.json (Project-specific overrides)

```json
{
  // Project-specific settings
  "terraform.workspace.root": "${workspaceFolder}",
  "python.pythonPath": "./venv/bin/python",
  "python.linting.pylintArgs": ["--rcfile=.pylintrc"],

  // Environment-specific configurations
  "aws.profile": "${workspaceFolderBasename}",

  // Task configurations
  "task.allowAutomaticTasks": "on",

  // Testing configurations
  "python.testing.pytestArgs": ["tests"]
}
```

#### .vscode/tasks.json (Build and automation tasks)

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Terraform: Init",
      "type": "shell",
      "command": "terraform",
      "args": ["init"],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": "$tsc"
    },
    {
      "label": "Terraform: Validate",
      "type": "shell",
      "command": "terraform",
      "args": ["validate"],
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Terraform: Plan",
      "type": "shell",
      "command": "terraform",
      "args": ["plan"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "AWS: Configure Profile",
      "type": "shell",
      "command": "aws",
      "args": ["configure", "sso"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Python: Create Virtual Environment",
      "type": "shell",
      "command": "python3",
      "args": ["-m", "venv", "venv"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

#### .vscode/launch.json (Debug configurations)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Current File",
      "type": "python",
      "request": "launch",
      "program": "${file}",
      "console": "integratedTerminal",
      "justMyCode": true
    },
    {
      "name": "Python: Django",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/manage.py",
      "args": ["runserver"],
      "django": true,
      "console": "integratedTerminal"
    },
    {
      "name": "Terraform: Debug",
      "type": "terraform",
      "request": "launch",
      "name": "Debug Terraform",
      "stopOnEntry": true,
      "showDevDebugOutput": true
    }
  ]
}
```

#### .vscode/extensions.json (Recommended extensions for the project)

```json
{
  "recommendations": [
    "hashicorp.terraform",
    "ms-python.python",
    "amazonwebservices.aws-toolkit-vscode",
    "ms-vscode.vscode-docker",
    "ms-kubernetes-tools.vscode-kubernetes-tools",
    "eamodio.gitlens",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-yaml"
  ],
  "unwantedRecommendations": [
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json"
  ]
}
```

### Custom Keybindings

#### keybindings.json (Keyboard shortcuts)

**macOS:** `Cmd + Shift + P` → "Preferences: Open Keyboard Shortcuts (JSON)"
**Windows:** `Ctrl + Shift + P` → "Preferences: Open Keyboard Shortcuts (JSON)"

```json
[
  // Terminal shortcuts
  {
    "key": "ctrl+shift+`",
    "command": "workbench.action.terminal.new",
    "when": "terminalProcessSupported || terminalWebExtensionContributedProfile"
  },
  {
    "key": "ctrl+shift+c",
    "command": "workbench.action.terminal.copySelection",
    "when": "terminalFocus && terminalTextSelected"
  },
  {
    "key": "ctrl+shift+v",
    "command": "workbench.action.terminal.paste",
    "when": "terminalFocus"
  },

  // Git shortcuts
  {
    "key": "ctrl+shift+g",
    "command": "gitlens.showQuickCommitFileDetails"
  },
  {
    "key": "ctrl+shift+b",
    "command": "gitlens.showFileHistory"
  },

  // Terraform shortcuts
  {
    "key": "ctrl+shift+i",
    "command": "terraform.init",
    "when": "editorLangId == terraform"
  },
  {
    "key": "ctrl+shift+p",
    "command": "terraform.plan",
    "when": "editorLangId == terraform"
  },

  // Multi-cursor shortcuts
  {
    "key": "ctrl+shift+l",
    "command": "editor.action.selectHighlights",
    "when": "editorFocus"
  },

  // Navigation shortcuts
  {
    "key": "ctrl+shift+o",
    "command": "workbench.action.quickOpen"
  },
  {
    "key": "ctrl+shift+f",
    "command": "workbench.action.findInFiles"
  }
]
```

### VS Code CLI Integration

Add VS Code to your PATH and create useful aliases:

#### macOS

```bash
# Add to ~/.zshrc or ~/.bashrc
export PATH="$PATH:/Applications/Visual Studio Code.app/Contents/Resources/app/bin"

# VS Code aliases
alias code.='code .'
alias codei='code --install-extension'
alias codeu='code --uninstall-extension'
alias codel='code --list-extensions'
```

#### Windows

```cmd
:: Add to PATH (System Environment Variables)
;C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\bin

:: Or use PowerShell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Users\$env:USERNAME\AppData\Local\Programs\Microsoft VS Code\bin", "User")
```

```bash
# Add to ~/.bashrc (Git Bash/WSL)
export PATH="$PATH:/c/Users/$USER/AppData/Local/Programs/Microsoft VS Code/bin"

# VS Code aliases
alias code.='code .'
alias codei='code --install-extension'
alias codeu='code --uninstall-extension'
alias codel='code --list-extensions'
```

### Sync Settings Across Machines

Set up Settings Sync for consistent configuration:

1. **Sign in to GitHub**: `Ctrl+Shift+P` → "GitHub: Sign In"
2. **Enable Settings Sync**: `Ctrl+Shift+P` → "Settings Sync: Turn On"
3. **Choose what to sync**: Settings, Extensions, Keybindings, UI State

### Performance Optimization

For better performance with large projects:

```json
{
  // Performance settings
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/.terraform/**": true,
    "**/dist/**": true,
    "**/build/**": true
  },
  "search.exclude": {
    "**/node_modules/**": true,
    "**/.terraform/**": true,
    "**/dist/**": true,
    "**/build/**": true
  },
  "editor.quickSuggestions": {
    "strings": true
  },
  "editor.suggest.localityBonus": true
}
```

#### Security Considerations for VS Code

**Code Editor Security:**
- **Extension verification** - Only install from trusted publishers
- **Workspace trust** - Enable workspace trust for untrusted folders
- **Settings sync security** - Use secure authentication for settings sync
- **Remote development** - Secure SSH configurations for remote development

**Why secure VS Code setup:**
- **Malicious extensions** can steal credentials and code
- **Untrusted workspaces** can execute harmful code
- **Insecure remote connections** expose local environment
- **Configuration leaks** can reveal sensitive settings

**Security Extensions to Install:**
- **MSR Security Extensions** - Code security analysis
- **GitHub CodeQL** - Vulnerability detection
- **Dependency Check** - Third-party library security
- **Secrets Detection** - Prevent credential leaks

**Secure Coding Practices:**
- **Linting rules** for security vulnerabilities
- **Code analysis** for common security issues
- **Dependency scanning** for known vulnerabilities
- **Commit signing** with GPG keys

## 7. Package Management and Updates

### macOS

```bash
# Update Homebrew packages
brew update && brew upgrade

# Clean up old versions
brew cleanup

# Check for outdated packages
brew outdated

# Update macOS
sudo softwareupdate -i -a
```

### Windows WSL

```bash
# Update Ubuntu packages
sudo apt update && sudo apt upgrade -y

# Remove unnecessary packages
sudo apt autoremove -y

# Clean package cache
sudo apt autoclean

# Update WSL kernel (if applicable)
# Check for WSL updates through Windows Store
```

### Ubuntu LTS

```bash
# Update all packages
sudo apt update && sudo apt upgrade -y

# Update to newer LTS version (when available)
# sudo do-release-upgrade

# Clean up
sudo apt autoremove -y && sudo apt autoclean

# Check for security updates
sudo unattended-upgrades --dry-run
```

#### Security Considerations for Package Management

**Package Security Best Practices:**
- **Verify package signatures** before installation
- **Use official repositories** only
- **Regular security audits** of installed packages
- **Monitor for vulnerable packages** with tools like `npm audit`, `safety`

**Why secure package management:**
- **Supply chain attacks** through compromised packages
- **Malware distribution** via popular libraries
- **Dependency vulnerabilities** affecting your applications
- **License compliance** issues

**Automated Update Security:**
- **Test updates** in staging before production
- **Schedule updates** during maintenance windows
- **Monitor for breaking changes** in dependencies
- **Maintain update logs** for compliance

**Vulnerability Management:**
- **Regular dependency scanning** with security tools
- **Automated alerts** for known vulnerabilities
- **Dependency pinning** for reproducible builds
- **Security patches** applied promptly

## 8. Additional Development Tools

### Install Common Development Tools (All Platforms)

```bash
# Install Python and pip
# macOS: brew install python
# Ubuntu/WSL: sudo apt install python3 python3-pip

# Install Node.js and npm
# macOS: brew install node
# Ubuntu/WSL: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt install nodejs

# Install Docker
# macOS: brew install --cask docker
# Ubuntu/WSL: curl -fsSL https://get.docker.com | sh

# Install VS Code extensions (if using VS Code)
# Terraform: hashicorp.terraform
# AWS Toolkit: amazonwebservices.aws-toolkit-vscode
# GitLens: eamodio.gitlens
```

## 9. Environment Validation

Create a validation script to ensure everything is working:

```bash
#!/bin/bash
# validate-setup.sh

echo "🔍 Validating Development Environment Setup"
echo "==========================================="

# Check Git
echo -n "Git: "
if command -v git &> /dev/null; then
    echo "✅ $(git --version)"
else
    echo "❌ Not installed"
fi

# Check SSH
echo -n "SSH Key: "
if [ -f ~/.ssh/id_ed25519.pub ]; then
    echo "✅ Present"
else
    echo "❌ Missing"
fi

# Check Terraform
echo -n "Terraform: "
if command -v terraform &> /dev/null; then
    echo "✅ $(terraform version | head -1)"
else
    echo "❌ Not installed"
fi

# Check AWS CLI
echo -n "AWS CLI: "
if command -v aws &> /dev/null; then
    echo "✅ $(aws --version | cut -d' ' -f1)"
else
    echo "❌ Not installed"
fi

# Check Bash completion
echo -n "Bash Completion: "
if [ -f /etc/bash_completion ] || [ -f /usr/local/etc/bash_completion ]; then
    echo "✅ Available"
else
    echo "❌ Not configured"
fi

echo ""
echo "🎉 Setup validation complete!"
```

## 10. Backup and Recovery

### Backup Your Configuration

```bash
# Create backup directory
mkdir -p ~/dev-setup-backup

# Backup SSH keys
cp -r ~/.ssh ~/dev-setup-backup/

# Backup Git config
cp ~/.gitconfig ~/dev-setup-backup/

# Backup Bash configuration
cp ~/.bashrc ~/dev-setup-backup/
cp ~/.bash_profile ~/dev-setup-backup/

# Backup AWS configuration
cp -r ~/.aws ~/dev-setup-backup/

# Backup Terraform configuration
cp -r ~/.terraform.d ~/dev-setup-backup/
```

### Quick Restore Script

```bash
#!/bin/bash
# restore-setup.sh

echo "🔄 Restoring Development Environment"

# Restore SSH keys
cp -r ~/dev-setup-backup/.ssh ~/

# Restore configurations
cp ~/dev-setup-backup/.gitconfig ~/
cp ~/dev-setup-backup/.bashrc ~/
cp ~/dev-setup-backup/.bash_profile ~/

# Restore AWS config
cp -r ~/dev-setup-backup/.aws ~/

# Restore Terraform config
cp -r ~/dev-setup-backup/.terraform.d ~/

echo "✅ Restore complete! Please restart your shell."
```

## 11. Troubleshooting Common Issues

### Git SSH Issues

```bash
# Test SSH connection
ssh -T git@github.com

# Check SSH agent
ssh-add -l

# Re-add key if needed
ssh-add ~/.ssh/id_ed25519
```

### AWS CLI Configuration Issues

```bash
# Check current configuration
aws configure list

# Test AWS connection
aws sts get-caller-identity

# Clear cache if needed
rm -rf ~/.aws/cli/cache/
```

### Terraform Issues

```bash
# Clear Terraform cache
rm -rf .terraform/

# Reinitialize
terraform init

# Check version
terraform version
```

## Security Summary and Best Practices

### Your Security Posture

By following this guide, you've implemented a **security-first development environment** with:

**🔐 Authentication & Access Control:**
- SSH key-based authentication (no passwords)
- AWS IAM with least privilege
- Git commit signing with GPG
- Multi-factor authentication enabled

**🛡️ Defense in Depth:**
- System hardening through updates
- Network security with firewalls
- Secure coding practices in VS Code
- Encrypted backups and configurations

**👁️ Monitoring & Auditing:**
- Regular security updates
- Package vulnerability scanning
- AWS access logging
- Git history integrity

### Ongoing Security Maintenance

**Daily Security Tasks:**
- Review AWS access logs for suspicious activity
- Check for security updates: `brew update && brew upgrade`
- Verify SSH keys haven't been compromised
- Audit installed packages for vulnerabilities

**Weekly Security Tasks:**
- Rotate AWS access keys and tokens
- Review Git repository access permissions
- Update VS Code extensions
- Check for exposed credentials in code

**Monthly Security Tasks:**
- Full system security audit
- Review and update IAM policies
- Backup encryption key rotation
- Security training and awareness

### Advanced Security Tools to Consider

**Secret Management:**
```bash
# Install AWS Secrets Manager CLI
pip install aws-secretsmanager-caching

# Or use HashiCorp Vault
brew install vault
```

**Security Scanning:**
```bash
# Install security scanning tools
brew install trivy          # Container vulnerability scanner
brew install checkov        # Infrastructure as Code security
pip install safety         # Python dependency security
```

**Network Security:**
```bash
# Install network security tools
brew install nmap          # Network scanning
brew install wireshark     # Packet analysis
brew install openvpn       # VPN client
```

### Security Incident Response

**If you suspect a breach:**
1. **Immediately rotate** all credentials and keys
2. **Audit recent activity** in AWS CloudTrail
3. **Check Git history** for unauthorized commits
4. **Scan for malware** with security tools
5. **Notify relevant teams** and stakeholders

**Prevention is better than cure** - regular security maintenance prevents most incidents.

### Final Security Recommendations

- **Zero Trust**: Never trust, always verify
- **Least Privilege**: Grant minimal required access
- **Defense in Depth**: Multiple security layers
- **Regular Audits**: Continuous security monitoring
- **Stay Informed**: Follow security news and updates

**Remember**: Security is not a one-time setup but an ongoing process. Your development environment security directly impacts your production systems' security.

## Conclusion

You've now set up a complete development environment optimized for DevOps and cloud development work. Your machine is configured with:

- ✅ Git with SSH authentication
- ✅ Bash with aliases and completion
- ✅ Terraform for infrastructure as code
- ✅ AWS CLI for cloud management
- ✅ Automated package management

Remember to regularly update your tools and backup your configurations. This setup will serve as an excellent foundation for your development work across DevOps, cloud engineering, and infrastructure automation projects.

Happy coding! 🚀
