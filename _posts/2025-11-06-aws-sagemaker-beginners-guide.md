---
layout: default
title: "AWS SageMaker for Beginners: Complete Setup Guide with Cost Optimization"
date: 2025-11-06 10:00:00 +0000
categories:
  [aws, machine-learning, sagemaker, jupyter, terraform, cost-optimization]
tags:
  [
    aws,
    sagemaker,
    machine-learning,
    jupyter-notebook,
    terraform,
    cost-optimization,
    beginners-guide,
    ml-workspace,
    data-science,
    cloud-ml,
  ]
description: "Complete beginner's guide to AWS SageMaker: what it is, how to set up, cost optimization tips, Terraform automation, and hands-on Jupyter notebook examples."
excerpt: "Master AWS SageMaker from scratch! Learn what it is, set up your first ML workspace, optimize costs, automate with Terraform, and build your first ML model with Jupyter notebooks."
---

# AWS SageMaker for Beginners: Complete Setup Guide with Cost Optimization

## Introduction to AWS SageMaker

AWS SageMaker is Amazon's comprehensive machine learning platform that simplifies the entire ML lifecycle. Whether you're a data scientist, ML engineer, or business analyst, SageMaker provides all the tools you need to build, train, and deploy machine learning models at scale.

### Why Choose SageMaker?

SageMaker stands out from other ML platforms for several key reasons:

- **Fully Managed Service**: No need to manage underlying infrastructure
- **Integrated Development Environment**: SageMaker Studio provides a unified interface
- **Built-in Algorithms**: Pre-optimized algorithms for common ML tasks
- **AutoML Capabilities**: SageMaker Autopilot can automatically build models
- **MLOps Integration**: Built-in CI/CD for ML workflows
- **Cost Optimization**: Pay-as-you-go pricing with multiple cost-saving features

### SageMaker Components Overview

SageMaker consists of several integrated components:

- **SageMaker Studio**: Web-based IDE for ML development
- **SageMaker Notebooks**: Jupyter notebooks with pre-installed ML libraries
- **SageMaker Training**: Distributed training infrastructure
- **SageMaker Hosting**: Model deployment and inference endpoints
- **SageMaker Ground Truth**: Data labeling service
- **SageMaker Model Monitor**: Production model monitoring
- **SageMaker Pipelines**: MLOps workflow orchestration

### Common Use Cases

SageMaker is used across industries for:

- Predictive analytics and forecasting
- Computer vision applications
- Natural language processing
- Recommendation systems
- Fraud detection
- Quality control and anomaly detection

## 🎯 MLS-C01 Exam Alignment: Foundational Knowledge

**This beginner guide covers fundamental concepts tested in the AWS Certified Machine Learning - Specialty (MLS-C01) exam:**

### **Domain 1: Data Engineering (20%) - Basic Concepts**

- Understanding data repositories and ingestion solutions
- Basic data transformation concepts

### **Domain 2: Exploratory Data Analysis (24%) - Getting Started**

- Introduction to data preparation and visualization
- Basic feature engineering concepts

### **Domain 3: Modeling (36%) - Core ML Knowledge**

- Framing business problems as ML problems
- Understanding different ML algorithms and when to use them
- Basic model training and evaluation concepts

### **Domain 4: ML Implementation and Operations (20%) - AWS Services**

- AWS ML service selection and basic implementation
- Security practices and operational considerations

**Exam Tip**: This post provides the foundational knowledge needed before diving into advanced MLS-C01 topics covered in our [professional ML guide]({% post_url 2025-11-07-aws-sagemaker-professional-ml %}) and [computer vision deep dive]({% post_url 2025-11-08-aws-sagemaker-image-recognition %}).

## Prerequisites and Setup

Before diving into SageMaker, ensure you have:

- An AWS account with appropriate permissions
- Basic understanding of machine learning concepts
- Familiarity with Python programming
- Knowledge of cloud computing fundamentals

### AWS Account Setup

1. Create an AWS account if you don't have one
2. Set up billing alerts to monitor costs
3. Enable multi-factor authentication (MFA)
4. Create an IAM user with least-privilege access

### Required Permissions

For SageMaker development, your IAM user needs these policies:

- AmazonSageMakerFullAccess
- AmazonS3FullAccess
- CloudWatchFullAccess
- IAMFullAccess (for role creation)

## Step-by-Step SageMaker Setup

### Step 1: Create SageMaker Domain

1. Navigate to the SageMaker console
2. Choose "Domains" from the left sidebar
3. Click "Create domain"
4. Select "Quick setup" for beginners
5. Configure domain settings:
   - Domain name: `my-ml-domain`
   - Authentication method: IAM
   - Default execution role: Create new role

### Step 2: Launch SageMaker Studio

1. From the domain dashboard, click "Launch Studio"
2. Wait for the environment to initialize (5-10 minutes)
3. Once loaded, you'll see the SageMaker Studio interface

### Step 3: Create Your First Notebook

1. In Studio, click the "File" menu
2. Select "New" → "Notebook"
3. Choose a kernel (Python 3 recommended)
4. Name your notebook: `getting-started.ipynb`

## Infrastructure as Code Setup

Choose your preferred infrastructure automation tool:

### Terraform Setup

```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# S3 bucket for SageMaker artifacts
resource "aws_s3_bucket" "sagemaker_artifacts" {
  bucket = "my-sagemaker-artifacts-${random_string.suffix.result}"
}

resource "random_string" "suffix" {
  length  = 8
  lower   = true
  upper   = false
  numeric = true
}

# IAM role for SageMaker
resource "aws_iam_role" "sagemaker_execution_role" {
  name = "sagemaker-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "sagemaker.amazonaws.com"
        }
      }
    ]
  })
}

# Attach required policies
resource "aws_iam_role_policy_attachment" "sagemaker_full_access" {
  role       = aws_iam_role.sagemaker_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSageMakerFullAccess"
}

resource "aws_iam_role_policy_attachment" "s3_full_access" {
  role       = aws_iam_role.sagemaker_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

# SageMaker domain
resource "aws_sagemaker_domain" "ml_domain" {
  domain_name = "my-ml-domain"
  auth_mode   = "IAM"

  default_user_settings {
    execution_role = aws_iam_role.sagemaker_execution_role.arn
  }

  default_space_settings {
    execution_role = aws_iam_role.sagemaker_execution_role.arn
  }
}

# VPC for network isolation (optional but recommended)
resource "aws_vpc" "sagemaker_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "sagemaker-vpc"
  }
}

resource "aws_subnet" "sagemaker_subnet" {
  vpc_id     = aws_vpc.sagemaker_vpc.id
  cidr_block = "10.0.1.0/24"

  tags = {
    Name = "sagemaker-subnet"
  }
}

# Cost monitoring
resource "aws_budgets_budget" "ml_budget" {
  name         = "sagemaker-budget"
  budget_type  = "COST"
  limit_amount = "100.0"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type            = "PERCENTAGE"
    notification_type         = "ACTUAL"
    subscriber_email_addresses = ["your-email@example.com"]
  }
}
```

### CloudFormation Setup

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Description: "SageMaker Domain and Resources"

Parameters:
  DomainName:
    Type: String
    Default: my-ml-domain
    Description: Name for the SageMaker domain

  BudgetLimit:
    Type: Number
    Default: 100
    Description: Monthly budget limit in USD

Resources:
  # S3 bucket for artifacts
  SageMakerArtifactsBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub my-sagemaker-artifacts-${AWS::AccountId}

  # IAM role for SageMaker
  SageMakerExecutionRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: sagemaker-execution-role
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: Allow
            Principal:
              Service: sagemaker.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/AmazonSageMakerFullAccess
        - arn:aws:iam::aws:policy/AmazonS3FullAccess

  # SageMaker domain
  SageMakerDomain:
    Type: AWS::SageMaker::Domain
    Properties:
      DomainName: !Ref DomainName
      AuthMode: IAM
      DefaultUserSettings:
        ExecutionRole: !GetAtt SageMakerExecutionRole.Arn
      DefaultSpaceSettings:
        ExecutionRole: !GetAtt SageMakerExecutionRole.Arn

  # VPC for network isolation
  SageMakerVPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: sagemaker-vpc

  SageMakerSubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref SageMakerVPC
      CidrBlock: 10.0.1.0/24
      Tags:
        - Key: Name
          Value: sagemaker-subnet

  # Budget monitoring
  SageMakerBudget:
    Type: AWS::Budgets::Budget
    Properties:
      Budget:
        BudgetName: sagemaker-budget
        BudgetType: COST
        LimitAmount: !Ref BudgetLimit
        LimitUnit: USD
        TimeUnit: MONTHLY
      NotificationsWithSubscribers:
        - Notification:
            ComparisonOperator: GREATER_THAN
            NotificationType: ACTUAL
            Threshold: 80
            ThresholdType: PERCENTAGE
          Subscribers:
            - Address: your-email@example.com
              SubscriptionType: EMAIL

Outputs:
  DomainId:
    Description: SageMaker Domain ID
    Value: !Ref SageMakerDomain
    Export:
      Name: !Sub ${AWS::StackName}-DomainId

  ExecutionRoleArn:
    Description: SageMaker Execution Role ARN
    Value: !GetAtt SageMakerExecutionRole.Arn
    Export:
      Name: !Sub ${AWS::StackName}-ExecutionRoleArn
```

## Cost Optimization Strategies

SageMaker costs can escalate quickly if not monitored. Here are proven strategies to keep expenses under control:

### 1. Right-Size Your Instances

Choose instances based on your workload:

```python
# For experimentation and learning
instance_type = 'ml.t3.medium'    # ~$0.05/hour

# For small datasets and simple models
instance_type = 'ml.t3.large'     # ~$0.10/hour

# For GPU workloads (expensive!)
instance_type = 'ml.p3.2xlarge'   # ~$3.00/hour
```

### 2. Use Spot Instances for Training

Spot instances can save up to 70%:

```python
training_job_config = {
    'TrainingJobName': 'my-training-job',
    'AlgorithmSpecification': {
        'TrainingImage': 'your-algorithm-image',
        'TrainingInputMode': 'File'
    },
    'RoleArn': 'your-sagemaker-role-arn',
    'InputDataConfig': [...],
    'OutputDataConfig': {...},
    'ResourceConfig': {
        'InstanceType': 'ml.p3.2xlarge',
        'InstanceCount': 1,
        'UseSpotInstances': True,
        'MaxWaitTimeInSeconds': 3600,  # 1 hour
        'MaxRuntimeInSeconds': 3600
    },
    'StoppingCondition': {
        'MaxRuntimeInSeconds': 3600
    }
}
```

### 3. Implement Auto-Shutdown

Create lifecycle configurations to automatically shut down idle resources:

```python
# Lifecycle configuration script
lifecycle_config_script = """
#!/bin/bash
set -e

# Auto-shutdown after 2 hours of inactivity
IDLE_TIME=7200

echo "Starting idle check script"

while true; do
    # Check if Jupyter is running and get last activity
    if pgrep -f jupyter > /dev/null; then
        LAST_ACTIVITY=$(stat -c %Y /home/ec2-user/.jupyter/lab/workspaces/default-*.jupyterlab-workspace)
        CURRENT_TIME=$(date +%s)
        TIME_DIFF=$((CURRENT_TIME - LAST_ACTIVITY))

        if [ $TIME_DIFF -gt $IDLE_TIME ]; then
            echo "Shutting down due to inactivity"
            shutdown -h now
        fi
    fi
    sleep 300  # Check every 5 minutes
done
"""
```

### 4. Monitor and Alert on Costs

Set up comprehensive monitoring:

```python
import boto3
from datetime import datetime, timedelta

def get_sagemaker_costs():
    client = boto3.client('ce', region_name='us-east-1')

    # Get costs for last 30 days
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=30)

    response = client.get_cost_and_usage(
        TimePeriod={
            'Start': start_date.strftime('%Y-%m-%d'),
            'End': end_date.strftime('%Y-%m-%d')
        },
        Granularity='DAILY',
        Metrics=['BlendedCost'],
        Filter={
            'Dimensions': {
                'Key': 'SERVICE',
                'Values': ['Amazon SageMaker']
            }
        }
    )

    total_cost = 0
    for result in response['ResultsByTime']:
        cost = float(result['Groups'][0]['Metrics']['BlendedCost']['Amount'])
        total_cost += cost

    return total_cost

# Check costs and alert if over budget
total_cost = get_sagemaker_costs()
budget_limit = 50.0

if total_cost > budget_limit:
    print(f"ALERT: SageMaker costs (${total_cost:.2f}) exceeded budget (${budget_limit:.2f})")
    # Send notification (integrate with SNS, email, etc.)
```

### 5. Optimize Data Storage

Use appropriate storage classes:

- **S3 Standard**: Frequently accessed data
- **S3 Intelligent-Tiering**: Unknown or changing access patterns
- **S3 Glacier**: Archive data with 1-5 minute retrieval

### 6. Clean Up Unused Resources

Regular cleanup script:

```python
import boto3

def cleanup_sagemaker_resources():
    sagemaker = boto3.client('sagemaker')

    # Delete unused notebook instances
    notebooks = sagemaker.list_notebook_instances()
    for notebook in notebooks['NotebookInstances']:
        if notebook['NotebookInstanceStatus'] == 'Stopped':
            # Check if stopped for more than 7 days
            stopped_time = notebook['LastModifiedTime']
            days_stopped = (datetime.now() - stopped_time.replace(tzinfo=None)).days

            if days_stopped > 7:
                print(f"Deleting old notebook: {notebook['NotebookInstanceName']}")
                sagemaker.delete_notebook_instance(
                    NotebookInstanceName=notebook['NotebookInstanceName']
                )

    # Delete unused endpoints
    endpoints = sagemaker.list_endpoints()
    for endpoint in endpoints['Endpoints']:
        if endpoint['EndpointStatus'] == 'OutOfService':
            print(f"Deleting out-of-service endpoint: {endpoint['EndpointName']}")
            sagemaker.delete_endpoint(EndpointName=endpoint['EndpointName'])

if __name__ == "__main__":
    cleanup_sagemaker_resources()
```

## Your First Machine Learning Project

Let's build a simple house price prediction model:

### Step 1: Import Libraries

```python
# Essential ML libraries
import pandas as pd  # Data manipulation and analysis library
import numpy as np   # Numerical computing library
import matplotlib.pyplot as plt  # Basic plotting library
import seaborn as sns  # Statistical data visualization library
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Set plotting style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

print("Libraries imported successfully!")
```

**About the libraries we're using:**

- **pandas**: A powerful data manipulation library that makes it easy to work with structured data (like spreadsheets or databases). It provides DataFrames - think of them as programmable Excel sheets that can handle millions of rows efficiently.

- **seaborn**: A statistical data visualization library built on top of matplotlib. It creates beautiful, informative plots with minimal code and includes statistical analysis features.

- **numpy**: The fundamental package for scientific computing in Python. It provides powerful N-dimensional arrays and mathematical functions.

- **matplotlib**: The original Python plotting library. Seaborn uses it under the hood for creating visualizations.

- **scikit-learn**: The most popular machine learning library for Python. It includes algorithms for classification, regression, clustering, and more.

### Step 2: Generate Sample Data

```python
# Create realistic housing data
np.random.seed(42)
n_samples = 1000

# Generate features
house_data = {
    'size_sqft': np.random.normal(2000, 500, n_samples),
    'bedrooms': np.random.randint(1, 6, n_samples),
    'bathrooms': np.random.randint(1, 4, n_samples),
    'age_years': np.random.randint(0, 50, n_samples),
    'lot_size': np.random.normal(8000, 2000, n_samples),
    'garage_spaces': np.random.randint(0, 3, n_samples)
}

# Create target variable (price)
base_price = 300000
df = pd.DataFrame(house_data)

# Add realistic price relationships
df['price'] = (
    base_price +
    (df['size_sqft'] - 2000) * 150 +           # Size impact
    df['bedrooms'] * 25000 +                   # Bedroom impact
    df['bathrooms'] * 15000 +                  # Bathroom impact
    df['lot_size'] * 10 +                      # Lot size impact
    df['garage_spaces'] * 10000 -              # Garage impact
    df['age_years'] * 3000                     # Age depreciation
)

# Add some noise and ensure positive prices
df['price'] += np.random.normal(0, 25000, n_samples)
df['price'] = df['price'].clip(lower=75000)

print(f"Generated {len(df)} house records")
print(df.head())
```

**Where does this housing data come from?**

For this beginner tutorial, we're creating a **synthetic dataset** using Python's random number generators. This is common in ML tutorials because:

1. **No external dependencies**: You don't need to download files or access APIs
2. **Controlled learning**: We know exactly how the data is generated and what relationships exist
3. **Reproducible**: Setting `np.random.seed(42)` ensures you get the same data every time
4. **Privacy-safe**: No real personal data is involved

**In real projects, you'd typically get data from:**

- **Kaggle datasets**: Free public datasets for ML practice
- **UCI Machine Learning Repository**: Academic datasets
- **Your company's databases**: Internal business data
- **APIs**: Real-time data from web services
- **Web scraping**: Collecting data from websites
- **Surveys/questionnaires**: Data you collect yourself

The synthetic data we created has realistic relationships (larger houses cost more, older houses cost less, etc.) that make it perfect for learning ML concepts.

### Step 3: Exploratory Data Analysis

```python
# Basic statistics
print("Dataset Overview:")
print(df.describe())

# Correlation analysis
correlation_matrix = df.corr()
print("\nFeature Correlations with Price:")
print(correlation_matrix['price'].sort_values(ascending=False))

# Visualize relationships
fig, axes = plt.subplots(2, 3, figsize=(15, 10))

# Scatter plots
axes[0, 0].scatter(df['size_sqft'], df['price'], alpha=0.6)
axes[0, 0].set_xlabel('Size (sq ft)')
axes[0, 0].set_ylabel('Price ($)')
axes[0, 0].set_title('Size vs Price')

axes[0, 1].scatter(df['bedrooms'], df['price'], alpha=0.6)
axes[0, 1].set_xlabel('Bedrooms')
axes[0, 1].set_ylabel('Price ($)')
axes[0, 1].set_title('Bedrooms vs Price')

axes[0, 2].scatter(df['age_years'], df['price'], alpha=0.6)
axes[0, 2].set_xlabel('Age (years)')
axes[0, 2].set_ylabel('Price ($)')
axes[0, 2].set_title('Age vs Price')

# Box plots
sns.boxplot(x='bathrooms', y='price', data=df, ax=axes[1, 0])
axes[1, 0].set_title('Bathrooms vs Price')

sns.boxplot(x='garage_spaces', y='price', data=df, ax=axes[1, 1])
axes[1, 1].set_title('Garage Spaces vs Price')

# Histogram
axes[1, 2].hist(df['price'], bins=30, alpha=0.7, edgecolor='black')
axes[1, 2].set_xlabel('Price ($)')
axes[1, 2].set_ylabel('Frequency')
axes[1, 2].set_title('Price Distribution')

plt.tight_layout()
plt.show()
```

### Step 4: Build and Train the Model

```python
# Prepare features and target
features = ['size_sqft', 'bedrooms', 'bathrooms', 'age_years', 'lot_size', 'garage_spaces']
X = df[features]
y = df['price']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Training set: {X_train.shape[0]} samples")
print(f"Testing set: {X_test.shape[0]} samples")

# Create and train the model
model = LinearRegression()
model.fit(X_train, y_train)

print("Model trained successfully!")

# Make predictions
y_pred = model.predict(X_test)

# Evaluate model performance
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f"Model Performance:")
print(f"Root Mean Squared Error: ${rmse:,.0f}")
print(f"R² Score: {r2:.3f}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': features,
    'importance': model.coef_
})
feature_importance = feature_importance.sort_values('importance', ascending=False)

print("\nFeature Importance:")
for _, row in feature_importance.iterrows():
    print(f"{row['feature']}: ${row['importance']:,.0f} impact per unit")
```

### Step 5: Test with New Data

```python
# Predict price for a new house
new_house = pd.DataFrame({
    'size_sqft': [2500],
    'bedrooms': [3],
    'bathrooms': [2],
    'age_years': [5],
    'lot_size': [8500],
    'garage_spaces': [2]
})

predicted_price = model.predict(new_house)[0]
confidence_range = rmse * 1.96  # 95% confidence interval

print(f"🏠 House Details:")
print(f"   Size: {new_house['size_sqft'][0]} sq ft")
print(f"   Bedrooms: {new_house['bedrooms'][0]}")
print(f"   Bathrooms: {new_house['bathrooms'][0]}")
print(f"   Age: {new_house['age_years'][0]} years")
print(f"   Lot Size: {new_house['lot_size'][0]} sq ft")
print(f"   Garage Spaces: {new_house['garage_spaces'][0]}")

print(f"\n💰 Predicted Price: ${predicted_price:,.0f}")
print(f"95% Confidence Range: ${predicted_price - confidence_range:,.0f} - ${predicted_price + confidence_range:,.0f}")
```

## Advanced SageMaker Features

Once you're comfortable with the basics, explore these advanced capabilities:

### 1. SageMaker Autopilot

Automatically build, train, and tune ML models:

```python
import sagemaker
from sagemaker.automl import AutoML

# Initialize Autopilot job
auto_ml = AutoML(
    role=sagemaker.get_execution_role(),
    target_attribute_name='price',
    problem_type='regression',
    max_candidates=50
)

# Launch AutoML job
auto_ml.fit(
    inputs=sagemaker.inputs.TrainingInput(
        s3_data_location,
        content_type='text/csv'
    ),
    job_name='house-price-automl'
)
```

### 2. SageMaker Pipelines

Create ML workflows with CI/CD:

```python
from sagemaker.workflow.pipeline import Pipeline
from sagemaker.workflow.steps import TrainingStep, ProcessingStep

# Define pipeline steps
processing_step = ProcessingStep(
    name='data-processing',
    processor=processor,
    inputs=[...],
    outputs=[...]
)

training_step = TrainingStep(
    name='model-training',
    estimator=estimator,
    inputs=[...]
)

# Create pipeline
pipeline = Pipeline(
    name='house-price-pipeline',
    steps=[processing_step, training_step]
)

pipeline.upsert()
pipeline.start()
```

### 3. Model Deployment and Monitoring

Deploy models with automatic scaling:

```python
from sagemaker.model_monitor import DataCaptureConfig

# Deploy model with data capture
predictor = model.deploy(
    initial_instance_count=1,
    instance_type='ml.m5.large',
    data_capture_config=DataCaptureConfig(
        enable_capture=True,
        sampling_percentage=100,
        destination_s3_uri=s3_capture_path
    )
)

# Set up monitoring
from sagemaker.model_monitor import ModelMonitor

monitor = ModelMonitor(
    role=sagemaker.get_execution_role(),
    image_uri=sagemaker.image_uris.retrieve('model-monitor', region),
    instance_count=1,
    instance_type='ml.m5.large'
)

monitor.create_monitoring_schedule(
    monitor_schedule_name='house-price-monitor',
    endpoint_input=predictor.endpoint_name,
    schedule_cron_expression='cron(0 * ? * * *)'  # Hourly
)
```

## Best Practices and Tips

### Development Best Practices

1. **Version Control**: Use Git for all code and configurations
2. **Environment Management**: Use conda environments for dependencies
3. **Experiment Tracking**: Log all experiments and results
4. **Code Reviews**: Review ML code just like software code
5. **Documentation**: Document models, data, and decisions

### Production Best Practices

1. **Model Validation**: Thoroughly test models before deployment
2. **Monitoring**: Monitor model performance and data drift
3. **Rollback Plans**: Have strategies to revert problematic models
4. **Security**: Implement proper access controls and encryption
5. **Scalability**: Design for production-scale inference

### Learning Resources

- **Official Documentation**: AWS SageMaker Developer Guide
- **SageMaker Examples**: GitHub repository with sample notebooks
- **AWS Blogs**: Regular updates on new features and best practices
- **Coursera/Udacity**: Structured ML courses using SageMaker
- **YouTube**: AWS ML channels with tutorials and demos

## Troubleshooting Common Issues

### Connection Issues

- Check VPC settings and security groups
- Verify IAM permissions
- Ensure correct region selection

### Cost Issues

- Monitor usage with Cost Explorer
- Set up billing alerts
- Use reserved instances for predictable workloads

### Performance Issues

- Right-size instances for your workload
- Use distributed training for large datasets
- Optimize data preprocessing pipelines

## Conclusion

AWS SageMaker provides a comprehensive platform for machine learning that scales from experimentation to production. By following the cost optimization strategies outlined in this guide and leveraging infrastructure as code tools like Terraform and CloudFormation, you can build robust ML solutions while maintaining cost control.

Remember to start small, iterate often, and gradually adopt more advanced features as your needs grow. The key to success with SageMaker is understanding both the technical capabilities and the operational best practices for managing ML workloads in the cloud.

Happy learning and building with SageMaker!
