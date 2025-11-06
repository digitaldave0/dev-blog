---
layout: post
title: "🚀 AWS CLI Cheatsheet: Top 100 Commands for DevOps Engineers"
categories: [AWS, DevOps, Cloud, Cheatsheet]
tags: [aws, cli, devops, cheatsheet, ec2, s3, lambda, ecs]
excerpt: "A comprehensive collection of essential AWS CLI commands for DevOps engineers. Includes practical examples and use cases for EC2, S3, ECS, Lambda, and more!"
description: "Master the AWS CLI with this detailed cheatsheet covering 100 essential commands across different AWS services. Perfect for DevOps engineers working with AWS infrastructure, featuring real-world examples and common use cases."
---


# AWS CLI Commands Cheatsheet for DevOps Engineers

This comprehensive cheatsheet provides the most commonly used AWS CLI commands for DevOps engineers, organized by service and use case. Each command includes a practical example and common use cases.

## EC2 & Compute Commands

### Instance Management

| Command | Example | Use Case |
|---------|---------|----------|
| `aws ec2 describe-instances` | `aws ec2 describe-instances --filters "Name=instance-type,Values=t2.micro" --query 'Reservations[].Instances[].InstanceId'` | List all EC2 instances of a specific type |
| `aws ec2 start-instances` | `aws ec2 start-instances --instance-ids i-1234567890abcdef0` | Start stopped instances in staging environment |
| `aws ec2 stop-instances` | `aws ec2 stop-instances --instance-ids i-1234567890abcdef0 --hibernate` | Hibernate dev instances during off-hours |
| `aws ec2 run-instances` | `aws ec2 run-instances --image-id ami-12345678 --instance-type t2.micro --key-name MyKeyPair --security-group-ids sg-903004f8` | Launch new application servers |
| `aws ec2 describe-instance-status` | `aws ec2 describe-instance-status --include-all-instances` | Monitor instance health across environments |

### AMI Management

| Command | Example | Use Case |
|---------|---------|----------|
| `aws ec2 create-image` | `aws ec2 create-image --instance-id i-1234567890abcdef0 --name "prod-backup-$(date +%Y%m%d)"` | Create backup AMIs for production servers |
| `aws ec2 describe-images` | `aws ec2 describe-images --owners self --filters "Name=name,Values=prod-*"` | List all custom production AMIs |
| `aws ec2 deregister-image` | `aws ec2 deregister-image --image-id ami-12345678` | Clean up old/unused AMIs |

## S3 Storage Operations

### Bucket Operations

| Command | Example | Use Case |
|---------|---------|----------|
| `aws s3 ls` | `aws s3 ls s3://my-bucket --recursive --human-readable --summarize` | Audit bucket contents and size |
| `aws s3 mb` | `aws s3 mb s3://new-artifact-bucket --region us-west-2` | Create new artifact storage bucket |
| `aws s3 sync` | `aws s3 sync ./dist s3://my-bucket/prod --delete` | Deploy frontend assets |
| `aws s3api put-bucket-versioning` | `aws s3api put-bucket-versioning --bucket my-bucket --versioning-configuration Status=Enabled` | Enable versioning for compliance |

### Object Operations

| Command | Example | Use Case |
|---------|---------|----------|
| `aws s3 cp` | `aws s3 cp ./backup.tar.gz s3://backup-bucket/$(date +%Y/%m/%d)/` | Upload daily backups |
| `aws s3 rm` | `aws s3 rm s3://my-bucket/logs --recursive --exclude "*" --include "*.log"` | Clean up old log files |
| `aws s3api put-object-acl` | `aws s3api put-object-acl --bucket my-bucket --key public/file.pdf --acl public-read` | Make specific files public |

## ECS & Container Services

### Cluster Management

| Command | Example | Use Case |
|---------|---------|----------|
| `aws ecs list-clusters` | `aws ecs list-clusters --query 'clusterArns[]'` | Monitor all ECS clusters |
| `aws ecs describe-clusters` | `aws ecs describe-clusters --clusters production-cluster --include ATTACHMENTS` | Check cluster capacity |
| `aws ecs update-service` | `aws ecs update-service --cluster prod --service api-service --desired-count 5` | Scale services during high load |

### Task Management

| Command | Example | Use Case |
|---------|---------|----------|
| `aws ecs list-tasks` | `aws ecs list-tasks --cluster production-cluster --service-name api-service` | Monitor running tasks |
| `aws ecs run-task` | `aws ecs run-task --cluster maintenance --task-definition db-backup:3 --count 1` | Run maintenance tasks |
| `aws ecs stop-task` | `aws ecs stop-task --cluster production-cluster --task arn:aws:ecs:region:123456789012:task/123abc` | Stop misbehaving tasks |

## Lambda Functions

### Function Management

| Command | Example | Use Case |
|---------|---------|----------|
| `aws lambda list-functions` | `aws lambda list-functions --query 'Functions[].FunctionName'` | Audit Lambda functions |
| `aws lambda update-function-code` | `aws lambda update-function-code --function-name api-handler --zip-file fileb://function.zip` | Deploy function updates |
| `aws lambda invoke` | `aws lambda invoke --function-name test-function --payload '{"test": true}' response.json` | Test function behavior |

## CloudWatch Monitoring

### Logs and Metrics

| Command | Example | Use Case |
|---------|---------|----------|
| `aws logs describe-log-groups` | `aws logs describe-log-groups --query 'logGroups[].logGroupName'` | Audit log groups |
| `aws logs get-log-events` | `aws logs get-log-events --log-group-name /aws/lambda/api-func --log-stream-name 2025/07/10` | Debug application issues |
| `aws cloudwatch get-metric-statistics` | `aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization --dimensions Name=InstanceId,Value=i-1234567890abcdef0 --start-time 2025-07-09T00:00:00 --end-time 2025-07-10T00:00:00 --period 3600 --statistics Average` | Monitor resource usage |

## IAM Security

### User Management

| Command | Example | Use Case |
|---------|---------|----------|
| `aws iam list-users` | `aws iam list-users --query 'Users[].UserName'` | Audit user accounts |
| `aws iam create-user` | `aws iam create-user --user-name new-developer` | Onboard new team members |
| `aws iam attach-user-policy` | `aws iam attach-user-policy --user-name developer --policy-arn arn:aws:iam::aws:policy/PowerUserAccess` | Grant permissions |

### Role Management

| Command | Example | Use Case |
|---------|---------|----------|
| `aws iam list-roles` | `aws iam list-roles --query 'Roles[?contains(RoleName, `service-role`)]'` | Audit service roles |
| `aws iam create-role` | `aws iam create-role --role-name lambda-executor --assume-role-policy-document file://trust-policy.json` | Set up service roles |
| `aws iam put-role-policy` | `aws iam put-role-policy --role-name lambda-executor --policy-name permissions --policy-document file://policy.json` | Update role permissions |

## RDS Database

### Instance Management

| Command | Example | Use Case |
|---------|---------|----------|
| `aws rds describe-db-instances` | `aws rds describe-db-instances --query 'DBInstances[].DBInstanceIdentifier'` | Monitor database instances |
| `aws rds create-db-snapshot` | `aws rds create-db-snapshot --db-instance-identifier prod-db --db-snapshot-identifier prod-backup-$(date +%Y%m%d)` | Create database backups |
| `aws rds modify-db-instance` | `aws rds modify-db-instance --db-instance-identifier prod-db --db-instance-class db.r5.xlarge --apply-immediately` | Scale database instances |

## Route53 DNS

### Record Management

| Command | Example | Use Case |
|---------|---------|----------|
| `aws route53 list-hosted-zones` | `aws route53 list-hosted-zones --query 'HostedZones[].Name'` | List DNS zones |
| `aws route53 change-resource-record-sets` | `aws route53 change-resource-record-sets --hosted-zone-id Z123456789ABCD --change-batch file://dns-changes.json` | Update DNS records |
| `aws route53 get-health-check` | `aws route53 get-health-check --health-check-id 12345678-90ab-cdef-1234-567890abcdef` | Monitor endpoint health |

## Auto Scaling

### Group Management

| Command | Example | Use Case |
|---------|---------|----------|
| `aws autoscaling describe-auto-scaling-groups` | `aws autoscaling describe-auto-scaling-groups --query 'AutoScalingGroups[].AutoScalingGroupName'` | Monitor scaling groups |
| `aws autoscaling update-auto-scaling-group` | `aws autoscaling update-auto-scaling-group --auto-scaling-group-name web-tier --min-size 2 --max-size 6` | Adjust scaling limits |
| `aws autoscaling set-desired-capacity` | `aws autoscaling set-desired-capacity --auto-scaling-group-name web-tier --desired-capacity 4` | Manual scaling |

## Useful Tips

1. Always use the `--profile` flag when working with multiple AWS accounts:
```bash
aws s3 ls --profile production
```

2. Use query and filter for better output:
```bash
aws ec2 describe-instances --query 'Reservations[].Instances[].[InstanceId,State.Name,Tags[?Key==`Name`].Value[]]' --output table
```

3. Use environment variables for repeated values:
```bash
export AWS_DEFAULT_REGION=us-west-2
export AWS_DEFAULT_OUTPUT=json
```

4. Create aliases for common commands:
```bash
alias awsp='aws --profile'
alias awsl='aws --region us-west-2'
```

## Additional Resources

- [AWS CLI Documentation](https://awscli.amazonaws.com/v2/documentation/api/latest/index.html)
- [AWS CLI Configuration Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
- [AWS CLI Examples GitHub Repository](https://github.com/aws/aws-cli/tree/develop/examples)

## Video Tutorials

### Getting Started
- [AWS CLI Complete Tutorial](https://www.youtube.com/watch?v=PWAnY-w1SGQ)
- [AWS CLI in DevOps](https://www.youtube.com/watch?v=K4YbsFnRWpw)

### Advanced Usage
- [AWS CLI Automation](https://www.youtube.com/watch?v=ZbgvG7yFoQI)
- [AWS CLI Security Best Practices](https://www.youtube.com/watch?v=Yz2XM7J7Vkw)
