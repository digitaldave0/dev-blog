---
layout: post
title: "Windows DevOps Desktop Setup: WSL Development Environment Guide"
description: "Complete guide to setting up a Windows desktop with WSL for DevOps development. Configure Windows Subsystem for Linux, development tools, Docker integration, security hardening, and DevOps workflows. Perfect for developers who need Linux tools on Windows."
tags:
  [
    windows,
    wsl,
    devops,
    development,
    docker,
    vscode,
    git,
    linux,
    security,
    development-environment,
  ]
icon: 🪟
excerpt: >
  Transform your Windows desktop into a powerful DevOps development environment! This comprehensive guide covers Windows Subsystem for Linux (WSL) setup, Docker integration, development tools configuration, security hardening, and DevOps workflows. Get the best of both Windows and Linux worlds for modern development.
---

Setting up a Windows desktop for DevOps development requires balancing Windows productivity with Linux tooling. Windows Subsystem for Linux (WSL) bridges this gap perfectly, giving you native Linux performance while maintaining Windows compatibility.

This guide walks you through creating a **professional DevOps development environment** that combines Windows convenience with Linux power, optimized for modern development workflows.

## Prerequisites

**What you'll need:**

- Windows 10 version 2004+ or Windows 11
- Administrator privileges
- Internet connection
- 8GB+ RAM recommended
- 50GB+ free disk space

**Why Windows + WSL for DevOps?**

- **Native Linux performance** for containers, build tools, and scripts
- **Windows integration** for enterprise tools and productivity software
- **File system compatibility** between Windows and Linux environments
- **GPU acceleration** support for AI/ML workloads
- **Enterprise security** features and compliance tools

## 1. Windows System Preparation

### Enable Windows Developer Features

**Why enable developer features?**
Windows developer features unlock advanced capabilities needed for DevOps workflows, including WSL, virtualization, and development tools.

```powershell
# Run PowerShell as Administrator
# Enable Windows Subsystem for Linux
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Enable Virtual Machine Platform (required for WSL 2)
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Enable Windows Developer Mode (optional but recommended)
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" /t REG_DWORD /f /v "AllowDevelopmentWithoutDevLicense" /d "1"
```

### Update Windows and Install Prerequisites

**Security and compatibility:** Regular updates ensure security patches and compatibility with latest DevOps tools.

```powershell
# Update Windows
Install-Module PSWindowsUpdate -Force
Get-WindowsUpdate
Install-WindowsUpdate -AcceptAll -AutoReboot

# Install Windows Terminal (modern terminal experience)
winget install --id Microsoft.WindowsTerminal -e

# Install PowerShell 7 (cross-platform PowerShell)
winget install --id Microsoft.PowerShell -e
```

## 2. Install and Configure WSL

### Install WSL and Ubuntu

**Why WSL 2 over WSL 1?**
WSL 2 provides full Linux kernel integration, better performance for file operations, and native Docker support - essential for DevOps workflows.

```bash
# Install WSL with Ubuntu (run in PowerShell as Administrator)
wsl --install -d Ubuntu

# Set WSL 2 as default version
wsl --set-default-version 2

# List available distributions
wsl --list --online

# Install additional distributions if needed
wsl --install -d Ubuntu-22.04
```

### Configure WSL Environment

**Why configure WSL properly?**
Proper configuration ensures optimal performance, security, and integration with Windows development tools.

```bash
# Update WSL kernel (if needed)
wsl --update

# Set Ubuntu as default distribution
wsl --set-default Ubuntu

# Configure WSL settings (%USERPROFILE%\.wslconfig)
cat > ~/.wslconfig << 'EOF'
[wsl2]
memory=8GB
processors=4
swap=4GB
localhostForwarding=true
guiApplications=true

[experimental]
autoMemoryRebalance=true
sparseVhd=true
EOF
```

### Initial Ubuntu Setup in WSL

**Why set up Ubuntu properly?**
A well-configured Ubuntu environment provides the foundation for all DevOps tools and workflows.

```bash
# Update Ubuntu packages
sudo apt update && sudo apt upgrade -y

# Install essential development tools
sudo apt install -y curl wget git vim htop tree jq unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Configure Git (replace with your details)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
git config --global core.autocrlf input

# Generate SSH key for Git and server access
ssh-keygen -t ed25519 -C "your.email@example.com" -f ~/.ssh/id_ed25519 -N ""
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Display public key for GitHub/GitLab
echo "Add this SSH key to your Git provider:"
cat ~/.ssh/id_ed25519.pub
```

## 3. Development Tools Installation

### Install VS Code with WSL Extensions

**Why VS Code + WSL?**
VS Code provides excellent Windows integration while WSL extensions enable seamless Linux development, perfect for DevOps workflows.

```powershell
# Install VS Code (Windows)
winget install --id Microsoft.VisualStudioCode -e

# Install VS Code extensions (run in VS Code terminal)
code --install-extension ms-vscode-remote.remote-wsl
code --install-extension ms-vscode-remote.remote-containers
code --install-extension ms-vscode.vscode-json
code --install-extension ms-python.python
code --install-extension hashicorp.terraform
code --install-extension ms-azuretools.vscode-docker
code --install-extension ms-vscode.vscode-yaml
code --install-extension redhat.vscode-yaml
code --install-extension eamodio.gitlens
```

### Install Docker Desktop with WSL Integration

**Why Docker on Windows with WSL?**
Docker Desktop with WSL integration provides native Linux container performance while maintaining Windows compatibility for enterprise DevOps workflows.

```powershell
# Install Docker Desktop
winget install --id Docker.DockerDesktop -e

# Enable WSL integration in Docker Desktop settings
# 1. Open Docker Desktop
# 2. Go to Settings > Resources > WSL Integration
# 3. Enable integration with your Ubuntu distribution
# 4. Apply and restart

# Test Docker in WSL
docker --version
docker run hello-world
```

### Install Programming Languages and Tools

**Why multiple languages and tools?**
DevOps engineers work with various technologies - infrastructure as code, scripting, containerization, and cloud platforms.

```bash
# Install Python (WSL)
sudo apt install -y python3 python3-pip python3-venv
python3 -m pip install --upgrade pip

# Install Node.js (WSL)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Go (WSL)
wget https://go.dev/dl/go1.21.5.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Install Google Cloud SDK
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
sudo apt update && sudo apt install -y google-cloud-sdk
```

## 4. Package Managers and Development Workflow

### Configure Windows Package Managers

**Why multiple package managers?**
Different tools excel at different tasks - winget for Microsoft tools, Chocolatey for community packages, and apt for Linux tools.

```powershell
# Install Chocolatey (community package manager)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Install essential Windows tools
choco install -y git terraform awscli azure-cli kubernetes-cli kubernetes-helm

# Install development tools
choco install -y vscode powershell-core windows-terminal
```

### Configure Development Environment

**Why configure the environment properly?**
A well-configured environment reduces friction in development workflows and ensures consistency across projects.

```bash
# Create development directory structure
mkdir -p ~/projects/{personal,work,learning}
mkdir -p ~/.config ~/.local/bin

# Configure bash profile
cat >> ~/.bashrc << 'EOF'

# DevOps environment configuration
export EDITOR=vim
export VISUAL=code

# Go environment
export GOPATH=$HOME/go
export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin

# Python virtual environments
export WORKON_HOME=$HOME/.virtualenvs
export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3

# Kubernetes configuration
export KUBECONFIG=$HOME/.kube/config

# Aliases for common DevOps tasks
alias k='kubectl'
alias tf='terraform'
alias dc='docker-compose'
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'

# Function to create Python virtual environment
mkvenv() {
    python3 -m venv ~/.virtualenvs/$1
    source ~/.virtualenvs/$1/bin/activate
}

# Function to activate Python virtual environment
venv() {
    source ~/.virtualenvs/$1/bin/activate
}
EOF

source ~/.bashrc
```

## 5. Security Configuration

### Windows Security Hardening

**Why secure Windows for DevOps?**
DevOps environments often handle sensitive credentials, API keys, and access to production systems - security is critical.

```powershell
# Enable Windows Defender real-time protection
Set-MpPreference -EnableControlledFolderAccess Enabled

# Configure Windows Firewall for development
# Allow WSL and development ports
New-NetFirewallRule -DisplayName "WSL" -Direction Inbound -InterfaceAlias "vEthernet (WSL)" -Action Allow

# Enable BitLocker for drive encryption (if not already enabled)
# manage-bde -on C: -RecoveryPassword

# Configure Windows Security settings
# Enable secure boot verification
# Confirm-SecureBootUEFI

# Set up Windows Hello for Business (if in enterprise environment)
```

### SSH and Credential Management

**Why proper credential management?**
DevOps work involves managing multiple credentials, SSH keys, and API tokens - proper management prevents security incidents.

```bash
# Configure SSH config for multiple environments
cat >> ~/.ssh/config << 'EOF'
# GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519

# GitLab
Host gitlab.com
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/id_ed25519

# AWS EC2 instances
Host *.compute.amazonaws.com
    User ubuntu
    IdentityFile ~/.ssh/aws-key.pem
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null

# Corporate servers
Host *.company.com
    User devops
    IdentityFile ~/.ssh/company-key
    ProxyCommand ssh proxy.company.com -W %h:%p
EOF

chmod 600 ~/.ssh/config

# Install 1Password CLI (if using 1Password)
# curl -sS https://downloads.1password.com/linux/tar/stable/1password-latest.tar.gz | tar -xz -C /tmp && sudo /tmp/1password/install.sh

# Configure Git credential manager
git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager-core.exe"
```

### WSL Security Considerations

**Why secure WSL?**
WSL runs with the same privileges as your Windows user account - proper security prevents compromise of both environments.

```bash
# Install security tools in WSL
sudo apt install -y ufw fail2ban rkhunter chkrootkit auditd

# Configure basic firewall in WSL
sudo ufw enable
sudo ufw allow 22/tcp  # SSH if needed
sudo ufw allow 3000/tcp  # Development servers
sudo ufw allow 8080/tcp  # Web applications

# Configure Fail2Ban for SSH protection
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Secure file permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub

# Install and configure auditd
sudo systemctl enable auditd
sudo systemctl start auditd
```

## 6. Development Workflow Optimization

### Configure Windows Terminal

**Why optimize the terminal?**
A well-configured terminal improves productivity for DevOps workflows involving multiple tools and environments.

```json
// Windows Terminal settings.json
{
  "defaultProfile": "{07b52e3e-de2c-5db4-bd2d-ba144ed6c273}",
  "profiles": {
    "defaults": {
      "colorScheme": "Campbell Powershell",
      "fontFace": "Cascadia Code",
      "fontSize": 11,
      "startingDirectory": "//wsl$/Ubuntu/home/yourusername"
    },
    "list": [
      {
        "guid": "{07b52e3e-de2c-5db4-bd2d-ba144ed6c273}",
        "name": "Ubuntu (WSL)",
        "source": "Windows.Terminal.Wsl",
        "startingDirectory": "//wsl$/Ubuntu/home/yourusername"
      },
      {
        "guid": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
        "name": "Windows PowerShell",
        "commandline": "powershell.exe"
      },
      {
        "guid": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
        "name": "PowerShell 7",
        "source": "Windows.Terminal.PowershellCore"
      }
    ]
  },
  "schemes": [
    {
      "name": "DevOps Theme",
      "background": "#0C0C0C",
      "foreground": "#CCCCCC",
      "cursorColor": "#FFFFFF",
      "selectionBackground": "#FFFFFF"
    }
  ]
}
```

### Set Up Development Scripts

**Why automation scripts?**
DevOps work involves repetitive setup tasks - scripts ensure consistency and save time.

```bash
# Create development environment setup script
cat > ~/setup-dev-env.sh << 'EOF'
#!/bin/bash
# Development Environment Setup Script

echo "🚀 Setting up development environment..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install development dependencies
sudo apt install -y build-essential libssl-dev zlib1g-dev libbz2-dev \
    libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev \
    xz-utils tk-dev libffi-dev liblzma-dev python-openssl git

# Install pyenv for Python version management
curl https://pyenv.run | bash
echo 'export PATH="$HOME/.pyenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.bashrc

# Install nvm for Node.js version management
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Install Helm
curl https://get.helm.sh/helm-v3.12.0-linux-amd64.tar.gz -o helm.tar.gz
tar -zxvf helm.tar.gz
sudo mv linux-amd64/helm /usr/local/bin/

# Install Terraform
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com jammy main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install -y terraform

echo "✅ Development environment setup complete!"
echo "🔄 Please restart your terminal or run: source ~/.bashrc"
EOF

chmod +x ~/setup-dev-env.sh

# Create project initialization script
cat > ~/create-project.sh << 'EOF'
#!/bin/bash
# Project Initialization Script

PROJECT_NAME=$1
PROJECT_TYPE=${2:-python}

if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: $0 <project-name> [project-type]"
    echo "Project types: python, node, go, terraform"
    exit 1
fi

echo "📁 Creating $PROJECT_TYPE project: $PROJECT_NAME"

# Create project directory
mkdir -p ~/projects/$PROJECT_NAME
cd ~/projects/$PROJECT_NAME

# Initialize based on project type
case $PROJECT_TYPE in
    python)
        # Create Python project structure
        mkdir -p src tests docs
        touch src/__init__.py tests/__init__.py
        touch requirements.txt setup.py README.md .gitignore

        # Create virtual environment
        python3 -m venv venv
        source venv/bin/activate

        # Install basic packages
        pip install pytest black flake8 mypy
        ;;
    node)
        # Initialize Node.js project
        npm init -y
        mkdir -p src test
        npm install --save-dev jest eslint prettier typescript @types/node
        ;;
    go)
        # Initialize Go module
        go mod init $PROJECT_NAME
        mkdir -p cmd pkg internal
        touch cmd/main.go README.md .gitignore
        ;;
    terraform)
        # Initialize Terraform project
        touch main.tf variables.tf outputs.tf terraform.tfvars .gitignore
        terraform init
        ;;
    *)
        echo "Unknown project type: $PROJECT_TYPE"
        exit 1
        ;;
esac

# Initialize Git repository
git init
git add .
git commit -m "Initial commit"

echo "✅ Project $PROJECT_NAME created successfully!"
echo "📂 Location: ~/projects/$PROJECT_NAME"
EOF

chmod +x ~/create-project.sh
```

## 7. Testing and Validation

### Validate Development Environment

**Why validate the setup?**
Proper validation ensures all tools work correctly and the environment is ready for DevOps workflows.

```bash
# Create environment validation script
cat > ~/validate-dev-env.sh << 'EOF'
#!/bin/bash
# Development Environment Validation Script

echo "🔍 Validating development environment..."
echo "======================================="

# Check WSL version
echo "WSL Version:"
wsl --version

# Check Ubuntu version
echo -e "\nUbuntu Version:"
lsb_release -a

# Check development tools
echo -e "\nDevelopment Tools:"
echo "Git: $(git --version)"
echo "Docker: $(docker --version 2>/dev/null || echo 'Not installed')"
echo "Python: $(python3 --version)"
echo "Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
echo "Go: $(go version 2>/dev/null || echo 'Not installed')"

# Check cloud CLIs
echo -e "\nCloud CLIs:"
echo "AWS CLI: $(aws --version 2>/dev/null || echo 'Not installed')"
echo "Azure CLI: $(az --version 2>/dev/null | head -1 || echo 'Not installed')"
echo "GCP SDK: $(gcloud --version 2>/dev/null | head -1 || echo 'Not installed')"

# Check Kubernetes tools
echo -e "\nKubernetes Tools:"
echo "kubectl: $(kubectl version --client 2>/dev/null || echo 'Not installed')"
echo "Helm: $(helm version 2>/dev/null || echo 'Not installed')"

# Check Terraform
echo -e "\nInfrastructure Tools:"
echo "Terraform: $(terraform --version 2>/dev/null || echo 'Not installed')"

# Test Docker connectivity
echo -e "\nDocker Test:"
docker run --rm hello-world 2>/dev/null | head -1 || echo "Docker not accessible"

# Check SSH keys
echo -e "\nSSH Keys:"
if [ -f ~/.ssh/id_ed25519 ]; then
    echo "✅ SSH key exists"
else
    echo "❌ SSH key missing"
fi

echo -e "\n✅ Environment validation complete!"
EOF

chmod +x ~/validate-dev-env.sh

# Run validation
~/validate-dev-env.sh
```

## 8. Backup and Recovery

### Configure Backup Strategy

**Why backups for development environment?**
Development environments contain valuable configurations, SSH keys, and project code that should be protected.

```powershell
# Create Windows backup script
# Save as backup-dev-env.ps1
$backupScript = @'
# Windows Development Environment Backup Script

$backupDir = "$env:USERPROFILE\DevEnv-Backup"
$date = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = "$backupDir\$date"

# Create backup directory
New-Item -ItemType Directory -Force -Path $backupPath | Out-Null

# Backup WSL distributions
Write-Host "Backing up WSL distributions..."
wsl --export Ubuntu "$backupPath\ubuntu.tar"

# Backup Windows development tools settings
Write-Host "Backing up VS Code settings..."
Copy-Item "$env:APPDATA\Code\User\settings.json" "$backupPath\" -ErrorAction SilentlyContinue
Copy-Item "$env:APPDATA\Code\User\keybindings.json" "$backupPath\" -ErrorAction SilentlyContinue

# Backup PowerShell profile
Write-Host "Backing up PowerShell profile..."
Copy-Item $PROFILE "$backupPath\Microsoft.PowerShell_profile.ps1" -ErrorAction SilentlyContinue

# Backup SSH keys (be careful with these!)
Write-Host "Backing up SSH keys..."
Copy-Item "$env:USERPROFILE\.ssh\*" "$backupPath\ssh\" -Recurse -ErrorAction SilentlyContinue

# Compress backup
Write-Host "Compressing backup..."
Compress-Archive -Path $backupPath -DestinationPath "$backupDir\DevEnv-Backup-$date.zip"

# Clean old backups (keep last 5)
Write-Host "Cleaning old backups..."
Get-ChildItem $backupDir -Directory | Sort-Object CreationTime -Descending | Select-Object -Skip 5 | Remove-Item -Recurse -Force

Write-Host "✅ Backup complete: $backupDir\DevEnv-Backup-$date.zip"
'@

$backupScript | Out-File -FilePath "$env:USERPROFILE\backup-dev-env.ps1" -Encoding UTF8
```

### Recovery Procedures

**Why document recovery procedures?**
Having documented recovery steps minimizes downtime when issues occur with the development environment.

```bash
# Create recovery script for WSL
cat > ~/recover-wsl.sh << 'EOF'
#!/bin/bash
# WSL Recovery Script

echo "🔄 Starting WSL recovery process..."

# Stop WSL
wsl --shutdown

# List available backups
echo "Available backups:"
ls -la ~/DevEnv-Backup/*.tar 2>/dev/null || echo "No WSL backups found"

# Prompt for backup file
echo "Enter backup filename (or 'skip' to continue without restore):"
read -r backup_file

if [ "$backup_file" != "skip" ] && [ -f "$backup_file" ]; then
    echo "Restoring from backup: $backup_file"

    # Unregister current Ubuntu
    wsl --unregister Ubuntu

    # Import from backup
    wsl --import Ubuntu "$HOME/Ubuntu-Restored" "$backup_file"

    # Set as default
    wsl --set-default Ubuntu

    echo "✅ WSL restored from backup"
else
    echo "Skipping WSL restore"
fi

# Restart WSL
wsl --distribution Ubuntu

echo "🔄 Recovery complete. You may need to:"
echo "  - Reinstall some packages: sudo apt update && sudo apt upgrade"
echo "  - Recreate SSH keys if lost"
echo "  - Reconfigure development tools"
EOF

chmod +x ~/recover-wsl.sh
```

## Development Containers (Dev Containers)

### Why Use Dev Containers?

**What are dev containers?**
Dev containers are Docker containers specifically configured for development environments. They provide consistent, isolated development environments that work across different machines and team members.

**Why dev containers for DevOps?**
- **Environment consistency** across development, testing, and production
- **Dependency isolation** prevents conflicts between projects
- **Team collaboration** ensures everyone uses identical environments
- **CI/CD integration** use the same container in pipelines
- **Easy onboarding** new team members get running instantly
- **Security** isolate development tools and dependencies

### Setting Up Dev Containers in VS Code

**Why VS Code dev containers?**
VS Code's dev container extension provides seamless integration with your development workflow, automatically mounting your source code and providing full IDE features inside the container.

```json
// .devcontainer/devcontainer.json
{
    "name": "Python DevOps Environment",
    "dockerComposeFile": "docker-compose.yml",
    "service": "devcontainer",
    "workspaceFolder": "/workspaces/${localWorkspaceFolderBasename}",
    "shutdownAction": "stopCompose",

    // Configure tool-specific properties
    "customizations": {
        "vscode": {
            "extensions": [
                "ms-python.python",
                "ms-python.black-formatter",
                "ms-python.flake8",
                "ms-toolsai.jupyter",
                "redhat.vscode-yaml",
                "hashicorp.terraform",
                "ms-azuretools.vscode-docker",
                "ms-vscode.vscode-json",
                "GitHub.copilot"
            ],
            "settings": {
                "python.defaultInterpreterPath": "/usr/local/bin/python",
                "python.linting.enabled": true,
                "python.linting.flake8Enabled": true,
                "python.formatting.provider": "black",
                "editor.formatOnSave": true,
                "editor.codeActionsOnSave": {
                    "source.organizeImports": true
                }
            }
        }
    },

    // Use 'forwardPorts' to make a list of ports inside the container available locally
    "forwardPorts": [3000, 8000, 8080],

    // Use 'postCreateCommand' to run commands after the container is created
    "postCreateCommand": "pip install -r requirements.txt",

    // Comment out to connect as root instead
    "remoteUser": "vscode"
}
```

### Python DevOps Environment Example

**Why this specific Python setup?**
This example creates a comprehensive Python environment for DevOps work, including infrastructure as code tools, cloud SDKs, and development utilities.

```yaml
# .devcontainer/docker-compose.yml
version: '3.8'

services:
  devcontainer:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      # Mount the workspace
      - ..:/workspaces:cached
      # Mount Docker socket for Docker-in-Docker
      - /var/run/docker.sock:/var/run/docker.sock
      # Mount SSH keys for Git access
      - ~/.ssh:/home/vscode/.ssh:cached
      # Mount AWS credentials
      - ~/.aws:/home/vscode/.aws:cached
      # Mount Azure credentials
      - ~/.azure:/home/vscode/.azure:cached
    working_dir: /workspaces
    command: sleep infinity
    environment:
      - DOCKER_BUILDKIT=1
    networks:
      - devcontainer

networks:
  devcontainer:
    driver: bridge
```

```dockerfile
# .devcontainer/Dockerfile
FROM mcr.microsoft.com/devcontainers/python:3.11

# Install system dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        curl \
        wget \
        git \
        vim \
        htop \
        jq \
        unzip \
        ca-certificates \
        gnupg \
        lsb-release \
        build-essential \
        libssl-dev \
        zlib1g-dev \
        libbz2-dev \
        libreadline-dev \
        libsqlite3-dev \
        llvm \
        libncurses5-dev \
        libncursesw5-dev \
        xz-utils \
        tk-dev \
        libffi-dev \
        liblzma-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python tools
RUN pip install --upgrade pip \
    && pip install \
        pip-tools \
        virtualenv \
        black \
        flake8 \
        mypy \
        pytest \
        pytest-cov \
        pre-commit \
        ansible \
        molecule \
        docker \
        kubernetes \
        openshift \
        boto3 \
        azure-identity \
        google-cloud-storage

# Install AWS CLI v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf awscliv2.zip aws/

# Install Azure CLI
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

# Install Google Cloud SDK
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list \
    && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add - \
    && apt-get update \
    && apt-get install -y google-cloud-sdk \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Terraform
RUN wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list \
    && apt-get update \
    && apt-get install -y terraform \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
    && chmod +x kubectl \
    && mv kubectl /usr/local/bin/

# Install Helm
RUN curl https://get.helm.sh/helm-v3.12.0-linux-amd64.tar.gz -o helm.tar.gz \
    && tar -zxvf helm.tar.gz \
    && mv linux-amd64/helm /usr/local/bin/ \
    && rm -rf helm.tar.gz linux-amd64/

# Install Docker CLI (for Docker-in-Docker)
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create workspace directory
RUN mkdir -p /workspaces
WORKDIR /workspaces

# Switch to vscode user
USER vscode
```

```txt
# requirements.txt
# Python dependencies for DevOps development
ansible>=7.0.0
boto3>=1.28.0
botocore>=1.31.0
kubernetes>=26.0.0
openshift>=0.13.0
azure-identity>=1.12.0
google-cloud-storage>=2.8.0
docker>=6.1.0
pytest>=7.4.0
black>=23.0.0
flake8>=6.0.0
mypy>=1.5.0
pre-commit>=3.4.0
```

### Using Dev Containers in Your Workflow

**How to open a project in a dev container:**

1. **Open in VS Code:**
   ```bash
   code .
   ```

2. **Reopen in Container:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Dev Containers: Reopen in Container"
   - Select your dev container configuration

3. **Command Line Alternative:**
   ```bash
   # Open current directory in dev container
   code --folder-uri vscode-remote://dev-container+$(pwd | sed 's|/|%2F|g')/workspaces/$(basename $(pwd))
   ```

### Advanced Dev Container Patterns

#### Multi-Stage Development Environments

**Why multi-stage containers?**
Different development phases may require different tools. Multi-stage containers allow you to switch environments based on your current task.

```json
// .devcontainer/devcontainer.json (multi-stage example)
{
    "name": "Multi-Stage Python DevOps",
    "dockerComposeFile": "docker-compose.yml",
    "service": "devcontainer",
    "workspaceFolder": "/workspaces/${localWorkspaceFolderBasename}",
    
    "customizations": {
        "vscode": {
            "extensions": [
                "ms-python.python",
                "hashicorp.terraform",
                "ms-azuretools.vscode-docker"
            ]
        }
    },

    // Define different container configurations
    "overrideCommand": false,
    "postCreateCommand": "echo 'Dev container ready!'",
    
    // Feature flags for different development stages
    "features": {
        "ghcr.io/devcontainers/features/docker-in-docker:2": {
            "moby": true,
            "dockerDashComposeVersion": "v2"
        },
        "ghcr.io/devcontainers/features/kubectl-helm-minikube:1": {
            "version": "latest"
        }
    }
}
```

#### Infrastructure as Code Dev Container

**Why specialized IaC containers?**
Infrastructure as Code requires specific tools and versions that may differ from application development.

```dockerfile
# .devcontainer/Dockerfile.iac
FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install Terraform versions
RUN wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list \
    && apt-get update \
    && apt-get install -y terraform terraform-ls \
    && apt-get clean

# Install Terragrunt
RUN curl -Lo terragrunt https://github.com/gruntwork-io/terragrunt/releases/latest/download/terragrunt_linux_amd64 \
    && chmod +x terragrunt \
    && mv terragrunt /usr/local/bin/

# Install TFLint
RUN curl -s https://raw.githubusercontent.com/terraform-linters/tflint/master/install_linux.sh | bash

# Install Checkov
RUN pip install checkov

# Install Infracost
RUN curl -fsSL https://raw.githubusercontent.com/infracost/infracost/master/scripts/install.sh | sh

USER vscode
```

#### Dev Container for CI/CD Pipeline Development

**Why CI/CD containers?**
Developing CI/CD pipelines requires testing against the same environment used in production pipelines.

```yaml
# .devcontainer/docker-compose.cicd.yml
version: '3.8'

services:
  devcontainer:
    build:
      context: .
      dockerfile: Dockerfile.cicd
    volumes:
      - ..:/workspaces:cached
      - /var/run/docker.sock:/var/run/docker.sock
    working_dir: /workspaces
    environment:
      - DOCKER_BUILDKIT=1
      - CI=true
    networks:
      - cicd

  # GitLab Runner for local testing
  gitlab-runner:
    image: gitlab/gitlab-runner:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./gitlab-runner-config:/etc/gitlab-runner
    networks:
      - cicd

  # Jenkins for local testing
  jenkins:
    image: jenkins/jenkins:lts
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    ports:
      - "8080:8080"
    networks:
      - cicd

volumes:
  jenkins_home:

networks:
  cicd:
    driver: bridge
```

### Dev Container Best Practices

#### Security Considerations

**Why secure dev containers?**
Dev containers may contain sensitive credentials and access production systems - security is critical.

```dockerfile
# Secure dev container practices
FROM mcr.microsoft.com/devcontainers/python:3.11

# Create non-root user early
RUN useradd -m -s /bin/bash vscode \
    && chown -R vscode:vscode /home/vscode

# Install tools as root, then switch to non-root user
USER root

RUN apt-get update && apt-get install -y \
    curl \
    git \
    # Add your tools here
    && rm -rf /var/lib/apt/lists/*

# Install Python packages securely
RUN pip install --no-cache-dir \
    --index-url https://pypi.org/simple \
    --trusted-host pypi.org \
    requests \
    boto3

# Switch to non-root user
USER vscode

# Set secure working directory
WORKDIR /workspaces

# Avoid running as root in containers
# Use USER directive and proper file permissions
```

#### Performance Optimization

**Why optimize dev container performance?**
Dev containers should feel as responsive as local development while providing environment consistency.

```json
// Optimized devcontainer.json
{
    "name": "Optimized Python DevOps",
    "build": {
        "dockerfile": "Dockerfile",
        "context": ".",
        // Use build args for customization
        "args": {
            "PYTHON_VERSION": "3.11",
            "NODE_VERSION": "18"
        }
    },
    
    // Optimize volume mounting
    "mounts": [
        // Use delegated consistency for better performance on macOS/Windows
        "source=${localWorkspaceFolder},target=/workspaces,type=bind,consistency=delegated",
        // Cache pip packages
        "source=pip-cache,target=/home/vscode/.cache/pip,type=volume"
    ],
    
    // Use remote user for security
    "remoteUser": "vscode",
    
    // Optimize container startup
    "postCreateCommand": "pip install -r requirements.txt --user",
    
    // Configure ports for development
    "forwardPorts": [3000, 8000, 8080],
    
    // Set container-specific environment
    "containerEnv": {
        "PYTHONPATH": "/workspaces/src",
        "DOCKER_BUILDKIT": "1"
    }
}
```

#### Team Collaboration Features

**Why team features in dev containers?**
Dev containers enable consistent team environments and simplify onboarding.

```json
// Team devcontainer.json with shared configurations
{
    "name": "Team Python DevOps Environment",
    
    // Use team's base image
    "image": "myregistry.azurecr.io/devcontainers/python-devops:latest",
    
    // Team-wide extensions
    "customizations": {
        "vscode": {
            "extensions": [
                // Team standards
                "ms-python.python",
                "ms-python.black-formatter",
                "GitHub.copilot",
                // Project specific
                "hashicorp.terraform",
                "ms-azuretools.vscode-docker"
            ],
            "settings": {
                // Team coding standards
                "python.formatting.provider": "black",
                "python.linting.flake8Enabled": true,
                "editor.formatOnSave": true,
                "editor.codeActionsOnSave": {
                    "source.organizeImports": true
                },
                // Team-specific settings
                "terraform.languageServer.enable": true,
                "azure.terraform.enable": true
            }
        }
    },
    
    // Team secrets management
    "secrets": {
        "AZURE_CLIENT_ID": {
            "description": "Azure service principal client ID"
        },
        "AZURE_TENANT_ID": {
            "description": "Azure tenant ID"
        }
    }
}
```

### Integrating Dev Containers with DevOps Workflows

#### Local Development to CI/CD Pipeline

**Why integrate with CI/CD?**
Using dev containers locally ensures your development environment matches your CI/CD pipelines.

```yaml
# .github/workflows/dev-container-ci.yml
name: Dev Container CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Dev Container
      uses: devcontainers/ci@v0.3
      with:
        configFile: .devcontainer/devcontainer.json
        
    - name: Run tests
      run: |
        pip install -r requirements.txt
        pytest
        
    - name: Run linting
      run: |
        black --check .
        flake8 .
        
    - name: Security scan
      run: |
        # Run security tools
        bandit -r .
        safety check
```

#### Dev Container Registry Management

**Why manage dev container registries?**
Teams can share standardized development environments through container registries.

```bash
# Build and push dev container image
docker build -f .devcontainer/Dockerfile -t myregistry.azurecr.io/devcontainers/python-devops:latest .
docker push myregistry.azurecr.io/devcontainers/python-devops:latest

# Use in devcontainer.json
{
    "image": "myregistry.azurecr.io/devcontainers/python-devops:latest"
}
```

Dev containers transform how you approach development environments, providing consistency, isolation, and seamless integration with your DevOps workflows. Start with the Python example above and customize it for your specific needs!

## Next Steps and Best Practices

### Ongoing Maintenance

**Why regular maintenance?**
DevOps environments evolve rapidly - regular maintenance ensures optimal performance and security.

1. **Weekly Updates:**

   ```bash
   # Update WSL
   sudo apt update && sudo apt upgrade -y

   # Update Windows tools
   winget upgrade --all
   ```

2. **Monthly Security Review:**

   - Review SSH keys and rotate if necessary
   - Update all development tools
   - Check for security vulnerabilities in dependencies

3. **Performance Monitoring:**
   - Monitor WSL memory usage
   - Clean up Docker images and containers
   - Review disk space usage

### Advanced Configurations

**Why advanced configurations?**
As your DevOps skills grow, these configurations optimize your environment for complex workflows.

1. **Multi-Environment Setup:**

   - Separate WSL distributions for different projects
   - Isolated Python/Node.js environments
   - Project-specific Docker networks

2. **CI/CD Integration:**

   - Local GitLab Runner in Docker
   - Jenkins in WSL for testing
   - GitHub Actions local testing

3. **Cloud Development:**
   - AWS Cloud9-like setup with VS Code
   - Azure Cloud Shell integration
   - GCP Cloud Code extensions

### Troubleshooting Common Issues

**Why document troubleshooting?**
Development environments can have issues - documented solutions save time and frustration.

**WSL Performance Issues:**

```bash
# Check WSL configuration
wsl --list --verbose

# Restart WSL
wsl --shutdown
wsl

# Update WSL kernel
wsl --update
```

**Docker Integration Problems:**

```bash
# Restart Docker Desktop
# Check WSL integration in Docker settings
# Verify Docker daemon is running: docker info
```

**Network Connectivity Issues:**

```bash
# Reset WSL network
wsl --shutdown
Get-NetAdapter | Where-Object {$_.Name -like "*WSL*"} | Restart-NetAdapter

# Check Windows firewall settings
# Verify VPN compatibility
```

Your Windows + WSL DevOps environment is now ready for professional development work! This setup provides the perfect balance of Windows productivity and Linux power for modern DevOps workflows.

**Key Achievements:**

- ✅ Native Linux performance with WSL 2
- ✅ Seamless Windows integration
- ✅ Complete DevOps toolset
- ✅ Security-hardened environment
- ✅ Automated backup and recovery
- ✅ Optimized development workflows

**Ready for DevOps success! 🚀🪟🐧**
