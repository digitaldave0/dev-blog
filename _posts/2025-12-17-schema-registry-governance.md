---
layout: post
title: "Schema Registry and Data Governance in Kafka"
categories: [Kafka, Schema Registry, Data Governance, Tutorial]
description: "Master Schema Registry: manage data schemas, ensure compatibility, and implement data governance in Kafka ecosystems."
excerpt: "Comprehensive guide to Schema Registry covering schema management, compatibility rules, serialization formats, and data governance best practices."
---

# Schema Registry and Data Governance in Kafka

Welcome to Part 8 of our Apache Kafka series! We've covered the [fundamentals]({% post_url 2025-12-10-kafka-introduction-basics %}), [architecture]({% post_url 2025-12-11-kafka-architecture-concepts %}), [producers]({% post_url 2025-12-12-kafka-producers-api %}), [consumers]({% post_url 2025-12-13-kafka-consumers-api %}), [topics/partitions]({% post_url 2025-12-14-kafka-topics-partitions %}), [Streams]({% post_url 2025-12-15-kafka-streams-processing %}), and [Connect]({% post_url 2025-12-16-kafka-connect-integration %}). Now we explore **Schema Registry** - the cornerstone of data governance in Kafka ecosystems.

Schema Registry provides a centralized repository for managing data schemas, ensuring compatibility between producers and consumers, and maintaining data quality across your event streaming platform.

## What is Schema Registry?

Schema Registry is a service that:

- **Stores Schemas**: Centralized repository for Avro, JSON, and Protobuf schemas
- **Ensures Compatibility**: Validates schema evolution rules
- **Provides Governance**: Controls who can register/modify schemas
- **Optimizes Performance**: Enables schema caching and optimization
- **Supports Multiple Formats**: Avro, JSON Schema, Protobuf

### Key Benefits

- **Data Quality**: Ensures consistent data formats
- **Evolution Safety**: Prevents breaking changes
- **Performance**: Reduces message size with schema references
- **Governance**: Centralized control over data models

## Schema Formats

### Avro

```json
{
  "type": "record",
  "name": "User",
  "fields": [
    {"name": "id", "type": "long"},
    {"name": "name", "type": "string"},
    {"name": "email", "type": "string"},
    {"name": "created_at", "type": {"type": "long", "logicalType": "timestamp-millis"}}
  ]
}
```

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {"type": "integer"},
    "name": {"type": "string"},
    "email": {"type": "string", "format": "email"},
    "created_at": {"type": "string", "format": "date-time"}
  },
  "required": ["id", "name", "email"]
}
```

### Protobuf

```protobuf
syntax = "proto3";

message User {
  int64 id = 1;
  string name = 2;
  string email = 3;
  google.protobuf.Timestamp created_at = 4;
}
```

## Setting Up Schema Registry

### Installation

```bash
# Using Confluent Platform
confluent start schema-registry

# Or standalone
./bin/schema-registry-start ./etc/schema-registry/schema-registry.properties
```

### Configuration

```properties
# schema-registry.properties
listeners=http://0.0.0.0:8081
kafkastore.bootstrap.servers=localhost:9092
kafkastore.topic=_schemas
kafkastore.topic.replication.factor=3
host.name=localhost
schema.compatibility.level=backward
```

## Schema Registration

### REST API

```bash
# Register Avro schema
curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data '{"schema": "{\"type\": \"record\", \"name\": \"User\", \"fields\": [{\"name\": \"id\", \"type\": \"long\"}]}"}' \
  http://localhost:8081/subjects/user-events-value/versions

# Register JSON schema
curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data '{"schema": "{\"$schema\": \"http://json-schema.org/draft-07/schema#\", \"type\": \"object\", \"properties\": {\"id\": {\"type\": \"integer\"}}}"}' \
  http://localhost:8081/subjects/user-events-value/versions

# Register Protobuf schema
curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data '{"schema": "syntax = \"proto3\"; message User { int64 id = 1; }"}' \
  http://localhost:8081/subjects/user-events-value/versions
```

### Java Client

```java
import io.confluent.kafka.schemaregistry.client.SchemaRegistryClient;
import io.confluent.kafka.schemaregistry.client.CachedSchemaRegistryClient;
import org.apache.avro.Schema;

SchemaRegistryClient schemaRegistry = new CachedSchemaRegistryClient(
    "http://localhost:8081", 100);

// Register schema
String schemaString = "{\"type\": \"record\", \"name\": \"User\", \"fields\": [{\"name\": \"id\", \"type\": \"long\"}]}";
Schema schema = new Schema.Parser().parse(schemaString);
int schemaId = schemaRegistry.register("user-events-value", schema);
```

## Schema Evolution and Compatibility

### Compatibility Levels

- **BACKWARD**: New schema can read old data
- **FORWARD**: Old schema can read new data
- **FULL**: Both backward and forward compatible
- **NONE**: No compatibility checks

### Setting Compatibility

```bash
# Set global compatibility
curl -X PUT -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data '{"compatibility": "BACKWARD"}' \
  http://localhost:8081/config

# Set per-subject compatibility
curl -X PUT -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data '{"compatibility": "FORWARD"}' \
  http://localhost:8081/config/user-events-value
```

### Safe Schema Evolution

#### Adding Optional Fields (Safe)

```json
// Version 1
{
  "type": "record",
  "name": "User",
  "fields": [
    {"name": "id", "type": "long"},
    {"name": "name", "type": "string"}
  ]
}

// Version 2 (Backward Compatible)
{
  "type": "record",
  "name": "User",
  "fields": [
    {"name": "id", "type": "long"},
    {"name": "name", "type": "string"},
    {"name": "email", "type": ["null", "string"], "default": null}
  ]
}
```

#### Removing Fields (Potentially Breaking)

```json
// Version 1
{
  "type": "record",
  "name": "User",
  "fields": [
    {"name": "id", "type": "long"},
    {"name": "name", "type": "string"},
    {"name": "email", "type": "string"}
  ]
}

// Version 2 (Breaking - email is required)
{
  "type": "record",
  "name": "User",
  "fields": [
    {"name": "id", "type": "long"},
    {"name": "name", "type": "string"}
  ]
}
```

## Serialization with Schema Registry

### Avro Serializer

```java
import io.confluent.kafka.serializers.KafkaAvroSerializer;
import io.confluent.kafka.serializers.KafkaAvroDeserializer;

Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("schema.registry.url", "http://localhost:8081");

// Producer
props.put("key.serializer", KafkaAvroSerializer.class);
props.put("value.serializer", KafkaAvroSerializer.class);

// Consumer
props.put("key.deserializer", KafkaAvroDeserializer.class);
props.put("value.deserializer", KafkaAvroDeserializer.class);

// Specific record (generated from schema)
KafkaProducer<String, User> producer = new KafkaProducer<>(props);
User user = new User(1L, "John Doe", "john@example.com");
producer.send(new ProducerRecord<>("user-events", "user-1", user));
```

### JSON Schema Serializer

```java
import io.confluent.kafka.serializers.json.KafkaJsonSchemaSerializer;
import io.confluent.kafka.serializers.json.KafkaJsonSchemaDeserializer;

props.put("key.serializer", KafkaJsonSchemaSerializer.class);
props.put("value.serializer", KafkaJsonSchemaSerializer.class);
props.put("value.subject.name.strategy",
         "io.confluent.kafka.serializers.subject.TopicRecordNameStrategy");
```

### Protobuf Serializer

```java
import io.confluent.kafka.serializers.protobuf.KafkaProtobufSerializer;
import io.confluent.kafka.serializers.protobuf.KafkaProtobufDeserializer;

props.put("key.serializer", KafkaProtobufSerializer.class);
props.put("value.serializer", KafkaProtobufSerializer.class);
```

## Schema Management

### Listing Schemas

```bash
# List all subjects
curl http://localhost:8081/subjects

# Get schema versions for subject
curl http://localhost:8081/subjects/user-events-value/versions

# Get specific schema
curl http://localhost:8081/subjects/user-events-value/versions/1
```

### Schema Deletion

```bash
# Soft delete (marks as deleted)
curl -X DELETE http://localhost:8081/subjects/user-events-value/versions/2

# Hard delete (permanent removal)
curl -X DELETE http://localhost:8081/subjects/user-events-value/versions/2?permanent=true
```

### Schema Lookup

```bash
# Get schema by ID
curl http://localhost:8081/schemas/ids/1

# Check compatibility
curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data '{"schema": "{\"type\": \"record\", \"name\": \"User\", \"fields\": [{\"name\": \"id\", \"type\": \"long\"}]}"}' \
  http://localhost:8081/compatibility/subjects/user-events-value/versions/latest
```

## Data Governance Features

### Subject Name Strategies

```properties
# TopicNameStrategy (default)
value.subject.name.strategy=io.confluent.kafka.serializers.subject.TopicNameStrategy

# TopicRecordNameStrategy
value.subject.name.strategy=io.confluent.kafka.serializers.subject.TopicRecordNameStrategy

# RecordNameStrategy
value.subject.name.strategy=io.confluent.kafka.serializers.subject.RecordNameStrategy
```

### Schema Validation

```java
// Enable schema validation in Connect
{
  "config": {
    "key.converter.schemas.enable": "true",
    "value.converter.schemas.enable": "true",
    "key.converter.schema.registry.url": "http://localhost:8081",
    "value.converter.schema.registry.url": "http://localhost:8081"
  }
}
```

### Access Control

```properties
# Enable authentication
schema.registry.authentication.method=BASIC
schema.registry.authentication.roles=admin,developer
schema.registry.authentication.realm=SchemaRegistry

# SSL configuration
schema.registry.ssl.truststore.location=/path/to/truststore.jks
schema.registry.ssl.keystore.location=/path/to/keystore.jks
```

## Monitoring and Metrics

### Key Metrics

- **Schema Count**: Total schemas registered
- **Compatibility Checks**: Success/failure rates
- **Serialization Time**: Performance metrics
- **Error Rates**: Schema validation failures

### JMX Metrics

```java
// Monitor via JMX
MBeanServer mbeanServer = ManagementFactory.getPlatformMBeanServer();
ObjectName schemaRegistryMetrics = new ObjectName("kafka.schema.registry:type=jetty-metrics");

Integer activeConnections = (Integer) mbeanServer.getAttribute(
    schemaRegistryMetrics, "connections-active");
```

## Best Practices

### 1. Schema Design

```json
// Use meaningful names
{
  "type": "record",
  "name": "OrderCreatedEvent",  // Specific and descriptive
  "namespace": "com.company.ecommerce",
  "fields": [...]
}

// Use logical types
{
  "name": "created_at",
  "type": {"type": "long", "logicalType": "timestamp-millis"}
}
```

### 2. Evolution Strategy

```bash
# Start with backward compatibility
# Plan evolution carefully
# Test compatibility before deployment
# Use default values for new fields
```

### 3. Naming Conventions

```bash
# Subject naming: {topic}-{key|value}
user-events-value
order-events-key

# Schema naming: PascalCase
UserProfile
OrderCreatedEvent
```

### 4. Documentation

```json
// Document schemas
{
  "type": "record",
  "name": "User",
  "doc": "Represents a user in the system",
  "fields": [
    {
      "name": "id",
      "type": "long",
      "doc": "Unique user identifier"
    }
  ]
}
```

## Integration with Kafka Ecosystem

### With Kafka Connect

```json
{
  "name": "avro-sink",
  "config": {
    "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
    "key.converter": "io.confluent.connect.avro.AvroConverter",
    "value.converter": "io.confluent.connect.avro.AvroConverter",
    "key.converter.schema.registry.url": "http://localhost:8081",
    "value.converter.schema.registry.url": "http://localhost:8081"
  }
}
```

### With Kafka Streams

```java
StreamsConfig streamsConfig = new StreamsConfig(props);
streamsConfig.put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG,
                  "http://localhost:8081");
```

### With ksqlDB

```sql
-- Create stream with schema
CREATE STREAM user_events (
  id BIGINT,
  name VARCHAR,
  email VARCHAR
) WITH (
  KAFKA_TOPIC='user-events',
  VALUE_FORMAT='AVRO',
  VALUE_SCHEMA_ID=1
);
```

## Troubleshooting

### Common Issues

#### Schema Not Found

```bash
# Check if schema exists
curl http://localhost:8081/subjects/user-events-value/versions

# Register missing schema
curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data @schema.json \
  http://localhost:8081/subjects/user-events-value/versions
```

#### Compatibility Errors

```bash
# Check compatibility
curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data @new-schema.json \
  http://localhost:8081/compatibility/subjects/user-events-value/versions/latest

# Adjust compatibility level if needed
curl -X PUT -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data '{"compatibility": "NONE"}' \
  http://localhost:8081/config/user-events-value
```

#### Serialization Errors

```java
// Enable debug logging
props.put("schema.registry.url", "http://localhost:8081");
props.put("auto.register.schemas", "false");  // Manual registration
```

## Real-World Example: E-commerce Schema Evolution

```json
// Initial schema
{
  "type": "record",
  "name": "OrderEvent",
  "fields": [
    {"name": "order_id", "type": "string"},
    {"name": "customer_id", "type": "string"},
    {"name": "amount", "type": "double"},
    {"name": "items", "type": {"type": "array", "items": "string"}}
  ]
}

// Add shipping info (backward compatible)
{
  "type": "record",
  "name": "OrderEvent",
  "fields": [
    {"name": "order_id", "type": "string"},
    {"name": "customer_id", "type": "string"},
    {"name": "amount", "type": "double"},
    {"name": "items", "type": {"type": "array", "items": "string"}},
    {"name": "shipping_address", "type": ["null", "string"], "default": null}
  ]
}

// Add payment method (still backward compatible)
{
  "type": "record",
  "name": "OrderEvent",
  "fields": [
    {"name": "order_id", "type": "string"},
    {"name": "customer_id", "type": "string"},
    {"name": "amount", "type": "double"},
    {"name": "items", "type": {"type": "array", "items": "string"}},
    {"name": "shipping_address", "type": ["null", "string"], "default": null},
    {"name": "payment_method", "type": {"type": "enum", "name": "PaymentMethod", "symbols": ["CREDIT_CARD", "PAYPAL", "BANK_TRANSFER"]}, "default": "CREDIT_CARD"}
  ]
}
```

## What's Next?

In this comprehensive guide to Schema Registry, we've covered:

- Schema management and storage
- Schema evolution and compatibility
- Serialization formats (Avro, JSON, Protobuf)
- Data governance features
- Integration with Kafka ecosystem
- Best practices and troubleshooting

You should now be able to implement robust data governance in your Kafka deployments.

In [Part 9]({% post_url 2025-12-18-kafka-security-hardening %}), we'll explore Kafka security - authentication, authorization, encryption, and hardening your Kafka clusters.

## Additional Resources

- [Schema Registry Documentation](https://docs.confluent.io/platform/current/schema-registry/index.html)
- [Avro Specification](https://avro.apache.org/docs/current/spec.html)
- [JSON Schema](https://json-schema.org/)
- [Protocol Buffers](https://developers.google.com/protocol-buffers)

---

*This is Part 8 of our comprehensive Apache Kafka series. [Part 7: Kafka Connect ←]({% post_url 2025-12-16-kafka-connect-integration %}) | [Part 9: Kafka Security →]({% post_url 2025-12-18-kafka-security-hardening %})*