---
layout: default
title: "AWS SageMaker Professional ML: Real Dataset House Price Prediction"
date: 2025-11-07 10:00:00 +0000
categories: [aws, machine-learning, sagemaker, data-science, professional-ml]
tags:
  [
    aws,
    sagemaker,
    machine-learning,
    california-housing,
    feature-engineering,
    cross-validation,
    hyperparameter-tuning,
    model-comparison,
    professional-ml,
    data-science,
  ]
description: "Take your SageMaker skills to the next level with professional ML practices using real datasets. Learn feature engineering, cross-validation, hyperparameter tuning, and model deployment."
excerpt: "Level up your SageMaker skills! Learn professional ML techniques with real datasets, feature engineering, model validation, and deployment best practices."
---

# AWS SageMaker Professional ML: Real Dataset House Price Prediction

Building on our [beginner's SageMaker house price predictor]({% post_url 2025-11-06-aws-sagemaker-beginners-guide %}), it's time to level up to professional machine learning practices. In this post, we'll use a **real dataset**, implement **industry-standard ML techniques**, and follow **production-ready workflows**.

**Ready for computer vision?** Check out our [comprehensive image recognition guide]({% post_url 2025-11-08-aws-sagemaker-image-recognition %}) covering traditional ML, deep learning CNNs, and AWS Rekognition!

## 🎯 MLS-C01 Exam Alignment: Professional ML Engineering

**This advanced guide covers core competencies tested in the AWS Certified Machine Learning - Specialty (MLS-C01) exam:**

### **Domain 2: Exploratory Data Analysis (24%) - Professional Data Science**

- **Sanitize and prepare data**: Advanced preprocessing, feature engineering, handling missing data
- **Perform feature engineering**: Creating derived features, feature selection, dimensionality reduction
- **Analyze and visualize data**: Statistical analysis, correlation analysis, outlier detection

### **Domain 3: Modeling (36%) - Advanced ML Techniques**

- **Frame ML problems**: Business problem translation, objective function definition
- **Model selection**: Algorithm comparison, cross-validation, performance metrics
- **Hyperparameter optimization**: Grid search, random search, Bayesian optimization
- **Model evaluation**: Confusion matrices, ROC curves, precision-recall analysis

### **Domain 4: ML Implementation and Operations (20%) - Production ML**

- **Performance & scalability**: Model optimization, distributed training, inference optimization
- **Operationalization**: Model deployment, monitoring, A/B testing frameworks
- **Security**: AWS security best practices, data encryption, access control

**Exam Tip**: The MLS-C01 exam heavily tests your ability to apply professional ML practices. This post covers the "Evaluate machine learning models" and "Perform hyperparameter optimization" objectives that are frequently tested.

## 🎯 What's Different This Time?

**Beginner Version**: Synthetic data, basic linear regression, simple evaluation
**Professional Version**: Real dataset, advanced techniques, rigorous validation, deployment considerations

## 📊 The California Housing Dataset

Instead of creating fake data, we'll use the **California Housing dataset** - a real dataset that's included with scikit-learn. This dataset contains information about houses in California districts from the 1990 census.

**Dataset Features:**

- **MedInc**: Median income in block group
- **HouseAge**: Median house age in block group
- **AveRooms**: Average number of rooms per household
- **AveBedrms**: Average number of bedrooms per household
- **Population**: Block group population
- **AveOccup**: Average number of household members
- **Latitude**: Block group latitude
- **Longitude**: Block group longitude

**Target Variable:**

- **MedHouseVal**: Median house value for California districts (in $100,000s)

## 🏗️ Professional ML Workflow

### Step 1: Environment Setup and Data Loading

```python
# Professional ML libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import warnings
warnings.filterwarnings('ignore')

# Set professional plotting style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

print("Professional ML environment ready!")
```

### Step 2: Load and Explore Real Data

```python
# Load the California Housing dataset
housing = fetch_california_housing()

# Convert to DataFrame for easier analysis
df = pd.DataFrame(housing.data, columns=housing.feature_names)
df['MedHouseVal'] = housing.target

print("California Housing Dataset Overview:")
print(f"Number of samples: {len(df)}")
print(f"Number of features: {len(housing.feature_names)}")
print(f"Target variable: Median House Value (in $100,000s)")

# Display first few rows
print("\nFirst 5 rows:")
print(df.head())

# Basic statistics
print("\nDataset Statistics:")
print(df.describe())
```

### Step 3: Exploratory Data Analysis (EDA)

```python
# Professional EDA with statistical insights
print("=== EXPLORATORY DATA ANALYSIS ===")

# Check for missing values
print("Missing values per column:")
print(df.isnull().sum())

# Correlation analysis
correlation_matrix = df.corr()
print("\nTop correlations with target (MedHouseVal):")
print(correlation_matrix['MedHouseVal'].sort_values(ascending=False))

# Visualize distributions
fig, axes = plt.subplots(2, 4, figsize=(20, 10))

# Plot distributions of key features
features_to_plot = ['MedInc', 'HouseAge', 'AveRooms', 'AveBedrms', 'Population', 'AveOccup', 'MedHouseVal']
for i, feature in enumerate(features_to_plot):
    row = i // 4
    col = i % 4
    axes[row, col].hist(df[feature], bins=50, alpha=0.7, edgecolor='black')
    axes[row, col].set_title(f'{feature} Distribution')
    axes[row, col].set_xlabel(feature)
    axes[row, col].set_ylabel('Frequency')

plt.tight_layout()
plt.show()

# Correlation heatmap
plt.figure(figsize=(12, 10))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0, fmt='.2f')
plt.title('Feature Correlation Heatmap')
plt.show()

# Scatter plots for key relationships
fig, axes = plt.subplots(2, 3, figsize=(18, 12))

# Top correlated features with target
top_features = ['MedInc', 'AveRooms', 'HouseAge', 'AveBedrms', 'Population', 'AveOccup']
for i, feature in enumerate(top_features):
    row = i // 3
    col = i % 3
    axes[row, col].scatter(df[feature], df['MedHouseVal'], alpha=0.6)
    axes[row, col].set_xlabel(feature)
    axes[row, col].set_ylabel('Median House Value ($100k)')
    axes[row, col].set_title(f'{feature} vs House Value')

plt.tight_layout()
plt.show()
```

### Step 4: Feature Engineering

```python
# Professional feature engineering
print("=== FEATURE ENGINEERING ===")

# Create new features
df_engineered = df.copy()

# Room-to-bedroom ratio (might indicate luxury)
df_engineered['RoomToBedroomRatio'] = df_engineered['AveRooms'] / df_engineered['AveBedrms']

# Population density (people per room)
df_engineered['PopulationDensity'] = df_engineered['Population'] / df_engineered['AveRooms']

# Income per capita
df_engineered['IncomePerCapita'] = df_engineered['MedInc'] * 10000 / df_engineered['Population']

# Location-based features (simplified)
# Create regions based on latitude/longitude
df_engineered['IsNorthernCA'] = (df_engineered['Latitude'] > 38).astype(int)
df_engineered['IsCoastal'] = ((df_engineered['Longitude'] > -122) & (df_engineered['Latitude'] < 40)).astype(int)

# Handle potential division by zero
df_engineered['RoomToBedroomRatio'] = df_engineered['RoomToBedroomRatio'].replace([np.inf, -np.inf], np.nan)
df_engineered['PopulationDensity'] = df_engineered['PopulationDensity'].replace([np.inf, -np.inf], np.nan)
df_engineered['IncomePerCapita'] = df_engineered['IncomePerCapita'].replace([np.inf, -np.inf], np.nan)

# Fill NaN values with median
for col in ['RoomToBedroomRatio', 'PopulationDensity', 'IncomePerCapita']:
    df_engineered[col] = df_engineered[col].fillna(df_engineered[col].median())

print("New features created:")
print("- RoomToBedroomRatio: Average rooms per bedroom")
print("- PopulationDensity: People per room")
print("- IncomePerCapita: Income per person")
print("- IsNorthernCA: Binary indicator for northern California")
print("- IsCoastal: Binary indicator for coastal regions")

print(f"\nOriginal features: {len(df.columns)}")
print(f"Engineered features: {len(df_engineered.columns)}")
```

### Step 5: Data Preprocessing and Train/Test Split

```python
# Professional data preprocessing
print("=== DATA PREPROCESSING ===")

# Separate features and target
X = df_engineered.drop('MedHouseVal', axis=1)
y = df_engineered['MedHouseVal']

# Split the data (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Training set: {X_train.shape[0]} samples")
print(f"Test set: {X_test.shape[0]} samples")
print(f"Number of features: {X_train.shape[1]}")

# Feature scaling (important for some algorithms)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\nFeatures scaled using StandardScaler")
```

### Step 6: Model Training and Cross-Validation

```python
# Professional model training with cross-validation
print("=== MODEL TRAINING & CROSS-VALIDATION ===")

# Define models to compare
models = {
    'Linear Regression': LinearRegression(),
    'Ridge Regression': Ridge(random_state=42),
    'Lasso Regression': Lasso(random_state=42),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42)
}

# Evaluate each model using cross-validation
cv_results = {}
for name, model in models.items():
    if name in ['Linear Regression', 'Ridge Regression', 'Lasso Regression']:
        # Use scaled data for linear models
        scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='neg_mean_squared_error')
    else:
        # Use original data for tree-based models
        scores = cross_val_score(model, X_train, y_train, cv=5, scoring='neg_mean_squared_error')

    cv_results[name] = {
        'mean_mse': -scores.mean(),
        'std_mse': scores.std(),
        'rmse': np.sqrt(-scores.mean())
    }

    print(f"{name}:")
    print(".4f")
    print(".4f")
    print()

# Visualize cross-validation results
model_names = list(cv_results.keys())
rmse_scores = [cv_results[name]['rmse'] for name in model_names]

plt.figure(figsize=(12, 6))
bars = plt.bar(model_names, rmse_scores, alpha=0.7, edgecolor='black')
plt.title('Cross-Validation RMSE Comparison')
plt.ylabel('Root Mean Squared Error')
plt.xticks(rotation=45)

# Add value labels on bars
for bar, score in zip(bars, rmse_scores):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01,
             '.3f', ha='center', va='bottom')

plt.tight_layout()
plt.show()
```

### Step 7: Hyperparameter Tuning

```python
# Professional hyperparameter tuning
print("=== HYPERPARAMETER TUNING ===")

# Focus on the best performing model (Random Forest)
rf_param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

rf_grid_search = GridSearchCV(
    RandomForestRegressor(random_state=42),
    rf_param_grid,
    cv=3,  # Reduced for speed
    scoring='neg_mean_squared_error',
    n_jobs=-1,
    verbose=1
)

rf_grid_search.fit(X_train, y_train)

print("Best Random Forest parameters:")
print(rf_grid_search.best_params_)
print(".4f")

# Train the best model
best_rf = rf_grid_search.best_estimator_
```

### Step 8: Final Model Evaluation

```python
# Professional model evaluation
print("=== FINAL MODEL EVALUATION ===")

# Make predictions on test set
y_pred = best_rf.predict(X_test)

# Calculate comprehensive metrics
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("Test Set Performance Metrics:")
print("-" * 40)
print(".4f")
print(".4f")
print(".4f")
print(".4f")

# Error analysis
errors = y_test - y_pred
print("
Error Analysis:")
print(".4f")
print(".4f")
print(".4f")

# Visualize predictions vs actual
plt.figure(figsize=(12, 8))

# Scatter plot of predictions vs actual
plt.subplot(2, 2, 1)
plt.scatter(y_test, y_pred, alpha=0.6)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.xlabel('Actual Values')
plt.ylabel('Predicted Values')
plt.title('Predictions vs Actual Values')

# Residual plot
plt.subplot(2, 2, 2)
plt.scatter(y_pred, errors, alpha=0.6)
plt.axhline(y=0, color='r', linestyle='--')
plt.xlabel('Predicted Values')
plt.ylabel('Residuals')
plt.title('Residual Plot')

# Error distribution
plt.subplot(2, 2, 3)
plt.hist(errors, bins=50, alpha=0.7, edgecolor='black')
plt.xlabel('Prediction Error')
plt.ylabel('Frequency')
plt.title('Error Distribution')

# Feature importance
plt.subplot(2, 2, 4)
feature_importance = pd.DataFrame({
    'feature': X_train.columns,
    'importance': best_rf.feature_importances_
}).sort_values('importance', ascending=False)

sns.barplot(x='importance', y='feature', data=feature_importance.head(10))
plt.title('Top 10 Feature Importance')
plt.xlabel('Importance Score')

plt.tight_layout()
plt.show()
```

### Step 9: Model Interpretation and Insights

```python
# Professional model interpretation
print("=== MODEL INSIGHTS ===")

print("Top 10 Most Important Features:")
for i, (_, row) in enumerate(feature_importance.head(10).iterrows()):
    print(f"{i+1}. {row['feature']}: {row['importance']:.4f}")

# Analyze specific predictions
print("
Analyzing Specific Predictions:")

# Find best and worst predictions
prediction_errors = pd.DataFrame({
    'actual': y_test,
    'predicted': y_pred,
    'error': errors,
    'abs_error': np.abs(errors)
})

best_predictions = prediction_errors.nsmallest(5, 'abs_error')
worst_predictions = prediction_errors.nlargest(5, 'abs_error')

print("\nBest Predictions (lowest error):")
for idx, row in best_predictions.iterrows():
    print(".2f")

print("\nWorst Predictions (highest error):")
for idx, row in worst_predictions.iterrows():
    print(".2f")
```

### Step 10: Production Considerations

```python
# Production-ready code patterns
print("=== PRODUCTION CONSIDERATIONS ===")

# Save the model and scaler (for deployment)
import joblib

# Save model
joblib.dump(best_rf, 'california_housing_model.pkl')
joblib.dump(scaler, 'feature_scaler.pkl')

print("Model and scaler saved for deployment")

# Create a prediction function (production-ready)
def predict_house_price(features_dict):
    """
    Production-ready prediction function

    Args:
        features_dict (dict): Dictionary containing all required features

    Returns:
        float: Predicted house price in $100,000s
    """
    # Required features
    required_features = [
        'MedInc', 'HouseAge', 'AveRooms', 'AveBedrms', 'Population', 'AveOccup',
        'Latitude', 'Longitude', 'RoomToBedroomRatio', 'PopulationDensity',
        'IncomePerCapita', 'IsNorthernCA', 'IsCoastal'
    ]

    # Validate input
    missing_features = [f for f in required_features if f not in features_dict]
    if missing_features:
        raise ValueError(f"Missing required features: {missing_features}")

    # Create DataFrame from input
    input_df = pd.DataFrame([features_dict])

    # Feature engineering (same as training)
    input_df['RoomToBedroomRatio'] = input_df['AveRooms'] / input_df['AveBedrms']
    input_df['PopulationDensity'] = input_df['Population'] / input_df['AveRooms']
    input_df['IncomePerCapita'] = input_df['MedInc'] * 10000 / input_df['Population']
    input_df['IsNorthernCA'] = (input_df['Latitude'] > 38).astype(int)
    input_df['IsCoastal'] = ((input_df['Longitude'] > -122) & (input_df['Latitude'] < 40)).astype(int)

    # Handle potential NaN values
    input_df = input_df.fillna(input_df.median())

    # Load model and scaler (in production, these would be loaded once)
    model = joblib.load('california_housing_model.pkl')
    scaler = joblib.load('feature_scaler.pkl')

    # Scale features (only scale the original features, not engineered ones)
    original_features = ['MedInc', 'HouseAge', 'AveRooms', 'AveBedrms', 'Population',
                        'AveOccup', 'Latitude', 'Longitude']
    input_df[original_features] = scaler.transform(input_df[original_features])

    # Make prediction
    prediction = model.predict(input_df)[0]

    return prediction

# Test the prediction function
sample_input = {
    'MedInc': 8.3252,
    'HouseAge': 41.0,
    'AveRooms': 6.984127,
    'AveBedrms': 1.023810,
    'Population': 322.0,
    'AveOccup': 2.555556,
    'Latitude': 37.88,
    'Longitude': -122.23
}

predicted_price = predict_house_price(sample_input)
print(".2f")
print("This means the predicted house price is ${predicted_price * 100000:,.0f}")
```

## 🚀 Next Steps: From Professional to Production

Now that you have professional ML skills, here are the next steps:

### **Level 5: Specialized ML Domains**

- **[Computer Vision Mastery]({% post_url 2025-11-08-aws-sagemaker-image-recognition %})**: Traditional ML, CNNs, and AWS Rekognition
- **Natural Language Processing**: Text classification, sentiment analysis, transformers
- **Time Series Forecasting**: ARIMA, Prophet, LSTM networks
- **Recommendation Systems**: Collaborative filtering, content-based methods

### **Level 6: Production ML Engineering**

- **Model versioning** with DVC or similar tools
- **CI/CD pipelines** for ML models
- **Model monitoring** and drift detection
- **A/B testing** frameworks
- **Model serving** with FastAPI or similar

### **Level 7: MLOps and Scale**

- **Kubernetes** for ML workloads
- **Distributed training** with multiple GPUs
- **Feature stores** for feature management
- **Model governance** and compliance
- **AutoML** and hyperparameter optimization at scale

### **Level 7: Advanced ML Research**

- **Deep learning** with TensorFlow/PyTorch
- **Computer vision** and NLP applications
- **Reinforcement learning** projects
- **Custom model architectures**
- **Research paper** implementations

## 📚 Key Takeaways

**Professional ML is different from beginner ML:**

1. **Real data** instead of synthetic data
2. **Rigorous validation** with cross-validation
3. **Hyperparameter tuning** for optimal performance
4. **Feature engineering** to create better features
5. **Model comparison** to choose the best algorithm
6. **Error analysis** to understand model limitations
7. **Production-ready code** with proper error handling

**Remember:** The goal isn't just to build models that work on paper—it's to build models that work reliably in the real world!

## 🔧 Practice Exercises

1. **Try different algorithms**: Implement SVM, Neural Networks, or XGBoost
2. **Feature selection**: Use techniques like recursive feature elimination
3. **Handle outliers**: Implement robust statistical methods
4. **Time series**: If you have temporal data, add time-based features
5. **Geospatial features**: Create distance-based or cluster-based features

## 📖 Further Reading

- **"Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow"** by Aurélien Géron
- **"Designing Machine Learning Systems"** by Chip Huyen
- **AWS Machine Learning blogs** and documentation
- **Kaggle kernels** for advanced techniques

Ready to take your ML skills to the next level? The journey from beginner to professional ML engineer is challenging but incredibly rewarding! 🚀

---

_This post builds on our [SageMaker beginner's guide]({% post_url 2025-11-06-aws-sagemaker-beginners-guide %}). Ready for computer vision? Check out our [image recognition deep dive]({% post_url 2025-11-08-aws-sagemaker-image-recognition %})! Next up: Deploying ML models to production with AWS services!_ 🚀
