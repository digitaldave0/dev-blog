---
layout: post
title: "🛠️ Kubernetes Intermediate: Configuration and Management"
categories: [Kubernetes, DevOps, Tutorial]
excerpt: "Level up your Kubernetes skills! Learn about ConfigMaps, Secrets, resource management, and deployment strategies. Perfect for developers ready to move beyond the basics."
description: "A deep dive into Kubernetes configuration and management practices. Learn how to handle application configurations, manage sensitive data with Secrets, implement resource quotas, and master different deployment strategies. Includes real-world scenarios and best practices for production environments."
---

# Kubernetes Intermediate: Configuration and Resource Management

Welcome to part 2 of our Kubernetes tutorial series! In this post, we'll explore more advanced concepts and learn how to properly configure and manage your applications in Kubernetes.

## What We'll Cover

1. Configuration Management with ConfigMaps
2. Managing Secrets
3. Resource Management
4. Advanced Deployment Strategies

## Prerequisites

- Completed our [Kubernetes Basics tutorial](./2025-07-09-kubernetes-basics-introduction.md)
- Running Kind cluster
- Basic YAML understanding

## ConfigMaps: Managing Application Configuration

ConfigMaps allow you to decouple configuration from your container images.

```yaml
# config-map.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  app.properties: |
    environment=development
    log.level=debug
  database.properties: |
    db.url=localhost:5432
    db.name=myapp
```

### Using ConfigMaps in Pods

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: config-test-pod
spec:
  containers:
  - name: test-container
    image: busybox
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: app-config
```

## Secrets: Managing Sensitive Data

```yaml
# Create a secret
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  db-password: BASE64_ENCODED_PASSWORD
  api-key: BASE64_ENCODED_API_KEY
```

### Using Secrets as Environment Variables

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
spec:
  containers:
  - name: test-container
    image: myapp
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: app-secrets
          key: db-password
```

## Resource Management

### Setting Resource Requests and Limits

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-demo
spec:
  containers:
  - name: resource-demo-container
    image: nginx
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

### Resource Quotas

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
spec:
  hard:
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
```

## Advanced Deployment Strategies

### Rolling Updates

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rolling-demo
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  # ... rest of deployment spec
```

### Blue-Green Deployments

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app
spec:
  selector:
    app: my-app
    version: blue  # Switch between blue and green
  ports:
  - port: 80
```

## Hands-on Exercise: Complete Application Setup

Let's create a complete application setup with:
- ConfigMap for application settings
- Secret for sensitive data
- Deployment with resource limits
- Service for exposure

```yaml
# Complete example in the repository
```

## What's Next?

In the next post, we'll explore:
- StatefulSets and persistent storage
- Networking and Service Mesh
- Monitoring and logging
- Horizontal Pod Autoscaling

## Additional Resources

- [Kubernetes ConfigMaps and Secrets](https://kubernetes.io/docs/concepts/configuration/)
- [Resource Management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
- [Deployment Strategies](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
