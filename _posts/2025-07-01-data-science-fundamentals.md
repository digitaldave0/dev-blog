---
layout: post
title: "🧹 Data Science Fundamentals: Data Preparation and Model Fitting"
date: 2025-07-01
categories: [AI, Machine Learning, Tutorial]
tags: [ml-basics, data-preparation, deduplication, data-science, machine-learning-series]
description: "Understanding the crucial steps of data preparation and how to achieve the right model fit."
excerpt: "Learn about data cleaning, deduplication, and how to split your data properly to build effective machine learning models."
---

# Data Science Fundamentals: Getting Your Data Right

Before diving into fancy algorithms and complex models, there's something even more important: your data. As the saying goes, "garbage in, garbage out." Let's learn how to prepare your data properly and avoid common pitfalls.

## The Data Preparation Pipeline

### 1. Data Cleaning Basics
```python
import pandas as pd
import numpy as np

# Load your data
df = pd.read_csv('raw_data.csv')

# Basic cleaning steps
df = df.dropna()  # Remove missing values
df = df.drop_duplicates()  # Remove exact duplicates
```

### 2. Understanding Deduplication

#### What is Deduplication?
Deduplication is removing redundant data points that might skew your model's learning:

- **Exact Duplicates**: Identical rows in your dataset
- **Near Duplicates**: Very similar entries that represent the same information
- **Semantic Duplicates**: Different representations of the same thing

#### Example: Customer Data Deduplication
```python
def normalize_text(text):
    """Basic text normalization"""
    return str(text).lower().strip()

# Create normalized versions of key fields
df['name_normalized'] = df['name'].apply(normalize_text)
df['email_normalized'] = df['email'].apply(normalize_text)

# Find similar entries using fuzzy matching
from fuzzywuzzy import fuzz
def find_similar_entries(df, threshold=80):
    similar_pairs = []
    for i in range(len(df)):
        for j in range(i + 1, len(df)):
            similarity = fuzz.ratio(
                df.iloc[i]['name_normalized'],
                df.iloc[j]['name_normalized']
            )
            if similarity > threshold:
                similar_pairs.append((i, j, similarity))
    return similar_pairs
```

### 3. Feature Scaling and Normalization

Different scales can bias your model:
```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# Standardization (mean=0, std=1)
scaler = StandardScaler()
df_scaled = scaler.fit_transform(df[numeric_columns])

# Normalization (0-1 range)
normalizer = MinMaxScaler()
df_normalized = normalizer.fit_transform(df[numeric_columns])
```

## The Train-Test-Validation Split

### Why Split Your Data?
Imagine studying for an exam using the actual test questions - that's cheating! Similarly, testing your model on training data doesn't prove it can handle new data.

### The Right Way to Split
```python
from sklearn.model_selection import train_test_split

# First split: training and temporary test set
X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Second split: create validation and test sets
X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.5, random_state=42
)

print(f"Training set size: {len(X_train)}")
print(f"Validation set size: {len(X_val)}")
print(f"Test set size: {len(X_test)}")
```

### The Golden Rule: No Leakage!
❌ **Wrong**:
```python
# DON'T DO THIS
scaler.fit(X)  # Fitting on all data
X_scaled = scaler.transform(X)
X_train, X_test = train_test_split(X_scaled, ...)
```

✅ **Right**:
```python
# DO THIS
X_train, X_test = train_test_split(X, ...)
scaler.fit(X_train)  # Fit only on training data
X_train_scaled = scaler.transform(X_train)
X_test_scaled = scaler.transform(X_test)
```

## Understanding Model Fit

### 1. Underfitting: When Your Model Is Too Simple
Think of it like trying to draw a circle using only straight lines.

**Signs of Underfitting:**
- Poor performance on training data
- Poor performance on test data
- Model is too simple for the problem

```python
# Example: Linear model trying to fit non-linear data
from sklearn.linear_model import LinearRegression
model = LinearRegression()  # Might underfit if data is non-linear
```

### 2. Just Right: The Goldilocks Zone
Your model learns the patterns without memorizing the noise.

**Signs of Good Fit:**
- Good performance on training data
- Similar performance on test data
- Model complexity matches problem complexity

```python
# Example: Using cross-validation to verify
from sklearn.model_selection import cross_val_score

scores = cross_val_score(model, X_train, y_train, cv=5)
print(f"Mean CV Score: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})")
```

### 3. Overfitting: When Your Model Memorizes
Like memorizing test answers without understanding the subject.

**Signs of Overfitting:**
- Excellent performance on training data
- Poor performance on test data
- Model is too complex

```python
# Example: Decision tree without proper pruning
from sklearn.tree import DecisionTreeClassifier

# Likely to overfit
complex_tree = DecisionTreeClassifier(max_depth=None)

# Better balanced
balanced_tree = DecisionTreeClassifier(max_depth=3)
```

## Visual Diagnosis

Here's how to visualize model fit:
```python
import matplotlib.pyplot as plt

def plot_learning_curves(model, X_train, X_val, y_train, y_val):
    train_sizes = np.linspace(0.1, 1.0, 10)
    train_scores = []
    val_scores = []
    
    for size in train_sizes:
        # Train on subset
        subset_size = int(len(X_train) * size)
        model.fit(X_train[:subset_size], y_train[:subset_size])
        
        # Record scores
        train_scores.append(model.score(X_train[:subset_size], 
                                      y_train[:subset_size]))
        val_scores.append(model.score(X_val, y_val))
    
    plt.plot(train_sizes, train_scores, 'b-', label='Training score')
    plt.plot(train_sizes, val_scores, 'r-', label='Validation score')
    plt.xlabel('Training set size')
    plt.ylabel('Score')
    plt.legend()
    plt.show()
```

## Best Practices Checklist

1. **Data Preparation**
   - [ ] Remove duplicates
   - [ ] Handle missing values
   - [ ] Scale/normalize features
   - [ ] Check for data leakage

2. **Data Splitting**
   - [ ] Split before any preprocessing
   - [ ] Use stratification for imbalanced data
   - [ ] Keep test set untouched until final evaluation

3. **Model Fitting**
   - [ ] Start simple
   - [ ] Use cross-validation
   - [ ] Monitor training and validation metrics
   - [ ] Apply regularization when needed

## Next Steps

Now that you understand data preparation and model fitting, you might want to explore:
- [Model Evaluation: Beyond Accuracy](/ai/machine%20learning/tutorial/2025/07/02/machine-learning-model-evaluation.html)
- [Cross-Validation and Overfitting](/ai/machine%20learning/tutorial/2025/07/02/machine-learning-cross-validation.html)
- [Feature Engineering: The Art of Creating Better Data](/ai/machine%20learning/tutorial/2025/07/02/machine-learning-feature-engineering.html)

## Key Takeaways

1. Clean and deduplicate your data before modeling
2. Always split your data properly to avoid leakage
3. Watch for signs of underfitting and overfitting
4. Start simple and increase complexity only when needed
5. Use cross-validation to verify your model's performance

Remember: A well-prepared dataset and proper validation strategy are often more important than choosing the "perfect" algorithm!
