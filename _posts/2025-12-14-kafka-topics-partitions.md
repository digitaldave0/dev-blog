---
layout: post
title: "Kafka Topics and Partitions - Management and Optimization"
categories: [Kafka, Topics, Partitions, Operations, Tutorial]
description: "Master Kafka topic and partition management: creation, configuration, retention policies, scaling, and performance optimization strategies."
excerpt: "Comprehensive guide to managing Kafka topics and partitions including configuration, monitoring, scaling, and operational best practices."
---

# Kafka Topics and Partitions - Management and Optimization

Welcome to Part 5 of our Apache Kafka series! We've covered the [basics]({% post_url 2025-12-10-kafka-introduction-basics %}), [architecture]({% post_url 2025-12-11-kafka-architecture-concepts %}), [producers]({% post_url 2025-12-12-kafka-producers-api %}), and [consumers]({% post_url 2025-12-13-kafka-consumers-api %}). Now we dive into **topics and partitions** - the core abstractions for organizing and scaling your data in Kafka.

Understanding how to create, configure, and manage topics and partitions is crucial for optimizing performance, ensuring scalability, and maintaining operational efficiency.

## Topic Fundamentals

Topics are the primary abstraction for organizing events in Kafka. They serve as categories or feeds to which events are published and from which they're consumed.

### Topic Characteristics

- **Named Categories**: Logical grouping of related events
- **Multi-Producer/Multi-Consumer**: Multiple applications can read/write
- **Partitioned**: Divided into partitions for parallelism
- **Configurable**: Retention, replication, and other policies
- **Durable**: Events persist according to retention policies

## Creating and Managing Topics

### Basic Topic Creation

```bash
# Create a topic with default settings
kafka-topics --create \
  --topic user-events \
  --bootstrap-server localhost:9092

# Create with specific partitions and replication
kafka-topics --create \
  --topic order-events \
  --bootstrap-server localhost:9092 \
  --partitions 6 \
  --replication-factor 3
```

### Topic Configuration

```bash
# Create topic with custom configuration
kafka-topics --create \
  --topic audit-logs \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 2 \
  --config retention.ms=604800000 \        # 7 days
  --config segment.bytes=1073741824 \      # 1GB segments
  --config cleanup.policy=compact          # Log compaction
```

### Listing and Describing Topics

```bash
# List all topics
kafka-topics --list --bootstrap-server localhost:9092

# Describe a specific topic
kafka-topics --describe --topic user-events --bootstrap-server localhost:9092

# Describe all topics
kafka-topics --describe --bootstrap-server localhost:9092
```

## Partition Management

Partitions are the unit of parallelism and scalability in Kafka. Each partition is an ordered, immutable sequence of events.

### Understanding Partitions

- **Ordered**: Events in a partition are totally ordered
- **Independent**: Partitions can be processed independently
- **Distributed**: Spread across brokers in the cluster
- **Replicated**: Copies maintained for fault tolerance

### Adding Partitions

```bash
# Add partitions to existing topic (can only increase, not decrease)
kafka-topics --alter \
  --topic user-events \
  --bootstrap-server localhost:9092 \
  --partitions 8
```

⚠️ **Important**: Adding partitions can cause rebalancing and may affect ordering guarantees for keyed events.

### Partition Distribution

```bash
# Check partition distribution across brokers
kafka-topics --describe --topic user-events --bootstrap-server localhost:9092

# Output shows:
# Topic: user-events    PartitionCount: 6    ReplicationFactor: 3    Configs:
#     Topic: user-events    Partition: 0    Leader: 1    Replicas: 1,2,3    Isr: 1,2,3
#     Topic: user-events    Partition: 1    Leader: 2    Replicas: 2,3,1    Isr: 2,3,1
```

## Retention Policies

Kafka provides flexible retention policies to manage disk usage and data lifecycle.

### Time-Based Retention

```bash
# Retain events for 7 days
kafka-configs --alter \
  --topic user-events \
  --bootstrap-server localhost:9092 \
  --add-config retention.ms=604800000
```

### Size-Based Retention

```bash
# Retain up to 1GB per partition
kafka-configs --alter \
  --topic user-events \
  --bootstrap-server localhost:9092 \
  --add-config retention.bytes=1073741824
```

### Log Compaction

```bash
# Enable log compaction (keeps latest value for each key)
kafka-configs --alter \
  --topic user-preferences \
  --bootstrap-server localhost:9092 \
  --add-config cleanup.policy=compact

# Configure compaction settings
kafka-configs --alter \
  --topic user-preferences \
  --bootstrap-server localhost:9092 \
  --add-config min.cleanable.dirty.ratio=0.5 \
  --add-config delete.retention.ms=86400000
```

## Log Structure and Segments

Understanding Kafka's log structure is key to performance optimization.

### Log Segments

- **Segments**: Logs divided into segments for efficient management
- **Rolling**: New segments created based on size or time
- **Indexing**: Offset and timestamp indexes for fast lookup
- **Compaction**: Optional cleanup of old data

### Segment Configuration

```bash
# Configure segment size
kafka-configs --alter \
  --topic user-events \
  --bootstrap-server localhost:9092 \
  --add-config segment.bytes=536870912  # 512MB

# Configure segment rolling
kafka-configs --alter \
  --topic user-events \
  --bootstrap-server localhost:9092 \
  --add-config segment.ms=86400000  # 24 hours
```

## Replication and Fault Tolerance

Replication ensures data durability and availability.

### Replication Factor

```bash
# Set replication factor when creating topic
kafka-topics --create \
  --topic critical-events \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 3
```

### In-Sync Replicas (ISR)

- **ISR**: Replicas that are caught up with the leader
- **Automatic Management**: Kafka maintains ISR automatically
- **Minimum ISR**: Configurable minimum for writes

```bash
# Configure minimum ISR
kafka-configs --alter \
  --topic critical-events \
  --bootstrap-server localhost:9092 \
  --add-config min.insync.replicas=2
```

### Rack Awareness

```bash
# Enable rack awareness for fault tolerance
kafka-configs --alter \
  --topic user-events \
  --bootstrap-server localhost:9092 \
  --add-config replica.selector.class=org.apache.kafka.common.replica.RackAwareReplicaSelector
```

## Performance Optimization

### Partition Count Optimization

```bash
# General guidelines:
# - Start with 3-6 partitions per topic
# - Consider: throughput requirements, consumer parallelism, rebalancing impact
# - Rule of thumb: partitions = max(consumer_instances, throughput/10MBps)

# Create topic with optimal partitions
kafka-topics --create \
  --topic high-throughput-events \
  --bootstrap-server localhost:9092 \
  --partitions 12 \
  --replication-factor 3
```

### Segment and Index Tuning

```bash
# Optimize for read-heavy workloads
kafka-configs --alter \
  --topic read-heavy-topic \
  --bootstrap-server localhost:9092 \
  --add-config segment.index.bytes=10485760  # 10MB index

# Optimize for write-heavy workloads
kafka-configs --alter \
  --topic write-heavy-topic \
  --bootstrap-server localhost:9092 \
  --add-config flush.messages=10000 \
  --add-config flush.ms=1000
```

### Compression

```bash
# Enable compression at topic level
kafka-configs --alter \
  --topic compressed-events \
  --bootstrap-server localhost:9092 \
  --add-config compression.type=gzip
```

## Monitoring Topics and Partitions

### Key Metrics to Monitor

- **Partition Count**: Number of partitions per topic
- **Replication Status**: Leader/replica distribution
- **Log Size**: Total size of topic data
- **Segment Count**: Number of log segments
- **Under-Replicated Partitions**: Partitions with insufficient replicas

### Monitoring Commands

```bash
# Check topic size
kafka-log-dirs --describe --bootstrap-server localhost:9092 --topic-list user-events

# Check under-replicated partitions
kafka-topics --describe --under-replicated-partitions --bootstrap-server localhost:9092

# Check partition reassignment status
kafka-reassign-partitions --verify --reassignment-json-file reassignment.json --bootstrap-server localhost:9092
```

## Operational Tasks

### Partition Reassignment

```bash
# Generate reassignment plan
kafka-reassign-partitions --generate \
  --topics-to-move-json-file topics.json \
  --broker-list 1,2,3 \
  --bootstrap-server localhost:9092

# Execute reassignment
kafka-reassign-partitions --execute \
  --reassignment-json-file reassignment.json \
  --bootstrap-server localhost:9092
```

### Preferred Leader Election

```bash
# Trigger preferred leader election
kafka-preferred-replica-election --bootstrap-server localhost:9092
```

### Topic Deletion

```bash
# Delete a topic
kafka-topics --delete --topic old-topic --bootstrap-server localhost:9092

# Note: Topic deletion must be enabled in broker config
# delete.topic.enable=true
```

## Scaling Strategies

### Horizontal Scaling

1. **Add Brokers**: Distribute existing partitions to new brokers
2. **Increase Partitions**: Add more partitions for parallelism
3. **Rebalance**: Redistribute partitions across cluster

### Vertical Scaling

1. **Increase Resources**: More CPU, memory, disk for existing brokers
2. **Optimize Configuration**: Tune for higher throughput

### Auto-Scaling Considerations

```bash
# Monitor and alert on:
# - Disk usage > 80%
# - Under-replicated partitions > 0
# - Consumer lag > threshold
# - Broker CPU/memory > 90%
```

## Best Practices

### 1. Partition Count Planning

```bash
# Calculate based on requirements:
partitions = max(
    consumer_instances,
    expected_throughput_mb_per_sec / 10,
    1
)
```

### 2. Replication Strategy

```bash
# Production recommendations:
# - Replication factor: 3
# - Minimum ISR: 2
# - Rack awareness: enabled
```

### 3. Retention Policy

```bash
# Choose based on use case:
# - High-frequency data: shorter retention (hours/days)
# - Reference data: compaction
# - Audit data: longer retention (months/years)
```

### 4. Naming Conventions

```bash
# Consistent naming:
# - {domain}-{entity}-{action}
# - user-events, order-created, payment-processed
# - Use hyphens, avoid underscores
```

### 5. Configuration Management

```bash
# Use configuration management for topic settings
# Avoid manual changes in production
# Document all custom configurations
```

## Common Issues and Troubleshooting

### 1. Uneven Partition Distribution

```bash
# Check distribution
kafka-topics --describe --topic unbalanced-topic --bootstrap-server localhost:9092

# Reassign partitions if needed
kafka-reassign-partitions --execute --reassignment-json-file fix-distribution.json --bootstrap-server localhost:9092
```

### 2. Log Directory Full

```bash
# Check disk usage
df -h /var/lib/kafka/data

# Options:
# - Increase retention time
# - Add more brokers
# - Delete unused topics
# - Enable log compaction
```

### 3. Slow Consumer Rebalancing

```bash
# Check consumer group status
kafka-consumer-groups --describe --group my-group --bootstrap-server localhost:9092

# Adjust rebalance settings
group.initial.rebalance.delay.ms=3000
```

## Programmatic Topic Management

### Java Admin Client

```java
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.NewTopic;
import java.util.Collections;
import java.util.Properties;

Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");

try (AdminClient admin = AdminClient.create(props)) {
    // Create topic
    NewTopic newTopic = new NewTopic("programmatic-topic", 3, (short) 3);
    admin.createTopics(Collections.singleton(newTopic)).all().get();

    // List topics
    admin.listTopics().names().get().forEach(System.out::println);
}
```

### Python Admin Client

```python
from kafka.admin import KafkaAdminClient, NewTopic

admin = KafkaAdminClient(bootstrap_servers=['localhost:9092'])

# Create topic
topic = NewTopic(name='python-topic', num_partitions=3, replication_factor=2)
admin.create_topics([topic])

# List topics
topics = admin.list_topics()
print(topics)
```

## What's Next?

In this comprehensive guide to topics and partitions, we've covered:

- Topic creation and configuration
- Partition management and scaling
- Retention policies and log compaction
- Replication and fault tolerance
- Performance optimization strategies
- Monitoring and operational tasks
- Best practices and troubleshooting

You should now be able to effectively manage and optimize Kafka topics and partitions for your use cases.

In [Part 6]({% post_url 2025-12-15-kafka-streams-processing %}), we'll explore Kafka Streams - how to build real-time stream processing applications on top of Kafka.

## Additional Resources

- [Kafka Topic Configs](https://kafka.apache.org/documentation/#topicconfigs)
- [Confluent Topic Management](https://docs.confluent.io/platform/current/kafka/manage-topics.html)
- [Log Compaction](https://kafka.apache.org/documentation/#compaction)
- [Partitioning Best Practices](https://www.confluent.io/blog/how-to-choose-the-number-of-topic-partitions-in-a-kafka-cluster/)

---

*This is Part 5 of our comprehensive Apache Kafka series. [Part 4: Consumers API ←]({% post_url 2025-12-13-kafka-consumers-api %}) | [Part 6: Kafka Streams →]({% post_url 2025-12-15-kafka-streams-processing %})*