---
layout: post
title: "🔧 Setting Up Azure Development Tools with Python on macOS"
categories: [Azure, Python, DevOps, Tutorial]
description: "A comprehensive guide to setting up Azure development tools with Python on macOS, including authentication, CLI, and SDK setup."
excerpt: "Learn how to set up a complete Azure development environment on macOS using Python, including authentication methods, CLI tools, and best practices for development."
---


# Setting Up Azure Development Tools with Python on macOS

As a DevOps engineer working with Azure, having a properly configured local development environment is crucial. In this guide, I'll walk you through setting up Azure tools for Python development on macOS, including some tips and tricks I've learned along the way.

## Prerequisites

Before we begin, make sure you have:
- Python 3.8 or later
- pip (Python package manager)
- Homebrew (macOS package manager)
- A text editor (VS Code recommended)
- An Azure subscription

## 1. Installing Azure CLI

The Azure CLI is your command-line interface to Azure. Here's how to install it on macOS:

```bash
brew update && brew install azure-cli
```

Verify the installation:

```bash
az --version
```

## 2. Authentication Setup

There are several ways to authenticate with Azure. Here are the most common approaches:

### 2.1 Interactive Browser Login

```bash
az login
```

This opens your default browser for authentication. It's great for local development but not suitable for automation.

### 2.2 Service Principal Authentication

For automation and CI/CD, create a service principal:

```bash
az ad sp create-for-rbac --name "my-app-sp" --role contributor
```

Store the output securely - you'll need it for Python SDK authentication.

### 2.3 Environment Variables

Set up environment variables for authentication:

```bash
export AZURE_SUBSCRIPTION_ID="your-subscription-id"
export AZURE_TENANT_ID="your-tenant-id"
export AZURE_CLIENT_ID="your-client-id"
export AZURE_CLIENT_SECRET="your-client-secret"
```

Pro tip: Add these to your `~/.zshrc` or use [direnv](https://direnv.net/) for project-specific environment variables.

## 3. Python SDK Setup

Install the Azure SDK for Python:

```bash
pip install azure-identity azure-mgmt-resource azure-mgmt-compute azure-mgmt-network
```

Here's a basic script to test your setup:

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient
import os

# Use DefaultAzureCredential which tries different authentication methods
credential = DefaultAzureCredential()

# Create a Resource Management client
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]
resource_client = ResourceManagementClient(credential, subscription_id)

# List resource groups
for group in resource_client.resource_groups.list():
    print(f"Resource Group: {group.name} - Location: {group.location}")
```

## 4. VS Code Extensions

Install these VS Code extensions for better Azure development:

- Azure Tools
- Python
- Azure Account
- Azure Resources

## 5. Best Practices

### 5.1 Using Virtual Environments

Always use virtual environments for your Python projects:

```bash
python -m venv .venv
source .venv/bin/activate
```

### 5.2 Requirements File

Keep track of your dependencies:

```bash
pip freeze > requirements.txt
```

Example `requirements.txt`:
```text
azure-identity>=1.12.0
azure-mgmt-resource>=21.1.0
azure-mgmt-compute>=29.1.0
azure-mgmt-network>=21.0.1
```

### 5.3 .gitignore Settings

Add these to your `.gitignore`:

```text
# Python
__pycache__/
*.py[cod]
*$py.class
.venv/

# Azure
.azure/
azureauth.json

# Environment variables
.env
.envrc
```

## 6. Troubleshooting Common Issues

### 6.1 Certificate Issues

If you encounter SSL certificate errors:

```bash
export REQUESTS_CA_BUNDLE=/usr/local/etc/openssl/cert.pem
```

### 6.2 Token Expiration

If you get authentication errors, try:

```bash
az account get-access-token
```

### 6.3 Multiple Subscriptions

List and set the correct subscription:

```bash
az account list --output table
az account set --subscription "Your-Subscription-Name"
```

## 7. Development Workflow

Here's a typical workflow I use:

1. Create a new project directory
2. Set up a virtual environment
3. Install required packages
4. Configure authentication
5. Create a basic script structure

Example project structure:
```
my-azure-project/
├── .venv/
├── .gitignore
├── requirements.txt
├── src/
│   ├── __init__.py
│   ├── config.py
│   └── main.py
└── README.md
```

## Conclusion

With this setup, you're ready to start developing Python applications for Azure on your Mac. Remember to:
- Keep your credentials secure
- Use virtual environments
- Update your tools regularly
- Check Azure documentation for SDK updates

## Resources

- [Azure Python Developer Guide](https://docs.microsoft.com/en-us/azure/developer/python/)
- [Azure SDK for Python Documentation](https://docs.microsoft.com/en-us/python/api/overview/azure/)
- [Azure CLI Reference](https://docs.microsoft.com/en-us/cli/azure/reference-index)
- [Authentication Best Practices](https://docs.microsoft.com/en-us/azure/developer/python/azure-sdk-authenticate)

Happy coding! 🚀
