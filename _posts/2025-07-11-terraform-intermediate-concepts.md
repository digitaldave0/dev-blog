---
layout: post
title: "Terraform Intermediate: Variables, Outputs, and Data Sources"
description: "Master Terraform variables, outputs, data sources, and learn how to structure your configurations effectively"
tags: [terraform, iac, devops, cloud, intermediate]
---

# Terraform Intermediate Concepts

After understanding the basics, it's time to make your Terraform configurations more flexible and maintainable. This post covers essential intermediate concepts that will help you write better infrastructure code.

## Variables and Inputs

### Variable Types and Declarations

Variables make your configurations flexible and reusable. Here are different ways to declare variables:

```hcl
# Basic variable declaration
variable "environment" {
  type        = string
  description = "Environment name (dev, staging, prod)"
  default     = "dev"
}

# List variable
variable "availability_zones" {
  type        = list(string)
  description = "List of availability zones"
}

# Map variable
variable "instance_tags" {
  type = map(string)
  default = {
    Environment = "dev"
    Team        = "devops"
  }
}

# Object variable
variable "vpc_config" {
  type = object({
    cidr_block = string
    name       = string
    enable_dns = bool
  })
}
```

### Using Variables

```hcl
resource "aws_vpc" "main" {
  cidr_block = var.vpc_config.cidr_block
  
  tags = merge(var.instance_tags, {
    Name = var.vpc_config.name
  })
}
```

## Working with tfvars

Create different configurations for different environments using `.tfvars` files:

```hcl
# prod.tfvars
environment = "prod"
vpc_config = {
  cidr_block = "10.0.0.0/16"
  name       = "prod-vpc"
  enable_dns = true
}

availability_zones = ["us-west-2a", "us-west-2b", "us-west-2c"]
```

Apply with:
```bash
terraform apply -var-file="prod.tfvars"
```

## Outputs

Outputs let you expose specific values that can be queried or used by other Terraform configurations:

```hcl
output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "subnet_ids" {
  description = "List of subnet IDs"
  value       = [for subnet in aws_subnet.main : subnet.id]
}

# Sensitive output
output "database_password" {
  description = "Database password"
  value       = aws_db_instance.main.password
  sensitive   = true
}
```

## Data Sources

Data sources let you query existing resources:

```hcl
# Find the latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# Use the AMI in an instance
resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux_2.id
  instance_type = "t2.micro"
}

# Get all availability zones
data "aws_availability_zones" "available" {
  state = "available"
}
```

## Local Values

Use locals to avoid repetition and compute values once:

```hcl
locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    Terraform   = "true"
  }
  
  subnet_count = length(data.aws_availability_zones.available.names)
}

resource "aws_subnet" "main" {
  count             = local.subnet_count
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = merge(local.common_tags, {
    Name = "subnet-${count.index + 1}"
  })
}
```

## File Structure Best Practices

Organize your Terraform code with this recommended structure:

```
project/
├── main.tf         # Main configuration file
├── variables.tf    # Variable declarations
├── outputs.tf      # Output declarations
├── providers.tf    # Provider configurations
├── terraform.tfvars # Variable values
└── environments/   # Environment-specific configurations
    ├── dev/
    │   └── terraform.tfvars
    └── prod/
        └── terraform.tfvars
```

## Next Steps

In our next post, we'll explore advanced concepts including:
- Terraform workspaces
- Remote state management
- Modules
- Complex expressions and functions

Remember to always:
- Use meaningful variable and resource names
- Document your variables and outputs
- Keep your configurations DRY (Don't Repeat Yourself)
- Use version control
- Test your configurations before applying to production
