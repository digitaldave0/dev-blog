---
layout: post
title: "🛠️ Kubernetes Intermediate: Configuration and Management"
categories: [Kubernetes, DevOps, Tutorial]
excerpt: "Level up your Kubernetes skills! Learn about ConfigMaps, Secrets, resource management, and deployment strategies. Perfect for developers ready to move beyond the basics."
description: "A deep dive into Kubernetes configuration and management practices. Learn how to handle application configurations, manage sensitive data with Secrets, implement resource quotas, and master different deployment strategies. Includes real-world scenarios and best practices for production environments."
---


# Kubernetes Intermediate: Configuration and Resource Management

Welcome to part 2 of our Kubernetes tutorial series! As your applications grow in complexity, proper configuration management becomes crucial. In this post, we'll explore the tools and practices that make Kubernetes applications maintainable, secure, and resource-efficient in production environments.

## What We'll Cover

1. Configuration Management with ConfigMaps - Keep your application settings flexible and environment-specific
2. Managing Secrets - Secure handling of sensitive data like passwords and API keys
3. Resource Management - Ensure optimal resource utilization and application performance
4. Advanced Deployment Strategies - Zero-downtime deployments and production rollout techniques

## Prerequisites

- Completed our [Kubernetes Basics tutorial](./2025-07-09-kubernetes-basics-introduction.md)
- Running Kind cluster
- Basic YAML understanding

## ConfigMaps: Managing Application Configuration

ConfigMaps are one of Kubernetes' most powerful features for configuration management. They solve several critical challenges in modern application deployment:

### Why Use ConfigMaps?

1. **Environment Separation**: Maintain different configurations for development, staging, and production without changing application code
2. **Configuration Updates**: Update application settings without rebuilding containers
3. **Configuration Sharing**: Share configuration data across multiple pods
4. **Version Control**: Track configuration changes in your Git repository

### Types of Configuration Data

ConfigMaps can store various types of configuration:
- Environment variables
- Configuration files
- Command-line arguments
- Custom configuration formats

Here's a comprehensive example:

```yaml
# config-map.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  # Simple key-value pairs
  APP_ENV: "development"
  LOG_LEVEL: "debug"
  
  # Configuration files
  app.properties: |
    environment=development
    log.level=debug
    feature.flag.newui=true
    cache.timeout=3600
    
  # JSON configuration
  config.json: |
    {
      "database": {
        "host": "localhost",
        "port": 5432,
        "maxConnections": 100
      },
      "cache": {
        "enabled": true,
        "ttl": 3600
      }
    }
```

### Best Practices for ConfigMaps

1. **Naming Convention**: Use clear, consistent names that reflect the purpose
2. **Size Limits**: Keep ConfigMaps under 1MB
3. **Granularity**: Split large configurations into multiple ConfigMaps
4. **Validation**: Always validate configuration before deployment

### Using ConfigMaps in Pods

There are three main ways to use ConfigMaps:

1. **Environment Variables**:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: config-env-pod
spec:
  containers:
  - name: app-container
    image: my-app:1.0
    env:
    - name: APP_ENV
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: APP_ENV
```

2. **Volume Mounts** (for configuration files):
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: config-volume-pod
spec:
  containers:
  - name: app-container
    image: my-app:1.0
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: app-config
```

3. **Command Line Arguments**:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: config-cmd-pod
spec:
  containers:
  - name: app-container
    image: my-app:1.0
    command: ["/bin/app"]
    args: ["--env", "$(APP_ENV)"]
    env:
    - name: APP_ENV
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: APP_ENV
```

### Dynamic Updates

One of the most powerful features of ConfigMaps is their ability to update configuration dynamically:

1. Most volume-mounted ConfigMaps update automatically (may take up to 1 minute)
2. Environment variables require pod restart
3. Use a sidecar container for more complex configuration updates

## Secrets: Managing Sensitive Data

Kubernetes Secrets are essential for managing sensitive information like:
- Database credentials
- API keys
- TLS certificates
- OAuth tokens

### Why Use Secrets?

1. **Security**: Base64 encoding and optional encryption at rest
2. **Access Control**: Fine-grained RBAC controls
3. **Integration**: Native integration with pods and services
4. **Rotation**: Easy secret rotation without rebuilding containers

### Types of Secrets

1. **Opaque**: Generic user-defined data
2. **kubernetes.io/tls**: TLS certificates
3. **kubernetes.io/dockerconfigjson**: Docker registry credentials
4. **kubernetes.io/service-account-token**: Service account tokens

Here's a comprehensive example:

```yaml
# Create different types of secrets
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  # Base64 encoded values
  db-password: cGFzc3dvcmQxMjM=
  api-key: c2VjcmV0LWtleS0xMjM=
  
---
apiVersion: v1
kind: Secret
metadata:
  name: tls-secret
type: kubernetes.io/tls
data:
  tls.crt: base64-encoded-cert
  tls.key: base64-encoded-key
```

### Best Practices for Secrets

1. **Never commit secrets to version control**
2. **Use external secret management systems** (HashiCorp Vault, AWS Secrets Manager)
3. **Implement secret rotation**
4. **Limit secret access with RBAC**
5. **Enable encryption at rest**

### Using Secrets in Pods

1. **As Environment Variables**:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
  - name: app-container
    image: my-app:1.0
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: app-secrets
          key: db-password
```

2. **As Volume Mounts**:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-volume-pod
spec:
  containers:
  - name: app-container
    image: my-app:1.0
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secret-volume
    secret:
      secretName: app-secrets
```

## Resource Management

Proper resource management is crucial for:
- Application performance
- Cost optimization
- Cluster stability
- Fair resource sharing

### Understanding Resource Types

1. **CPU**
   - Measured in cores or millicores (m)
   - 1 core = 1000m
   - Compressible resource (can be throttled)

2. **Memory**
   - Measured in bytes (Ki, Mi, Gi)
   - Non-compressible resource (can't be throttled)
   - OOM killer terminates pods exceeding limits

3. **Ephemeral Storage**
   - Local storage for containers
   - Temporary data, logs, etc.

### Resource Requests vs Limits

**Requests**: Guaranteed minimum resources
**Limits**: Maximum allowed resources

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-demo
spec:
  containers:
  - name: app
    image: my-app:1.0
    resources:
      requests:
        memory: "128Mi"    # Guaranteed minimum
        cpu: "250m"        # 1/4 CPU core
      limits:
        memory: "256Mi"    # Maximum allowed
        cpu: "500m"        # 1/2 CPU core
```

### Resource Quotas

Resource Quotas help manage cluster resources at the namespace level:

1. **Compute Quotas**:
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
spec:
  hard:
    requests.cpu: "4"
    requests.memory: "8Gi"
    limits.cpu: "8"
    limits.memory: "16Gi"
```

2. **Object Quotas**:
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: object-quota
spec:
  hard:
    configmaps: "10"
    persistentvolumeclaims: "4"
    pods: "20"
    services: "10"
    services.loadbalancers: "2"
```

### Best Practices for Resource Management

1. **Always Set Requests and Limits**
   - Prevents resource starvation
   - Enables better scheduling
   - Improves cluster stability

2. **Monitor Resource Usage**
   - Use tools like Prometheus and Grafana
   - Track historical usage patterns
   - Set up alerts for resource pressure

3. **Implement Horizontal Pod Autoscaling**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
```

## Advanced Deployment Strategies

Choosing the right deployment strategy is crucial for maintaining application availability and user experience. Let's explore the main strategies:

### 1. Rolling Updates (Default)

Rolling updates gradually replace old pods with new ones, ensuring zero downtime.

**Benefits**:
- Zero downtime deployments
- Automatic rollback capability
- Gradual traffic migration
- No additional resource overhead

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rolling-demo
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # How many pods above desired count
      maxUnavailable: 1  # How many pods can be unavailable
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:2.0
        readinessProbe:     # Important for rolling updates
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
```

### 2. Blue-Green Deployments

Run two identical environments, switching traffic from blue (current) to green (new) all at once.

**Benefits**:
- Instant rollback capability
- Zero downtime
- Testing in production environment
- Simplified rollback process

```yaml
# blue-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
      version: blue
  template:
    metadata:
      labels:
        app: my-app
        version: blue
    spec:
      containers:
      - name: app
        image: my-app:1.0

---
# green-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
      version: green
  template:
    metadata:
      labels:
        app: my-app
        version: green
    spec:
      containers:
      - name: app
        image: my-app:2.0

---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app
spec:
  selector:
    app: my-app
    version: blue  # Switch to green when ready
  ports:
  - port: 80
    targetPort: 8080
```

### 3. Canary Deployments

Gradually route traffic to the new version, testing it with a small subset of users.

**Benefits**:
- Risk mitigation
- A/B testing capability
- Gradual rollout
- Early problem detection

```yaml
# Main deployment (90% of traffic)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-stable
spec:
  replicas: 9  # 90% of pods
  template:
    metadata:
      labels:
        app: my-app
        version: stable
    spec:
      containers:
      - name: app
        image: my-app:1.0

---
# Canary deployment (10% of traffic)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-canary
spec:
  replicas: 1  # 10% of pods
  template:
    metadata:
      labels:
        app: my-app
        version: canary
    spec:
      containers:
      - name: app
        image: my-app:2.0

---
# Service (routes to both deployments)
apiVersion: v1
kind: Service
metadata:
  name: my-app
spec:
  selector:
    app: my-app  # Routes to both versions
  ports:
  - port: 80
```

## Hands-on Exercise: Complete Application Setup

Let's put it all together with a real-world example that incorporates all the concepts we've covered:

```yaml
# complete-app.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: production
  CACHE_TTL: "3600"
  app.properties: |
    log.level=info
    feature.flags.enabled=true

---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  db-password: base64-encoded-password
  api-key: base64-encoded-key

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: complete-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: complete-app
    spec:
      containers:
      - name: app
        image: my-app:1.0
        resources:
          requests:
            cpu: "250m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "256Mi"
        env:
        - name: APP_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: APP_ENV
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db-password
        volumeMounts:
        - name: config-volume
          mountPath: /etc/config
      volumes:
      - name: config-volume
        configMap:
          name: app-config

---
apiVersion: v1
kind: Service
metadata:
  name: complete-app
spec:
  selector:
    app: complete-app
  ports:
  - port: 80
    targetPort: 8080
```

## What's Next?

In our next post, we'll explore advanced Kubernetes topics including:
- Service Mesh with Istio
- Monitoring and Observability
- Cluster Autoscaling
- Custom Resource Definitions (CRDs)
- Operators and Custom Controllers

## Additional Resources

- [Kubernetes Official Documentation on ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [Kubernetes Secrets Best Practices](https://kubernetes.io/docs/concepts/security/secrets-good-practices/)
- [Resource Management Guide](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
- [Deployment Strategies Explained](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#deployment-strategies)

Remember to join our community on Discord for questions and discussions about Kubernetes deployments and configurations!
