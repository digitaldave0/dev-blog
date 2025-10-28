---
layout: post
title: "☁️ Azure CLI Cheatsheet: Essential Commands for DevOps Engineers"
categories: [Azure, DevOps, Cloud, Cheatsheet]
excerpt: "Master Azure CLI with this comprehensive command reference. Includes practical examples for managing resources, VMs, AKS, storage, and more. Perfect for DevOps engineers working with Azure!"
description: "Complete Azure CLI command reference with real-world examples and use cases. Covers resource management, compute, containers, networking, storage, and security. Essential guide for DevOps professionals working with Azure cloud infrastructure."
---


# Azure CLI Commands Cheatsheet for DevOps Engineers

A comprehensive collection of Azure CLI commands organized by service and common use cases. Each command includes practical examples and typical DevOps scenarios.

## Authentication and Account Management

### Login and Subscription

| Command | Example | Use Case |
|---------|---------|----------|
| `az login` | `az login --use-device-code` | Secure login in CI/CD pipelines |
| `az account set` | `az account set --subscription "Production"` | Switch between environments |
| `az account list` | `az account list --query "[].{Name:name, ID:id, State:state}"` | Audit available subscriptions |
| `az account show` | `az account show --query "{Name:name, ID:id}"` | Verify active subscription |

## Resource Management

### Resource Groups

| Command | Example | Use Case |
|---------|---------|----------|
| `az group create` | `az group create --name prod-rg --location eastus --tags env=prod` | Create tagged resource groups |
| `az group list` | `az group list --query "[].{Name:name, Location:location}"` | Inventory resource groups |
| `az group delete` | `az group delete --name dev-rg --yes --no-wait` | Clean up development resources |

### Resource Management

| Command | Example | Use Case |
|---------|---------|----------|
| `az resource list` | `az resource list --resource-group prod-rg --query "[].{Name:name, Type:type}"` | Audit resources |
| `az resource show` | `az resource show --resource-group prod-rg --name myapp --resource-type "Microsoft.Web/sites"` | Resource details |
| `az resource tag` | `az resource tag --tags "env=prod" "owner=team" -g prod-rg -n myapp --resource-type "Microsoft.Web/sites"` | Resource tagging |

## Virtual Machines

### VM Management

| Command | Example | Use Case |
|---------|---------|----------|
| `az vm create` | `az vm create --resource-group prod-rg --name web-vm --image UbuntuLTS --admin-username azureuser --generate-ssh-keys` | Deploy web servers |
| `az vm list` | `az vm list --resource-group prod-rg --query "[].{Name:name, State:powerState}"` | Monitor VM status |
| `az vm start` | `az vm start --resource-group prod-rg --name web-vm` | Start production VMs |
| `az vm stop` | `az vm stop --resource-group dev-rg --name test-vm` | Stop dev machines |

### VM Configuration

| Command | Example | Use Case |
|---------|---------|----------|
| `az vm extension set` | `az vm extension set --resource-group prod-rg --vm-name web-vm --name customScript --publisher Microsoft.Azure.Extensions --settings ./script-config.json` | Configure VM software |
| `az vm update` | `az vm update --resource-group prod-rg --name web-vm --set vmSize=Standard_DS3_v2` | Scale VM resources |
| `az vm disk attach` | `az vm disk attach --resource-group prod-rg --vm-name db-vm --name data-disk --size-gb 128` | Add storage capacity |

## Azure Kubernetes Service (AKS)

### Cluster Management

| Command | Example | Use Case |
|---------|---------|----------|
| `az aks create` | `az aks create --resource-group prod-rg --name prod-cluster --node-count 3 --enable-managed-identity` | Create production cluster |
| `az aks get-credentials` | `az aks get-credentials --resource-group prod-rg --name prod-cluster` | Configure kubectl |
| `az aks scale` | `az aks scale --resource-group prod-rg --name prod-cluster --node-count 5` | Scale cluster capacity |
| `az aks nodepool add` | `az aks nodepool add --resource-group prod-rg --cluster-name prod-cluster --name gpupool --node-count 2 --node-vm-size Standard_NC6` | Add specialized nodes |

### Cluster Operations

| Command | Example | Use Case |
|---------|---------|----------|
| `az aks upgrade` | `az aks upgrade --resource-group prod-rg --name prod-cluster --kubernetes-version 1.26.0` | Cluster upgrades |
| `az aks show` | `az aks show --resource-group prod-rg --name prod-cluster --query "currentKubernetesVersion"` | Version management |
| `az aks update` | `az aks update --resource-group prod-rg --name prod-cluster --enable-cluster-autoscaler --min-count 1 --max-count 5` | Enable autoscaling |

## Storage Accounts

### Account Management

| Command | Example | Use Case |
|---------|---------|----------|
| `az storage account create` | `az storage account create --name prodstore --resource-group prod-rg --sku Standard_ZRS --https-only true` | Create secure storage |
| `az storage account list` | `az storage account list --query "[].{Name:name, Location:location, Kind:kind}"` | Inventory storage accounts |
| `az storage account update` | `az storage account update --name prodstore --resource-group prod-rg --enable-hierarchical-namespace true` | Enable features |

### Container Operations

| Command | Example | Use Case |
|---------|---------|----------|
| `az storage container create` | `az storage container create --account-name prodstore --name backups --auth-mode login` | Create backup storage |
| `az storage blob upload-batch` | `az storage blob upload-batch --account-name prodstore --source ./logs --destination logs` | Upload log files |
| `az storage blob download-batch` | `az storage blob download-batch --account-name prodstore --source backups --destination ./restore` | Restore backups |

## App Service

### Web App Management

| Command | Example | Use Case |
|---------|---------|----------|
| `az webapp create` | `az webapp create --resource-group prod-rg --plan prod-plan --name myapp --runtime "NODE:16-lts"` | Deploy web applications |
| `az webapp deployment slot create` | `az webapp deployment slot create --resource-group prod-rg --name myapp --slot staging` | Set up staging slots |
| `az webapp deployment source config` | `az webapp deployment source config --resource-group prod-rg --name myapp --repo-url https://github.com/org/app --branch main` | Configure CI/CD |

### Configuration

| Command | Example | Use Case |
|---------|---------|----------|
| `az webapp config set` | `az webapp config set --resource-group prod-rg --name myapp --always-on true` | Optimize performance |
| `az webapp config appsettings set` | `az webapp config appsettings set --resource-group prod-rg --name myapp --settings DATABASE_URL="url" API_KEY="key"` | Configure app settings |
| `az webapp log tail` | `az webapp log tail --resource-group prod-rg --name myapp` | Monitor applications |

## Networking

### Virtual Networks

| Command | Example | Use Case |
|---------|---------|----------|
| `az network vnet create` | `az network vnet create --resource-group prod-rg --name prod-vnet --address-prefix 10.0.0.0/16` | Create network infrastructure |
| `az network vnet subnet create` | `az network vnet subnet create --resource-group prod-rg --vnet-name prod-vnet --name backend --address-prefix 10.0.1.0/24` | Segment networks |
| `az network vnet peering create` | `az network vnet peering create --resource-group prod-rg --name peer1to2 --vnet-name vnet1 --remote-vnet vnet2` | Connect networks |

### Security Groups

| Command | Example | Use Case |
|---------|---------|----------|
| `az network nsg create` | `az network nsg create --resource-group prod-rg --name web-nsg` | Create security groups |
| `az network nsg rule create` | `az network nsg rule create --resource-group prod-rg --nsg-name web-nsg --name allow-https --priority 100 --port 443` | Configure access rules |
| `az network nsg show` | `az network nsg show --resource-group prod-rg --name web-nsg --query "securityRules"` | Audit security rules |

## Monitor and Diagnose

### Monitoring

| Command | Example | Use Case |
|---------|---------|----------|
| `az monitor metrics list` | `az monitor metrics list --resource-id /subscriptions/xxx/resourceGroups/prod-rg/providers/Microsoft.Web/sites/myapp --metric CPUUsage` | Performance monitoring |
| `az monitor log-analytics workspace create` | `az monitor log-analytics workspace create --resource-group prod-rg --workspace-name prod-logs` | Set up logging |
| `az monitor diagnostic-settings create` | `az monitor diagnostic-settings create --resource-id /subscriptions/xxx/resourceGroups/prod-rg/providers/Microsoft.Web/sites/myapp --workspace prod-logs` | Configure diagnostics |

## Best Practices and Tips

### Output Formatting
```bash
# Get JSON output
az vm list --output json

# Format as table
az vm list --output table

# Custom query
az vm list --query "[].{Name:name, Size:hardwareProfile.vmSize}" --output table
```

### Working with Multiple Subscriptions
```bash
# Create named profiles
az login --scope https://management.core.windows.net//.default
az configure --defaults group=prod-rg location=eastus

# Use specific subscription
az account set --subscription "Production"
```

### Automation Tips
```bash
# Use environment variables
export AZURE_DEFAULTS_GROUP=prod-rg
export AZURE_DEFAULTS_LOCATION=eastus

# Create service principals
az ad sp create-for-rbac --name "github-actions" --role contributor --scope /subscriptions/xxx

# Use managed identities
az vm identity assign --resource-group prod-rg --name web-vm
```

## Video Resources

### Getting Started
- [Azure CLI Fundamentals](https://www.youtube.com/watch?v=0oZxuQN1Jgk)
- [Azure CLI for DevOps](https://www.youtube.com/watch?v=Yc9ETNu_YLE)

### Advanced Topics
- [Azure CLI Automation](https://www.youtube.com/watch?v=F_hfH0G0M_4)
- [Azure CLI Security Best Practices](https://www.youtube.com/watch?v=Yzd_Xr3xwRM)

## Additional Resources

- [Official Azure CLI Documentation](https://docs.microsoft.com/cli/azure/)
- [Azure CLI GitHub Repository](https://github.com/Azure/azure-cli)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure/reference-index)
- [Azure CLI Query Language](https://docs.microsoft.com/cli/azure/query-azure-cli)
