---
layout: post
title: "Kafka Monitoring, Operations, and Troubleshooting"
categories: [Kafka, Monitoring, Operations, Troubleshooting, Tutorial]
description: "Master Kafka operations: implement comprehensive monitoring, handle common issues, perform maintenance, and ensure high availability."
excerpt: "Complete guide to monitoring Kafka clusters, operational procedures, troubleshooting common problems, and maintaining production deployments."
---

# Kafka Monitoring, Operations, and Troubleshooting

Welcome to Part 10 of our Apache Kafka series! We've covered the [fundamentals]({% post_url 2025-12-10-kafka-introduction-basics %}), [architecture]({% post_url 2025-12-11-kafka-architecture-concepts %}), [producers]({% post_url 2025-12-12-kafka-producers-api %}), [consumers]({% post_url 2025-12-13-kafka-consumers-api %}), [topics/partitions]({% post_url 2025-12-14-kafka-topics-partitions %}), [Streams]({% post_url 2025-12-15-kafka-streams-processing %}), [Connect]({% post_url 2025-12-16-kafka-connect-integration %}), [Schema Registry]({% post_url 2025-12-17-schema-registry-governance %}), and [security]({% post_url 2025-12-18-kafka-security-hardening %}). Now we focus on **operations** - keeping your Kafka clusters running smoothly in production.

Effective monitoring and operations are crucial for maintaining reliable, performant Kafka deployments. This post covers monitoring strategies, operational procedures, and troubleshooting techniques.

## Monitoring Overview

### Key Monitoring Areas

- **Cluster Health**: Broker status, leadership, replication
- **Performance**: Throughput, latency, resource utilization
- **Data Flow**: Producer/consumer metrics, lag monitoring
- **Errors**: Failed operations, exceptions, timeouts
- **Capacity**: Disk usage, network I/O, memory

### Monitoring Tools

- **JMX**: Built-in Kafka metrics
- **Prometheus + Grafana**: Popular open-source stack
- **Confluent Control Center**: Commercial monitoring solution
- **Kafka Manager**: Open-source web UI
- **Burrow**: Consumer lag monitoring

## JMX Metrics

### Enabling JMX

```bash
# Start broker with JMX
export JMX_PORT=9999
export KAFKA_JMX_OPTS="-Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.ssl=false"
./bin/kafka-server-start.sh config/server.properties
```

### Key JMX Metrics

#### Broker Metrics

```java
// Broker state
kafka.server:type=BrokerState,name=BrokerState  // 1=Starting, 2=Recovering, 3=Running, 4=PendingControlledShutdown, 5=BrokerShuttingDown, 6=Shutdown

// Partition count
kafka.server:type=BrokerTopicMetrics,name=Partitions

// Leader count
kafka.server:type=ReplicaManager,name=LeaderCount

// Under-replicated partitions
kafka.server:type=ReplicaManager,name=UnderReplicatedPartitions
```

#### Topic Metrics

```java
// Per-topic metrics
kafka.server:type=BrokerTopicMetrics,name=MessagesInPerSec,topic=orders
kafka.server:type=BrokerTopicMetrics,name=BytesInPerSec,topic=orders
kafka.server:type=BrokerTopicMetrics,name=BytesOutPerSec,topic=orders
```

#### Producer Metrics

```java
// Producer metrics
kafka.producer:type=producer-metrics,client-id=producer-1,name=records-send-rate
kafka.producer:type=producer-metrics,client-id=producer-1,name=record-error-rate
kafka.producer:type=producer-metrics,client-id=producer-1,name=request-latency-avg
```

#### Consumer Metrics

```java
// Consumer metrics
kafka.consumer:type=consumer-metrics,client-id=consumer-1,name=records-consumed-rate
kafka.consumer:type=consumer-fetch-manager-metrics,client-id=consumer-1,name=records-lag
```

## Prometheus Monitoring

### Kafka Exporter

```yaml
# docker-compose.yml
version: '3.8'
services:
  kafka-exporter:
    image: danielqsj/kafka-exporter
    ports:
      - "9308:9308"
    command:
      - '--kafka.server=localhost:9092'
      - '--kafka.version=2.8.0'
    depends_on:
      - kafka
```

### Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'kafka'
    static_configs:
      - targets: ['localhost:9308']
```

### Grafana Dashboard

```json
// Key panels for Kafka dashboard
{
  "title": "Kafka Overview",
  "panels": [
    {
      "title": "Active Brokers",
      "targets": [{"expr": "up{job=\"kafka\"}"}]
    },
    {
      "title": "Messages In/Out",
      "targets": [
        {"expr": "kafka_topic_partition_current_offset{topic=~\"$topic\"}"},
        {"expr": "rate(kafka_topic_partition_current_offset[5m])"}
      ]
    },
    {
      "title": "Consumer Lag",
      "targets": [{"expr": "kafka_consumergroup_lag"}]
    }
  ]
}
```

## Operational Procedures

### Cluster Startup

```bash
# Start ZooKeeper ensemble
./bin/zookeeper-server-start.sh config/zookeeper.properties

# Start brokers in order
./bin/kafka-server-start.sh config/server-1.properties
./bin/kafka-server-start.sh config/server-2.properties
./bin/kafka-server-start.sh config/server-3.properties

# Verify cluster health
./bin/kafka-topics.sh --describe --bootstrap-server localhost:9092
```

### Rolling Restart

```bash
# Check for under-replicated partitions
./bin/kafka-topics.sh --describe --under-replicated-partitions --bootstrap-server localhost:9092

# Restart brokers one by one
./bin/kafka-server-stop.sh config/server-1.properties
./bin/kafka-server-start.sh config/server-1.properties

# Wait for full recovery
# Check metrics: kafka.server:type=ReplicaManager,name=UnderReplicatedPartitions == 0
```

### Scaling the Cluster

```bash
# Add new broker
# Update broker.id in server.properties
broker.id=4

# Start new broker
./bin/kafka-server-start.sh config/server-4.properties

# Reassign partitions (optional, for load balancing)
./bin/kafka-reassign-partitions.sh --execute --reassignment-json-file expand-cluster.json --bootstrap-server localhost:9092
```

### Backup and Recovery

```bash
# Backup topics
./bin/kafka-mirror-maker.sh --consumer.config consumer.properties --producer.config producer.properties --whitelist ".*"

# Backup consumer offsets
./bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group my-group --members --verbose

# Restore from backup
# Use MirrorMaker in reverse direction
```

## Troubleshooting Common Issues

### High Consumer Lag

**Symptoms:**
- Consumer lag increasing
- Consumers can't keep up with producers

**Diagnosis:**
```bash
# Check consumer group status
./bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group my-consumer-group

# Check consumer metrics
# Look for: records-consumed-rate, records-lag
```

**Solutions:**
```bash
# Increase consumer instances
# Increase partition count
# Optimize consumer configuration
fetch.min.bytes=1
fetch.max.wait.ms=500
max.poll.records=1000

# Check for processing bottlenecks
# Monitor consumer thread utilization
```

### Under-Replicated Partitions

**Symptoms:**
- `UnderReplicatedPartitions` > 0
- Potential data loss risk

**Diagnosis:**
```bash
# Find under-replicated partitions
./bin/kafka-topics.sh --describe --under-replicated-partitions --bootstrap-server localhost:9092

# Check broker status
./bin/kafka-broker-api-versions.sh --bootstrap-server localhost:9092
```

**Solutions:**
```bash
# Restart failed brokers
# Check disk space
# Verify network connectivity
# Increase replication factor if needed
./bin/kafka-topics.sh --alter --topic my-topic --replication-factor 3 --bootstrap-server localhost:9092
```

### Broker Unavailable

**Symptoms:**
- Broker not responding to requests
- Clients can't connect

**Diagnosis:**
```bash
# Check broker logs
tail -f /var/log/kafka/server.log

# Check broker metrics
# Look for: BrokerState, NetworkProcessorAvgIdlePercent

# Test connectivity
telnet localhost 9092
```

**Solutions:**
```bash
# Check system resources (CPU, memory, disk)
# Verify configuration
# Check for JVM issues (GC pauses)
# Restart broker if necessary
```

### Disk Full

**Symptoms:**
- Broker crashes or becomes unresponsive
- `NoSpaceLeftOnDevice` errors

**Diagnosis:**
```bash
# Check disk usage
df -h /var/lib/kafka

# Check log directory size
du -sh /var/lib/kafka/data
```

**Solutions:**
```bash
# Increase retention time
./bin/kafka-configs.sh --alter --add-config retention.ms=86400000 --topic my-topic --bootstrap-server localhost:9092

# Enable log compaction
./bin/kafka-configs.sh --alter --add-config cleanup.policy=compact --topic my-topic --bootstrap-server localhost:9092

# Add more disk space
# Clean up old logs
```

### Network Issues

**Symptoms:**
- Connection timeouts
- High latency
- Intermittent failures

**Diagnosis:**
```bash
# Check network connectivity
ping broker1.example.com

# Monitor network metrics
# Look for: network-io-rate, request-queue-size

# Check for packet loss
mtr broker1.example.com
```

**Solutions:**
```bash
# Adjust timeout settings
request.timeout.ms=30000
replica.lag.time.max.ms=30000

# Increase socket buffer sizes
socket.send.buffer.bytes=1048576
socket.receive.buffer.bytes=1048576

# Check network hardware
# Implement network redundancy
```

## Performance Tuning

### Broker Tuning

```properties
# server.properties - Performance settings
num.network.threads=9
num.io.threads=16
num.replica.fetchers=2

# Buffer sizes
socket.send.buffer.bytes=1048576
socket.receive.buffer.bytes=1048576

# Log settings
num.partitions=8
log.flush.interval.messages=10000
log.flush.interval.ms=1000
```

### Producer Tuning

```properties
# Producer performance
batch.size=1048576
linger.ms=10
compression.type=lz4
acks=1

# Buffer settings
buffer.memory=67108864
max.block.ms=60000
```

### Consumer Tuning

```properties
# Consumer performance
fetch.min.bytes=1024
fetch.max.wait.ms=500
max.poll.records=1000
enable.auto.commit=false

# Processing settings
max.poll.interval.ms=300000
session.timeout.ms=30000
```

## Capacity Planning

### Sizing Guidelines

```bash
# Disk capacity
# Estimate: (messages_per_sec * message_size * retention_hours * 2) / 3600

# Network capacity
# Estimate: messages_per_sec * (message_size + overhead)

# Memory requirements
# Heap: 4-8GB per broker
# Page cache: 50-70% of system memory
```

### Monitoring Capacity

```bash
# Disk usage alerts
# Alert when > 80% disk used

# Network saturation
# Monitor network-io-rate vs capacity

# CPU utilization
# Alert when > 70% sustained CPU
```

## Maintenance Tasks

### Log Cleanup

```bash
# Manual log cleanup
./bin/kafka-log-dirs.sh --describe --bootstrap-server localhost:9092

# Force log compaction
./bin/kafka-configs.sh --alter --add-config cleanup.policy=compact,delete --topic my-topic --bootstrap-server localhost:9092
```

### Index Rebuilding

```bash
# Rebuild indexes (requires broker restart)
# Delete .index files
# Broker will rebuild on startup
```

### Configuration Updates

```bash
# Update broker configs dynamically
./bin/kafka-configs.sh --alter --add-config log.retention.hours=24 --entity-type brokers --entity-name 1 --bootstrap-server localhost:9092

# Update topic configs
./bin/kafka-configs.sh --alter --add-config retention.ms=86400000 --topic my-topic --bootstrap-server localhost:9092
```

## Disaster Recovery

### Multi-Cluster Setup

```bash
# MirrorMaker 2.0 for cross-cluster replication
./bin/connect-mirror-maker.sh config/mm2.properties

# Configuration
clusters=primary,secondary
primary.bootstrap.servers=primary:9092
secondary.bootstrap.servers=secondary:9092
```

### Backup Strategy

```bash
# Regular backups of:
# - Configuration files
# - Consumer offsets
# - Schema Registry schemas
# - Custom connectors

# Test restore procedures regularly
```

## Alerting

### Key Alerts

```yaml
# Prometheus alerting rules
groups:
  - name: kafka
    rules:
      - alert: KafkaDown
        expr: up{job="kafka"} == 0
        for: 5m
        labels:
          severity: critical

      - alert: HighConsumerLag
        expr: kafka_consumergroup_lag > 10000
        for: 10m
        labels:
          severity: warning

      - alert: UnderReplicatedPartitions
        expr: kafka_server_replicamanager_underreplicatedpartitions > 0
        for: 5m
        labels:
          severity: critical
```

## Best Practices

### 1. Monitoring Strategy

```yaml
# Implement comprehensive monitoring
# Use multiple tools (JMX, Prometheus, logs)
# Set up alerts for critical metrics
# Monitor trends, not just current values
# Document normal vs abnormal behavior
```

### 2. Operational Procedures

```bash
# Document all procedures
# Test procedures in staging
# Implement change management
# Have rollback plans
# Schedule maintenance windows
```

### 3. Capacity Management

```bash
# Monitor resource utilization trends
# Plan for growth (3-6 months ahead)
# Implement auto-scaling where possible
# Regular capacity reviews
```

### 4. Incident Response

```bash
# Define severity levels
# Establish response procedures
# Set up communication channels
# Conduct post-mortems
# Implement preventive measures
```

## Real-World Monitoring Dashboard

```json
{
  "dashboard": {
    "title": "Kafka Production Monitoring",
    "panels": [
      {
        "title": "Cluster Health",
        "type": "stat",
        "targets": [
          {"expr": "count(kafka_server_brokerstate == 3)"},
          {"expr": "kafka_server_replicamanager_underreplicatedpartitions"}
        ]
      },
      {
        "title": "Throughput",
        "type": "graph",
        "targets": [
          {"expr": "rate(kafka_server_brokertopicmetrics_messagesin_total[5m])"},
          {"expr": "rate(kafka_server_brokertopicmetrics_bytesin_total[5m])"}
        ]
      },
      {
        "title": "Consumer Lag",
        "type": "table",
        "targets": [{"expr": "kafka_consumergroup_lag"}]
      },
      {
        "title": "System Resources",
        "type": "graph",
        "targets": [
          {"expr": "100 - (avg by(instance) (irate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)"},
          {"expr": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100"}
        ]
      }
    ]
  }
}
```

## What's Next?

In this comprehensive guide to Kafka monitoring and operations, we've covered:

- JMX and Prometheus monitoring
- Operational procedures (startup, scaling, backup)
- Troubleshooting common issues
- Performance tuning
- Capacity planning
- Maintenance tasks
- Disaster recovery
- Alerting and best practices

You should now be able to operate and maintain production Kafka clusters effectively.

In [Part 11]({% post_url 2025-12-20-kafka-real-world-use-cases %}), we'll explore real-world use cases and best practices - applying Kafka in various scenarios with proven patterns.

## Additional Resources

- [Kafka Operations](https://kafka.apache.org/documentation/#operations)
- [Confluent Monitoring](https://docs.confluent.io/platform/current/monitoring/index.html)
- [Kafka Performance Tuning](https://docs.confluent.io/platform/current/kafka/monitoring.html)
- [Kafka Troubleshooting Guide](https://docs.confluent.io/platform/current/troubleshooting.html)

---

*This is Part 10 of our comprehensive Apache Kafka series. [Part 9: Kafka Security ←]({% post_url 2025-12-18-kafka-security-hardening %}) | [Part 11: Real-World Use Cases →]({% post_url 2025-12-20-kafka-real-world-use-cases %})*