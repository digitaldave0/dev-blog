---
layout: post
title: "Kafka Connect - Integrating with External Systems"
categories: [Kafka, Connect, Integration, ETL, Tutorial]
description: "Master Kafka Connect: build reliable data pipelines with source and sink connectors for databases, message queues, and external systems."
excerpt: "Comprehensive guide to Kafka Connect covering connectors, configuration, deployment modes, transformations, and building scalable data integration pipelines."
---

# Kafka Connect - Integrating with External Systems

Welcome to Part 7 of our Apache Kafka series! We've covered the [fundamentals]({% post_url 2025-12-10-kafka-introduction-basics %}), [architecture]({% post_url 2025-12-11-kafka-architecture-concepts %}), [producers]({% post_url 2025-12-12-kafka-producers-api %}), [consumers]({% post_url 2025-12-13-kafka-consumers-api %}), [topics/partitions]({% post_url 2025-12-14-kafka-topics-partitions %}), and [Streams]({% post_url 2025-12-15-kafka-streams-processing %}). Now we explore **Kafka Connect** - the framework for building reliable, scalable data pipelines between Kafka and external systems.

Kafka Connect eliminates the need to write custom integration code by providing a framework for moving data between Kafka and external systems like databases, message queues, and file systems.

## What is Kafka Connect?

Kafka Connect is a framework for:

- **Source Connectors**: Import data from external systems into Kafka
- **Sink Connectors**: Export data from Kafka to external systems
- **Reliability**: Exactly-once delivery and fault tolerance
- **Scalability**: Distributed deployment across multiple workers
- **Management**: REST API for configuration and monitoring

### Key Components

- **Connectors**: High-level abstractions for data movement
- **Tasks**: Individual units of work within connectors
- **Workers**: Processes that execute connectors and tasks
- **Converters**: Handle data format transformations

## Deployment Modes

### Standalone Mode

```bash
# Start standalone worker
connect-standalone worker.properties source-connector.properties
```

Best for:
- Development and testing
- Single worker deployments
- Simple configurations

### Distributed Mode

```bash
# Start distributed workers
connect-distributed worker.properties
```

Best for:
- Production deployments
- High availability
- Scalability across multiple machines

## Configuration

### Worker Configuration

```properties
# worker.properties
bootstrap.servers=localhost:9092

# Group coordination
group.id=connect-cluster

# Key and value converters
key.converter=org.apache.kafka.connect.json.JsonConverter
value.converter=org.apache.kafka.connect.json.JsonConverter
key.converter.schemas.enable=true
value.converter.schemas.enable=true

# Plugin path
plugin.path=/usr/share/java,/usr/share/confluent-hub-components

# REST API
rest.host.name=0.0.0.0
rest.port=8083

# Offset storage
offset.storage.topic=connect-offsets
offset.storage.replication.factor=3
offset.storage.partitions=3

# Config storage
config.storage.topic=connect-configs
config.storage.replication.factor=3

# Status storage
status.storage.topic=connect-status
status.storage.replication.factor=3
status.storage.partitions=3
```

## Source Connectors

Source connectors read data from external systems and write to Kafka topics.

### File Source Connector

```json
{
  "name": "file-source",
  "config": {
    "connector.class": "org.apache.kafka.connect.file.FileStreamSourceConnector",
    "tasks.max": "1",
    "file": "/tmp/test.txt",
    "topic": "file-events",
    "transforms": "AddTimestamp",
    "transforms.AddTimestamp.type": "org.apache.kafka.connect.transforms.InsertField$Value",
    "transforms.AddTimestamp.timestamp.field": "timestamp"
  }
}
```

### JDBC Source Connector

```json
{
  "name": "jdbc-source",
  "config": {
    "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
    "connection.url": "jdbc:postgresql://localhost:5432/mydb",
    "connection.user": "user",
    "connection.password": "password",
    "table.whitelist": "users,orders",
    "mode": "incrementing",
    "incrementing.column.name": "id",
    "topic.prefix": "db-",
    "poll.interval.ms": "1000"
  }
}
```

### Debezium CDC Connector

```json
{
  "name": "postgres-cdc",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "localhost",
    "database.port": "5432",
    "database.user": "debezium",
    "database.password": "dbz",
    "database.dbname": "mydb",
    "database.server.name": "dbserver1",
    "table.whitelist": "public.users",
    "plugin.name": "pgoutput"
  }
}
```

## Sink Connectors

Sink connectors read from Kafka topics and write to external systems.

### File Sink Connector

```json
{
  "name": "file-sink",
  "config": {
    "connector.class": "org.apache.kafka.connect.file.FileStreamSinkConnector",
    "tasks.max": "1",
    "file": "/tmp/sink.txt",
    "topics": "file-events"
  }
}
```

### JDBC Sink Connector

```json
{
  "name": "jdbc-sink",
  "config": {
    "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
    "connection.url": "jdbc:postgresql://localhost:5432/warehouse",
    "connection.user": "user",
    "connection.password": "password",
    "topics": "user-events,order-events",
    "auto.create": "true",
    "auto.evolve": "true",
    "insert.mode": "upsert",
    "pk.mode": "record_key",
    "pk.fields": "id"
  }
}
```

### Elasticsearch Sink Connector

```json
{
  "name": "elasticsearch-sink",
  "config": {
    "connector.class": "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector",
    "topics": "user-events",
    "connection.url": "http://localhost:9200",
    "type.name": "_doc",
    "key.ignore": "false",
    "schema.ignore": "true",
    "behavior.on.malformed.documents": "warn"
  }
}
```

## Single Message Transforms (SMTs)

SMTs modify messages as they flow through Connect.

### Built-in Transforms

#### Insert Field

```json
{
  "transforms": "InsertTimestamp",
  "transforms.InsertTimestamp.type": "org.apache.kafka.connect.transforms.InsertField$Value",
  "transforms.InsertTimestamp.timestamp.field": "event_timestamp"
}
```

#### Extract Field

```json
{
  "transforms": "ExtractId",
  "transforms.ExtractId.type": "org.apache.kafka.connect.transforms.ExtractField$Key",
  "transforms.ExtractId.field": "id"
}
```

#### Value to Key

```json
{
  "transforms": "CopyIdToKey",
  "transforms.CopyIdToKey.type": "org.apache.kafka.connect.transforms.ValueToKey",
  "transforms.CopyIdToKey.fields": "id"
}
```

#### Custom Transform

```java
public class CustomTransform<R extends ConnectRecord<R>> implements Transformation<R> {
    @Override
    public R apply(R record) {
        // Transform logic
        return record;
    }

    @Override
    public ConfigDef config() {
        return new ConfigDef();
    }

    @Override
    public void close() {}
}
```

## REST API Management

### Managing Connectors

```bash
# List connectors
curl -X GET http://localhost:8083/connectors

# Create connector
curl -X POST -H "Content-Type: application/json" \
  --data @connector-config.json \
  http://localhost:8083/connectors

# Get connector config
curl -X GET http://localhost:8083/connectors/file-source/config

# Update connector
curl -X PUT -H "Content-Type: application/json" \
  --data @updated-config.json \
  http://localhost:8083/connectors/file-source/config

# Delete connector
curl -X DELETE http://localhost:8083/connectors/file-source

# Get connector status
curl -X GET http://localhost:8083/connectors/file-source/status

# Restart connector
curl -X POST http://localhost:8083/connectors/file-source/restart
```

### Task Management

```bash
# List tasks for connector
curl -X GET http://localhost:8083/connectors/file-source/tasks

# Get task status
curl -X GET http://localhost:8083/connectors/file-source/tasks/0/status

# Restart task
curl -X POST http://localhost:8083/connectors/file-source/tasks/0/restart
```

## Converters and Data Formats

### JSON Converter

```properties
key.converter=org.apache.kafka.connect.json.JsonConverter
value.converter=org.apache.kafka.connect.json.JsonConverter
key.converter.schemas.enable=true
value.converter.schemas.enable=true
```

### Avro Converter

```properties
key.converter=io.confluent.connect.avro.AvroConverter
value.converter=io.confluent.connect.avro.AvroConverter
key.converter.schema.registry.url=http://localhost:8081
value.converter.schema.registry.url=http://localhost:8081
```

### String Converter

```properties
key.converter=org.apache.kafka.connect.storage.StringConverter
value.converter=org.apache.kafka.connect.storage.StringConverter
```

## Error Handling

### Dead Letter Queue

```json
{
  "name": "error-handling-sink",
  "config": {
    "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
    "errors.tolerance": "all",
    "errors.deadletterqueue.topic.name": "dlq-topic",
    "errors.deadletterqueue.topic.replication.factor": 3,
    "errors.deadletterqueue.context.headers.enable": true
  }
}
```

### Retry and Logging

```json
{
  "config": {
    "errors.retry.timeout": "60000",
    "errors.retry.delay.max.ms": "60000",
    "errors.log.enable": "true",
    "errors.log.include.messages": "true"
  }
}
```

## Custom Connectors

### Source Connector Implementation

```java
public class CustomSourceConnector extends SourceConnector {
    @Override
    public void start(Map<String, String> props) {
        // Initialize connector
    }

    @Override
    public Class<? extends Task> taskClass() {
        return CustomSourceTask.class;
    }

    @Override
    public List<Map<String, String>> taskConfigs(int maxTasks) {
        // Return task configurations
        return Collections.singletonList(config);
    }

    @Override
    public void stop() {
        // Cleanup
    }

    @Override
    public ConfigDef config() {
        return new ConfigDef()
            .define("topic", Type.STRING, Importance.HIGH, "Target topic")
            .define("poll.interval.ms", Type.INT, 1000, Importance.MEDIUM, "Poll interval");
    }
}
```

### Source Task Implementation

```java
public class CustomSourceTask extends SourceTask {
    @Override
    public void start(Map<String, String> props) {
        // Initialize task
    }

    @Override
    public List<SourceRecord> poll() throws InterruptedException {
        // Fetch data and create SourceRecords
        List<SourceRecord> records = new ArrayList<>();

        // Create record
        SourceRecord record = new SourceRecord(
            sourcePartition,    // Source partition
            sourceOffset,       // Source offset
            topic,              // Target topic
            null,               // Target partition (null for auto)
            keySchema,          // Key schema
            key,                // Key
            valueSchema,        // Value schema
            value               // Value
        );

        records.add(record);
        return records;
    }

    @Override
    public void stop() {
        // Cleanup
    }
}
```

## Monitoring and Metrics

### Key Metrics

- **Connector Status**: Running, paused, failed
- **Task Status**: Running, failed, paused
- **Throughput**: Records per second
- **Lag**: Source lag for source connectors
- **Errors**: Error rates and types

### JMX Metrics

```java
// Access metrics programmatically
MBeanServer mbeanServer = ManagementFactory.getPlatformMBeanServer();
ObjectName objectName = new ObjectName("kafka.connect:type=connector-metrics,connector=*");

Set<ObjectName> names = mbeanServer.queryNames(objectName, null);
for (ObjectName name : names) {
    String connectorName = mbeanServer.getAttribute(name, "connector").toString();
    Long taskCount = (Long) mbeanServer.getAttribute(name, "task-count");
    // ... other metrics
}
```

## Best Practices

### 1. Configuration Management

```bash
# Use environment variables for sensitive data
export CONNECT_BOOTSTRAP_SERVERS=localhost:9092
export CONNECT_DB_PASSWORD=secret

# Reference in config
connection.password=${CONNECT_DB_PASSWORD}
```

### 2. Resource Allocation

```properties
# Allocate appropriate resources
tasks.max=3
max.poll.records=1000
batch.size=10000
```

### 3. Schema Management

```json
{
  "config": {
    "key.converter.schemas.enable": "true",
    "value.converter.schemas.enable": "true",
    "auto.register.schemas": "true",
    "use.latest.version": "true"
  }
}
```

### 4. Monitoring Setup

```json
{
  "config": {
    "metric.reporters": "io.confluent.connect.reporter.ConfluentMonitoringReporter",
    "confluent.monitoring.interceptor.topic": "_confluent-monitoring",
    "confluent.monitoring.interceptor.publish.ms": "10000"
  }
}
```

## Real-World Example: Database to Elasticsearch Pipeline

```json
// 1. JDBC Source (PostgreSQL)
{
  "name": "postgres-source",
  "config": {
    "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
    "connection.url": "jdbc:postgresql://localhost:5432/ecommerce",
    "table.whitelist": "products,orders",
    "mode": "timestamp",
    "timestamp.column.name": "updated_at",
    "topic.prefix": "db-",
    "transforms": "unwrap",
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState"
  }
}

// 2. Elasticsearch Sink
{
  "name": "elasticsearch-sink",
  "config": {
    "connector.class": "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector",
    "topics": "db-products,db-orders",
    "connection.url": "http://localhost:9200",
    "type.name": "_doc",
    "key.ignore": "true",
    "schema.ignore": "true",
    "behavior.on.malformed.documents": "warn",
    "transforms": "RenameField",
    "transforms.RenameField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
    "transforms.RenameField.renames": "id:product_id,name:product_name"
  }
}
```

## Troubleshooting Common Issues

### Connector Won't Start

```bash
# Check logs
tail -f /var/log/kafka/connect.log

# Validate configuration
curl -X PUT -H "Content-Type: application/json" \
  --data @config.json \
  http://localhost:8083/connector-plugins/JdbcSourceConnector/config/validate
```

### Performance Issues

```bash
# Monitor throughput
curl http://localhost:8083/connectors/jdbc-source/status

# Adjust batch settings
"batch.size": "10000",
"max.poll.records": "1000"
```

### Schema Evolution

```json
{
  "config": {
    "auto.evolve": "true",
    "evolve": "true",
    "errors.tolerance": "all"
  }
}
```

## What's Next?

In this comprehensive guide to Kafka Connect, we've covered:

- Source and sink connectors
- Configuration and deployment modes
- Single message transforms
- REST API management
- Custom connector development
- Error handling and monitoring
- Best practices and real-world examples

You should now be able to build reliable data integration pipelines with Kafka Connect.

In [Part 8]({% post_url 2025-12-17-schema-registry-governance %}), we'll explore Schema Registry and data governance - managing schemas, ensuring compatibility, and maintaining data quality.

## Additional Resources

- [Kafka Connect Documentation](https://kafka.apache.org/documentation/#connect)
- [Confluent Connect Guide](https://docs.confluent.io/platform/current/connect/index.html)
- [Connector Hub](https://www.confluent.io/hub/)
- [Debezium Documentation](https://debezium.io/documentation/)

---

*This is Part 7 of our comprehensive Apache Kafka series. [Part 6: Kafka Streams ←]({% post_url 2025-12-15-kafka-streams-processing %}) | [Part 8: Schema Registry →]({% post_url 2025-12-17-schema-registry-governance %})*