---
layout: post
title: "Setting Up a Developer Machine for Python and Node.js on Ubuntu LTS"
description: "Complete guide to setting up a development environment for Python and Node.js on Ubuntu LTS, including installation, configuration, tools, databases, security, and troubleshooting."
tags: [python, nodejs, ubuntu, setup, development-environment, tutorial]
icon: 💻
excerpt: >
  Comprehensive tutorial for setting up a developer machine for Python and Node.js development on Ubuntu LTS. Covers Python installation with pyenv, Node.js with nvm, development tools like VS Code, databases, Docker, cloud CLIs, security hardening, and common pitfalls to avoid.
author: "owner"
date: 2025-10-29 10:00:00 +0000
categories: [Development, Tutorial]
permalink: /posts/developer-machine-setup/
---

## Introduction

Setting up a robust development environment is crucial for efficient coding, debugging, and deployment. This guide will walk you through setting up a developer machine for Python and Node.js development on Ubuntu LTS (Long Term Support). We'll cover everything from basic installations to advanced configurations, and highlight common pitfalls to avoid.

Ubuntu LTS versions (like 22.04 or 24.04) are ideal for development due to their stability and long support cycles. This guide assumes you're starting with a fresh Ubuntu LTS installation.

## Prerequisites

Before we begin, ensure you have:

- Ubuntu LTS installed (22.04 or 24.04 recommended)
- Sudo privileges
- Internet connection
- At least 8GB RAM (16GB recommended for smooth development)
- 50GB free disk space

Update your system first:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y
```

## Installing Python

### Using Ubuntu's Package Manager

Ubuntu comes with Python 3 pre-installed, but it's often an older version. Let's install the latest Python version alongside the system Python.

```bash
# Check current Python version
python3 --version

# Install essential build tools
sudo apt install -y build-essential libssl-dev zlib1g-dev \
libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev

# Install Python 3.11 (or latest stable)
sudo apt install -y python3.11 python3.11-venv python3.11-dev
```

### Using pyenv for Version Management

For better version control, use pyenv to manage multiple Python versions:

```bash
# Install pyenv dependencies
sudo apt install -y curl git

# Install pyenv
curl https://pyenv.run | bash

# Add to your shell profile (~/.bashrc or ~/.zshrc)
echo 'export PATH="$HOME/.pyenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.bashrc

# Reload shell
source ~/.bashrc

# Install Python versions
pyenv install 3.11.0
pyenv install 3.10.0
pyenv global 3.11.0

# Verify installation
python --version
```

### Setting Up Virtual Environments

Always use virtual environments to isolate project dependencies:

```bash
# Using venv (built-in)
python3 -m venv myproject
source myproject/bin/activate
pip install --upgrade pip

# Using pyenv-virtualenv
pyenv virtualenv 3.11.0 myproject
pyenv activate myproject
```

## Installing Node.js

### Using NodeSource Repository

For the latest LTS version of Node.js:

```bash
# Install Node.js 20.x LTS (current as of 2025)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Using nvm (Node Version Manager)

For managing multiple Node.js versions:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Add to shell profile
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc

# Reload shell
source ~/.bashrc

# Install Node.js versions
nvm install --lts
nvm install 18
nvm use --lts

# Verify
node --version
npm --version
```

### Updating npm and Installing Global Packages

```bash
# Update npm
npm install -g npm@latest

# Install essential global packages
npm install -g yarn pnpm
npm install -g typescript @types/node
npm install -g eslint prettier
npm install -g nodemon ts-node
```

## Development Tools and Editors

### Visual Studio Code

```bash
# Install VS Code
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt install apt-transport-https
sudo apt update
sudo apt install code

# Essential VS Code extensions for Python and Node.js
code --install-extension ms-python.python
code --install-extension ms-python.black-formatter
code --install-extension ms-python.isort
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
```

### Vim/Neovim Setup

```bash
# Install Neovim
sudo apt install -y neovim

# Install vim-plug
curl -fLo ~/.local/share/nvim/site/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

# Create Neovim config
mkdir -p ~/.config/nvim
cat > ~/.config/nvim/init.vim << EOF
call plug#begin('~/.vim/plugged')
Plug 'neovim/nvim-lspconfig'
Plug 'hrsh7th/nvim-cmp'
Plug 'hrsh7th/cmp-nvim-lsp'
Plug 'saadparwaiz1/cmp_luasnip'
Plug 'L3MON4D3/LuaSnip'
Plug 'nvim-treesitter/nvim-treesitter', {'do': ':TSUpdate'}
Plug 'psf/black', { 'branch': 'main' }
Plug 'dense-analysis/ale'
call plug#end()

lua << EOF
require('lspconfig').pyright.setup{}
require('lspconfig').tsserver.setup{}
EOF
EOF
```

### Git Configuration

```bash
# Install Git
sudo apt install -y git

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global core.editor "code --wait"
git config --global init.defaultBranch main

# Generate SSH key for GitHub
ssh-keygen -t ed25519 -C "your.email@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
# Copy the output and add to GitHub
```

## Database Setup

### PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create a database user
sudo -u postgres createuser --interactive --pwprompt yourusername
sudo -u postgres createdb yourdatabase

# Install pgAdmin (optional GUI)
sudo apt install -y pgadmin4
```

### MongoDB

```bash
# Install MongoDB
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Containerization with Docker

```bash
# Install Docker
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect

# Install Docker Compose
sudo apt install -y docker-compose
```

## Cloud CLI Tools

### AWS CLI

```bash
# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS
aws configure
```

### Azure CLI

```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login
az login
```

### Google Cloud SDK

```bash
# Install Google Cloud SDK
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
sudo apt update && sudo apt install -y google-cloud-sdk

# Initialize
gcloud init
```

## Security Considerations

### SSH Hardening

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Recommended changes:
# Port 22 -> Port 2222 (or other non-standard port)
# PermitRootLogin no
# PasswordAuthentication no
# AllowUsers yourusername

# Restart SSH
sudo systemctl restart ssh
```

### Firewall Setup

```bash
# Install UFW
sudo apt install -y ufw

# Configure firewall
sudo ufw allow 2222/tcp  # SSH on custom port
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable
```

### VPN Setup (Optional)

Consider setting up a VPN for secure remote access:

```bash
# Install OpenVPN
sudo apt install -y openvpn easy-rsa

# Or WireGuard
sudo apt install -y wireguard
```

## Performance Optimization

### System Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop ncdu tree

# Install system info
sudo apt install -y neofetch
```

### SSD Optimization

If using an SSD:

```bash
# Enable TRIM
sudo systemctl enable fstrim.timer
sudo systemctl start fstrim.timer
```

### Swap File Tuning

```bash
# Check current swap
free -h

# Create swap file if needed
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Common Pitfalls and Troubleshooting

### 1. PATH Issues

**Problem**: Commands not found after installation.

**Solution**: Check your `~/.bashrc` or `~/.zshrc` and ensure the correct paths are added:

```bash
# For pyenv
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init -)"

# For nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Reload shell
source ~/.bashrc
```

### 2. Permission Errors

**Problem**: Permission denied when installing global npm packages.

**Solutions**:

- Use `nvm` and avoid `sudo` with npm
- Fix permissions: `sudo chown -R $(whoami) ~/.npm`
- Use a Node version manager

### 3. Python Virtual Environment Issues

**Problem**: Virtual environments not activating or packages not installing.

**Solutions**:

- Ensure you're using the correct Python version
- Upgrade pip: `pip install --upgrade pip`
- Use `python -m venv` instead of `virtualenv`
- Check for conflicting installations

### 4. Node.js Version Conflicts

**Problem**: Different projects require different Node versions.

**Solution**: Use `nvm` to manage multiple versions:

```bash
nvm use 18  # For project A
nvm use 20  # For project B
```

### 5. Docker Permission Issues

**Problem**: `docker: Got permission denied` error.

**Solution**:

```bash
sudo usermod -aG docker $USER
# Log out and back in
```

### 6. Git SSH Issues

**Problem**: Git push/pull fails with SSH.

**Solution**:

- Ensure SSH key is added to ssh-agent: `ssh-add ~/.ssh/id_ed25519`
- Test connection: `ssh -T git@github.com`
- Check SSH config: `~/.ssh/config`

### 7. Package Installation Failures

**Problem**: `apt` or `pip` installations fail.

**Solutions**:

- Update package lists: `sudo apt update`
- Clear cache: `sudo apt clean && sudo apt autoclean`
- Fix broken packages: `sudo apt --fix-broken install`
- Use `--no-cache-dir` with pip if network issues

### 8. Memory Issues

**Problem**: System becomes slow during builds.

**Solutions**:

- Increase swap space
- Close unnecessary applications
- Use `nice` to lower process priority: `nice -n 10 npm install`
- Monitor with `htop`

### 9. Firewall Blocking Connections

**Problem**: Services not accessible from outside.

**Solution**:

```bash
sudo ufw status
sudo ufw allow port_number/protocol
```

### 10. Timezone Issues

**Problem**: System time is wrong.

**Solution**:

```bash
sudo dpkg-reconfigure tzdata
# Or
sudo timedatectl set-timezone America/New_York
```

## Development Workflow Tips

### 1. Use Version Control for Everything

```bash
# Initialize git in project
git init
echo "node_modules/" > .gitignore
echo "__pycache__/" >> .gitignore
git add .
git commit -m "Initial commit"
```

### 2. Use Environment Variables

Create a `.env` file for sensitive data:

```bash
# .env
DATABASE_URL=postgresql://user:password@localhost/db
API_KEY=your_api_key_here
```

### 3. Automate Setup with Scripts

Create a setup script for new projects:

```bash
#!/bin/bash
# setup.sh
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
npm install
```

### 4. Use Linters and Formatters

Configure pre-commit hooks:

```bash
pip install pre-commit
pre-commit install

# .pre-commit-config.yaml
repos:
- repo: https://github.com/pre-commit/pre-commit-hooks
  rev: v4.4.0
  hooks:
  - id: trailing-whitespace
  - id: end-of-file-fixer
- repo: https://github.com/psf/black
  rev: 22.10.0
  hooks:
  - id: black
```

### 5. Backup Your Configuration

```bash
# Backup dotfiles
mkdir ~/dotfiles
cp ~/.bashrc ~/dotfiles/
cp ~/.gitconfig ~/dotfiles/
cp -r ~/.config/nvim ~/dotfiles/

# Use a dotfiles manager like stow or bare git repo
```

## Conclusion

Setting up a developer machine for Python and Node.js on Ubuntu LTS involves multiple components working together seamlessly. The key is to use version managers (pyenv, nvm), virtual environments, and proper tooling to avoid conflicts and ensure reproducibility.

Remember to:

- Keep your system updated
- Use virtual environments for Python projects
- Manage Node versions with nvm
- Secure your setup with SSH keys and firewall
- Backup your configurations
- Monitor system performance

With this setup, you'll have a robust, efficient development environment that can handle both Python and Node.js projects with ease. Happy coding!

## Resources

- [Ubuntu Documentation](https://ubuntu.com/desktop/developers)
- [Python Official Documentation](https://docs.python.org/3/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [VS Code Documentation](https://code.visualstudio.com/docs)
- [Docker Documentation](https://docs.docker.com/)

If you encounter any issues not covered here, the respective project documentation and community forums are excellent resources for troubleshooting.
