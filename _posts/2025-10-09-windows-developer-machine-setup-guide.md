---
layout: post
title: "Windows Developer Machine Setup Guide: Complete PowerShell Environment for DevOps & Cloud Development"
description: "Comprehensive guide to setting up a Windows development machine with PowerShell, Git, Terraform, AWS CLI, VS Code, and package management using Chocolatey, winget, and PowerShell modules"
tags:
  [windows, powershell, devops, setup, git, terraform, aws, vscode, development]
icon: 🪟
excerpt: >
  Master your Windows development environment! This comprehensive guide covers setting up PowerShell with profiles and modules, Git with SSH, Terraform and AWS CLI, VS Code configuration, and Windows package management with Chocolatey and winget. Perfect for Windows-native DevOps workflows.
---

# Windows Developer Machine Setup Guide: Complete PowerShell Environment

Setting up a Windows development machine for DevOps and cloud development requires a different approach than traditional Unix-like systems. This guide focuses on leveraging Windows-native tools and PowerShell to create a powerful, efficient development environment that stays within the Windows ecosystem.

Whether you're working with Azure, AWS, or multi-cloud environments, this Windows-centric setup will give you all the tools you need for modern infrastructure as code and cloud development.

## Prerequisites

Before we begin, ensure you have:

- Windows 10/11 Pro or Enterprise (for some advanced features)
- Administrator privileges
- Internet connection
- Basic command-line familiarity

## 1. Windows Package Managers and System Updates

### Windows Update

```powershell
# Check for and install Windows updates
Get-WindowsUpdate -Install -AcceptAll -AutoReboot
# Or use Windows Settings: Settings > Update & Security > Windows Update
```

### Install Package Managers

#### Chocolatey (Essential Windows Package Manager)

```powershell
# Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force; `
[System.Net.ServicePointManager]::SecurityProtocol = `
[System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Verify installation
choco --version

# Enable global confirmation
choco feature enable -n allowGlobalConfirmation
```

#### Winget (Microsoft's Official Package Manager)

```powershell
# Winget comes pre-installed on Windows 10/11
# If not available, install from Microsoft Store or GitHub

# Verify installation
winget --version

# Update winget
winget upgrade --id Microsoft.Winget.Source --source winget
```

#### Scoop (Alternative Package Manager)

```powershell
# Install Scoop
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Add buckets
scoop bucket add extras
scoop bucket add versions
scoop bucket add nerd-fonts
```

## 2. PowerShell Setup and Configuration

### PowerShell Version Check and Update

```powershell
# Check current PowerShell version
$PSVersionTable.PSVersion

# Install PowerShell 7 (recommended)
winget install --id Microsoft.PowerShell --source winget

# Or using Chocolatey
choco install powershell-core
```

### PowerShell Profile Configuration

```powershell
# Check current profile path
$PROFILE

# Create profile directory if it doesn't exist
if (!(Test-Path -Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force
}

# Edit profile (opens in default editor)
notepad $PROFILE
# Or use VS Code: code $PROFILE
```

Add the following to your PowerShell profile:

```powershell
# PowerShell Profile Configuration
# =================================

# Set execution policy for current session
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

# Oh My Posh for beautiful prompts (install first: winget install JanDeDobbeleer.OhMyPosh)
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\clean-detailed.omp.json" | Invoke-Expression

# Import modules
Import-Module posh-git
Import-Module PSReadLine
Import-Module Terminal-Icons

# PSReadLine configuration for better command-line experience
Set-PSReadLineOption -EditMode Windows
Set-PSReadLineOption -HistoryNoDuplicates
Set-PSReadLineOption -HistorySearchCursorMovesToEnd
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -PredictionViewStyle ListView

# Key bindings
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward
Set-PSReadLineKeyHandler -Key Tab -Function Complete
Set-PSReadLineKeyHandler -Key Ctrl+d -Function DeleteCharOrExit

# Aliases
Set-Alias ll Get-ChildItem
Set-Alias grep Select-String
Set-Alias touch New-Item
Set-Alias which Get-Command
Set-Alias open Invoke-Item

# Git aliases
function gs { git status }
function ga { git add . }
function gc { param($m) git commit -m $m }
function gp { git push }
function gl { git log --oneline -10 }
function gd { git diff }

# Terraform aliases
function tf { terraform $args }
function tfi { terraform init }
function tfp { terraform plan }
function tfa { terraform apply }
function tfd { terraform destroy }

# AWS aliases
function aws-whoami { aws sts get-caller-identity }

# Navigation functions
function dev { Set-Location ~/dev }
function docs { Set-Location ~/Documents }
function dl { Set-Location ~/Downloads }

function mkcd { param($dir) mkdir $dir; Set-Location $dir }

# Environment variables
$env:EDITOR = "code"
$env:VISUAL = "code"

# Path additions
$env:Path += ";$env:USERPROFILE\bin"
$env:Path += ";$env:USERPROFILE\.local\bin"

# Custom prompt function
function prompt {
    $location = Get-Location
    $gitBranch = ""
    if (Test-Path .git) {
        $gitBranch = " ($(git branch --show-current))"
    }
    "PS $($location.Path)$gitBranch> "
}

# Load additional configurations
$configPath = Join-Path $PSScriptRoot "powershell-config.ps1"
if (Test-Path $configPath) {
    . $configPath
}

# Welcome message
Write-Host "🚀 PowerShell environment loaded!" -ForegroundColor Green
Write-Host "💡 Type 'help' for available commands" -ForegroundColor Yellow
```

### Essential PowerShell Modules

```powershell
# Install essential modules
Install-Module -Name posh-git -Scope CurrentUser -Force
Install-Module -Name PSReadLine -Scope CurrentUser -AllowPrerelease -Force
Install-Module -Name Terminal-Icons -Scope CurrentUser -Force
Install-Module -Name oh-my-posh -Scope CurrentUser -Force
Install-Module -Name PSFzf -Scope CurrentUser -Force
Install-Module -Name PSWindowsUpdate -Scope CurrentUser -Force

# AWS PowerShell module
Install-Module -Name AWSPowerShell.NetCore -Scope CurrentUser -Force

# Azure PowerShell module
Install-Module -Name Az -Scope CurrentUser -AllowClobber -Force

# Docker module
Install-Module -Name DockerMsftProvider -Scope CurrentUser -Force
```

## 3. Windows Terminal Setup

### Install Windows Terminal

```powershell
# Install Windows Terminal using winget
winget install --id Microsoft.WindowsTerminal --source winget

# Or using Chocolatey
choco install microsoft-windows-terminal
```

### Windows Terminal Configuration

```json
// Open settings.json in Windows Terminal (Ctrl+,)
// Add this configuration:

{
  "$schema": "https://aka.ms/terminal-profiles-schema",
  "defaultProfile": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
  "profiles": {
    "defaults": {
      "fontFace": "Cascadia Code",
      "fontSize": 11,
      "colorScheme": "Campbell Powershell",
      "useAcrylic": true,
      "acrylicOpacity": 0.75
    },
    "list": [
      {
        "guid": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
        "name": "PowerShell",
        "commandline": "powershell.exe",
        "hidden": false
      },
      {
        "guid": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
        "name": "PowerShell 7",
        "commandline": "pwsh.exe",
        "hidden": false
      },
      {
        "guid": "{07b52e3e-de2c-5db4-bd2d-ba144ed6c273}",
        "name": "Ubuntu (WSL)",
        "commandline": "wsl.exe -d Ubuntu",
        "hidden": false
      },
      {
        "guid": "{0caa0dad-35be-5f56-a8ff-afceeeaa6101}",
        "name": "Command Prompt",
        "commandline": "cmd.exe",
        "hidden": false
      }
    ]
  },
  "schemes": [
    {
      "name": "Dracula",
      "background": "#282A36",
      "black": "#21222C",
      "blue": "#BD93F9",
      "brightBlack": "#6272A4",
      "brightBlue": "#D6ACFF",
      "brightCyan": "#A4FFFF",
      "brightGreen": "#69FF94",
      "brightPurple": "#FF92DF",
      "brightRed": "#FF6E6E",
      "brightWhite": "#FFFFFF",
      "brightYellow": "#FFFFA5",
      "cyan": "#8BE9FD",
      "foreground": "#F8F8F2",
      "green": "#50FA7B",
      "purple": "#FF79C6",
      "red": "#FF5555",
      "white": "#F8F8F2",
      "yellow": "#F1FA8C"
    }
  ],
  "actions": [
    {
      "command": "find",
      "keys": "ctrl+shift+f"
    },
    {
      "command": "splitPane",
      "keys": "ctrl+shift+5"
    },
    {
      "command": {
        "action": "splitPane",
        "split": "vertical"
      },
      "keys": "ctrl+shift+v"
    }
  ]
}
```

## 4. Git Setup with SSH on Windows

### Install Git for Windows

```powershell
# Install Git using winget
winget install --id Git.Git --source winget

# Or using Chocolatey
choco install git

# Verify installation
git --version
```

### Git Configuration

```powershell
# Set Git configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
git config --global credential.helper wincred
git config --global core.autocrlf input

# Set up useful aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```

### SSH Key Generation

```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com" -f "$env:USERPROFILE\.ssh\id_ed25519" -N '""'

# Start SSH agent
Start-Service ssh-agent
ssh-add "$env:USERPROFILE\.ssh\id_ed25519"

# Copy public key to clipboard
Get-Content "$env:USERPROFILE\.ssh\id_ed25519.pub" | Set-Clipboard
```

### Test SSH Connection

```powershell
# Test GitHub
ssh -T git@github.com

# Test GitLab
ssh -T git@gitlab.com
```

## 5. Terraform Installation and Setup

### Install Terraform

```powershell
# Install using Chocolatey
choco install terraform

# Or using winget
winget install --id Hashicorp.Terraform --source winget

# Or manually download from HashiCorp
# Download from: https://www.terraform.io/downloads
# Extract to: C:\terraform
# Add to PATH

# Verify installation
terraform version
```

### Terraform Configuration

```powershell
# Create Terraform directory
New-Item -ItemType Directory -Path "$env:USERPROFILE\.terraform.d" -Force

# Create credentials file
@"
{
  "credentials": {
    "app.terraform.io": {
      "token": "your-terraform-cloud-token-here"
    }
  }
}
"@ | Out-File -FilePath "$env:USERPROFILE\.terraform.d\credentials.tfrc.json" -Encoding UTF8

# Set environment variable
[Environment]::SetEnvironmentVariable("TF_CLI_CONFIG_FILE", "$env:USERPROFILE\.terraform.d\credentials.tfrc.json", "User")

# Install autocomplete
terraform -install-autocomplete
```

## 6. AWS CLI and PowerShell Tools

### Install AWS CLI

```powershell
# Install AWS CLI v2 using Chocolatey
choco install awscli

# Or using winget
winget install --id Amazon.AWSCLI --source winget

# Or manual installation
# Download from: https://awscli.amazonaws.com/AWSCLIV2.msi
# Run installer

# Verify installation
aws --version
```

### AWS CLI Configuration

```powershell
# Configure AWS CLI
aws configure

# Create additional profiles
aws configure --profile dev
aws configure --profile staging
aws configure --profile prod

# Set default profile
[Environment]::SetEnvironmentVariable("AWS_PROFILE", "dev", "User")

# Install AWS PowerShell module
Install-Module -Name AWSPowerShell.NetCore -Scope CurrentUser -Force

# Import AWS module in profile
# Add to $PROFILE: Import-Module AWSPowerShell.NetCore
```

### AWS Tools for PowerShell

```powershell
# Install AWS Tools
Install-Module -Name AWS.Tools.Common -Scope CurrentUser -Force
Install-Module -Name AWS.Tools.EC2 -Scope CurrentUser -Force
Install-Module -Name AWS.Tools.S3 -Scope CurrentUser -Force
Install-Module -Name AWS.Tools.IAM -Scope CurrentUser -Force

# Example usage in PowerShell
# Import-Module AWS.Tools.Common
# Set-AWSCredential -ProfileName dev
# Get-EC2Instance
```

## 7. Visual Studio Code Setup for Windows

### Install VS Code

```powershell
# Install using winget
winget install --id Microsoft.VisualStudioCode --source winget

# Or using Chocolatey
choco install vscode

# Install VS Code Insiders (optional)
winget install --id Microsoft.VisualStudioCode.Insiders --source winget
```

### Essential Extensions Installation

```powershell
# Install extensions using command line
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension ms-python.python
code --install-extension ms-vscode.vscode-json
code --install-extension hashicorp.terraform
code --install-extension hashicorp.hcl
code --install-extension ms-vscode.vscode-docker
code --install-extension ms-vscode.vscode-yaml
code --install-extension amazonwebservices.aws-toolkit-vscode
code --install-extension ms-vscode.powershell
code --install-extension msazurermtools.azurerm-vscode-tools
code --install-extension eamodio.gitlens
code --install-extension github.copilot
code --install-extension github.copilot-chat
code --install-extension ms-vscode.vscode-icons
code --install-extension dracula-theme.theme-dracula
code --install-extension github.github-vscode-theme
code --install-extension ms-vscode.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-python.black-formatter
```

### VS Code Settings for Windows

```json
{
  // Editor Configuration
  "editor.fontSize": 14,
  "editor.fontFamily": "'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
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

  // PowerShell Configuration
  "powershell.powerShellExePath": "C:\\Program Files\\PowerShell\\7\\pwsh.exe",
  "powershell.integratedConsole.showOnStartup": false,
  "powershell.enableProfileLoading": true,

  // Terminal Configuration
  "terminal.integrated.shell.windows": "C:\\Program Files\\PowerShell\\7\\pwsh.exe",
  "terminal.integrated.fontFamily": "'Cascadia Code', monospace",
  "terminal.integrated.fontSize": 12,

  // File Associations
  "files.associations": {
    "*.tf": "terraform",
    "*.tfvars": "terraform",
    "*.hcl": "hcl",
    "Dockerfile*": "dockerfile",
    "*.yml": "yaml",
    "*.yaml": "yaml",
    "*.ps1": "powershell",
    "*.psm1": "powershell"
  },

  // Exclude Files
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/.terraform": true,
    "**/*.tfstate*": true,
    "**/.aws": true,
    "**/bin": true,
    "**/obj": true
  },

  // Git Configuration
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "git.autofetch": true,
  "gitlens.showWelcomeOnInstall": false,

  // Terraform Configuration
  "terraform.languageServer.enable": true,
  "terraform.languageServer.args": ["serve"],

  // Python Configuration
  "python.defaultInterpreterPath": "python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",

  // AWS Configuration
  "aws.profile": "dev",
  "aws.telemetry": false,

  // Theme and Appearance
  "workbench.iconTheme": "vscode-icons",
  "workbench.colorTheme": "GitHub Dark",
  "workbench.preferredDarkColorTheme": "GitHub Dark",

  // Window Configuration
  "window.zoomLevel": 0,
  "window.restoreWindows": "all",

  // PowerShell Specific
  "powershell.codeFormatting.preset": "OTBS",
  "powershell.integratedConsole.focusConsoleOnExecute": false
}
```

### PowerShell Extension Configuration

```json
{
  "powershell.powerShellExePath": "C:\\Program Files\\PowerShell\\7\\pwsh.exe",
  "powershell.integratedConsole.showOnStartup": false,
  "powershell.enableProfileLoading": true,
  "powershell.codeFormatting.preset": "OTBS",
  "powershell.integratedConsole.focusConsoleOnExecute": false,
  "powershell.startAsLoginShell": true
}
```

## 8. Windows-Specific Development Tools

### Install Additional Tools

```powershell
# Development tools
choco install nodejs-lts yarn
choco install python --version=3.11.0
choco install openjdk11
choco install dotnetcore-sdk
choco install docker-desktop

# Cloud tools
choco install azure-cli
choco install googlecloudsdk

# Database tools
choco install postgresql
choco install mysql
choco install mongodb

# Text editors and IDEs
choco install notepadplusplus
choco install jetbrainstoolbox

# Utilities
choco install 7zip
choco install everything
choco install powertoys
choco install autohotkey
```

### Windows Subsystem for Linux (Optional)

```powershell
# Enable WSL
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Install WSL2
wsl --install -d Ubuntu

# Set WSL2 as default
wsl --set-default-version 2

# List available distributions
wsl --list --online

# Install additional distribution
wsl --install -d Ubuntu-20.04
```

## 9. Environment Validation Script

Create a PowerShell validation script:

```powershell
# validate-windows-setup.ps1

Write-Host "🔍 Validating Windows Development Environment Setup" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check PowerShell version
Write-Host "PowerShell Version: $($PSVersionTable.PSVersion)" -ForegroundColor Yellow

# Check Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git: Not installed" -ForegroundColor Red
}

# Check Terraform
try {
    $tfVersion = terraform version | Select-Object -First 1
    Write-Host "✅ Terraform: $tfVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Terraform: Not installed" -ForegroundColor Red
}

# Check AWS CLI
try {
    $awsVersion = aws --version
    Write-Host "✅ AWS CLI: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI: Not installed" -ForegroundColor Red
}

# Check VS Code
try {
    $codeVersion = code --version | Select-Object -First 1
    Write-Host "✅ VS Code: $codeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ VS Code: Not installed" -ForegroundColor Red
}

# Check Chocolatey
try {
    $chocoVersion = choco --version
    Write-Host "✅ Chocolatey: v$chocoVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Chocolatey: Not installed" -ForegroundColor Red
}

# Check winget
try {
    $wingetVersion = winget --version
    Write-Host "✅ Winget: $wingetVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Winget: Not available" -ForegroundColor Red
}

# Check SSH keys
$sshKeyPath = "$env:USERPROFILE\.ssh\id_ed25519.pub"
if (Test-Path $sshKeyPath) {
    Write-Host "✅ SSH Key: Present" -ForegroundColor Green
} else {
    Write-Host "❌ SSH Key: Missing" -ForegroundColor Red
}

# Check PowerShell modules
$modules = @('posh-git', 'PSReadLine', 'Terminal-Icons', 'AWSPowerShell.NetCore')
foreach ($module in $modules) {
    if (Get-Module -ListAvailable -Name $module) {
        Write-Host "✅ Module $module`: Installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Module $module`: Not installed" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Setup validation complete!" -ForegroundColor Green
Write-Host "💡 Run 'choco upgrade all' regularly to keep packages updated" -ForegroundColor Yellow
```

## 10. Backup and Recovery

### Backup Your Configuration

```powershell
# Create backup directory
$backupDir = "$env:USERPROFILE\dev-setup-backup"
New-Item -ItemType Directory -Path $backupDir -Force

# Backup PowerShell profile
Copy-Item $PROFILE "$backupDir\powershell-profile.ps1"

# Backup Windows Terminal settings
Copy-Item "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json" "$backupDir\windows-terminal-settings.json"

# Backup SSH keys
Copy-Item "$env:USERPROFILE\.ssh" "$backupDir\ssh-keys" -Recurse

# Backup VS Code settings
Copy-Item "$env:APPDATA\Code\User\settings.json" "$backupDir\vscode-settings.json"
Copy-Item "$env:APPDATA\Code\User\keybindings.json" "$backupDir\vscode-keybindings.json"

# Backup AWS configuration
Copy-Item "$env:USERPROFILE\.aws" "$backupDir\aws-config" -Recurse

# Backup Terraform configuration
Copy-Item "$env:USERPROFILE\.terraform.d" "$backupDir\terraform-config" -Recurse

Write-Host "✅ Backup completed to $backupDir" -ForegroundColor Green
```

### Quick Restore Script

```powershell
# restore-windows-setup.ps1

$backupDir = "$env:USERPROFILE\dev-setup-backup"

Write-Host "🔄 Restoring Windows Development Environment" -ForegroundColor Cyan

# Restore PowerShell profile
Copy-Item "$backupDir\powershell-profile.ps1" $PROFILE

# Restore Windows Terminal settings
Copy-Item "$backupDir\windows-terminal-settings.json" "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json"

# Restore SSH keys
Copy-Item "$backupDir\ssh-keys\*" "$env:USERPROFILE\.ssh\" -Recurse

# Restore VS Code settings
Copy-Item "$backupDir\vscode-settings.json" "$env:APPDATA\Code\User\settings.json"
Copy-Item "$backupDir\vscode-keybindings.json" "$env:APPDATA\Code\User\keybindings.json"

# Restore AWS config
Copy-Item "$backupDir\aws-config\*" "$env:USERPROFILE\.aws\" -Recurse

# Restore Terraform config
Copy-Item "$backupDir\terraform-config\*" "$env:USERPROFILE\.terraform.d\" -Recurse

Write-Host "✅ Restore complete! Restart PowerShell and VS Code." -ForegroundColor Green
```

## 11. Windows-Specific Tips and Tricks

### Windows Key Shortcuts

- `Win + X`: Quick access menu
- `Win + Shift + S`: Screenshot tool
- `Win + V`: Clipboard history
- `Win + .`: Emoji picker
- `Win + ,`: Peek at desktop

### PowerShell Tips

```powershell
# Quick edit mode toggle
Set-PSReadLineOption -EditMode Emacs  # or Windows

# Fuzzy finding with PSFzf
# Install: Install-Module PSFzf
# Use: Ctrl+R for history, Ctrl+T for files

# Profile editing
code $PROFILE  # Edit in VS Code
. $PROFILE     # Reload profile
```

### Performance Optimization

```powershell
# Disable Windows search indexing on dev folders
Set-WindowsSearchSetting -EnableIndexing $false -Paths "$env:USERPROFILE\dev"

# Exclude folders from Windows Defender
Add-MpPreference -ExclusionPath "$env:USERPROFILE\dev"
Add-MpPreference -ExclusionPath "$env:USERPROFILE\.terraform"
```

### Windows Services Management

```powershell
# Useful services for development
Start-Service -Name ssh-agent  # For SSH keys
Start-Service -Name docker     # If using Docker Desktop

# Check service status
Get-Service -Name ssh-agent, docker
```

## Conclusion

You've now set up a complete Windows development environment optimized for DevOps and cloud development work. Your Windows machine is configured with:

- ✅ PowerShell with custom profile and modules
- ✅ Windows Terminal with multiple shells
- ✅ Git with SSH authentication
- ✅ Terraform for infrastructure as code
- ✅ AWS CLI and PowerShell tools
- ✅ VS Code with DevOps extensions
- ✅ Windows package management with Chocolatey and winget

This Windows-native setup provides excellent performance and integration with Windows-specific tools and workflows while maintaining full compatibility with cloud and DevOps tooling.

Remember to regularly update your tools using `choco upgrade all` and `winget upgrade --all`, and backup your configurations regularly.

Happy Windows development! 🎉
