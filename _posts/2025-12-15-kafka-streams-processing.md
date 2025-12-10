---
layout: post
title: "Kafka Streams - Real-Time Stream Processing"
categories: [Kafka, Streams, Stream Processing, Tutorial]
description: "Master Kafka Streams: build real-time stream processing applications with KStreams, KTables, windowing, joins, and stateful operations."
excerpt: "Comprehensive guide to Kafka Streams covering topology, operations, state management, windowing, joins, and building real-time processing pipelines."
---

# Kafka Streams - Real-Time Stream Processing

Welcome to Part 6 of our Apache Kafka series! We've covered the [fundamentals]({% post_url 2025-12-10-kafka-introduction-basics %}), [architecture]({% post_url 2025-12-11-kafka-architecture-concepts %}), [producers]({% post_url 2025-12-12-kafka-producers-api %}), [consumers]({% post_url 2025-12-13-kafka-consumers-api %}), and [topics/partitions]({% post_url 2025-12-14-kafka-topics-partitions %}). Now we explore **Kafka Streams** - the powerful library for building real-time stream processing applications.

Kafka Streams enables you to build sophisticated stream processing applications that transform, aggregate, and analyze data in real-time, all while maintaining exactly-once processing semantics.

## What is Kafka Streams?

Kafka Streams is a client library for building applications that process and analyze data stored in Kafka. It provides:

- **Stream Processing**: Transform, filter, and aggregate event streams
- **Table Processing**: Maintain materialized views of event data
- **Stateful Operations**: Joins, aggregations with fault-tolerant state
- **Exactly-Once Processing**: Guaranteed processing semantics
- **Scalability**: Distributed processing across multiple instances

### Key Concepts

- **KStream**: Represents a stream of events (append-only)
- **KTable**: Represents a changelog stream (upserts/deletes)
- **GlobalKTable**: Read-only KTable replicated to all instances
- **Topology**: The processing graph of operations

## Getting Started with Kafka Streams

### Basic Setup

```xml
<!-- Maven dependency -->
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-streams</artifactId>
    <version>3.6.0</version>
</dependency>
```

```java
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import java.util.Properties;

public class StreamProcessor {
    public static void main(String[] args) {
        // Configure streams
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "stream-processor");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        // Build topology
        StreamsBuilder builder = new StreamsBuilder();

        // Define processing logic here

        // Create and start streams
        KafkaStreams streams = new KafkaStreams(builder.build(), props);
        streams.start();

        // Graceful shutdown
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }
}
```

## KStreams: Processing Event Streams

KStreams represent unbounded sequences of events where each event is a key-value pair.

### Basic Stream Operations

```java
StreamsBuilder builder = new StreamsBuilder();

// Create a stream from topic
KStream<String, String> userEvents = builder.stream("user-events");

// Filter events
KStream<String, String> loginEvents = userEvents
    .filter((key, value) -> value.contains("login"));

// Transform values
KStream<String, String> upperCaseEvents = loginEvents
    .mapValues(value -> value.toUpperCase());

// Write to output topic
upperCaseEvents.to("processed-events");
```

### Key Operations

#### Filtering and Mapping

```java
KStream<String, UserEvent> userEvents = builder.stream("user-events");

// Filter by user type
KStream<String, UserEvent> premiumUsers = userEvents
    .filter((key, user) -> user.getSubscription().equals("premium"));

// Transform to different format
KStream<String, NotificationEvent> notifications = premiumUsers
    .mapValues(user -> new NotificationEvent(user.getId(), "Welcome premium user!"));
```

#### Branching (Splitting Streams)

```java
KStream<String, OrderEvent>[] branches = orderEvents
    .branch(
        (key, order) -> order.getAmount() > 1000,    // High value orders
        (key, order) -> order.getAmount() > 100,     // Medium value orders
        (key, order) -> true                         // Low value orders
    );

// Process each branch differently
branches[0].to("high-value-orders");
branches[1].to("medium-value-orders");
branches[2].to("low-value-orders");
```

#### Grouping and Aggregating

```java
// Group by user ID
KGroupedStream<String, OrderEvent> groupedByUser = orderEvents
    .groupByKey();

// Count orders per user
KTable<String, Long> orderCounts = groupedByUser
    .count(Materialized.as("order-counts-store"));

// Sum order amounts per user
KTable<String, Double> totalSpent = groupedByUser
    .aggregate(
        () -> 0.0,                                    // Initial value
        (key, order, total) -> total + order.getAmount(), // Adder
        Materialized.as("total-spent-store")          // State store
    );
```

## KTables: Materialized Views

KTables represent changelog streams and maintain the latest value for each key.

### Creating KTables

```java
// From a topic (assumes key-value events)
KTable<String, UserProfile> userProfiles = builder.table("user-profiles");

// From a stream (convert stream to table)
KTable<String, Long> userLoginCounts = builder.stream("login-events")
    .groupByKey()
    .count(Materialized.as("login-counts"));
```

### Table Operations

```java
// Join two tables
KTable<String, UserOrderSummary> orderSummary = userProfiles
    .join(
        totalSpent,
        (profile, spent) -> new UserOrderSummary(profile, spent)
    );

// Filter table
KTable<String, UserProfile> activeUsers = userProfiles
    .filter((key, profile) -> profile.isActive());
```

## Windowing: Time-Based Operations

Windowing groups events that occur within time windows for aggregation.

### Tumbling Windows

```java
// 1-hour tumbling windows
KTable<Windowed<String>, Long> hourlyLogins = loginEvents
    .groupByKey()
    .windowedBy(TimeWindows.of(Duration.ofHours(1)))
    .count();
```

### Sliding Windows

```java
// 30-minute sliding windows with 10-minute advance
KTable<Windowed<String>, Long> slidingLogins = loginEvents
    .groupByKey()
    .windowedBy(TimeWindows.of(Duration.ofMinutes(30)).advanceBy(Duration.ofMinutes(10)))
    .count();
```

### Session Windows

```java
// Session windows with 30-minute gap
KTable<Windowed<String>, Long> sessionActivity = userActivity
    .groupByKey()
    .windowedBy(SessionWindows.with(Duration.ofMinutes(30)))
    .count();
```

## Joins: Combining Streams and Tables

Kafka Streams supports various types of joins for combining data.

### Stream-Stream Joins

```java
KStream<String, OrderEvent> orders = builder.stream("orders");
KStream<String, PaymentEvent> payments = builder.stream("payments");

// Join orders with payments within 1 hour
KStream<String, OrderPayment> orderPayments = orders
    .join(
        payments,
        (order, payment) -> new OrderPayment(order, payment),
        JoinWindows.of(Duration.ofHours(1)),
        StreamJoined.as("order-payment-join")
    );
```

### Stream-Table Joins

```java
KStream<String, OrderEvent> orders = builder.stream("orders");
KTable<String, UserProfile> users = builder.table("user-profiles");

// Enrich orders with user data
KStream<String, EnrichedOrder> enrichedOrders = orders
    .leftJoin(
        users,
        (order, user) -> new EnrichedOrder(order, user)
    );
```

### Table-Table Joins

```java
KTable<String, UserProfile> users = builder.table("user-profiles");
KTable<String, UserPreferences> preferences = builder.table("user-preferences");

// Join user data with preferences
KTable<String, UserData> userData = users
    .join(
        preferences,
        (profile, prefs) -> new UserData(profile, prefs)
    );
```

## State Stores: Managing Application State

State stores provide fault-tolerant storage for stream processing state.

### Types of State Stores

- **Key-Value Stores**: For aggregations and lookups
- **Window Stores**: For windowed operations
- **Session Stores**: For session-based aggregations

### Custom State Stores

```java
// Define a custom store
StoreBuilder<KeyValueStore<String, Long>> customStore = Stores
    .keyValueStoreBuilder(
        Stores.persistentKeyValueStore("my-custom-store"),
        Serdes.String(),
        Serdes.Long()
    );

// Add to topology
builder.addStateStore(customStore);

// Use in processor
KStream<String, String> stream = builder.stream("input");
stream.process(() -> new CustomProcessor(), "my-custom-store");
```

## Exactly-Once Processing

Kafka Streams provides exactly-once processing semantics.

### Enabling Exactly-Once

```java
// Enable exactly-once processing
props.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE_V2);

// For older versions
props.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE);
```

### Transactional Processing

```java
// Read from input, process, write to output atomically
KStream<String, String> input = builder.stream("input-topic");
KStream<String, String> output = input
    .mapValues(value -> process(value));

output.to("output-topic");
// Exactly-once ensures atomic read-process-write
```

## Interactive Queries

Query the state of your stream processing application at runtime.

### Querying State Stores

```java
// Get store from running streams
ReadOnlyKeyValueStore<String, Long> store = streams
    .store(StoreQueryParameters.fromNameAndType("order-counts", QueryableStoreTypes.keyValueStore()));

// Query specific key
Long count = store.get("user123");

// Iterate over all entries
KeyValueIterator<String, Long> iterator = store.all();
while (iterator.hasNext()) {
    KeyValue<String, Long> entry = iterator.next();
    System.out.println(entry.key + ": " + entry.value);
}
```

### REST API for Queries

```java
// Expose state via REST API
@GetMapping("/user/{userId}/order-count")
public Long getOrderCount(@PathVariable String userId) {
    ReadOnlyKeyValueStore<String, Long> store = streams
        .store(StoreQueryParameters.fromNameAndType("order-counts", QueryableStoreTypes.keyValueStore()));

    return store.get(userId);
}
```

## Error Handling and Resilience

### Handling Deserialization Errors

```java
// Handle deserialization failures
KStream<String, String> stream = builder.stream("input-topic",
    Consumed.with(Serdes.String(), Serdes.String()));

KStream<String, String> validEvents = stream
    .filter((key, value) -> {
        try {
            // Validate JSON
            objectMapper.readTree(value);
            return true;
        } catch (Exception e) {
            // Log error and skip invalid event
            log.error("Invalid JSON: " + value, e);
            return false;
        }
    });
```

### Dead Letter Topics

```java
// Send invalid events to dead letter topic
KStream<String, String> invalidEvents = stream
    .filterNot((key, value) -> isValid(value));

invalidEvents.to("dead-letter-topic");
```

## Testing Kafka Streams Applications

### Topology Test Driver

```java
@Test
public void testStreamProcessing() {
    StreamsBuilder builder = new StreamsBuilder();

    // Define topology
    KStream<String, String> input = builder.stream("input-topic");
    KStream<String, String> output = input
        .filter((k, v) -> v.length() > 5)
        .mapValues(String::toUpperCase);

    output.to("output-topic");

    // Test with TopologyTestDriver
    try (TopologyTestDriver testDriver = new TopologyTestDriver(builder.build(), props)) {
        // Create test input
        TestInputTopic<String, String> inputTopic = testDriver
            .createInputTopic("input-topic", Serdes.String().serializer(), Serdes.String().serializer());

        TestOutputTopic<String, String> outputTopic = testDriver
            .createOutputTopic("output-topic", Serdes.String().deserializer(), Serdes.String().deserializer());

        // Send test data
        inputTopic.pipeInput("key1", "hello");
        inputTopic.pipeInput("key2", "world");
        inputTopic.pipeInput("key3", "hi");

        // Verify output
        assertEquals("HELLO", outputTopic.readValue());
        assertEquals("WORLD", outputTopic.readValue());
        assertTrue(outputTopic.isEmpty()); // "hi" filtered out
    }
}
```

## Performance Optimization

### Configuration Tuning

```properties
# Performance settings
num.stream.threads=4
buffered.records.per.partition=1000
commit.interval.ms=10000
cache.max.bytes.buffering=10485760
```

### State Store Optimization

```java
// Optimize state store
Materialized<String, Long, KeyValueStore<Bytes, byte[]>> materialized =
    Materialized.<String, Long>as("optimized-store")
        .withKeySerde(Serdes.String())
        .withValueSerde(Serdes.Long())
        .withCachingEnabled()    // Enable caching
        .withLoggingEnabled(Collections.singletonMap("retention.ms", "604800000")); // 7 days
```

## Real-World Example: E-commerce Analytics

```java
public class EcommerceAnalytics {

    public static void main(String[] args) {
        StreamsBuilder builder = new StreamsBuilder();

        // User events stream
        KStream<String, UserEvent> userEvents = builder.stream("user-events");

        // Product views
        KStream<String, String> productViews = userEvents
            .filter((k, v) -> "view".equals(v.getAction()))
            .map((k, v) -> KeyValue.pair(v.getProductId(), v.getUserId()));

        // Top products by views (last hour)
        KTable<Windowed<String>, Long> topProducts = productViews
            .groupByKey()
            .windowedBy(TimeWindows.of(Duration.ofHours(1)))
            .count()
            .groupBy((k, v) -> KeyValue.pair("top-products", v),
                     Grouped.with(Serdes.String(), Serdes.Long()))
            .aggregate(
                () -> new HashMap<String, Long>(),
                (k, v, agg) -> {
                    agg.put(k.key(), v);
                    return agg;
                },
                Materialized.with(Serdes.String(), hashMapSerde)
            );

        // User session analysis
        KStream<String, UserEvent> sessions = userEvents
            .groupByKey()
            .windowedBy(SessionWindows.with(Duration.ofMinutes(30)))
            .aggregate(
                () -> new UserSession(),
                (k, v, session) -> session.addEvent(v),
                (k, agg1, agg2) -> agg1.merge(agg2)
            )
            .toStream()
            .map((k, v) -> KeyValue.pair(k.key(), v));

        sessions.to("user-sessions");

        // Start streams
        KafkaStreams streams = new KafkaStreams(builder.build(), props);
        streams.start();
    }
}
```

## Deployment and Scaling

### Running Multiple Instances

```bash
# Run multiple instances with same application.id
# Kafka Streams automatically distributes work
java -jar streams-app.jar &
java -jar streams-app.jar &
java -jar streams-app.jar &
```

### Monitoring Streams Applications

Key metrics to monitor:
- **Processing latency**
- **Throughput (records/sec)**
- **State store size**
- **Rebalance frequency**
- **Error rates**

## What's Next?

In this comprehensive guide to Kafka Streams, we've covered:

- Stream and table processing concepts
- KStreams and KTables operations
- Windowing and time-based processing
- Joins between streams and tables
- State management and stores
- Exactly-once processing
- Interactive queries
- Testing and performance optimization
- Real-world examples

You should now be able to build sophisticated real-time stream processing applications with Kafka Streams.

In [Part 7]({% post_url 2025-12-16-kafka-connect-integration %}), we'll explore Kafka Connect - how to integrate Kafka with external systems like databases, message queues, and file systems.

## Additional Resources

- [Kafka Streams Documentation](https://kafka.apache.org/documentation/streams/)
- [Confluent Streams Guide](https://docs.confluent.io/platform/current/streams/index.html)
- [Streams DSL Examples](https://github.com/confluentinc/kafka-streams-examples)
- [Interactive Queries](https://docs.confluent.io/platform/current/streams/developer-guide/interactive-queries.html)

---

*This is Part 6 of our comprehensive Apache Kafka series. [Part 5: Topics and Partitions ←]({% post_url 2025-12-14-kafka-topics-partitions %}) | [Part 7: Kafka Connect →]({% post_url 2025-12-16-kafka-connect-integration %})*