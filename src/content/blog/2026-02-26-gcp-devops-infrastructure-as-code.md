---
pubDate: 2026-02-26T00:00:00.000Z
title: "\U0001F3D7️ GCP DevOps & Infrastructure-as-Code (IaC) Guide"
categories:
  - GCP
  - DevOps
  - Terraform
  - Docker
  - Tutorial
description: >-
  Deploy Google Cloud resources using Terraform and Infracost from a Docker
  environment.
series: Cloud Infrastructure Series
part: 1
tags:
  - devops
heroImage: >-
  https://picsum.photos/seed/2026-02-26-gcp-devops-infrastructure-as-code/800/400
---


Welcome to the world of Infrastructure-as-Code on Google Cloud Platform! This guide walks you through deploying GCP resources using Terraform and Infracost from within a containerized development environment.

**What we'll cover:**
- Setting up a consistent Docker development environment
- Authenticating with Google Cloud
- Estimating infrastructure costs with Infracost
- Running the complete Terraform workflow
- Verifying deployments
- Cleaning up resources safely

Let's build cloud infrastructure the professional way!

## Why Infrastructure-as-Code?

Before we dive in, understand why IaC matters:

- **Version Control**: Track infrastructure changes like code
- **Reproducibility**: Deploy identical environments every time
- **Automation**: No more manual clicking in the console
- **Cost Control**: Estimate expenses before deploying
- **Team Collaboration**: Share infrastructure definitions across teams

## 🏗️ Environment Setup (Docker Compose)

The foundation of this workflow is a containerized development environment. This ensures everyone on your team uses the same Google Cloud SDK and Terraform versions.

### Why Docker for Development?

- **Consistency**: Same tools on Mac, Linux, Windows
- **Isolation**: Doesn't affect your system tools
- **Credential Sharing**: Safely passes your GCP credentials via bind mounts
- **Easy Reset**: Start fresh with a single command

### Docker Compose Configuration

Create a `docker-compose.yml` file in your project root:

```yaml
services:
  gcp-toolbox:
    build: .
    container_name: gcp_dev_env
    volumes:
      - .:/workspace                           # Syncs code & main.tf
      - ~/.config/gcloud:/root/.config/gcloud  # Syncs GCP Auth
    environment:
      - GCP_PROJECT_ID=${GCP_PROJECT_ID}
      - INFRACOST_API_KEY=${INFRACOST_API_KEY}
    working_dir: /workspace
    tty: true
    stdin_open: true
```

**Key components:**
- `build: .`: Builds from a Dockerfile in the current directory
- `volumes`: Bind mounts link your Mac's files and credentials
- `environment`: Passes secrets via `.env` file
- `working_dir`: Sets the container's working directory
- `tty: true` & `stdin_open: true`: Allows interactive use

### Create the .env File

Create `.env` on your Mac to store secrets (add to `.gitignore`):

```bash
GCP_PROJECT_ID=your-project-id
INFRACOST_API_KEY=ico-your-key-here
```

**Warning**: Never commit `.env` to git. Add it to your `.gitignore`:

```
.env
.terraform/
tfplan.binary
```

### Create the Dockerfile

Create a `Dockerfile` to define the container image:

```dockerfile
FROM google/cloud-sdk:latest

# Install Terraform
RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | apt-key add - && \
    apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main" && \
    apt-get update && apt-get install -y terraform

# Install Infracost
RUN curl -fsSL https://raw.githubusercontent.com/infracost/infracost/master/scripts/install.sh | bash

WORKDIR /workspace
```

**What this installs:**
- Google Cloud SDK (gcloud, gsutil)
- Terraform for IaC
- Infracost for cost estimation

### Start the Environment

On your Mac terminal, start the container:

```bash
docker-compose up -d
```

This:
1. Builds the Docker image (first time only)
2. Starts the container in the background
3. Mounts your credentials and code

Verify it's running:

```bash
docker ps
```

You should see `gcp_dev_env` in the list.

## 🔐 Authentication (The "Credential Tunnel")

Before Terraform can create resources, the container needs permission to access your GCP project. This happens through credential binding.

### Step 1: Authenticate Locally

On your Mac, log in to Google Cloud:

```bash
gcloud auth login
```

This:
- Opens your browser
- Lets you authenticate with your Google account
- Saves credentials to `~/.config/gcloud`

### Step 2: Create Application Default Credentials (ADC)

Terraform needs a JSON key file to authenticate:

```bash
gcloud auth application-default login
```

This:
- Creates a credential file at `~/.config/gcloud/application_default_credentials.json`
- Terraform uses this automatically

### Step 3: The Bind Mount Magic

The Docker Compose volume binding does the heavy lifting:

```yaml
volumes:
  - ~/.config/gcloud:/root/.config/gcloud  # Syncs GCP Auth
```

This line:
- Mounts your Mac's `~/.config/gcloud` folder
- Into the container's `/root/.config/gcloud`
- The container sees all your credentials
- No need to pass keys separately

**Result**: Terraform inside the container can now authenticate with GCP!

### Verify Authentication

Inside the container:

```bash
docker exec -it gcp_dev_env gcloud auth list
```

You should see your authenticated account listed.

## 💰 FinOps & Cost Estimation (Infracost)

Before deploying infrastructure, always estimate the cost. Infracost analyzes your Terraform code and shows the monthly bill.

### Why Estimate First?

- **Avoid Bill Shock**: Know the cost before deploying
- **Budget Planning**: Justify infrastructure spend to stakeholders
- **Cost Optimization**: Spot expensive resources early
- **Change Impact**: See how changes affect monthly costs

### Get an Infracost API Key

1. Visit [infracost.io](https://www.infracost.io)
2. Sign up for a free account
3. Copy your API key
4. Add it to your `.env` file:

```bash
INFRACOST_API_KEY=ico-your-key-here
```

### Quick Cost Breakdown

Analyze your raw Terraform code:

```bash
docker exec -it gcp_dev_env infracost breakdown --path infra/
```

**Output example:**

```
 Name                                     Monthly Qty  Unit                    Monthly Cost
 google_compute_instance.custom-vm-tf     1            instances               $20.40
 google_compute_network.custom-vpc        1            networks                $0.00
 TOTAL MONTHLY COST                                                            $20.40
```

**What this shows:**
- The VM costs $20.40/month
- Networks don't cost extra (in this case)
- Total projected monthly bill

### Detailed Diff (For Updates)

When updating infrastructure, see exactly what changes cost:

```bash
docker exec -it gcp_dev_env infracost diff --path infra/
```

**Output shows:**
- Resources being added/removed
- Cost changes (green = cheaper, red = more expensive)
- The overall cost impact

**Best practice**: Always run `infracost diff` before applying changes.

## 🚀 Terraform Lifecycle (The Workflow)

Now for the core IaC workflow. Think of this as three phases: Initialize, Plan, Apply.

### Phase A: Initialize

Download the necessary Terraform plugins:

```bash
docker exec -it gcp_dev_env terraform -chdir=infra init
```

**What happens:**
- Detects you're using the Google Cloud provider
- Downloads the Google provider plugin
- Initializes the Terraform state file
- Creates a `.terraform/` directory

**Run this once** (unless you add new providers).

### Phase B: Plan & Audit

Create a detailed execution plan and audit costs:

```bash
# Step 1: Generate the binary plan
docker exec -it gcp_dev_env terraform -chdir=infra plan -out=tfplan.binary
```

**Review the output:**
- Shows resources to be created
- Displays their properties
- Lists any errors or warnings

```bash
# Step 2: Convert to JSON for Infracost analysis
docker exec -it gcp_dev_env terraform -chdir=infra show -json tfplan.binary > infra/plan.json

# Step 3: Run final cost check
docker exec -it gcp_dev_env infracost breakdown --path infra/plan.json
```

**Best practice**: Always audit costs before applying!

### Phase C: Apply (The Launch)

Deploy the infrastructure:

```bash
docker exec -it gcp_dev_env terraform -chdir=infra apply tfplan.binary
```

**What happens:**
- Reads the binary plan
- Creates resources in GCP
- Updates the Terraform state file
- Outputs important values (IPs, endpoints, etc.)

**Key point**: Using `tfplan.binary` ensures you deploy exactly what you planned.

### Example Terraform Code

Here's a minimal example `infra/main.tf`:

```hcl
terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
}

# Create a VPC Network
resource "google_compute_network" "custom_vpc" {
  name                    = "custom-vpc"
  auto_create_subnetworks = false
}

# Create a Subnet
resource "google_compute_subnetwork" "custom_subnet" {
  name          = "custom-subnet"
  ip_cidr_range = "10.0.1.0/24"
  region        = var.region
  network       = google_compute_network.custom_vpc.id
}

# Create a VM Instance
resource "google_compute_instance" "custom_vm" {
  name         = "custom-vm-tf"
  machine_type = "e2-medium"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.custom_subnet.id
    access_config {}  # Assigns an external IP
  }
}
```

Create `infra/variables.tf`:

```hcl
variable "gcp_project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "your-project-id"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP Zone"
  type        = string
  default     = "us-central1-a"
}
```

## 🔐 Post-Deployment Verification

After applying, test that everything works correctly.

### View Deployed Resources

List resources created by Terraform:

```bash
docker exec -it gcp_dev_env terraform -chdir=infra state list
```

Show details of a specific resource:

```bash
docker exec -it gcp_dev_env terraform -chdir=infra state show google_compute_instance.custom_vm
```

### SSH into Your VM

Connect to the newly created VM:

```bash
docker exec -it gcp_dev_env gcloud compute ssh dev-user@custom-vm-tf --zone=us-central1-a
```

**Important Note**: Use a non-root user (`dev-user`) to avoid GCP security blocks on root login.

### Health Checks

Verify the network is working:

```bash
docker exec -it gcp_dev_env gcloud compute instances describe custom-vm-tf --zone=us-central1-a
```

This shows:
- IP addresses (internal and external)
- Status (RUNNING or STOPPED)
- Network interfaces
- Boot disk details

## 🧹 Cleanup (Destroy)

Always clean up resources to avoid unexpected charges.

### Step 1: Preview Destruction

See what will be deleted:

```bash
docker exec -it gcp_dev_env terraform -chdir=infra plan -destroy -out=destroy.tfplan
```

**Review the output carefully!** This is your last chance to abort.

### Step 2: Execute Deletion

Delete all managed resources:

```bash
docker exec -it gcp_dev_env terraform -chdir=infra apply destroy.tfplan
```

**What happens:**
- Deletes the VM
- Deletes the subnet
- Deletes the VPC network
- Updates the state file
- Clears your cloud account

**Warning**: This is permanent and irreversible!

### Verify Cleanup

Confirm everything is gone:

```bash
docker exec -it gcp_dev_env gcloud compute instances list
```

Should return an empty list.

## Best Practices Summary

Follow these guidelines for professional IaC:

1. **Always Estimate Costs First**
   - Run `infracost breakdown` before deploying
   - Review `infracost diff` before applying changes

2. **Use Separate State Files**
   - Keep dev, staging, and prod in separate directories
   - Use remote state (Cloud Storage) for team collaboration

3. **Version Your Infrastructure**
   ```hcl
   terraform {
     required_version = ">= 1.0"
     required_providers {
       google = {
         source  = "hashicorp/google"
         version = "~> 5.0"
       }
     }
   }
   ```

4. **Leverage Variables**
   - Use `variables.tf` for configuration
   - Override with `terraform.tfvars` per environment
   - Never hardcode values

5. **Use Meaningful Names**
   ```hcl
   resource "google_compute_instance" "web_server" {
     name = "web-server-prod-01"
   }
   ```

6. **Document Your Resources**
   ```hcl
   resource "google_compute_network" "main" {
     description = "Main production VPC with private subnets"
     name        = "prod-vpc"
   }
   ```

7. **Plan Before Apply**
   - Always review `terraform plan` output
   - Use `-out` flag to save plans
   - Apply the saved plan, never direct changes

8. **Keep Secrets Safe**
   ```bash
   # In .gitignore:
   .env
   terraform.tfvars
   .terraform/
   tfplan.binary
   ```

9. **Use Outputs for Important Values**
   ```hcl
   output "vm_external_ip" {
     description = "External IP of the VM"
     value       = google_compute_instance.custom_vm.network_interface[0].access_config[0].nat_ip
   }
   ```

10. **Implement Remote State (For Teams)**
    ```hcl
    terraform {
      backend "gcs" {
        bucket  = "my-terraform-state"
        prefix  = "prod"
      }
    }
    ```

## Common Issues & Solutions

**Issue**: "Credentials not found"
- **Solution**: Run `gcloud auth application-default login` on your Mac
- Then restart the container: `docker-compose restart`

**Issue**: "Infracost API key invalid"
- **Solution**: Check your `.env` file has the correct key
- Restart: `docker-compose down && docker-compose up -d`

**Issue**: "Permission denied on GCP"
- **Solution**: Ensure your account has `Editor` or `Compute Admin` role
- Check in GCP Console → IAM & Admin

**Issue**: "State file conflicts"
- **Solution**: Never edit `terraform.tfstate` directly
- Use `terraform state` commands only
- For team: Implement remote state in Cloud Storage

## Conclusion

You now have the complete workflow for professional GCP infrastructure management:

- ✅ **Containerized environment** for consistency
- ✅ **Secure credential handling** via bind mounts
- ✅ **Cost estimation** before deployment
- ✅ **Full Terraform lifecycle** from plan to apply
- ✅ **Verification and cleanup** processes

## What's Next?

To advance your IaC skills:
- Learn **Terraform modules** for reusable infrastructure
- Set up **remote state** in Cloud Storage for team collaboration
- Implement **CI/CD pipelines** with GitHub Actions or Cloud Build
- Explore **Google Cloud Deployment Manager** as an alternative
- Master **Kubernetes on GKE** with Terraform

**Keep building!** Infrastructure-as-Code is a superpower in modern DevOps. With this foundation, you can reliably provision and manage cloud resources at scale.

---

*Happy deploying!*

[Home](/archive)
