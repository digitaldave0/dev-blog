---
title: 'Modern Observability: Mastering OpenTelemetry and Prometheus'
pubDate: 2026-04-27T11:00:00.000Z
categories:
  - Observability
  - SRE
description: 'A technical deep-dive into standardizing telemetry data with OTel, including collector configurations, sampling strategies, and Prometheus integration.'
tags:
  - observability
  - opentelemetry
  - prometheus
  - grafana
  - monitoring
  - sre
heroImage: 'https://picsum.photos/seed/otel-prometheus/800/400'
---

Modern observability is defined by the shift from vendor-specific agents to open standards. **OpenTelemetry (OTel)** provides a unified framework for traces, metrics, and logs, while **Prometheus** remains the industry leader for time-series storage.

## The OpenTelemetry Collector: The Nervous System
The OTel Collector is a vendor-agnostic proxy that can receive, process, and export telemetry data. In production, we typically use a "Gateway" pattern for centralized processing.

### Advanced Collector Configuration
```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:
  hostmetrics:
    scrapers:
      cpu:
      memory:
      network:

processors:
  resourcedetection:
    detectors: ["env", "system", "k8snode"]
  batch:
    timeout: 10s
    send_batch_size: 1024
  tail_sampling:
    policies:
      - name: errors-only
        type: status_code
        status_code: {status_codes: [ERROR]}

exporters:
  prometheusremotewrite:
    endpoint: "http://prometheus:9090/api/v1/write"
  otlp/jaeger:
    endpoint: "jaeger-collector:4317"

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [resourcedetection, tail_sampling, batch]
      exporters: [otlp/jaeger]
    metrics:
      receivers: [otlp, hostmetrics]
      processors: [resourcedetection, batch]
      exporters: [prometheusremotewrite]
```

## Sampling Strategies: Balancing Cost and Context
Sampling is crucial for managing the volume of trace data.
- **Head-based Sampling**: Decisions are made at the start of a trace. Simple but can miss critical errors.
- **Tail-based Sampling**: Decisions are made after the trace is complete. Allows for "Keep all errors" logic, but requires the Collector to buffer traces.

## Prometheus Integration: Metrics 2.0
With the introduction of **OpenMetrics**, Prometheus can now handle OTel-native metrics with ease. Using the `prometheusremotewrite` exporter allows for high-availability setups with tools like **Thanos** or **Cortex**.

## Best Practices for Instrumentation
1. **Auto-Instrumentation**: Use OTel agents/SDKs for common libraries (HTTP, SQL, Redis).
2. **Custom Attributes**: Add high-value domain data (e.g., `account_id`, `region`) to your spans.
3. **Semantic Conventions**: Follow the OTel specification for attribute naming to ensure cross-tool compatibility.

By mastering OpenTelemetry, you decouple your observability strategy from your tooling, ensuring your data remains portable and powerful.

## Advanced Topics

### Exporting Traces to Jaeger & Zipkin
Add sidecar exporters for low‑latency trace shipping:
```yaml
exporters:
  jaeger:
    endpoint: "http://jaeger-collector:14250"
  zipkin:
    endpoint: "http://zipkin:9411/api/v2/spans"
service:
  pipelines:
    traces:
      exporters: [jaeger, zipkin]
```

### Grafana Dashboards for OTel Metrics
Create a dashboard that queries the `otelcol` Prometheus endpoint:
```json
{
  "title": "OTel Metrics",
  "panels": [{
    "type": "graph",
    "title": "CPU Usage",
    "targets": [{
      "expr": "process_cpu_seconds_total"
    }]
  }]
}
```
Import via Grafana UI or `grafana-cli`.

### Java Auto‑Instrumentation with Spring Boot
Add the OpenTelemetry Java agent to your `Dockerfile`:
```Dockerfile
FROM eclipse-temurin:21-jdk-alpine
ARG OTEL_AGENT_VERSION=1.27.0
ADD https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/v${OTEL_AGENT_VERSION}/opentelemetry-javaagent.jar /otel/opentelemetry-javaagent.jar
ENV JAVA_TOOL_OPTIONS="-javaagent:/otel/opentelemetry-javaagent.jar"
COPY target/app.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```
Enable exporter via env vars:
```bash
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
OTEL_RESOURCE_ATTRIBUTES=service.name=my-spring-app
```

### Sampling Strategies in Production
- **Tail‑Sampling**: Already demonstrated; add a second policy for `high‑value` traces:
```yaml
policies:
  - name: high-value
    type: span_attributes
    span_attributes:
      key: "environment"
      string_values: ["prod"]
```
- **Probabilistic Sampling**: Simple 1% sample for low‑traffic services.
```yaml
processors:
  probabilistic_sampling:
    sampling_percentage: 1
```
These extensions give you a production‑grade observability stack that scales with your services.
