---
layout: post
title: "Complete Guide: Setting Up Self-Hosted GitLab Server with CI/CD and Advanced Features"
description: "Comprehensive tutorial for setting up your own GitLab server, mastering CI/CD pipelines, and exploring advanced GitLab features from basics to enterprise-level usage."
tags:
  [
    gitlab,
    cicd,
    docker,
    devops,
    self-hosted,
    git,
    automation,
    tutorial,
    kubernetes,
    security,
    gitlab-runner,
    pipelines,
    docker-compose,
  ]
icon: 🦊
excerpt: >
  Master GitLab from the ground up with this comprehensive guide. Learn to set up your own self-hosted GitLab server, implement powerful CI/CD pipelines, and explore advanced features like Kubernetes integration, security scanning, and enterprise workflows.
author: "owner"
date: 2025-10-29 13:00:00 +0000
categories: [DevOps, GitLab, CI/CD, Tutorial]
permalink: /posts/gitlab-self-hosted-server-guide/
---

## Introduction

GitLab is a complete DevOps platform that provides Git repository management, CI/CD pipelines, issue tracking, and much more. While GitLab.com offers a hosted solution, running your own self-hosted GitLab server gives you complete control over your data, security, and infrastructure.

This comprehensive guide will take you from GitLab basics to advanced enterprise features. We'll start with setting up a self-hosted server, then build a complete CI/CD pipeline, and explore advanced capabilities like Kubernetes integration and security scanning.

## Prerequisites

Before we begin, ensure you have:

- A server with at least 4GB RAM (8GB recommended)
- Docker and Docker Compose installed
- Basic Linux knowledge
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt for free)

```bash
# Check system requirements
docker --version
docker-compose --version
free -h
df -h
```

## Part 1: Setting Up Self-Hosted GitLab Server

### Docker Compose Setup

Create a `docker-compose.yml` file for GitLab:

```yaml
version: "3.8"

services:
  gitlab:
    image: gitlab/gitlab-ee:latest
    container_name: gitlab-server
    restart: unless-stopped
    hostname: "gitlab.example.com"
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'https://gitlab.example.com'
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
        nginx['redirect_http_to_https'] = true
        nginx['ssl_certificate'] = "/etc/gitlab/ssl/gitlab.example.com.crt"
        nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/gitlab.example.com.key"
        gitlab_rails['smtp_enable'] = true
        gitlab_rails['smtp_address'] = "smtp.gmail.com"
        gitlab_rails['smtp_port'] = 587
        gitlab_rails['smtp_user_name'] = "your-email@gmail.com"
        gitlab_rails['smtp_password'] = "your-app-password"
        gitlab_rails['smtp_domain'] = "gmail.com"
        gitlab_rails['smtp_authentication'] = "login"
        gitlab_rails['smtp_enable_starttls_auto'] = true
    ports:
      - "80:80"
      - "443:443"
      - "2222:22"
    volumes:
      - ./gitlab/config:/etc/gitlab
      - ./gitlab/logs:/var/log/gitlab
      - ./gitlab/data:/var/opt/gitlab
      - ./ssl:/etc/gitlab/ssl
    networks:
      - gitlab-network
    shm_size: 256m

  gitlab-runner:
    image: gitlab/gitlab-runner:latest
    container_name: gitlab-runner
    restart: unless-stopped
    volumes:
      - ./gitlab-runner/config:/etc/gitlab-runner
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - gitlab-network
    depends_on:
      - gitlab

networks:
  gitlab-network:
    driver: bridge
```

### SSL Certificate Setup

For HTTPS, let's set up SSL certificates:

```bash
# Create SSL directory
mkdir -p ssl

# Generate self-signed certificate (for testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/gitlab.example.com.key \
  -out ssl/gitlab.example.com.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=gitlab.example.com"

# Or use Let's Encrypt (recommended for production)
# Install certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d gitlab.example.com

# Copy certificates
sudo cp /etc/letsencrypt/live/gitlab.example.com/fullchain.pem ssl/gitlab.example.com.crt
sudo cp /etc/letsencrypt/live/gitlab.example.com/privkey.pem ssl/gitlab.example.com.key
```

### Starting GitLab

```bash
# Create directories
mkdir -p gitlab/{config,logs,data} gitlab-runner/config ssl

# Start GitLab
docker-compose up -d

# Check logs
docker-compose logs -f gitlab

# Wait for GitLab to fully start (can take 5-10 minutes)
docker-compose exec gitlab gitlab-ctl status
```

### Initial Configuration

Access GitLab at `https://gitlab.example.com` and complete the setup:

```bash
# Get initial root password
docker-compose exec gitlab cat /etc/gitlab/initial_root_password

# Or check logs for password
docker-compose logs gitlab | grep "Password:"
```

## Part 2: GitLab Basics - Your First Project

### Creating Your First Repository

1. **Sign in** with root account
2. **Create a new project**:
   - Go to Projects → Create new project
   - Choose "Create blank project"
   - Name: `hello-gitlab`
   - Visibility: Public (for demo)

### Basic Git Operations

```bash
# Clone the repository
git clone https://gitlab.example.com/root/hello-gitlab.git
cd hello-gitlab

# Create a simple application
echo "# Hello GitLab" > README.md
echo "print('Hello from GitLab CI/CD!')" > hello.py

# Add and commit
git add .
git commit -m "Initial commit: Hello GitLab"

# Push to GitLab
git push origin main
```

### GitLab Features Overview

#### Issues and Project Management

```markdown
<!-- Create an issue in GitLab -->

## Issue: Implement User Authentication

**Description:**
Implement user login/logout functionality

**Acceptance Criteria:**

- [ ] User can register with email/password
- [ ] User can login/logout
- [ ] Password hashing implemented
- [ ] Session management

**Labels:** feature, backend, security
```

#### Merge Requests

```bash
# Create a feature branch
git checkout -b feature/user-auth

# Make changes
echo "def authenticate_user(username, password):
    # Authentication logic here
    return True" >> auth.py

# Commit and push
git add auth.py
git commit -m "Add basic user authentication function"
git push origin feature/user-auth

# Create Merge Request in GitLab UI
# - Source branch: feature/user-auth
# - Target branch: main
# - Title: "Implement user authentication"
# - Description: "Adds basic user authentication functionality"
```

## Part 3: CI/CD Fundamentals

### What is CI/CD?

**Continuous Integration (CI)**: Automatically build and test code changes
**Continuous Delivery (CD)**: Automatically deploy tested code to staging/production
**Continuous Deployment (CD)**: Automatically deploy to production (subset of CD)

### Your First CI/CD Pipeline

Create `.gitlab-ci.yml` in your repository:

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_IMAGE: "hello-gitlab:$CI_COMMIT_REF_SLUG"

build:
  stage: build
  script:
    - echo "Building application..."
    - docker build -t $DOCKER_IMAGE .
    - docker save $DOCKER_IMAGE > app.tar
  artifacts:
    paths:
      - app.tar
    expire_in: 1 hour

test:
  stage: test
  script:
    - echo "Running tests..."
    - python -m pytest tests/ -v
  dependencies:
    - build

deploy_staging:
  stage: deploy
  script:
    - echo "Deploying to staging..."
    - docker load < app.tar
    - docker run -d --name hello-gitlab-staging -p 8080:80 $DOCKER_IMAGE
  environment:
    name: staging
    url: http://staging.example.com
  dependencies:
    - build
  only:
    - main

deploy_production:
  stage: deploy
  script:
    - echo "Deploying to production..."
    - docker load < app.tar
    - docker run -d --name hello-gitlab-prod -p 80:80 $DOCKER_IMAGE
  environment:
    name: production
    url: http://example.com
  dependencies:
    - build
  when: manual
  only:
    - main
```

### Understanding Pipeline Concepts

#### Stages and Jobs

```yaml
stages:
  - build # Compile/build artifacts
  - test # Run automated tests
  - deploy # Deploy to environments
  - cleanup # Clean up resources

job_name:
  stage: build
  script:
    - echo "This job runs in the build stage"
```

#### Environments

```yaml
deploy_staging:
  stage: deploy
  script:
    - ./deploy.sh staging
  environment:
    name: staging
    url: https://staging.example.com
    on_stop: stop_staging

stop_staging:
  stage: deploy
  script:
    - ./stop.sh staging
  environment:
    name: staging
    action: stop
  when: manual
```

#### Artifacts and Caching

```yaml
build_dependencies:
  stage: build
  script:
    - npm install
    - npm run build
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
      - dist/
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
```

## Part 4: Advanced CI/CD Features

### Parallel Jobs and Dependencies

```yaml
stages:
  - build
  - test
  - deploy

build_app:
  stage: build
  script: make build

test_unit:
  stage: test
  script: make test-unit
  dependencies:
    - build_app

test_integration:
  stage: test
  script: make test-integration
  dependencies:
    - build_app

test_e2e:
  stage: test
  script: make test-e2e
  dependencies:
    - test_integration

deploy:
  stage: deploy
  script: make deploy
  dependencies:
    - test_unit
    - test_integration
    - test_e2e
```

### Dynamic Pipelines with `rules`

```yaml
workflow:
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_COMMIT_BRANCH =~ /^feature\/.*$/
    - if: $CI_COMMIT_TAG

build:
  stage: build
  script: docker build -t myapp .
  rules:
    - changes:
        - Dockerfile
        - src/**/*
      when: always
    - when: never

test:
  stage: test
  script: npm test
  rules:
    - changes:
        - package.json
        - src/**/*
        - tests/**/*
    - if: $CI_COMMIT_BRANCH == "main"

deploy_staging:
  stage: deploy
  script: ./deploy staging
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      changes:
        - src/**/*
  environment: staging

deploy_production:
  stage: deploy
  script: ./deploy production
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
  environment: production
  when: manual
```

### GitLab Runner Configuration

#### Registering a Runner

```bash
# Register the runner
docker-compose exec gitlab-runner gitlab-runner register \
  --url "https://gitlab.example.com/" \
  --token "YOUR_RUNNER_TOKEN" \
  --description "docker-runner" \
  --executor "docker" \
  --docker-image "alpine:latest"

# Get runner token from GitLab UI:
# Admin Area → CI/CD → Runners → Register a runner
```

#### Advanced Runner Configuration

Create `config.toml` for the runner:

```toml
[[runners]]
  name = "docker-runner"
  url = "https://gitlab.example.com/"
  token = "YOUR_RUNNER_TOKEN"
  executor = "docker"
  [runners.custom_build_dir]
  [runners.docker]
    tls_verify = false
    image = "alpine:latest"
    privileged = false
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    disable_cache = false
    volumes = ["/cache"]
    shm_size = 0
  [runners.cache]
    [runners.cache.s3]
    [runners.cache.gcs]
    [runners.cache.azure]
```

### Multi-Stage Docker Builds

```yaml
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_HOST: tcp://docker:2376
  DOCKER_TLS_CERTDIR: "/certs"

services:
  - docker:dind

build:
  stage: build
  image: docker:latest
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build --target builder -t $CI_REGISTRY_IMAGE/builder:$CI_COMMIT_SHA .
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE/builder:$CI_COMMIT_SHA

test:
  stage: test
  image: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  script:
    - npm test
  dependencies:
    - build

deploy:
  stage: deploy
  script:
    - kubectl set image deployment/myapp myapp=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  environment: production
```

## Part 5: Advanced GitLab Features

### GitLab Container Registry

```yaml
build_image:
  stage: build
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  script:
    - kubectl set image deployment/myapp myapp=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  environment: production
```

### Security Scanning

```yaml
include:
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Secret-Detection.gitlab-ci.yml
  - template: Security/Dependency-Scanning.gitlab-ci.yml
  - template: Security/License-Scanning.gitlab-ci.yml
  - template: Container-Scanning.gitlab-ci.yml

stages:
  - build
  - test
  - security
  - deploy

sast:
  stage: security

secret_detection:
  stage: security

dependency_scanning:
  stage: security

license_scanning:
  stage: security

container_scanning:
  stage: security
  variables:
    DOCKER_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

### GitLab Pages

```yaml
pages:
  stage: deploy
  script:
    - mkdir .public
    - cp -r * .public
    - mv .public public
  artifacts:
    paths:
      - public
  only:
    - main
```

### GitLab Environments

```yaml
deploy_review:
  stage: deploy
  script:
    - ./deploy review $CI_COMMIT_REF_NAME
  environment:
    name: review/$CI_COMMIT_REF_NAME
    url: https://$CI_COMMIT_REF_NAME.example.com
    on_stop: stop_review
    auto_stop_in: 1 week

stop_review:
  stage: deploy
  script:
    - ./stop review $CI_COMMIT_REF_NAME
  environment:
    name: review/$CI_COMMIT_REF_NAME
    action: stop
  when: manual
```

## Part 6: Kubernetes Integration

### GitLab Kubernetes Agent

```yaml
# Install GitLab Agent in Kubernetes
kubectl create namespace gitlab-agent
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: gitlab-agent
  namespace: gitlab-agent
---
apiVersion: v1
kind: Secret
metadata:
  name: gitlab-agent-token
  namespace: gitlab-agent
type: Opaque
data:
  token: $(echo -n "YOUR_AGENT_TOKEN" | base64)
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gitlab-agent
  namespace: gitlab-agent
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gitlab-agent
  template:
    metadata:
      labels:
        app: gitlab-agent
    spec:
      serviceAccountName: gitlab-agent
      containers:
      - name: agent
        image: registry.gitlab.com/gitlab-org/cluster-integration/gitlab-agent/agentk:latest
        args:
        - --token-file=/config/token
        volumeMounts:
        - name: config
          mountPath: /config
      volumes:
      - name: config
        secret:
          secretName: gitlab-agent-token
EOF
```

### Auto DevOps

```yaml
# Enable Auto DevOps in .gitlab-ci.yml
include:
  - template: Auto-DevOps.gitlab-ci.yml

variables:
  AUTO_DEVOPS_PLATFORM_TARGET: kubernetes
  KUBE_INGRESS_BASE_DOMAIN: example.com
  KUBE_NAMESPACE: production
```

### GitLab Review Apps

```yaml
review:
  stage: deploy
  script:
    - helm upgrade --install review-$CI_COMMIT_REF_SLUG ./chart
      --set image.tag=$CI_COMMIT_SHA
      --set ingress.host=review-$CI_COMMIT_REF_SLUG.example.com
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    url: https://review-$CI_COMMIT_REF_SLUG.example.com
    on_stop: stop_review

stop_review:
  stage: deploy
  script:
    - helm delete review-$CI_COMMIT_REF_SLUG
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    action: stop
  when: manual
```

## Part 7: Complete Demo Project

### Project Structure

```
gitlab-demo/
├── .gitlab-ci.yml
├── Dockerfile
├── docker-compose.yml
├── src/
│   ├── app.py
│   ├── requirements.txt
│   └── tests/
│       └── test_app.py
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
├── helm/
│   └── Chart.yaml
└── README.md
```

### Application Code

```python
# src/app.py
from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify({
        'message': 'Hello from GitLab CI/CD!',
        'version': os.getenv('VERSION', '1.0.0'),
        'environment': os.getenv('ENVIRONMENT', 'development')
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

```python
# src/tests/test_app.py
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_hello(client):
    response = client.get('/')
    assert response.status_code == 200
    data = response.get_json()
    assert 'message' in data
    assert 'Hello from GitLab CI/CD!' in data['message']

def test_health(client):
    response = client.get('/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'
```

### Dockerfile

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

### Complete CI/CD Pipeline

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - security
  - deploy

variables:
  DOCKER_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  DOCKER_IMAGE_LATEST: $CI_REGISTRY_IMAGE:latest

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $DOCKER_IMAGE .
    - docker push $DOCKER_IMAGE
    - docker tag $DOCKER_IMAGE $DOCKER_IMAGE_LATEST
    - docker push $DOCKER_IMAGE_LATEST
  only:
    - main
    - merge_requests

test:
  stage: test
  image: python:3.9
  before_script:
    - pip install -r src/requirements.txt
  script:
    - cd src
    - python -m pytest tests/ -v --cov=. --cov-report=term --cov-report=xml
  coverage: '/TOTAL.*\s+(\d+%)$/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: src/coverage.xml
  dependencies:
    - build

security_scan:
  stage: security
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker run --rm -v $(pwd):/app -w /app
      registry.gitlab.com/gitlab-org/cli:latest
      container-scanning image scan $DOCKER_IMAGE
  dependencies:
    - build
  allow_failure: true

deploy_staging:
  stage: deploy
  script:
    - echo "Deploying to staging environment"
    - docker run -d --name app-staging -p 8080:5000
      -e ENVIRONMENT=staging -e VERSION=$CI_COMMIT_SHA
      $DOCKER_IMAGE
  environment:
    name: staging
    url: http://staging.example.com:8080
  dependencies:
    - build
    - test
  only:
    - main

deploy_production:
  stage: deploy
  script:
    - echo "Deploying to production environment"
    - docker run -d --name app-production -p 80:5000
      -e ENVIRONMENT=production -e VERSION=$CI_COMMIT_TAG
      $DOCKER_IMAGE
  environment:
    name: production
    url: http://example.com
  dependencies:
    - build
    - test
  only:
    - tags
  when: manual

cleanup:
  stage: deploy
  script:
    - docker system prune -f
  when: manual
```

## Part 8: Best Practices and Troubleshooting

### GitLab Best Practices

#### Repository Organization

```bash
# Use meaningful branch names
git checkout -b feature/user-authentication
git checkout -b bugfix/login-validation
git checkout -b hotfix/security-patch

# Use conventional commits
git commit -m "feat: add user authentication"
git commit -m "fix: validate email format"
git commit -m "docs: update API documentation"
```

#### CI/CD Best Practices

```yaml
# Use templates for consistency
include:
  - template: Auto-DevOps.gitlab-ci.yml

# Cache dependencies
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .npm/
    - node_modules/

# Use artifacts for passing data between jobs
build:
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

test:
  dependencies:
    - build
```

### Troubleshooting Common Issues

#### Pipeline Failures

```bash
# Check runner status
docker-compose exec gitlab-runner gitlab-runner verify

# View runner logs
docker-compose logs gitlab-runner

# Debug pipeline
# Add debug logging to .gitlab-ci.yml
test:
  script:
    - set -x  # Enable debug mode
    - npm test
```

#### GitLab Performance Issues

```bash
# Check GitLab status
docker-compose exec gitlab gitlab-ctl status

# View GitLab logs
docker-compose exec gitlab gitlab-ctl tail

# Restart GitLab services
docker-compose exec gitlab gitlab-ctl restart

# Check resource usage
docker stats
```

#### Runner Issues

```bash
# List runners
docker-compose exec gitlab-runner gitlab-runner list

# Unregister runner
docker-compose exec gitlab-runner gitlab-runner unregister --name "docker-runner"

# Update runner configuration
docker-compose exec gitlab-runner gitlab-runner register [options]
```

### Backup and Recovery

```bash
# Backup GitLab
docker-compose exec gitlab gitlab-backup create

# List backups
docker-compose exec gitlab ls /var/opt/gitlab/backups/

# Restore from backup
docker-compose exec gitlab gitlab-backup restore BACKUP_ID

# Backup configuration
docker-compose exec gitlab gitlab-ctl backup-etc
```

## Conclusion

You've now mastered GitLab from setting up your own self-hosted server to implementing advanced CI/CD pipelines and enterprise features. GitLab provides a complete DevOps platform that can scale from small teams to large enterprises.

### Key Takeaways

1. **Self-Hosted GitLab** gives you complete control over your data and infrastructure
2. **CI/CD Pipelines** automate your development workflow from build to deployment
3. **Advanced Features** like security scanning, Kubernetes integration, and review apps enhance your development process
4. **Best Practices** ensure maintainable and scalable GitLab implementations

### Next Steps

- Explore GitLab's extensive API for automation
- Set up monitoring and alerting for your pipelines
- Implement GitOps workflows with GitLab
- Integrate with other DevOps tools in your ecosystem

### Resources

- [GitLab Documentation](https://docs.gitlab.com/)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [GitLab Runner Documentation](https://docs.gitlab.com/runner/)
- [GitLab University](https://university.gitlab.com/)

Happy GitLab-ing! 🦊
