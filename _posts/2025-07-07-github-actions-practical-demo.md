---
layout: post
title: "GitHub Actions in Practice: A Complete CI/CD Pipeline Demo"
date: 2025-07-07
categories: devops ci-cd
tags: 
  - github-actions
  - ci-cd
  - deployment
  - security
  - automation
  - devops
description: "A hands-on guide to building a complete CI/CD pipeline with GitHub Actions, including manual approvals, secrets management, and deployment strategies."
excerpt: "Learn how to build a real-world CI/CD pipeline using GitHub Actions. This practical guide covers building, testing, deployment, manual approvals, and securing your workflow with GitHub Secrets."
---


# GitHub Actions in Practice: Building a Complete CI/CD Pipeline

In this practical guide, we'll create a complete CI/CD pipeline using GitHub Actions. We'll build a Node.js application, run tests, and deploy it to different environments with manual approval gates.

## Project Setup

Let's start with a simple Node.js Express application. Here's our project structure:

```
my-node-app/
├── .github/
│   └── workflows/
│       └── main.yml
├── src/
│   └── app.js
├── tests/
│   └── app.test.js
├── package.json
└── Dockerfile
```

### Basic Application Code

```javascript
// src/app.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from my Node.js app!' });
});

module.exports = app;
```

```javascript
// tests/app.test.js
const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  it('responds with hello message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello from my Node.js app!');
  });
});
```

## The Complete CI/CD Workflow

Here's our comprehensive workflow that includes building, testing, and deploying with manual approvals:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  # Enable manual trigger
  workflow_dispatch:

env:
  NODE_VERSION: '18.x'
  
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
        
      - name: Build Docker image
        run: |
          docker build -t my-node-app:${{ github.sha }} .
          
      # Save the build artifacts
      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: app-build
          path: .

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.myapp.com
    steps:
      - name: Download build artifact
        uses: actions/download-artifact@v3
        with:
          name: app-build
          
      - name: Deploy to staging
        env:
          STAGING_SECRET: ${{ secrets.STAGING_DEPLOY_KEY }}
        run: |
          echo "Deploying to staging..."
          # Your deployment commands here
          
  manual-approval:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment:
      name: production-approval
    steps:
      - name: Manual approval step
        run: echo "Approved for production deployment"

  deploy-production:
    needs: manual-approval
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
    steps:
      - name: Download build artifact
        uses: actions/download-artifact@v3
        with:
          name: app-build
          
      - name: Deploy to production
        env:
          PROD_SECRET: ${{ secrets.PROD_DEPLOY_KEY }}
        run: |
          echo "Deploying to production..."
          # Your production deployment commands here
```

## Understanding Manual Gates

In our workflow, we've implemented a manual approval gate before production deployment using GitHub Environments:

1. Go to your repository settings
2. Navigate to Environments
3. Create a new environment called "production-approval"
4. Add required reviewers who can approve deployments

The `manual-approval` job will pause the workflow until an authorized person approves the deployment through the GitHub UI.

## Managing Secrets

GitHub Secrets provide secure storage for sensitive information. Here's how to use them:

### Setting Up Secrets

1. Navigate to your repository settings
2. Go to Secrets and Variables → Actions
3. Click "New repository secret"
4. Add your secrets:
   - `STAGING_DEPLOY_KEY`
   - `PROD_DEPLOY_KEY`

### Using Secrets in Workflows

```yaml
steps:
  - name: Use secret
    env:
      MY_SECRET: ${{ secrets.SECRET_NAME }}
    run: |
      # Your commands here
      # Never echo or print secrets!
```

### Best Practices for Secrets

1. **Never Log Secrets**
```yaml
# DON'T DO THIS
- name: Debug
  run: echo ${{ secrets.MY_SECRET }}

# DO THIS
- name: Use secret safely
  env:
    SECRET: ${{ secrets.MY_SECRET }}
  run: ./deploy.sh  # Use secret internally
```

2. **Scope Secrets Properly**
```yaml
# Scope secrets to specific environments
environment:
  name: production
  # Secrets from this environment are only available in this job
```

3. **Rotate Secrets Regularly**
   - Update deployment keys
   - Rotate API tokens
   - Change access credentials

## Adding Status Checks

To enforce quality gates, add branch protection rules:

1. Go to repository settings
2. Navigate to Branches
3. Add rule for your main branch
4. Required status checks:
   - build
   - deploy-staging
   - manual-approval

## Monitoring and Debugging

### View Workflow Runs

1. Go to Actions tab
2. Select your workflow
3. View detailed logs and artifacts

### Debug with SSH (if needed)

```yaml
# Add this step to ssh into the runner for debugging
steps:
  - uses: actions/checkout@v4
  - name: Setup tmate session
    uses: mxschmitt/action-tmate@v3
    if: {% raw %}${{ failure() }}{% endraw %}
```

## Real-World Considerations

1. **Environment Variables**
```yaml
{% raw %}
env:
  NODE_ENV: production
  APP_VERSION: ${{ github.sha }}
{% endraw %}
```

2. **Caching Dependencies**
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

3. **Notifications**
```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    fields: repo,message,commit,author,action,workflow
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Common Issues and Solutions

1. **Build Failures**
   - Check Node version matches
   - Verify dependencies are locked
   - Ensure tests are deterministic

2. **Deployment Issues**
   - Verify environment secrets
   - Check deployment service status
   - Review access permissions

3. **Manual Approval Timeout**
   - Default timeout is 24 hours
   - Can be configured in environment settings

## Conclusion

This practical implementation demonstrates a production-ready CI/CD pipeline with GitHub Actions. The workflow includes all essential elements:
- Automated testing
- Multi-environment deployment
- Manual approval gates
- Secure secrets management
- Status checks and protection

Remember to adapt the deployment steps to your specific hosting platform (AWS, Azure, GCP, etc.) and add any necessary environment-specific configurations.

## Additional Resources

- [GitHub Actions Environments Documentation](https://docs.github.com/en/actions/deployment/targeting-different-environments)
- [GitHub Secrets Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
