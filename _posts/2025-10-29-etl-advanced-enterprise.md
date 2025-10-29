---
layout: post
title: "Advanced ETL: Enterprise-Scale Data Pipelines and Real-Time Processing - Part 3: Advanced Level"
description: "Master advanced ETL concepts including real-time processing, ML integration, multi-cloud architectures, performance optimization, and enterprise governance."
tags:
  [
    etl,
    data-engineering,
    real-time-etl,
    machine-learning,
    kinesis,
    kafka,
    data-lake,
    enterprise-etl,
    performance-optimization,
    governance,
    tutorial,
    python,
    aws,
  ]
icon: 🚀
excerpt: >
  Advanced ETL guide covering real-time data processing, machine learning integration, enterprise architectures, performance optimization, and governance. Learn to build scalable, intelligent data pipelines for modern enterprises.
author: "owner"
date: 2025-10-29 16:00:00 +0000
categories: [Data Engineering, ETL, Advanced, Tutorial]
permalink: /posts/etl-advanced-enterprise/
---

## Introduction

Welcome to Part 3 of our comprehensive ETL series! In [Part 1](/posts/etl-fundamentals-basics/), we covered ETL basics, and in [Part 2](/posts/etl-aws-medium-level/), we explored AWS ETL services. Now we'll dive into **advanced ETL concepts** for enterprise-scale data processing.

This advanced guide covers real-time ETL, machine learning integration, complex architectures, performance optimization, and enterprise governance. These patterns are essential for building robust, scalable data platforms that can handle massive volumes and complex business requirements.

## Real-Time ETL with Streaming Data

Traditional batch ETL processes data at scheduled intervals, but modern applications require real-time insights. Let's explore streaming ETL architectures.

### AWS Kinesis-Based Real-Time ETL

```python
# kinesis_producer.py
import boto3
import json
from datetime import datetime
import time

class KinesisProducer:
    def __init__(self, stream_name, region='us-east-1'):
        self.kinesis = boto3.client('kinesis', region_name=region)
        self.stream_name = stream_name

    def put_record(self, data, partition_key):
        """Put a single record to Kinesis stream"""
        try:
            response = self.kinesis.put_record(
                StreamName=self.stream_name,
                Data=json.dumps(data),
                PartitionKey=partition_key
            )
            return response['SequenceNumber']
        except Exception as e:
            print(f"Error putting record: {e}")
            raise

    def put_records_batch(self, records):
        """Put multiple records in batch"""
        try:
            kinesis_records = []
            for record in records:
                kinesis_records.append({
                    'Data': json.dumps(record['data']),
                    'PartitionKey': record['partition_key']
                })

            response = self.kinesis.put_records(
                StreamName=self.stream_name,
                Records=kinesis_records
            )

            # Handle failed records
            if response['FailedRecordCount'] > 0:
                print(f"Failed to put {response['FailedRecordCount']} records")
                # Retry logic would go here

            return response

        except Exception as e:
            print(f"Error in batch put: {e}")
            raise

# Example usage for real-time customer events
producer = KinesisProducer('customer-events-stream')

# Simulate real-time customer interactions
customer_events = [
    {
        'data': {
            'event_type': 'page_view',
            'customer_id': '12345',
            'page_url': '/products/laptop',
            'timestamp': datetime.now().isoformat(),
            'user_agent': 'Mozilla/5.0...',
            'session_id': 'sess_abc123'
        },
        'partition_key': '12345'  # Use customer_id for partitioning
    },
    {
        'data': {
            'event_type': 'purchase',
            'customer_id': '12345',
            'product_id': 'P001',
            'quantity': 1,
            'amount': 999.99,
            'timestamp': datetime.now().isoformat()
        },
        'partition_key': '12345'
    }
]

producer.put_records_batch(customer_events)
```

### Kinesis Analytics for Real-Time Transformations

```sql
-- Kinesis Analytics SQL for real-time ETL
CREATE OR REPLACE STREAM "DESTINATION_SQL_STREAM" (
    customer_id VARCHAR(16),
    session_id VARCHAR(32),
    page_views INTEGER,
    total_amount DECIMAL(10,2),
    last_event_timestamp TIMESTAMP
);

CREATE OR REPLACE PUMP "STREAM_PUMP" AS
INSERT INTO "DESTINATION_SQL_STREAM"
SELECT STREAM
    customer_id,
    session_id,
    COUNT(*) as page_views,
    SUM(CASE WHEN event_type = 'purchase' THEN amount ELSE 0 END) as total_amount,
    MAX(event_timestamp) as last_event_timestamp
FROM "SOURCE_SQL_STREAM_001"
WHERE event_type IN ('page_view', 'purchase')
GROUP BY customer_id, session_id, FLOOR(("SOURCE_SQL_STREAM_001".ROWTIME - TIMESTAMP '1970-01-01 00:00:00') / 300000) * 300000;  -- 5-minute tumbling window
```

### Lambda for Stream Processing

```python
# kinesis_consumer.py
import json
import boto3
import base64
from decimal import Decimal
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3')

class KinesisProcessor:
    def __init__(self):
        self.customer_table = dynamodb.Table('customer_sessions')
        self.raw_data_bucket = 'raw-events-bucket'

    def process_records(self, event):
        """Process Kinesis records"""
        try:
            for record in event['Records']:
                # Decode the data
                data = json.loads(base64.b64decode(record['kinesis']['data']))

                # Process based on event type
                if data['event_type'] == 'page_view':
                    self.process_page_view(data)
                elif data['event_type'] == 'purchase':
                    self.process_purchase(data)

                # Archive raw data to S3
                self.archive_raw_data(data, record['kinesis']['sequenceNumber'])

        except Exception as e:
            logger.error(f"Error processing records: {e}")
            raise

    def process_page_view(self, data):
        """Process page view events"""
        try:
            # Update customer session in DynamoDB
            response = self.customer_table.update_item(
                Key={
                    'customer_id': data['customer_id'],
                    'session_id': data['session_id']
                },
                UpdateExpression='ADD page_views :incr SET last_activity = :time, #url = :url',
                ExpressionAttributeNames={
                    '#url': 'current_page'
                },
                ExpressionAttributeValues={
                    ':incr': 1,
                    ':time': data['timestamp'],
                    ':url': data['page_url']
                },
                ReturnValues='ALL_NEW'
            )

            logger.info(f"Updated page views for customer {data['customer_id']}")

        except Exception as e:
            logger.error(f"Error processing page view: {e}")

    def process_purchase(self, data):
        """Process purchase events"""
        try:
            # Update customer lifetime value
            response = self.customer_table.update_item(
                Key={
                    'customer_id': data['customer_id'],
                    'session_id': data['session_id']
                },
                UpdateExpression='ADD lifetime_value :amount, purchase_count :incr SET last_purchase = :time',
                ExpressionAttributeValues={
                    ':amount': Decimal(str(data['amount'])),
                    ':incr': 1,
                    ':time': data['timestamp']
                },
                ReturnValues='ALL_NEW'
            )

            # Trigger downstream processes (e.g., inventory update, notifications)
            self.trigger_purchase_workflows(data)

            logger.info(f"Processed purchase for customer {data['customer_id']}: ${data['amount']}")

        except Exception as e:
            logger.error(f"Error processing purchase: {e}")

    def trigger_purchase_workflows(self, data):
        """Trigger downstream workflows"""
        # Send to Step Functions for order fulfillment
        step_functions = boto3.client('stepfunctions')
        step_functions.start_execution(
            stateMachineArn='arn:aws:states:us-east-1:123456789012:stateMachine:order-fulfillment',
            name=f"order-{data['customer_id']}-{int(time.time())}",
            input=json.dumps(data)
        )

    def archive_raw_data(self, data, sequence_number):
        """Archive raw data to S3 for compliance and reprocessing"""
        try:
            key = f"raw-events/{data['event_type']}/{data['customer_id']}/{sequence_number}.json"

            s3_client.put_object(
                Bucket=self.raw_data_bucket,
                Key=key,
                Body=json.dumps(data),
                Metadata={
                    'event_type': data['event_type'],
                    'customer_id': data['customer_id'],
                    'timestamp': data['timestamp']
                }
            )

        except Exception as e:
            logger.error(f"Error archiving data: {e}")

def lambda_handler(event, context):
    """Main Lambda handler"""
    processor = KinesisProcessor()
    processor.process_records(event)

    return {
        'statusCode': 200,
        'body': json.dumps('Records processed successfully')
    }
```

## Machine Learning Integration in ETL

Modern ETL pipelines increasingly incorporate machine learning for intelligent data processing.

### ML-Powered Data Quality

```python
# ml_data_quality.py
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import boto3
from io import BytesIO

class MLDataQualityChecker:
    def __init__(self, model_bucket='ml-models-bucket'):
        self.s3_client = boto3.client('s3')
        self.model_bucket = model_bucket
        self.models = {}

    def train_anomaly_detector(self, historical_data, feature_columns):
        """Train anomaly detection model"""
        # Prepare features
        features = historical_data[feature_columns].fillna(0)

        # Scale features
        scaler = StandardScaler()
        scaled_features = scaler.fit_transform(features)

        # Train Isolation Forest
        model = IsolationForest(
            contamination=0.1,  # Expected percentage of anomalies
            random_state=42,
            n_estimators=100
        )
        model.fit(scaled_features)

        # Save model and scaler
        model_key = 'anomaly_detector.joblib'
        scaler_key = 'feature_scaler.joblib'

        self.save_model(model, model_key)
        self.save_model(scaler, scaler_key)

        return model, scaler

    def detect_anomalies(self, new_data, feature_columns):
        """Detect anomalies in new data"""
        try:
            # Load models
            model = self.load_model('anomaly_detector.joblib')
            scaler = self.load_model('feature_scaler.joblib')

            # Prepare features
            features = new_data[feature_columns].fillna(0)
            scaled_features = scaler.transform(features)

            # Predict anomalies
            anomaly_scores = model.decision_function(scaled_features)
            predictions = model.predict(scaled_features)

            # Add results to dataframe
            new_data = new_data.copy()
            new_data['anomaly_score'] = anomaly_scores
            new_data['is_anomaly'] = predictions == -1  # -1 indicates anomaly

            return new_data

        except Exception as e:
            print(f"Error in anomaly detection: {e}")
            # Return data with default anomaly flags
            new_data = new_data.copy()
            new_data['anomaly_score'] = 0
            new_data['is_anomaly'] = False
            return new_data

    def save_model(self, model, key):
        """Save model to S3"""
        buffer = BytesIO()
        joblib.dump(model, buffer)
        buffer.seek(0)

        self.s3_client.put_object(
            Bucket=self.model_bucket,
            Key=key,
            Body=buffer.getvalue()
        )

    def load_model(self, key):
        """Load model from S3"""
        response = self.s3_client.get_object(Bucket=self.model_bucket, Key=key)
        buffer = BytesIO(response['Body'].read())
        return joblib.load(buffer)

# Usage in ETL pipeline
def ml_enhanced_etl_pipeline(raw_data):
    """ETL pipeline with ML-powered data quality"""

    # Initialize ML quality checker
    quality_checker = MLDataQualityChecker()

    # Define features for anomaly detection
    feature_columns = ['amount', 'quantity', 'customer_age', 'purchase_frequency']

    # Check for anomalies
    data_with_quality = quality_checker.detect_anomalies(
        raw_data, feature_columns
    )

    # Filter out anomalies or flag them
    clean_data = data_with_quality[~data_with_quality['is_anomaly']].copy()
    anomalous_data = data_with_quality[data_with_quality['is_anomaly']].copy()

    # Log anomalies for investigation
    if not anomalous_data.empty:
        print(f"Detected {len(anomalous_data)} anomalous records")
        # Could send to separate processing pipeline or alert

    return clean_data
```

### Predictive ETL with ML Models

```python
# predictive_etl.py
import boto3
import json
import pandas as pd
from datetime import datetime, timedelta
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

class PredictiveETLProcessor:
    def __init__(self):
        self.sagemaker_runtime = boto3.client('sagemaker-runtime')
        self.endpoint_name = 'customer-churn-predictor'

    def enrich_with_predictions(self, customer_data):
        """Enrich customer data with ML predictions"""

        enriched_data = customer_data.copy()

        # Prepare data for ML model
        features_for_prediction = self.prepare_features_for_ml(customer_data)

        # Get predictions from SageMaker endpoint
        predictions = self.get_predictions(features_for_prediction)

        # Add predictions to data
        enriched_data['churn_probability'] = predictions
        enriched_data['churn_risk'] = pd.cut(
            predictions,
            bins=[0, 0.3, 0.7, 1.0],
            labels=['Low', 'Medium', 'High']
        )

        # Add predictive insights
        enriched_data['predicted_lifetime_value'] = self.calculate_predicted_ltv(
            customer_data, predictions
        )

        return enriched_data

    def prepare_features_for_ml(self, data):
        """Prepare features for ML model"""
        # This would include feature engineering specific to your model
        features = data[[
            'age', 'tenure_months', 'monthly_spend',
            'support_tickets', 'login_frequency', 'last_login_days'
        ]].fillna(0)

        return features.values.tolist()

    def get_predictions(self, features):
        """Get predictions from SageMaker"""
        predictions = []

        for feature_set in features:
            try:
                # Call SageMaker endpoint
                response = self.sagemaker_runtime.invoke_endpoint(
                    EndpointName=self.endpoint_name,
                    ContentType='application/json',
                    Body=json.dumps({'features': feature_set})
                )

                # Parse prediction
                result = json.loads(response['Body'].read().decode())
                predictions.append(result['churn_probability'])

            except Exception as e:
                logger.error(f"Error getting prediction: {e}")
                predictions.append(0.5)  # Default prediction

        return predictions

    def calculate_predicted_ltv(self, customer_data, churn_probabilities):
        """Calculate predicted lifetime value"""
        # Simple LTV calculation: current_monthly_spend * (1 / churn_probability) * 12
        # More sophisticated models would use proper LTV formulas

        ltv_predictions = []
        for idx, row in customer_data.iterrows():
            churn_prob = churn_probabilities[idx]
            monthly_spend = row.get('monthly_spend', 0)

            if churn_prob > 0:
                predicted_ltv = (monthly_spend / churn_prob) * 12
            else:
                predicted_ltv = monthly_spend * 24  # Assume 2 years for very low churn risk

            ltv_predictions.append(min(predicted_ltv, 10000))  # Cap at reasonable maximum

        return ltv_predictions

# Integration with ETL pipeline
def predictive_etl_pipeline(customer_data):
    """ETL pipeline with predictive capabilities"""

    processor = PredictiveETLProcessor()

    # Standard ETL transformations
    transformed_data = standard_etl_transformations(customer_data)

    # Add ML predictions
    enriched_data = processor.enrich_with_predictions(transformed_data)

    # Route data based on predictions
    high_risk_customers = enriched_data[enriched_data['churn_risk'] == 'High']
    medium_risk_customers = enriched_data[enriched_data['churn_risk'] == 'Medium']

    # Trigger retention campaigns for high-risk customers
    if not high_risk_customers.empty:
        trigger_retention_campaign(high_risk_customers)

    return enriched_data

def trigger_retention_campaign(customers):
    """Trigger retention campaign for high-risk customers"""
    # This could integrate with marketing automation systems
    logger.info(f"Triggering retention campaign for {len(customers)} high-risk customers")

    # Example: Send to marketing automation platform
    # marketing_api.send_campaign('churn_prevention', customers['customer_id'].tolist())
```

## Enterprise ETL Architectures

### Lambda Architecture

```python
# lambda_architecture.py
import boto3
import json
from datetime import datetime
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

class LambdaArchitectureETL:
    """
    Lambda Architecture for ETL:
    - Speed Layer: Real-time processing (Kinesis + Lambda)
    - Batch Layer: Batch processing (Glue/Spark)
    - Serving Layer: Query serving (Redshift/S3)
    """

    def __init__(self):
        self.kinesis = boto3.client('kinesis')
        self.glue = boto3.client('glue')
        self.redshift = boto3.client('redshift-data')

    def speed_layer_processing(self, event):
        """Real-time processing for immediate insights"""
        try:
            for record in event['Records']:
                data = json.loads(record['kinesis']['data'].decode('utf-8'))

                # Real-time aggregations
                real_time_metrics = self.calculate_real_time_metrics(data)

                # Store in Redis/ElastiCache for real-time queries
                self.store_real_time_metrics(real_time_metrics)

                # Also send to batch layer for later reconciliation
                self.send_to_batch_layer(data)

        except Exception as e:
            logger.error(f"Speed layer processing error: {e}")
            raise

    def batch_layer_processing(self):
        """Batch processing for comprehensive analytics"""
        try:
            # Run Glue ETL job for batch processing
            response = self.glue.start_job_run(
                JobName='batch-analytics-etl',
                Arguments={
                    '--process_date': datetime.now().strftime('%Y-%m-%d')
                }
            )

            logger.info(f"Started batch ETL job: {response['JobRunId']}")

        except Exception as e:
            logger.error(f"Batch layer processing error: {e}")
            raise

    def serving_layer_query(self, query):
        """Query serving layer for analytics"""
        try:
            response = self.redshift.execute_statement(
                ClusterIdentifier='analytics-cluster',
                Database='analytics',
                Sql=query
            )

            # Get query results
            result = self.redshift.get_statement_result(
                Id=response['Id']
            )

            return result['Records']

        except Exception as e:
            logger.error(f"Serving layer query error: {e}")
            raise

    def calculate_real_time_metrics(self, data):
        """Calculate real-time metrics"""
        # Example: Real-time customer behavior metrics
        metrics = {
            'customer_id': data.get('customer_id'),
            'event_type': data.get('event_type'),
            'timestamp': datetime.now().isoformat(),
            'metrics': {}
        }

        if data.get('event_type') == 'purchase':
            metrics['metrics'] = {
                'revenue': data.get('amount', 0),
                'items_purchased': data.get('quantity', 0)
            }

        return metrics

    def store_real_time_metrics(self, metrics):
        """Store real-time metrics in Redis/ElastiCache"""
        # Implementation would use Redis client
        # redis_client.hset(f"customer:{metrics['customer_id']}", mapping=metrics['metrics'])
        pass

    def send_to_batch_layer(self, data):
        """Send data to batch layer for processing"""
        # Could send to S3 for batch processing or directly to batch queue
        # s3_client.put_object(Bucket='batch-data-bucket', Key=f"events/{data['id']}.json", Body=json.dumps(data))
        pass

    def reconcile_layers(self):
        """Reconcile speed and batch layers periodically"""
        # This would combine real-time and batch views for consistency
        # Typically runs every few hours
        pass
```

### Data Mesh Architecture

```python
# data_mesh_etl.py
import boto3
import json
from typing import Dict, List
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

class DataMeshETL:
    """
    Data Mesh ETL: Domain-oriented, self-serve data platform
    - Each domain owns its data products
    - Federated governance
    - Self-serve data infrastructure
    """

    def __init__(self):
        self.lakeformation = boto3.client('lakeformation')
        self.glue = boto3.client('glue')
        self.domains = {}

    def register_data_domain(self, domain_name: str, domain_config: Dict):
        """Register a new data domain"""
        try:
            self.domains[domain_name] = domain_config

            # Create domain-specific database
            self.glue.create_database(
                DatabaseInput={
                    'Name': f"{domain_name}_domain",
                    'Description': domain_config.get('description', ''),
                    'LocationUri': domain_config.get('s3_location')
                }
            )

            # Set up domain permissions
            self.setup_domain_permissions(domain_name, domain_config)

            logger.info(f"Registered data domain: {domain_name}")

        except Exception as e:
            logger.error(f"Error registering domain {domain_name}: {e}")
            raise

    def setup_domain_permissions(self, domain_name: str, domain_config: Dict):
        """Set up Lake Formation permissions for domain"""
        try:
            # Grant domain admin permissions
            self.lakeformation.grant_permissions(
                Principal={
                    'DataLakePrincipalIdentifier': domain_config['admin_role_arn']
                },
                Resource={
                    'Database': {
                        'Name': f"{domain_name}_domain"
                    }
                },
                Permissions=['ALL'],
                PermissionsWithGrantOption=['ALL']
            )

            # Grant consumer permissions
            for consumer in domain_config.get('consumers', []):
                self.lakeformation.grant_permissions(
                    Principal={
                        'DataLakePrincipalIdentifier': consumer['role_arn']
                    },
                    Resource={
                        'Database': {
                            'Name': f"{domain_name}_domain"
                        }
                    },
                    Permissions=consumer.get('permissions', ['SELECT'])
                )

        except Exception as e:
            logger.error(f"Error setting up domain permissions: {e}")
            raise

    def publish_data_product(self, domain_name: str, product_name: str, data: pd.DataFrame):
        """Publish a data product from a domain"""
        try:
            domain_config = self.domains[domain_name]
            s3_location = f"{domain_config['s3_location']}/products/{product_name}/"

            # Write data to domain's S3 location
            data.to_parquet(
                f"s3://{s3_location}/data.parquet",
                index=False
            )

            # Register as Glue table
            self.register_data_product_table(domain_name, product_name, s3_location, data)

            # Update data catalog
            self.update_data_catalog(domain_name, product_name, {
                'schema': data.dtypes.to_dict(),
                'row_count': len(data),
                'last_updated': datetime.now().isoformat(),
                'quality_score': self.calculate_data_quality_score(data)
            })

            logger.info(f"Published data product: {domain_name}.{product_name}")

        except Exception as e:
            logger.error(f"Error publishing data product: {e}")
            raise

    def register_data_product_table(self, domain_name: str, product_name: str,
                                  s3_location: str, data: pd.DataFrame):
        """Register data product as Glue table"""
        try:
            # Create table schema from DataFrame
            columns = []
            for col, dtype in data.dtypes.items():
                glue_type = self.pandas_to_glue_type(dtype)
                columns.append({
                    'Name': col,
                    'Type': glue_type
                })

            self.glue.create_table(
                DatabaseName=f"{domain_name}_domain",
                TableInput={
                    'Name': product_name,
                    'StorageDescriptor': {
                        'Columns': columns,
                        'Location': f"s3://{s3_location}",
                        'InputFormat': 'org.apache.hadoop.mapred.TextInputFormat',
                        'OutputFormat': 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat',
                        'SerdeInfo': {
                            'SerializationLibrary': 'org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe'
                        }
                    },
                    'Parameters': {
                        'classification': 'parquet',
                        'typeOfData': 'file'
                    }
                }
            )

        except Exception as e:
            logger.error(f"Error registering table: {e}")
            raise

    def pandas_to_glue_type(self, pandas_type) -> str:
        """Convert pandas dtype to Glue type"""
        type_mapping = {
            'int64': 'bigint',
            'float64': 'double',
            'object': 'string',
            'bool': 'boolean',
            'datetime64[ns]': 'timestamp'
        }
        return type_mapping.get(str(pandas_type), 'string')

    def calculate_data_quality_score(self, data: pd.DataFrame) -> float:
        """Calculate data quality score"""
        quality_checks = [
            1 - (data.isnull().sum().sum() / (len(data) * len(data.columns))),  # Completeness
            len(data.drop_duplicates()) / len(data),  # Uniqueness
            # Add more quality checks as needed
        ]

        return sum(quality_checks) / len(quality_checks)

    def update_data_catalog(self, domain_name: str, product_name: str, metadata: Dict):
        """Update domain data catalog"""
        # This would typically use a metadata store like Amundsen or custom solution
        # For simplicity, we'll use DynamoDB
        dynamodb = boto3.resource('dynamodb')
        catalog_table = dynamodb.Table('data_product_catalog')

        catalog_table.put_item(
            Item={
                'domain_product': f"{domain_name}.{product_name}",
                'domain': domain_name,
                'product': product_name,
                'metadata': metadata,
                'last_updated': datetime.now().isoformat()
            }
        )

    def discover_data_products(self, domain_filter: str = None) -> List[Dict]:
        """Discover available data products"""
        dynamodb = boto3.resource('dynamodb')
        catalog_table = dynamodb.Table('data_product_catalog')

        if domain_filter:
            response = catalog_table.scan(
                FilterExpression=boto3.dynamodb.conditions.Attr('domain').eq(domain_filter)
            )
        else:
            response = catalog_table.scan()

        return response['Items']
```

## Performance Optimization

### Parallel Processing and Scaling

```python
# parallel_etl.py
import concurrent.futures
import multiprocessing
from typing import List, Dict, Any
import pandas as pd
import boto3
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

class ParallelETLProcessor:
    def __init__(self, max_workers: int = None):
        self.max_workers = max_workers or multiprocessing.cpu_count()
        self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers)

    def parallel_extract(self, sources: List[Dict]) -> Dict[str, pd.DataFrame]:
        """Extract data from multiple sources in parallel"""
        logger.info(f"Starting parallel extraction with {self.max_workers} workers")

        # Submit extraction tasks
        future_to_source = {}
        for source in sources:
            future = self.executor.submit(self.extract_single_source, source)
            future_to_source[future] = source

        # Collect results
        results = {}
        for future in concurrent.futures.as_completed(future_to_source):
            source = future_to_source[future]
            try:
                table_name, data = future.result()
                results[table_name] = data
                logger.info(f"Extracted {len(data)} rows from {source['name']}")
            except Exception as e:
                logger.error(f"Extraction failed for {source['name']}: {e}")

        return results

    def extract_single_source(self, source: Dict) -> tuple:
        """Extract data from a single source"""
        source_type = source['type']
        table_name = source['name']

        if source_type == 's3':
            return table_name, self.extract_from_s3(source)
        elif source_type == 'rds':
            return table_name, self.extract_from_rds(source)
        elif source_type == 'api':
            return table_name, self.extract_from_api(source)
        else:
            raise ValueError(f"Unsupported source type: {source_type}")

    def extract_from_s3(self, source: Dict) -> pd.DataFrame:
        """Extract data from S3"""
        s3_client = boto3.client('s3')

        # List objects
        response = s3_client.list_objects_v2(
            Bucket=source['bucket'],
            Prefix=source['prefix']
        )

        all_data = []
        for obj in response.get('Contents', []):
            # Read Parquet file
            s3_path = f"s3://{source['bucket']}/{obj['Key']}"
            df = pd.read_parquet(s3_path)
            all_data.append(df)

        return pd.concat(all_data, ignore_index=True) if all_data else pd.DataFrame()

    def extract_from_rds(self, source: Dict) -> pd.DataFrame:
        """Extract data from RDS"""
        # Implementation for RDS extraction
        pass

    def extract_from_api(self, source: Dict) -> pd.DataFrame:
        """Extract data from API"""
        # Implementation for API extraction
        pass

    def parallel_transform(self, data_dict: Dict[str, pd.DataFrame],
                          transformations: Dict[str, callable]) -> Dict[str, pd.DataFrame]:
        """Apply transformations in parallel"""
        logger.info("Starting parallel transformations")

        future_to_table = {}
        for table_name, data in data_dict.items():
            if table_name in transformations:
                future = self.executor.submit(
                    transformations[table_name], data
                )
                future_to_table[future] = table_name

        # Collect results
        results = data_dict.copy()  # Include untransformed data
        for future in concurrent.futures.as_completed(future_to_table):
            table_name = future_to_table[future]
            try:
                transformed_data = future.result()
                results[table_name] = transformed_data
                logger.info(f"Transformed {len(transformed_data)} rows for {table_name}")
            except Exception as e:
                logger.error(f"Transformation failed for {table_name}: {e}")

        return results

    def parallel_load(self, data_dict: Dict[str, pd.DataFrame],
                     destinations: Dict[str, Dict]) -> List[str]:
        """Load data to multiple destinations in parallel"""
        logger.info("Starting parallel loading")

        future_to_table = {}
        for table_name, data in data_dict.items():
            if table_name in destinations:
                future = self.executor.submit(
                    self.load_single_table, table_name, data, destinations[table_name]
                )
                future_to_table[future] = table_name

        # Collect results
        results = []
        for future in concurrent.futures.as_completed(future_to_table):
            table_name = future_to_table[future]
            try:
                result = future.result()
                results.append(result)
                logger.info(f"Loaded {table_name}: {result}")
            except Exception as e:
                logger.error(f"Loading failed for {table_name}: {e}")
                results.append(f"FAILED: {table_name}")

        return results

    def load_single_table(self, table_name: str, data: pd.DataFrame,
                         destination: Dict) -> str:
        """Load data to a single destination"""
        dest_type = destination['type']

        if dest_type == 'redshift':
            return self.load_to_redshift(table_name, data, destination)
        elif dest_type == 's3':
            return self.load_to_s3(table_name, data, destination)
        else:
            raise ValueError(f"Unsupported destination type: {dest_type}")

    def load_to_redshift(self, table_name: str, data: pd.DataFrame,
                        destination: Dict) -> str:
        """Load data to Redshift"""
        # Implementation for Redshift loading
        pass

    def load_to_s3(self, table_name: str, data: pd.DataFrame,
                  destination: Dict) -> str:
        """Load data to S3"""
        s3_client = boto3.client('s3')

        # Write as Parquet
        import io
        buffer = io.BytesIO()
        data.to_parquet(buffer, index=False)
        buffer.seek(0)

        key = f"{destination['prefix']}/{table_name}.parquet"
        s3_client.put_object(
            Bucket=destination['bucket'],
            Key=key,
            Body=buffer.getvalue()
        )

        return f"Loaded {len(data)} rows to s3://{destination['bucket']}/{key}"

    def shutdown(self):
        """Shutdown the executor"""
        self.executor.shutdown(wait=True)

# Usage example
def run_parallel_etl():
    """Run complete parallel ETL pipeline"""
    processor = ParallelETLProcessor(max_workers=8)

    try:
        # Define sources
        sources = [
            {
                'name': 'customers',
                'type': 's3',
                'bucket': 'raw-data-bucket',
                'prefix': 'customers/'
            },
            {
                'name': 'products',
                'type': 's3',
                'bucket': 'raw-data-bucket',
                'prefix': 'products/'
            },
            {
                'name': 'orders',
                'type': 'rds',
                'connection': 'postgresql://...',
                'query': 'SELECT * FROM orders WHERE created_date >= CURRENT_DATE - 1'
            }
        ]

        # Extract
        raw_data = processor.parallel_extract(sources)

        # Define transformations
        transformations = {
            'customers': lambda df: df.fillna({'name': 'Unknown'}).assign(
                customer_segment=lambda x: pd.cut(x['total_spend'],
                                                bins=[0, 100, 1000, float('inf')],
                                                labels=['Low', 'Medium', 'High'])
            ),
            'products': lambda df: df.fillna({'category': 'Uncategorized'}).assign(
                price_category=lambda x: pd.cut(x['price'],
                                              bins=[0, 50, 200, float('inf')],
                                              labels=['Budget', 'Mid-range', 'Premium'])
            )
        }

        # Transform
        transformed_data = processor.parallel_transform(raw_data, transformations)

        # Define destinations
        destinations = {
            'customers': {
                'type': 'redshift',
                'table': 'dim_customers',
                'connection': 'redshift://...'
            },
            'products': {
                'type': 's3',
                'bucket': 'processed-data-bucket',
                'prefix': 'dimensions/products'
            }
        }

        # Load
        load_results = processor.parallel_load(transformed_data, destinations)

        logger.info(f"ETL completed. Results: {load_results}")

    finally:
        processor.shutdown()
```

### Memory Optimization

```python
# memory_optimized_etl.py
import pandas as pd
import dask.dataframe as dd
from typing import Iterator, Dict, Any
import gc

class MemoryOptimizedETL:
    def __init__(self, chunk_size: int = 100000):
        self.chunk_size = chunk_size

    def process_large_file_chunked(self, file_path: str,
                                 transformation_func: callable,
                                 output_path: str):
        """Process large files in chunks to manage memory"""
        print(f"Processing {file_path} in chunks of {self.chunk_size}")

        # Use pandas chunked reading
        chunks = pd.read_csv(file_path, chunksize=self.chunk_size)
        processed_chunks = []

        for i, chunk in enumerate(chunks):
            print(f"Processing chunk {i+1}")

            # Apply transformation
            processed_chunk = transformation_func(chunk)

            # Write chunk to temporary file or accumulate
            processed_chunks.append(processed_chunk)

            # Force garbage collection
            gc.collect()

            # Optional: Write intermediate results
            if len(processed_chunks) >= 10:  # Write every 10 chunks
                self.write_intermediate_results(processed_chunks, output_path, i)
                processed_chunks = []

        # Write final results
        if processed_chunks:
            self.write_intermediate_results(processed_chunks, output_path, 'final')

    def process_with_dask(self, file_pattern: str,
                         transformation_func: callable) -> dd.DataFrame:
        """Process large datasets using Dask for distributed computing"""
        # Read data with Dask
        df = dd.read_csv(file_pattern)

        # Apply transformations (lazy evaluation)
        transformed_df = transformation_func(df)

        return transformed_df

    def streaming_json_processing(self, json_file_path: str,
                                processing_func: callable):
        """Process large JSON files in streaming fashion"""
        import json

        with open(json_file_path, 'r') as f:
            # For JSON Lines format
            for line_num, line in enumerate(f):
                try:
                    record = json.loads(line.strip())
                    processed_record = processing_func(record)

                    # Yield or process individual records
                    yield processed_record

                    # Periodic cleanup
                    if line_num % 10000 == 0:
                        gc.collect()

                except json.JSONDecodeError as e:
                    print(f"Error parsing line {line_num}: {e}")
                    continue

    def optimize_dataframe_dtypes(self, df: pd.DataFrame) -> pd.DataFrame:
        """Optimize DataFrame memory usage by adjusting dtypes"""
        optimized_df = df.copy()

        for col in optimized_df.columns:
            col_type = optimized_df[col].dtype

            if col_type == 'object':
                # Try to convert to category if low cardinality
                if optimized_df[col].nunique() / len(optimized_df) < 0.5:
                    optimized_df[col] = optimized_df[col].astype('category')
            elif col_type == 'int64':
                # Downcast integers
                optimized_df[col] = pd.to_numeric(optimized_df[col], downcast='integer')
            elif col_type == 'float64':
                # Downcast floats
                optimized_df[col] = pd.to_numeric(optimized_df[col], downcast='float')

        return optimized_df

    def write_intermediate_results(self, chunks: list, output_path: str, suffix: str):
        """Write intermediate results to disk"""
        combined_chunk = pd.concat(chunks, ignore_index=True)

        # Optimize memory before writing
        combined_chunk = self.optimize_dataframe_dtypes(combined_chunk)

        # Write to Parquet for efficient storage
        output_file = f"{output_path}/chunk_{suffix}.parquet"
        combined_chunk.to_parquet(output_file, index=False)

        print(f"Wrote {len(combined_chunk)} rows to {output_file}")

        # Clear memory
        del combined_chunk
        gc.collect()
```

## Enterprise Governance and Compliance

### Data Lineage Tracking

```python
# data_lineage.py
import boto3
import json
from datetime import datetime
from typing import Dict, List, Any
import uuid

class DataLineageTracker:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb')
        self.lineage_table = self.dynamodb.Table('data_lineage')

    def start_etl_run(self, pipeline_name: str, run_config: Dict) -> str:
        """Start tracking an ETL run"""
        run_id = str(uuid.uuid4())

        lineage_record = {
            'run_id': run_id,
            'pipeline_name': pipeline_name,
            'start_time': datetime.now().isoformat(),
            'status': 'RUNNING',
            'config': run_config,
            'lineage_events': []
        }

        self.lineage_table.put_item(Item=lineage_record)
        return run_id

    def log_lineage_event(self, run_id: str, event_type: str,
                         source_tables: List[str], target_tables: List[str],
                         transformation: str, record_count: int):
        """Log a lineage event"""
        event = {
            'event_id': str(uuid.uuid4()),
            'timestamp': datetime.now().isoformat(),
            'event_type': event_type,
            'source_tables': source_tables,
            'target_tables': target_tables,
            'transformation': transformation,
            'record_count': record_count
        }

        # Update the lineage record
        self.lineage_table.update_item(
            Key={'run_id': run_id},
            UpdateExpression='SET lineage_events = list_append(lineage_events, :event)',
            ExpressionAttributeValues={
                ':event': [event]
            }
        )

    def complete_etl_run(self, run_id: str, status: str, metrics: Dict):
        """Complete an ETL run"""
        self.lineage_table.update_item(
            Key={'run_id': run_id},
            UpdateExpression='SET #status = :status, end_time = :end_time, metrics = :metrics',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':status': status,
                ':end_time': datetime.now().isoformat(),
                ':metrics': metrics
            }
        )

    def get_lineage_history(self, table_name: str) -> List[Dict]:
        """Get lineage history for a table"""
        # Query for all runs that affected this table
        response = self.lineage_table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr('lineage_events').contains(table_name)
        )

        return response['Items']

    def get_data_dependencies(self, table_name: str) -> Dict[str, List[str]]:
        """Get upstream and downstream dependencies"""
        upstream = set()
        downstream = set()

        # Scan all lineage records
        response = self.lineage_table.scan()

        for item in response['Items']:
            for event in item.get('lineage_events', []):
                if table_name in event.get('target_tables', []):
                    upstream.update(event.get('source_tables', []))
                if table_name in event.get('source_tables', []):
                    downstream.update(event.get('target_tables', []))

        return {
            'upstream': list(upstream),
            'downstream': list(downstream)
        }

# Usage in ETL pipeline
def lineage_tracked_etl():
    """ETL pipeline with comprehensive lineage tracking"""
    tracker = DataLineageTracker()

    # Start run
    run_id = tracker.start_etl_run('customer_analytics_pipeline', {
        'source_systems': ['CRM', 'ERP'],
        'target_system': 'data_warehouse'
    })

    try:
        # Extract phase
        tracker.log_lineage_event(
            run_id, 'EXTRACT', [], ['raw_customers', 'raw_orders'],
            'Extract from CRM and ERP systems', 10000
        )

        # Transform phase
        tracker.log_lineage_event(
            run_id, 'TRANSFORM',
            ['raw_customers', 'raw_orders'],
            ['dim_customers', 'fact_orders'],
            'Clean data, join tables, calculate metrics', 9500
        )

        # Load phase
        tracker.log_lineage_event(
            run_id, 'LOAD',
            ['dim_customers', 'fact_orders'],
            ['dw.dim_customers', 'dw.fact_orders'],
            'Load to data warehouse with SCD Type 2', 9500
        )

        # Complete successfully
        tracker.complete_etl_run(run_id, 'SUCCESS', {
            'total_processed': 9500,
            'success_rate': 0.95,
            'duration_seconds': 360
        })

    except Exception as e:
        # Complete with failure
        tracker.complete_etl_run(run_id, 'FAILED', {
            'error': str(e),
            'partial_completion': True
        })
        raise
```

### Data Quality Monitoring

```python
# data_quality_monitor.py
import pandas as pd
import json
import boto3
from datetime import datetime
from typing import Dict, List, Any

class DataQualityMonitor:
    def __init__(self):
        self.cloudwatch = boto3.client('cloudwatch')
        self.sns = boto3.client('sns')
        self.quality_rules = {}

    def define_quality_rules(self, table_name: str, rules: Dict):
        """Define quality rules for a table"""
        self.quality_rules[table_name] = rules

    def assess_data_quality(self, table_name: str, df: pd.DataFrame) -> Dict[str, Any]:
        """Assess data quality against defined rules"""
        if table_name not in self.quality_rules:
            return {'score': 1.0, 'issues': []}

        rules = self.quality_rules[table_name]
        issues = []
        total_checks = 0
        passed_checks = 0

        # Completeness checks
        if 'completeness' in rules:
            for column, threshold in rules['completeness'].items():
                if column in df.columns:
                    completeness = 1 - (df[column].isnull().sum() / len(df))
                    total_checks += 1
                    if completeness >= threshold:
                        passed_checks += 1
                    else:
                        issues.append({
                            'type': 'completeness',
                            'column': column,
                            'actual': completeness,
                            'required': threshold
                        })

        # Uniqueness checks
        if 'uniqueness' in rules:
            for column in rules['uniqueness']:
                if column in df.columns:
                    uniqueness = df[column].nunique() / len(df)
                    total_checks += 1
                    if uniqueness >= 0.95:  # 95% unique
                        passed_checks += 1
                    else:
                        issues.append({
                            'type': 'uniqueness',
                            'column': column,
                            'actual': uniqueness
                        })

        # Validity checks
        if 'validity' in rules:
            for column, pattern in rules['validity'].items():
                if column in df.columns:
                    import re
                    valid_count = df[column].astype(str).str.match(pattern).sum()
                    validity = valid_count / len(df)
                    total_checks += 1
                    if validity >= 0.95:  # 95% valid
                        passed_checks += 1
                    else:
                        issues.append({
                            'type': 'validity',
                            'column': column,
                            'actual': validity
                        })

        # Range checks
        if 'ranges' in rules:
            for column, (min_val, max_val) in rules['ranges'].items():
                if column in df.columns:
                    in_range = df[column].between(min_val, max_val).sum()
                    range_score = in_range / len(df)
                    total_checks += 1
                    if range_score >= 0.95:
                        passed_checks += 1
                    else:
                        issues.append({
                            'type': 'range',
                            'column': column,
                            'actual': range_score
                        })

        quality_score = passed_checks / total_checks if total_checks > 0 else 1.0

        return {
            'score': quality_score,
            'total_checks': total_checks,
            'passed_checks': passed_checks,
            'issues': issues
        }

    def report_quality_metrics(self, table_name: str, quality_result: Dict):
        """Report quality metrics to CloudWatch"""
        self.cloudwatch.put_metric_data(
            Namespace='DataQuality',
            MetricData=[
                {
                    'MetricName': 'QualityScore',
                    'Dimensions': [
                        {
                            'Name': 'TableName',
                            'Value': table_name
                        }
                    ],
                    'Value': quality_result['score'],
                    'Unit': 'None',
                    'Timestamp': datetime.now()
                },
                {
                    'MetricName': 'QualityIssues',
                    'Dimensions': [
                        {
                            'Name': 'TableName',
                            'Value': table_name
                        }
                    ],
                    'Value': len(quality_result['issues']),
                    'Unit': 'Count',
                    'Timestamp': datetime.now()
                }
            ]
        )

    def alert_on_quality_issues(self, table_name: str, quality_result: Dict):
        """Send alerts for quality issues"""
        if quality_result['score'] < 0.8 or quality_result['issues']:
            message = f"""
Data Quality Alert for {table_name}

Quality Score: {quality_result['score']:.2%}
Issues Found: {len(quality_result['issues'])}

Top Issues:
{json.dumps(quality_result['issues'][:5], indent=2)}
            """

            self.sns.publish(
                TopicArn='arn:aws:sns:us-east-1:123456789012:data-quality-alerts',
                Message=message,
                Subject=f'Data Quality Alert: {table_name}'
            )

# Example usage
def quality_monitored_etl():
    """ETL pipeline with quality monitoring"""
    monitor = DataQualityMonitor()

    # Define quality rules
    monitor.define_quality_rules('customers', {
        'completeness': {
            'email': 0.95,
            'name': 0.90
        },
        'uniqueness': ['email', 'customer_id'],
        'validity': {
            'email': r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        'ranges': {
            'age': (18, 100),
            'signup_date': ('2020-01-01', datetime.now().date().isoformat())
        }
    })

    # In ETL pipeline
    customer_data = extract_customer_data()
    quality_result = monitor.assess_data_quality('customers', customer_data)

    # Report metrics
    monitor.report_quality_metrics('customers', quality_result)

    # Alert if needed
    monitor.alert_on_quality_issues('customers', quality_result)

    # Proceed based on quality
    if quality_result['score'] >= 0.8:
        load_customer_data(customer_data)
    else:
        quarantine_customer_data(customer_data, quality_result)
```

## Conclusion

This advanced ETL guide has covered enterprise-scale data processing techniques:

- **Real-time ETL**: Kinesis-based streaming pipelines with Lambda processing
- **ML Integration**: Anomaly detection and predictive analytics in ETL
- **Enterprise Architectures**: Lambda architecture and data mesh patterns
- **Performance Optimization**: Parallel processing and memory management
- **Governance**: Data lineage tracking and quality monitoring

### Key Takeaways

1. **Real-time is essential**: Modern ETL must handle streaming data for immediate insights
2. **ML enhances ETL**: Machine learning can improve data quality and add predictive capabilities
3. **Architecture matters**: Choose the right architecture (Lambda, Data Mesh) for your scale
4. **Performance is critical**: Parallel processing and memory optimization handle big data
5. **Governance is mandatory**: Lineage tracking and quality monitoring ensure compliance

### What's Next

This concludes our comprehensive ETL series. You've learned:

- **Part 1**: ETL fundamentals and basic Python pipelines
- **Part 2**: AWS services for managed ETL at medium scale
- **Part 3**: Advanced patterns for enterprise ETL

The ETL landscape continues to evolve with new tools and patterns. Stay curious, keep learning, and adapt these patterns to your specific use cases!

## Resources

- [Designing Data-Intensive Applications](https://dataintensive.net/)
- [Streaming Systems](https://www.oreilly.com/library/view/streaming-systems/9781491983874/)
- [Data Mesh Principles](https://martinfowler.com/articles/data-mesh-principles.html)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)

Happy advanced ETL engineering! 🚀📊🔬
