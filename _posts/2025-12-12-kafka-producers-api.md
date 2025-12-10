---
layout: post
title: "Kafka Producers API - Publishing Events to Kafka"
categories: [Kafka, Producers, Event Streaming, Tutorial]
description: "Master the Kafka Producer API: learn to publish events, handle serialization, configure reliability, and implement exactly-once semantics."
excerpt: "Comprehensive guide to Kafka producers covering configuration, serialization, partitioning, error handling, and best practices for reliable event publishing."
---

# Kafka Producers API - Publishing Events to Kafka

Welcome to Part 3 of our Apache Kafka series! In [Part 1]({% post_url 2025-12-10-kafka-introduction-basics %}), we introduced Kafka, and in [Part 2]({% post_url 2025-12-11-kafka-architecture-concepts %}), we explored the architecture. Now it's time to get hands-on with **producers** - the applications that publish events to Kafka.

Producers are the entry point for data into Kafka. Understanding how to configure and use producers effectively is crucial for building reliable event-driven systems. This post covers everything from basic publishing to advanced features like idempotence and transactions.

## Producer Fundamentals

A Kafka producer is responsible for:
- **Serializing** events into bytes
- **Partitioning** events across topic partitions
- **Batching** events for efficiency
- **Handling retries** and errors
- **Ensuring delivery** guarantees

### Basic Producer Setup

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import java.util.Properties;

public class BasicProducer {
    public static void main(String[] args) {
        // Configure producer
        Properties props = new Properties();
        props.put("bootstrap.servers", "localhost:9092");
        props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

        // Create producer
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);

        // Create and send record
        ProducerRecord<String, String> record =
            new ProducerRecord<>("user-events", "user123", "User logged in");

        producer.send(record);
        producer.close();
    }
}
```

## Key Configuration Properties

### Required Properties

- `bootstrap.servers`: List of broker addresses
- `key.serializer`: Serializer class for keys
- `value.serializer`: Serializer class for values

### Important Optional Properties

```properties
# Reliability settings
acks=all                    # Wait for all replicas
retries=3                   # Retry failed sends
retry.backoff.ms=100        # Backoff between retries

# Performance settings
batch.size=16384           # Batch size in bytes
linger.ms=5                # Wait time for batching
buffer.memory=33554432     # Total buffer memory

# Compression
compression.type=gzip      # Compress batches
```

## Serialization

Kafka requires events to be serialized to bytes. You can use built-in serializers or create custom ones.

### Built-in Serializers

```java
// String serialization
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

// Integer serialization
props.put("key.serializer", "org.apache.kafka.common.serialization.IntegerSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.IntegerSerializer");

// Byte array (for custom serialization)
props.put("key.serializer", "org.apache.kafka.common.serialization.ByteArraySerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.ByteArraySerializer");
```

### Custom Serialization

```java
public class UserEventSerializer implements Serializer<UserEvent> {
    @Override
    public byte[] serialize(String topic, UserEvent data) {
        try {
            return objectMapper.writeValueAsBytes(data);
        } catch (Exception e) {
            throw new SerializationException("Error serializing UserEvent", e);
        }
    }
}

// Usage
props.put("value.serializer", "com.example.UserEventSerializer");
```

## Partitioning Strategies

Producers determine which partition an event goes to. This affects ordering and load distribution.

### Default Partitioning (Round-Robin)

```java
// No key specified - round-robin distribution
ProducerRecord<String, String> record =
    new ProducerRecord<>("user-events", "User logged in");
```

### Key-Based Partitioning

```java
// Events with same key go to same partition (ordered)
ProducerRecord<String, String> record =
    new ProducerRecord<>("user-events", "user123", "User logged in");
```

### Custom Partitioning

```java
public class CustomPartitioner implements Partitioner {
    @Override
    public int partition(String topic, Object key, byte[] keyBytes,
                        Object value, byte[] valueBytes, Cluster cluster) {
        // Custom logic based on key or value
        return Math.abs(key.hashCode()) % cluster.partitionsForTopic(topic).size();
    }
}

// Configure custom partitioner
props.put("partitioner.class", "com.example.CustomPartitioner");
```

## Synchronous vs Asynchronous Sending

### Synchronous Sending

```java
try {
    RecordMetadata metadata = producer.send(record).get();
    System.out.println("Sent to partition " + metadata.partition() +
                      " at offset " + metadata.offset());
} catch (Exception e) {
    System.err.println("Send failed: " + e.getMessage());
}
```

### Asynchronous Sending with Callback

```java
producer.send(record, new Callback() {
    @Override
    public void onCompletion(RecordMetadata metadata, Exception exception) {
        if (exception != null) {
            System.err.println("Send failed: " + exception.getMessage());
        } else {
            System.out.println("Sent successfully to partition " +
                             metadata.partition() + " at offset " + metadata.offset());
        }
    }
});
```

## Error Handling and Retries

### Common Producer Errors

- `TimeoutException`: Broker not responding
- `InterruptException`: Producer interrupted
- `SerializationException`: Serialization failure
- `IllegalStateException`: Producer closed

### Retry Configuration

```properties
# Retry settings
retries=10
retry.backoff.ms=1000
delivery.timeout.ms=120000

# Idempotence (exactly-once)
enable.idempotence=true
acks=all
```

## Idempotent Producers

Idempotent producers ensure exactly-once delivery semantics.

```java
// Enable idempotence
props.put("enable.idempotence", "true");
props.put("acks", "all");
props.put("retries", "3");

// Producer ID assigned by broker
// Duplicate sends within session are ignored
```

## Transactional Producers

For multi-partition, multi-topic transactions:

```java
props.put("transactional.id", "user-event-producer-1");

// Initialize transactions
producer.initTransactions();

// Begin transaction
producer.beginTransaction();

try {
    // Send multiple records
    producer.send(record1);
    producer.send(record2);

    // Commit transaction
    producer.commitTransaction();
} catch (Exception e) {
    // Abort transaction
    producer.abortTransaction();
}
```

## Message Headers

Add metadata to events:

```java
ProducerRecord<String, String> record =
    new ProducerRecord<>("user-events", "user123", "User logged in");

// Add headers
record.headers().add("source", "web-app".getBytes());
record.headers().add("version", "1.0".getBytes());
```

## Performance Optimization

### Batching Configuration

```properties
# Increase batch size for higher throughput
batch.size=1048576          # 1MB batches
linger.ms=10                # Wait longer for batches

# Compression
compression.type=lz4        # Fast compression
```

### Memory Management

```properties
# Buffer memory
buffer.memory=67108864      # 64MB buffer
max.block.ms=60000          # Block timeout
```

### Monitoring Producer Metrics

```java
// Access producer metrics
Map<String, String> tags = new HashMap<>();
tags.put("client-id", "my-producer");

MetricName metricName = new MetricName("records-send-rate", "producer-metrics", "", tags);
double sendRate = producer.metrics().get(metricName).value();
```

## Best Practices

### 1. Use Appropriate Acknowledgment Levels

```properties
# For high throughput (may lose messages)
acks=1

# For reliability (slower)
acks=all
```

### 2. Configure Proper Timeouts

```properties
# Request timeout
request.timeout.ms=30000

# Delivery timeout
delivery.timeout.ms=120000
```

### 3. Handle Serialization Errors

```java
try {
    producer.send(record);
} catch (SerializationException e) {
    // Handle serialization failure
    log.error("Failed to serialize record", e);
}
```

### 4. Close Producers Properly

```java
// Graceful shutdown
Runtime.getRuntime().addShutdownHook(new Thread(() -> {
    producer.close(Duration.ofSeconds(5));
}));
```

## Common Pitfalls

### 1. Blocking on Send

```java
// DON'T: Blocks indefinitely
producer.send(record).get();

// DO: Use timeouts
producer.send(record).get(10, TimeUnit.SECONDS);
```

### 2. Ignoring Send Results

```java
// DON'T: Fire and forget
producer.send(record);

// DO: Handle results
producer.send(record, callback);
```

### 3. Large Message Issues

```properties
# Handle large messages
max.request.size=10485760    # 10MB
message.max.bytes=10485760   # Must match broker config
```

## Python Producer Example

```python
from kafka import KafkaProducer
import json

# Create producer
producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8'),
    key_serializer=str.encode
)

# Send event
event = {'user_id': '123', 'action': 'login', 'timestamp': '2025-12-10T10:00:00Z'}
producer.send('user-events', value=event, key='123')

# Flush and close
producer.flush()
producer.close()
```

## Testing Producers

### Unit Testing

```java
@Test
public void testProducer() {
    Properties props = new Properties();
    props.put("bootstrap.servers", "localhost:9092");
    // Use mock or test broker

    try (KafkaProducer<String, String> producer = new KafkaProducer<>(props)) {
        ProducerRecord<String, String> record = new ProducerRecord<>("test-topic", "test");
        producer.send(record).get();
    }
}
```

## What's Next?

In this post, we've covered the complete Producer API:

- Basic setup and configuration
- Serialization strategies
- Partitioning and routing
- Synchronous/asynchronous sending
- Error handling and retries
- Idempotent and transactional producers
- Performance optimization
- Best practices and common pitfalls

You should now be able to build reliable Kafka producers for your applications.

In [Part 4]({% post_url 2025-12-13-kafka-consumers-api %}), we'll explore the Consumer API - how to read and process events from Kafka topics.

## Additional Resources

- [Kafka Producer Documentation](https://kafka.apache.org/documentation/#producerapi)
- [Confluent Producer Guide](https://docs.confluent.io/platform/current/clients/producer.html)
- [Exactly-Once Semantics](https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/)
- [Producer Performance Tuning](https://www.confluent.io/blog/optimizing-apache-kafka-for-production/)

---

*This is Part 3 of our comprehensive Apache Kafka series. [Part 2: Kafka Architecture ←]({% post_url 2025-12-11-kafka-architecture-concepts %}) | [Part 4: Consumers API →]({% post_url 2025-12-13-kafka-consumers-api %})*