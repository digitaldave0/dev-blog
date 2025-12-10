---
layout: post
title: "Kafka Architecture and Core Concepts - Understanding the Foundation"
categories: [Kafka, Architecture, Event Streaming, Tutorial]
description: "Deep dive into Apache Kafka's architecture, core concepts, and how brokers, topics, partitions, and replication work together."
excerpt: "Master Kafka's fundamental architecture including topics, partitions, brokers, replication, and the shift from ZooKeeper to KRaft mode."
---

# Kafka Architecture and Core Concepts - Understanding the Foundation

Welcome back to our Apache Kafka series! In [Part 1]({% post_url 2025-12-10-kafka-introduction-basics %}), we explored what Kafka is and why it matters. Now it's time to understand the architecture that makes Kafka so powerful and reliable.

This post will take you through Kafka's core concepts and architecture. We'll explore topics, partitions, brokers, replication, and the coordination mechanisms that keep everything running smoothly. By the end, you'll understand how Kafka achieves its legendary scalability and fault tolerance.

## The Big Picture

At its core, Kafka is a distributed commit log. Events are written to topics in an append-only fashion, and consumers can read from any point in the log. This simple abstraction enables complex distributed systems.

Let's break down the key components:

## Topics: The Heart of Kafka

Topics are the fundamental abstraction in Kafka. Think of a topic as a category or feed name to which events are published.

### Topic Characteristics
- **Named channels**: Events are published to named topics
- **Multi-consumer**: Multiple consumers can read from the same topic
- **Durable**: Events persist until retention policies delete them
- **Ordered**: Events within a topic are ordered by time

### Creating Topics

```bash
# Create a topic with 3 partitions and replication factor 2
kafka-topics --create \
  --topic user-events \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 2
```

## Partitions: The Key to Scalability

Topics are divided into **partitions**, which are the unit of parallelism in Kafka. Each partition is:

- An ordered, immutable sequence of events
- Stored as a log file on disk
- Independently consumable
- Replicated across multiple brokers

### Why Partitions Matter

1. **Parallelism**: Multiple consumers in a group can read different partitions simultaneously
2. **Scalability**: Partitions can be distributed across brokers
3. **Ordering**: Events in a partition are totally ordered
4. **Load Distribution**: Producers can distribute load across partitions

### Partition Assignment Strategies

Producers use partition keys to determine which partition an event goes to:

```java
// Java producer example
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

KafkaProducer<String, String> producer = new KafkaProducer<>(props);

// Send with key (determines partition)
ProducerRecord<String, String> record = new ProducerRecord<>("user-events", "user123", "User logged in");
producer.send(record);
```

## Brokers: The Workhorses

Brokers are the servers that form a Kafka cluster. Each broker:

- Stores partitions and serves consumer requests
- Handles producer writes
- Manages partition leadership
- Coordinates with other brokers

### Broker Responsibilities

1. **Partition Management**: Each broker acts as leader or follower for partitions
2. **Data Storage**: Persists events to disk
3. **Request Handling**: Processes producer and consumer requests
4. **Replication**: Maintains copies of partitions

### Cluster Configuration

```yaml
# Example broker configuration
broker.id=1
listeners=PLAINTEXT://:9092
log.dirs=/tmp/kafka-logs
zookeeper.connect=localhost:2181
num.partitions=3
default.replication.factor=2
```

## Replication: Ensuring Durability

Replication is Kafka's mechanism for fault tolerance. Each partition can have multiple copies (replicas) distributed across brokers.

### Replication Concepts

- **Leader Replica**: Handles all reads and writes for a partition
- **Follower Replicas**: Maintain copies of the leader's data
- **In-Sync Replicas (ISR)**: Followers that are caught up with the leader
- **Replication Factor**: Total number of replicas per partition

### How Replication Works

1. Producer sends event to partition leader
2. Leader writes event to its log
3. Leader sends event to all followers
4. Followers acknowledge receipt
5. Leader commits the event when minimum ISR acknowledge

```bash
# Check replication status
kafka-topics --describe --topic user-events --bootstrap-server localhost:9092
```

## Offsets: Tracking Progress

An **offset** is a unique identifier for each event within a partition. Consumers use offsets to track their reading progress.

### Offset Management

- **Sequential**: Offsets are sequential numbers (0, 1, 2, ...)
- **Per Partition**: Each partition has its own offset sequence
- **Consumer Tracking**: Consumers commit offsets to track progress
- **Reset Capability**: Consumers can reset to earlier offsets

### Offset Types

- **Current Offset**: Latest event position
- **Committed Offset**: Last acknowledged position
- **Log End Offset (LEO)**: End of log position
- **High Watermark**: Safe consumption point

## Consumer Groups: Parallel Processing

Consumer groups enable parallel processing of topics. Multiple consumers in a group share the work of consuming events.

### Group Behavior

- **Partition Assignment**: Each partition assigned to one consumer in the group
- **Load Balancing**: Work distributed across consumers
- **Fault Tolerance**: If a consumer fails, partitions reassign automatically
- **Independent Consumption**: Different groups don't affect each other

```java
// Consumer group configuration
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("group.id", "user-event-processors");
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("auto.offset.reset", "earliest");

KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
consumer.subscribe(Arrays.asList("user-events"));
```

## Coordination: ZooKeeper vs KRaft

Kafka needs coordination for cluster management. Traditionally, this was handled by Apache ZooKeeper, but Kafka 2.8+ introduced KRaft mode.

### ZooKeeper Mode (Traditional)

- **External Service**: Separate ZooKeeper ensemble
- **Metadata Storage**: Stores cluster metadata
- **Leader Election**: Manages controller election
- **Complexity**: Additional operational overhead

### KRaft Mode (New)

- **Self-Managed**: Kafka manages its own metadata
- **Simplified Architecture**: No external dependencies
- **Better Performance**: Reduced latency
- **Future-Proof**: Default in Kafka 4.0+

```bash
# Enable KRaft mode
process.roles=broker,controller
node.id=1
controller.quorum.voters=1@localhost:9093
```

## Message Delivery Semantics

Kafka provides different delivery guarantees:

### At Most Once
- Message delivered once or not at all
- Fastest, but may lose messages
- `acks=0` or `acks=1`

### At Least Once
- Message delivered at least once
- May have duplicates
- `acks=all` with proper error handling

### Exactly Once
- Message delivered exactly once
- Most reliable, but complex
- Requires idempotent producers and transactional APIs

## Log Structure and Storage

Understanding Kafka's storage model is key to performance tuning.

### Log Segments

- **Segments**: Logs divided into segments for management
- **Rolling**: New segments created based on size/time
- **Compaction**: Optional cleanup of old segments

### Retention Policies

```properties
# Time-based retention
log.retention.hours=168

# Size-based retention
log.retention.bytes=1073741824

# Compaction
log.cleanup.policy=delete  # or compact
```

## Putting It All Together

Let's trace a message through the system:

1. **Producer** sends event with key "user123"
2. **Partitioner** determines partition (hash of key)
3. **Broker** (leader) receives and replicates to followers
4. **ISR** acknowledges receipt
5. **Consumer Group** reads from assigned partitions
6. **Offset** committed for progress tracking

## Configuration Best Practices

### Broker Configuration
```properties
# Performance tuning
num.network.threads=3
num.io.threads=8
socket.send.buffer.bytes=102400
socket.receive.buffer.bytes=102400

# Replication
default.replication.factor=3
min.insync.replicas=2
```

### Topic Configuration
```bash
# Create topic with specific settings
kafka-topics --create \
  --topic high-throughput \
  --partitions 6 \
  --replication-factor 3 \
  --config retention.ms=604800000 \
  --config segment.bytes=1073741824
```

## Monitoring Key Metrics

Essential metrics to monitor:

- **Throughput**: Messages/sec per topic/partition
- **Latency**: Producer/consumer lag
- **Disk Usage**: Log size and growth
- **Replication Lag**: Follower lag behind leader
- **Consumer Lag**: How far behind consumers are

## Common Architecture Patterns

### High Availability
- Multiple brokers across availability zones
- Replication factor ≥ 3
- Proper rack awareness

### Multi-Cluster
- MirrorMaker for cross-datacenter replication
- Cluster linking for active-active setups

## Troubleshooting Common Issues

### Consumer Lag
- Check consumer group status
- Monitor broker performance
- Adjust partition count if needed

### Broker Failures
- Automatic failover through replication
- Monitor ISR changes
- Check disk space and network connectivity

## What's Next?

In this post, we've covered Kafka's fundamental architecture:

- Topics as event categories
- Partitions for parallelism and scalability
- Brokers as the core servers
- Replication for fault tolerance
- Consumer groups for parallel processing
- Coordination mechanisms (ZooKeeper/KRaft)

You should now understand how Kafka achieves its performance and reliability characteristics.

In [Part 3]({% post_url 2025-12-12-kafka-producers-api %}), we'll dive into the Producer API - how to publish events to Kafka, handle serialization, and ensure reliable delivery.

## Additional Resources

- [Kafka Architecture Documentation](https://kafka.apache.org/documentation/#design)
- [Confluent Platform Architecture](https://docs.confluent.io/platform/current/overview.html)
- [KRaft: Apache Kafka Without ZooKeeper](https://www.confluent.io/blog/kafka-without-zookeeper/)
- [Kafka Internals Deep Dive](https://www.confluent.io/blog/kafka-internals/)

---

*This is Part 2 of our comprehensive Apache Kafka series. [Part 1: Introduction to Kafka ←]({% post_url 2025-12-10-kafka-introduction-basics %}) | [Part 3: Producers API →]({% post_url 2025-12-12-kafka-producers-api %})*