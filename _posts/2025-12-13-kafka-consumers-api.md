---
layout: post
title: "Kafka Consumers API - Reading and Processing Events"
categories: [Kafka, Consumers, Event Streaming, Tutorial]
description: "Master the Kafka Consumer API: learn consumer groups, offset management, deserialization, and building scalable event processing applications."
excerpt: "Comprehensive guide to Kafka consumers covering groups, offsets, polling, error handling, and patterns for reliable event consumption."
---

# Kafka Consumers API - Reading and Processing Events

Welcome to Part 4 of our Apache Kafka series! We've covered [introduction]({% post_url 2025-12-10-kafka-introduction-basics %}), [architecture]({% post_url 2025-12-11-kafka-architecture-concepts %}), and [producers]({% post_url 2025-12-12-kafka-producers-api %}). Now we turn to **consumers** - the applications that read and process events from Kafka topics.

Consumers are the exit point for data from Kafka. Understanding consumer groups, offset management, and consumption patterns is essential for building scalable, fault-tolerant event processing systems.

## Consumer Fundamentals

A Kafka consumer reads events from topics and processes them. Key responsibilities include:

- **Subscribing** to topics
- **Polling** for new events
- **Deserializing** events from bytes
- **Managing offsets** for progress tracking
- **Handling rebalancing** in consumer groups

### Basic Consumer Setup

```java
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import java.time.Duration;
import java.util.Arrays;
import java.util.Properties;

public class BasicConsumer {
    public static void main(String[] args) {
        // Configure consumer
        Properties props = new Properties();
        props.put("bootstrap.servers", "localhost:9092");
        props.put("group.id", "my-consumer-group");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("auto.offset.reset", "earliest");

        // Create consumer
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);

        // Subscribe to topic
        consumer.subscribe(Arrays.asList("user-events"));

        try {
            while (true) {
                // Poll for new events
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));

                for (ConsumerRecord<String, String> record : records) {
                    System.out.println("Received: " + record.value() +
                                     " from partition " + record.partition() +
                                     " at offset " + record.offset());
                }
            }
        } finally {
            consumer.close();
        }
    }
}
```

## Key Configuration Properties

### Required Properties

- `bootstrap.servers`: Broker addresses
- `group.id`: Consumer group identifier
- `key.deserializer`: Key deserializer class
- `value.deserializer`: Value deserializer class

### Important Optional Properties

```properties
# Offset management
auto.offset.reset=earliest      # Where to start if no offset exists
enable.auto.commit=true         # Auto-commit offsets
auto.commit.interval.ms=5000    # Commit frequency

# Polling behavior
max.poll.records=500           # Max records per poll
max.poll.interval.ms=300000    # Max time between polls
fetch.min.bytes=1              # Min bytes to fetch
fetch.max.wait.ms=500          # Max wait for min bytes

# Session management
session.timeout.ms=10000       # Session timeout
heartbeat.interval.ms=3000     # Heartbeat frequency
```

## Consumer Groups and Parallelism

Consumer groups enable parallel processing of topics.

### Group Concepts

- **Group ID**: Identifies the consumer group
- **Partition Assignment**: Each partition assigned to one consumer
- **Rebalancing**: Automatic redistribution when consumers join/leave
- **Independent Processing**: Different groups don't interfere

### Scaling Consumers

```java
// Multiple consumers in same group
// Start multiple instances of this code with same group.id
// Kafka automatically distributes partitions

Properties props = new Properties();
props.put("group.id", "user-processor-group");
// ... other configs

KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
consumer.subscribe(Arrays.asList("user-events"));
```

## Offset Management

Offsets track consumption progress. Managing them correctly is crucial for reliability.

### Automatic Offset Commits

```properties
# Enable auto-commit
enable.auto.commit=true
auto.commit.interval.ms=1000
```

### Manual Offset Commits

```java
// Disable auto-commit
props.put("enable.auto.commit", "false");

// Manual commit after processing
try {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));

    for (ConsumerRecord<String, String> record : records) {
        // Process record
        processRecord(record);

        // Manual commit (synchronous)
        consumer.commitSync();
    }
} catch (Exception e) {
    // Handle error
    consumer.commitSync(); // Commit processed records
}
```

### Asynchronous Commits

```java
// Async commit with callback
consumer.commitAsync(new OffsetCommitCallback() {
    @Override
    public void onComplete(Map<TopicPartition, OffsetAndMetadata> offsets, Exception exception) {
        if (exception != null) {
            log.error("Commit failed", exception);
        }
    }
});
```

## Deserialization

Consumers deserialize bytes back to objects, opposite of producers.

### Built-in Deserializers

```java
// String deserialization
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

// JSON deserialization
props.put("value.deserializer", "org.springframework.kafka.support.serializer.JsonDeserializer");
props.put("spring.json.value.default.type", "com.example.UserEvent");
```

### Custom Deserialization

```java
public class UserEventDeserializer implements Deserializer<UserEvent> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public UserEvent deserialize(String topic, byte[] data) {
        try {
            return objectMapper.readValue(data, UserEvent.class);
        } catch (Exception e) {
            throw new SerializationException("Error deserializing UserEvent", e);
        }
    }
}
```

## Polling and Processing Patterns

### Basic Polling Loop

```java
while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));

    if (!records.isEmpty()) {
        for (ConsumerRecord<String, String> record : records) {
            processRecord(record);
        }

        // Commit offsets
        consumer.commitAsync();
    }
}
```

### Batch Processing

```java
while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));

    if (!records.isEmpty()) {
        List<UserEvent> batch = new ArrayList<>();

        for (ConsumerRecord<String, String> record : records) {
            batch.add(deserializeRecord(record));
        }

        // Process batch
        processBatch(batch);

        // Commit after successful processing
        consumer.commitSync();
    }
}
```

## Rebalancing and Partition Assignment

Rebalancing occurs when consumers join or leave the group.

### Handling Rebalancing

```java
consumer.subscribe(Arrays.asList("user-events"), new ConsumerRebalanceListener() {

    @Override
    public void onPartitionsRevoked(Collection<TopicPartition> partitions) {
        // Called before rebalancing
        // Commit offsets for revoked partitions
        consumer.commitSync();
    }

    @Override
    public void onPartitionsAssigned(Collection<TopicPartition> partitions) {
        // Called after rebalancing
        // Seek to specific offsets if needed
        for (TopicPartition partition : partitions) {
            consumer.seek(partition, getOffsetForPartition(partition));
        }
    }
});
```

### Manual Partition Assignment

```java
// Assign specific partitions (not recommended for most use cases)
List<TopicPartition> partitions = Arrays.asList(
    new TopicPartition("user-events", 0),
    new TopicPartition("user-events", 1)
);
consumer.assign(partitions);
```

## Seeking and Offset Control

Control where consumption starts.

### Seek to Beginning/End

```java
// Seek to beginning of all assigned partitions
consumer.seekToBeginning(consumer.assignment());

// Seek to end of all assigned partitions
consumer.seekToEnd(consumer.assignment());
```

### Seek to Specific Offset

```java
// Seek to specific offset
TopicPartition partition = new TopicPartition("user-events", 0);
consumer.seek(partition, 1000L); // Start from offset 1000
```

### Time-based Seeking

```java
// Seek to events from 1 hour ago
long oneHourAgo = System.currentTimeMillis() - (1000 * 60 * 60);
Map<TopicPartition, Long> timestamps = new HashMap<>();
for (TopicPartition partition : consumer.assignment()) {
    timestamps.put(partition, oneHourAgo);
}

Map<TopicPartition, OffsetAndTimestamp> offsets = consumer.offsetsForTimes(timestamps);
for (Map.Entry<TopicPartition, OffsetAndTimestamp> entry : offsets.entrySet()) {
    consumer.seek(entry.getKey(), entry.getValue().offset());
}
```

## Error Handling

### Common Consumer Errors

- `TimeoutException`: Broker not responding
- `InterruptException`: Consumer interrupted
- `SerializationException`: Deserialization failure
- `CommitFailedException`: Offset commit failure

### Robust Error Handling

```java
while (!closed) {
    try {
        ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));

        for (ConsumerRecord<String, String> record : records) {
            try {
                processRecord(record);
            } catch (Exception e) {
                log.error("Error processing record", e);
                // Handle processing error (retry, dead letter queue, etc.)
            }
        }

        consumer.commitAsync();

    } catch (WakeupException e) {
        // Shutdown signal
        break;
    } catch (Exception e) {
        log.error("Consumer error", e);
        // Handle consumer error
    }
}
```

## Exactly-Once Processing

Achieving exactly-once semantics with consumers.

### Idempotent Processing

```java
// Use record offset as idempotency key
String idempotencyKey = record.topic() + "-" + record.partition() + "-" + record.offset();
if (!isProcessed(idempotencyKey)) {
    processRecord(record);
    markAsProcessed(idempotencyKey);
}
```

### Transactional Processing

```java
// Read from input topic, process, write to output topic
while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));

    producer.beginTransaction();

    try {
        for (ConsumerRecord<String, String> record : records) {
            String result = processRecord(record);
            producer.send(new ProducerRecord<>("processed-events", result));
        }

        // Commit both consumer offset and producer transaction
        Map<TopicPartition, OffsetAndMetadata> offsets = new HashMap<>();
        for (TopicPartition partition : records.partitions()) {
            List<ConsumerRecord<String, String>> partitionRecords = records.records(partition);
            long lastOffset = partitionRecords.get(partitionRecords.size() - 1).offset();
            offsets.put(partition, new OffsetAndMetadata(lastOffset + 1));
        }

        producer.sendOffsetsToTransaction(offsets, consumer.groupMetadata());
        producer.commitTransaction();

    } catch (Exception e) {
        producer.abortTransaction();
    }
}
```

## Performance Optimization

### Polling Configuration

```properties
# Optimize polling
max.poll.records=1000
fetch.min.bytes=1024
fetch.max.wait.ms=500
```

### Threading Models

#### Single Threaded

```java
// Simple single-threaded consumer
while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
    processRecords(records);
}
```

#### Multi-threaded (Partition-based)

```java
// One thread per partition
Map<TopicPartition, List<ConsumerRecord<String, String>>> recordsByPartition =
    new HashMap<>();

for (ConsumerRecord<String, String> record : records) {
    recordsByPartition.computeIfAbsent(
        new TopicPartition(record.topic(), record.partition()),
        k -> new ArrayList<>()
    ).add(record);
}

// Submit to thread pool
for (List<ConsumerRecord<String, String>> partitionRecords : recordsByPartition.values()) {
    executor.submit(() -> processPartitionRecords(partitionRecords));
}
```

## Monitoring Consumer Metrics

### Key Metrics to Monitor

- **Consumer Lag**: How far behind the latest offset
- **Poll Rate**: Records consumed per second
- **Commit Rate**: Offset commits per second
- **Rebalance Frequency**: How often rebalancing occurs

```java
// Access consumer metrics
MetricName lagMetric = new MetricName("records-lag", "consumer-fetch-manager-metrics");
double lag = consumer.metrics().get(lagMetric).value();
```

## Best Practices

### 1. Proper Shutdown

```java
Runtime.getRuntime().addShutdownHook(new Thread(() -> {
    consumer.wakeup(); // Wake up from poll
}));

try {
    // Consumer loop
} finally {
    consumer.close(Duration.ofSeconds(5));
}
```

### 2. Handle Rebalancing Gracefully

```java
// Always commit before rebalancing
consumer.subscribe(topics, new ConsumerRebalanceListener() {
    @Override
    public void onPartitionsRevoked(Collection<TopicPartition> partitions) {
        consumer.commitSync();
    }
});
```

### 3. Monitor Consumer Health

```java
// Check if consumer is healthy
Set<TopicPartition> assigned = consumer.assignment();
if (assigned.isEmpty()) {
    log.warn("No partitions assigned to consumer");
}
```

### 4. Use Appropriate Poll Timeouts

```java
// Don't poll too frequently
Duration pollTimeout = Duration.ofMillis(100);
ConsumerRecords<String, String> records = consumer.poll(pollTimeout);
```

## Python Consumer Example

```python
from kafka import KafkaConsumer
import json

# Create consumer
consumer = KafkaConsumer(
    'user-events',
    bootstrap_servers=['localhost:9092'],
    group_id='user-processor-group',
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    auto_commit_interval_ms=1000
)

# Consume messages
for message in consumer:
    print(f"Received: {message.value} from partition {message.partition} at offset {message.offset}")
```

## Testing Consumers

### Unit Testing

```java
@Test
public void testConsumer() {
    Properties props = new Properties();
    props.put("bootstrap.servers", "localhost:9092");
    props.put("group.id", "test-group");

    try (KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props)) {
        consumer.subscribe(Arrays.asList("test-topic"));

        ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(1));
        assertTrue(records.isEmpty()); // Assuming no messages
    }
}
```

## What's Next?

In this comprehensive guide to Kafka consumers, we've covered:

- Basic consumer setup and configuration
- Consumer groups and parallel processing
- Offset management strategies
- Deserialization and error handling
- Rebalancing and partition assignment
- Seeking and time-based consumption
- Exactly-once processing patterns
- Performance optimization and monitoring
- Best practices and testing

You should now be able to build robust Kafka consumer applications.

In [Part 5]({% post_url 2025-12-14-kafka-topics-partitions %}), we'll dive deep into topics and partitions - how to manage them, configure retention policies, and optimize for performance.

## Additional Resources

- [Kafka Consumer Documentation](https://kafka.apache.org/documentation/#consumerapi)
- [Confluent Consumer Guide](https://docs.confluent.io/platform/current/clients/consumer.html)
- [Consumer Group Protocol](https://www.confluent.io/blog/kafka-consumer-group-protocol/)
- [Exactly-Once Processing](https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/)

---

*This is Part 4 of our comprehensive Apache Kafka series. [Part 3: Producers API ←]({% post_url 2025-12-12-kafka-producers-api %}) | [Part 5: Topics and Partitions →]({% post_url 2025-12-14-kafka-topics-partitions %})*