---
title: 'Platform Engineering: Building an Internal Developer Portal with Backstage'
pubDate: 2026-04-27T10:00:00.000Z
categories:
  - Platform Engineering
  - DevOps
description: 'An enterprise-grade guide to building Internal Developer Portals (IDP) using Backstage, focusing on Scaffolder, Software Catalog, and TechDocs.'
tags:
  - backstage
  - developer-experience
  - idp
  - platform-engineering
  - software-catalog
heroImage: 'https://picsum.photos/seed/backstage-idp/800/400'
---
Platform Engineering is the strategic practice of designing and building self-service capabilities for software engineering organizations. At the heart of this movement is **Backstage**, an open-source framework for building developer portals.

## The Three Pillars of Backstage

### 1. The Software Catalog
The catalog is the "Source of Truth" for all software in your ecosystem. It tracks not just services, but the relationships between them.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: payment-gateway-api
  description: Core API for processing transactions
  annotations:
    github.com/project-slug: internal/payment-api
    backstage.io/techdocs-ref: dir:.
spec:
  type: service
  owner: fintech-team
  lifecycle: production
  system: payment-system
  dependsOn:
    - resource:default/payment-db
```

### 2. The Software Scaffolder (Golden Paths)
The Scaffolder allows developers to create new projects based on company-wide best practices. It uses **Templates** to automate repository creation, CI/CD setup, and cloud provisioning.

```yaml
# template.yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: go-service-template
spec:
  steps:
    - id: fetch-base
      name: Fetch Base
      action: fetch:template
      input:
        url: ./skeleton
    - id: publish
      name: Publish to GitHub
      action: publish:github
      input:
        allowedHosts: ['github.com']
        description: 'New microservice created via Backstage'
        repoUrl: 'github.com?owner=org&repo=${{ parameters.name }}'
```

### 3. TechDocs (Documentation-as-Code)
TechDocs allows documentation to live in the same repository as the code. Backstage renders it using MkDocs, ensuring documentation is never out of sync with the implementation.

## Advanced Architecture: Plugins and Integration
Backstage's power lies in its **Plugin API**. You can integrate:
- **Kubernetes**: View pod status and deployments directly in the portal.
- **Cost Insights**: Show developers the cost of their infrastructure.
- **Security Scans**: Integrate Snyk or SonarQube results.

## Challenges in Enterprise Adoption
- **Culture over Tooling**: An IDP is only successful if it solves a real friction point for developers.
- **Data Governance**: Keeping the catalog updated requires automated discovery mechanisms.

Platform engineering with Backstage is about creating a developer experience that is "Golden," not "Gilded"—providing freedom within a framework of safety.

## Advanced Topics

### Security Plugins & Policy Enforcement
- **OPA Integration**: Use the `@backstage/plugin-opa` plugin to evaluate policy decisions for catalog entities. Example policy to enforce required labels:
```rego
package backstage.catalog
default allow = false
allow {
  input.metadata.labels.owner != ""
}
```
- **Snyk Scan**: Configure the `@backstage/plugin-snyk` to surface vulnerability reports directly in the UI.

### Scaling Backstage in Kubernetes
Deploy Backstage as a Helm chart with autoscaling:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backstage
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
  template:
    spec:
      containers:
        - name: backstage
          image: backstage:latest
          resources:
            requests:
              cpu: "250m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          env:
            - name: NODE_ENV
              value: "production"
```
Enable HPA based on CPU:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backstage-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backstage
  minReplicas: 2
  maxReplicas: 6
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

### CI/CD Integration Example (GitHub Actions)
```yaml
name: Backstage CI
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: Lint & Test
        run: npm run lint && npm test
      - name: Build image
        run: |
          docker build -t myorg/backstage:${{ github.sha }} .
      - name: Push to registry
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USER }}
          password: ${{ secrets.DOCKER_PASS }}
      - name: Deploy to K8s
        uses: azure/k8s-deploy@v4
        with:
          manifests: |
            k8s/deployment.yaml
```
