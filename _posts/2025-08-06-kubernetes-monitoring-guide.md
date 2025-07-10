---
layout: post
title: "📊 Kubernetes Monitoring and Observability"
categories: [Kubernetes, DevOps, Monitoring, Tutorial]
excerpt: "Implement comprehensive monitoring and observability in your Kubernetes clusters using Prometheus, Grafana, and other powerful tools. Learn how to set up dashboards, alerts, and troubleshooting workflows."
description: "Master Kubernetes monitoring and observability with this in-depth guide. Learn how to implement Prometheus and Grafana, set up custom metrics, create powerful dashboards, and establish effective alerting strategies. Essential knowledge for maintaining production-grade Kubernetes clusters."
---

<style>
pre, code {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
}
pre {
    padding: 15px !important;
    border-radius: 5px !important;
    border: 1px solid #444 !important;
}
code {
    padding: 2px 5px !important;
    border-radius: 3px !important;
}
</style>

# Kubernetes Monitoring and Observability

Learn how to implement comprehensive monitoring and observability in your Kubernetes clusters to ensure optimal performance and quick troubleshooting.

## What We'll Cover

1. Setting up Prometheus and Grafana
2. Custom Metrics and Service Monitors
3. Alert Management
4. Log Aggregation
5. Distributed Tracing

## Prerequisites

- Working Kubernetes cluster
- Helm installed
- Basic understanding of monitoring concepts

## Installing Prometheus Operator

First, let's set up Prometheus Operator using Helm:

```bash
# Add Prometheus community charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus Stack
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

## Custom ServiceMonitor Configuration

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: app-monitor
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: my-app
  endpoints:
  - port: metrics
    interval: 15s
  namespaceSelector:
    matchNames:
    - default
```

## Creating Custom Metrics

Example of a custom metrics endpoint in Go:

```go
package main

import (
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    httpRequestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "endpoint"},
    )
)

func init() {
    prometheus.MustRegister(httpRequestsTotal)
}
```

## Grafana Dashboard Configuration

Example dashboard JSON:

```json
{
  "dashboard": {
    "id": null,
    "title": "Application Overview",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      }
    ]
  }
}
```

## Alert Configuration

PrometheusRule example:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: application-alerts
  namespace: monitoring
spec:
  groups:
  - name: application
    rules:
    - alert: HighErrorRate
      expr: |
        rate(http_requests_total{status=~"5.*"}[5m]) 
        / 
        rate(http_requests_total[5m]) > 0.1
      for: 5m
      labels:
        severity: critical
      annotations:
        description: Error rate is above 10% for 5 minutes
```

## Log Aggregation with Loki

Installing Loki stack:

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm install loki grafana/loki-stack \
  --namespace monitoring \
  --set grafana.enabled=false
```

## Distributed Tracing with Jaeger

Jaeger deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger
spec:
  selector:
    matchLabels:
      app: jaeger
  template:
    metadata:
      labels:
        app: jaeger
    spec:
      containers:
      - name: jaeger
        image: jaegertracing/all-in-one:latest
        ports:
        - containerPort: 16686
        - containerPort: 14268
```

## Best Practices

1. **Metric Collection**:
   - Use meaningful labels
   - Follow naming conventions
   - Keep cardinality under control

2. **Alerting**:
   - Define clear severity levels
   - Avoid alert fatigue
   - Include runbooks

3. **Dashboard Design**:
   - Start with overview
   - Use consistent layouts
   - Include documentation

## Video Resources

### Monitoring Fundamentals
- [Kubernetes Monitoring with Prometheus](https://www.youtube.com/watch?v=h4Sl21AKiDg) by TechWorld with Nana
- [Grafana Dashboards Tutorial](https://www.youtube.com/watch?v=4WWW2ZLEg74) by The Digital Life

### Advanced Monitoring
- [PromQL Deep Dive](https://www.youtube.com/watch?v=hTjHuoWxsks) by Julius Volz
- [Kubernetes Monitoring Architecture](https://www.youtube.com/watch?v=mWJmXJ5KyHo) by CNCF

### Observability Practices
- [Distributed Tracing with Jaeger](https://www.youtube.com/watch?v=LYPExHjqjyA) by Juraci Paixão
- [Logging Best Practices](https://www.youtube.com/watch?v=QQZc_VJM0Ws) by Cloud Native Skunkworks

## Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [SRE Book - Monitoring Chapter](https://sre.google/sre-book/monitoring-distributed-systems/)
