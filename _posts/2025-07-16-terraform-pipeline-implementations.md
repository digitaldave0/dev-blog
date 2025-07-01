---
layout: post
title: "Implementing Terraform Pipelines: Platform-Specific Examples"
description: "Detailed examples of implementing Terraform pipelines in Jenkins, GitLab CI, and CircleCI with real-world configurations"
tags: [terraform, cicd, devops, jenkins, gitlab, circleci, automation]
icon: ⚡
excerpt: >
  Dive into platform-specific implementations of Terraform pipelines! Learn how to set up and optimize Infrastructure as Code pipelines in Jenkins, GitLab CI, and CircleCI with detailed, production-ready examples.
---

# Platform-Specific Terraform Pipeline Implementations

Following our comprehensive guide to Terraform CI/CD, let's explore detailed implementations in popular CI/CD platforms.

## Jenkins Pipeline Implementation

### 1. Jenkinsfile Configuration

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    environment {
        AWS_CREDENTIALS = credentials('aws-terraform')
        TF_WORKSPACE = "${env.BRANCH_NAME}"
        TF_IN_AUTOMATION = 'true'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('TF Init & Format') {
            steps {
                script {
                    sh '''
                        terraform fmt -check
                        terraform init \
                            -backend-config="bucket=${TF_STATE_BUCKET}" \
                            -backend-config="key=${TF_WORKSPACE}/terraform.tfstate"
                    '''
                }
            }
        }
        
        stage('TF Validate') {
            steps {
                script {
                    sh '''
                        terraform validate
                        tflint --minimum-failure-severity=error
                        checkov -d .
                    '''
                }
            }
        }
        
        stage('TF Plan') {
            steps {
                script {
                    sh '''
                        terraform plan -out=tfplan
                        terraform show -json tfplan > tfplan.json
                    '''
                    
                    // Parse and display plan
                    def plan = readJSON file: 'tfplan.json'
                    def changes = plan.resource_changes.findAll { it.change.actions != ['no-op'] }
                    
                    echo "Planned Changes:"
                    changes.each { change ->
                        echo "${change.change.actions[0]} ${change.address}"
                    }
                }
            }
        }
        
        stage('Approval') {
            when {
                expression { env.BRANCH_NAME == 'main' }
            }
            steps {
                input message: 'Apply Terraform changes?'
            }
        }
        
        stage('TF Apply') {
            steps {
                script {
                    sh 'terraform apply tfplan'
                }
            }
        }
        
        stage('Verification') {
            steps {
                script {
                    sh '''
                        # Custom verification scripts
                        ./verify-deployment.sh
                    '''
                }
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'tfplan.json', allowEmptyArchive: true
            junit testResults: '**/test-results/*.xml', allowEmptyResults: true
        }
        failure {
            // Notification on failure
            emailext (
                subject: "Pipeline Failed: ${currentBuild.fullDisplayName}",
                body: "Check console output at ${env.BUILD_URL}",
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
    }
}
```

### 2. Jenkins Configuration

```groovy
// jenkins-config.groovy
folder('terraform') {
    description('Terraform Infrastructure Pipelines')
}

pipelineJob('terraform/infrastructure') {
    definition {
        cpsScm {
            scm {
                git {
                    remote {
                        url('https://github.com/org/terraform-infra.git')
                        credentials('github-creds')
                    }
                    branches('*/main', '*/develop')
                }
            }
            scriptPath('Jenkinsfile')
        }
    }
    
    parameters {
        stringParam('TF_STATE_BUCKET', 'company-terraform-state', 'S3 bucket for Terraform state')
        choiceParam('TF_WORKSPACE', ['dev', 'staging', 'prod'], 'Terraform workspace')
    }
}
```

## GitLab CI Implementation

### 1. GitLab CI Configuration

```yaml
# .gitlab-ci.yml
variables:
  TF_ADDRESS: ${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/terraform/state/${CI_COMMIT_REF_NAME}
  TF_VAR_environment: ${CI_COMMIT_REF_NAME}

workflow:
  rules:
    - if: $CI_COMMIT_BRANCH

stages:
  - validate
  - plan
  - security
  - apply
  - verify

image:
  name: hashicorp/terraform:latest
  entrypoint: [""]

.terraform_init: &terraform_init |
  terraform init \
    -backend-config="address=${TF_ADDRESS}" \
    -backend-config="lock_address=${TF_ADDRESS}/lock" \
    -backend-config="unlock_address=${TF_ADDRESS}/lock" \
    -backend-config="username=${CI_USERNAME}" \
    -backend-config="password=${CI_TOKEN}"

validate:
  stage: validate
  script:
    - *terraform_init
    - terraform fmt -check
    - terraform validate
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH

security_scan:
  stage: security
  script:
    - terraform init
    - checkov -d .
    - tfsec .
  artifacts:
    reports:
      junit: gl-terraform-scan.xml

plan:
  stage: plan
  script:
    - *terraform_init
    - terraform plan -out=tfplan
    - terraform show -json tfplan > tfplan.json
  artifacts:
    paths:
      - tfplan
      - tfplan.json
    reports:
      terraform: tfplan.json
  rules:
    - if: $CI_COMMIT_BRANCH

apply:
  stage: apply
  script:
    - *terraform_init
    - terraform apply -auto-approve tfplan
  dependencies:
    - plan
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
  environment:
    name: production
    deployment_tier: production

verify:
  stage: verify
  script:
    - ./scripts/verify-deployment.sh
  dependencies:
    - apply
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
  environment:
    name: production
    deployment_tier: production
```

### 2. GitLab Environment Configuration

```yaml
# .gitlab/terraform.yml
.terraform:
  variables:
    TF_ROOT: ${CI_PROJECT_DIR}
    TF_STATE_NAME: ${CI_PROJECT_NAME}
    TF_CACHE_KEY: ${CI_COMMIT_REF_SLUG}
  cache:
    key: ${TF_CACHE_KEY}
    paths:
      - ${TF_ROOT}/.terraform
```

## CircleCI Implementation

### 1. CircleCI Configuration

```yaml
# .circleci/config.yml
version: 2.1

orbs:
  terraform: circleci/terraform@3.0.0
  aws-cli: circleci/aws-cli@3.1.1

commands:
  terraform-init:
    steps:
      - terraform/init:
          backend_config_file: backend-config/${CIRCLE_BRANCH}.tfvars

jobs:
  validate:
    docker:
      - image: hashicorp/terraform:latest
    steps:
      - checkout
      - terraform-init
      - terraform/validate
      - run:
          name: Security Scan
          command: |
            apk add --update python3 py3-pip
            pip3 install checkov
            checkov -d .

  plan:
    docker:
      - image: hashicorp/terraform:latest
    steps:
      - checkout
      - terraform-init
      - terraform/plan:
          plan_path: tfplan
      - persist_to_workspace:
          root: .
          paths:
            - tfplan

  apply:
    docker:
      - image: hashicorp/terraform:latest
    steps:
      - checkout
      - terraform-init
      - attach_workspace:
          at: .
      - terraform/apply:
          plan_path: tfplan
      - run:
          name: Verify Deployment
          command: ./scripts/verify-deployment.sh

workflows:
  version: 2
  terraform:
    jobs:
      - validate:
          context: terraform
          filters:
            branches:
              only: /.*/
      
      - plan:
          context: terraform
          requires:
            - validate
          filters:
            branches:
              only: /.*/
      
      - approve-apply:
          type: approval
          requires:
            - plan
          filters:
            branches:
              only: main
      
      - apply:
          context: terraform
          requires:
            - approve-apply
          filters:
            branches:
              only: main
```

### 2. CircleCI Environment Setup

```yaml
# .circleci/terraform-env.yml
environment:
  TF_IN_AUTOMATION: "true"
  TF_INPUT: "false"
  TF_VAR_environment: << pipeline.git.branch >>

contexts:
  terraform:
    environment:
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      TF_STATE_BUCKET: company-terraform-state
```

## Platform-Specific Best Practices

### Jenkins
1. **Parallel Execution**
   ```groovy
   stage('Validation') {
       parallel {
           stage('Terraform Validate') {
               steps {
                   sh 'terraform validate'
               }
           }
           stage('Security Scan') {
               steps {
                   sh 'checkov -d .'
               }
           }
       }
   }
   ```

### GitLab CI
1. **Dynamic Environments**
   ```yaml
   .deploy_template: &deploy
     script:
       - terraform init
       - terraform workspace select ${CI_ENVIRONMENT_NAME} || terraform workspace new ${CI_ENVIRONMENT_NAME}
       - terraform apply -auto-approve
     environment:
       name: $CI_COMMIT_REF_NAME
   ```

### CircleCI
1. **Reusable Commands**
   ```yaml
   commands:
     plan-with-cache:
       steps:
         - restore_cache:
             keys:
               - terraform-{{ .Branch }}-{{ checksum "terraform.tfstate" }}
         - terraform/plan
         - save_cache:
             key: terraform-{{ .Branch }}-{{ checksum "terraform.tfstate" }}
             paths:
               - .terraform
   ```

## Security Considerations

### 1. Credential Management
```yaml
# Example AWS credentials management
environment:
  AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
  AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
  AWS_SESSION_TOKEN: ${AWS_SESSION_TOKEN}
  AWS_ROLE_ARN: arn:aws:iam::ACCOUNT_ID:role/TerraformDeployRole
```

### 2. Branch Protection
```yaml
# GitLab branch protection example
protected_branches:
  main:
    allowed_to_push:
      - group_ids: [infrastructure-team]
    allowed_to_merge:
      - group_ids: [infrastructure-team]
```

## Monitoring and Alerting

### 1. Pipeline Metrics
```yaml
# Example Prometheus metrics
metrics:
  pipeline_duration_seconds:
    type: gauge
    labels:
      - environment
      - status
  terraform_changes:
    type: counter
    labels:
      - resource_type
      - action
```

### 2. Alert Configuration
```yaml
# Example alert configuration
alerts:
  - name: TerraformPipelineFailure
    condition: pipeline_status == "failed" && branch == "main"
    notifications:
      - type: slack
        channel: "#terraform-alerts"
      - type: email
        to: [infrastructure-team@company.com]
```

## Additional Resources

- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [GitLab CI/CD Reference](https://docs.gitlab.com/ee/ci/)
- [CircleCI Configuration Reference](https://circleci.com/docs/configuration-reference/)
- [Terraform Enterprise Integration Guide](https://www.terraform.io/docs/cloud/run/api.html)

## Conclusion

Each CI/CD platform has its strengths and unique features. Choose the one that best fits your team's workflow and existing toolchain. Remember to:

- Implement proper security controls
- Use infrastructure testing
- Set up monitoring and alerting
- Document pipeline configurations
- Maintain consistent workflows across environments
