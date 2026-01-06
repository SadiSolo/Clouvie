# Backend Development Flowchart & Implementation Guide

## 📋 Document Purpose
This is a step-by-step implementation guide for backend developers to build the Sales Forecasting backend logic that connects to the existing frontend. Follow this flowchart sequentially to ensure complete integration.

---

## 🎯 Overview Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND DEVELOPMENT FLOW                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                   ┌──────────────────────┐
                   │   Phase 1: Setup     │
                   │   - Database         │
                   │   - API Structure    │
                   │   - Dependencies     │
                   └──────────┬───────────┘
                              ↓
                   ┌──────────────────────┐
                   │ Phase 2: Core Models │
                   │ - Forecasting Logic  │
                   │ - Confidence Bands   │
                   └──────────┬───────────┘
                              ↓
                   ┌──────────────────────┐
                   │ Phase 3: Analytics   │
                   │ - Growth Metrics     │
                   │ - Accuracy Calc      │
                   └──────────┬───────────┘
                              ↓
                   ┌──────────────────────┐
                   │ Phase 4: Scenarios   │
                   │ - Price Impact       │
                   │ - Multi-Factor       │
                   └──────────┬───────────┘
                              ↓
                   ┌──────────────────────┐
                   │ Phase 5: Testing     │
                   │ - Validation         │
                   │ - Frontend Connect   │
                   └──────────────────────┘
```

---

## 🔧 Phase 1: Setup & Infrastructure

### Step 1.1: Environment Setup

```
START
  ↓
┌─────────────────────────────────────┐
│ Install Required Dependencies        │
├─────────────────────────────────────┤
│ □ Python 3.9+                        │
│ □ NumPy (pip install numpy)         │
│ □ SciPy (pip install scipy)         │
│ □ Pandas (pip install pandas)       │
│ □ Statsmodels (pip install)         │
│ □ Flask/FastAPI (web framework)     │
│ □ SQLAlchemy (database ORM)         │
│ □ PostgreSQL/MySQL driver           │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Create Project Structure             │
├─────────────────────────────────────┤
│ backend/                             │
│ ├── app.py (main)                    │
│ ├── config.py                        │
│ ├── models/                          │
│ │   ├── __init__.py                  │
│ │   └── sales.py                     │
│ ├── services/                        │
│ │   ├── __init__.py                  │
│ │   ├── forecast_service.py         │
│ │   ├── analytics_service.py        │
│ │   └── scenario_service.py         │
│ ├── routes/                          │
│ │   ├── __init__.py                  │
│ │   ├── sales_routes.py              │
│ │   └── forecast_routes.py           │
│ ├── utils/                           │
│ │   ├── __init__.py                  │
│ │   └── validators.py                │
│ └── tests/                           │
│     └── test_forecast.py             │
└─────────────────────────────────────┘
  ↓
CONTINUE TO STEP 1.2
```

**Code Template:**
```python
# requirements.txt
numpy==1.24.0
scipy==1.11.0
pandas==2.0.0
statsmodels==0.14.0
flask==2.3.0
flask-cors==4.0.0
sqlalchemy==2.0.0
psycopg2-binary==2.9.0
python-dotenv==1.0.0
```

### Step 1.2: Database Setup

```
START
  ↓
┌─────────────────────────────────────┐
│ Design Database Schema               │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Create Tables:                       │
│ 1. sales_history                     │
│ 2. forecast_cache                    │
│ 3. model_accuracy                    │
│ 4. products                          │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Create Indexes for Performance       │
│ - (product_id, date)                 │
│ - (product_id, model_type)           │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Seed with Sample Data                │
│ (for testing)                        │
└─────────────────────────────────────┘
  ↓
CONTINUE TO PHASE 2
```

**SQL Template:**
```sql
-- Step 1.2.1: Create sales_history table
CREATE TABLE sales_history (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    sales_units INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    revenue DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    profit DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_product_date UNIQUE(product_id, date)
);

-- Step 1.2.2: Create index
CREATE INDEX idx_product_date ON sales_history(product_id, date DESC);

-- Step 1.2.3: Create forecast_cache table
CREATE TABLE forecast_cache (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    model_type VARCHAR(20) NOT NULL,
    forecast_period VARCHAR(10) NOT NULL,
    forecast_date DATE NOT NULL,
    predicted_sales DECIMAL(10,2),
    lower_bound DECIMAL(10,2),
    upper_bound DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cache_lookup (product_id, model_type, forecast_period)
);

-- Step 1.2.4: Create model_accuracy table
CREATE TABLE model_accuracy (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    model_type VARCHAR(20) NOT NULL,
    mape DECIMAL(5,2),
    rmse DECIMAL(10,2),
    mae DECIMAL(10,2),
    r_squared DECIMAL(5,4),
    evaluation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📊 Phase 2: Core Forecasting Implementation

### Step 2.1: Implement Linear Regression Forecast

```
START: Build Linear Forecast
  ↓
┌─────────────────────────────────────┐
│ CREATE: forecast_service.py          │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Function: get_sales_history()        │
│ - Query database                     │
│ - Filter by product_id               │
│ - Sort by date ASC                   │
│ - Return array of sales values       │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Function: calculate_linear_forecast()│
│                                      │
│ Input: sales_history[], periods      │
│ Output: forecast[], slope, intercept │
│                                      │
│ Formula:                             │
│ ŷ(t) = α + β × t                    │
│ β = Σ[(t-t̄)(y-ȳ)] / Σ(t-t̄)²       │
│ α = ȳ - β × t̄                       │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ DECISION: Is R² > 0.7?              │
├─────────────────────────────────────┤
│ YES → Model is good                  │
│ NO  → Try exponential smoothing      │
└─────────────────────────────────────┘
  ↓
CONTINUE TO STEP 2.2
```

**Implementation Code:**
```python
# services/forecast_service.py

import numpy as np
from scipy import stats
from datetime import datetime, timedelta
from models.sales import SalesHistory

class ForecastService:
    
    def get_sales_history(self, product_id, days=90):
        """
        Step 2.1.1: Fetch historical sales data
        
        Args:
            product_id: Product identifier
            days: Number of days to retrieve
            
        Returns:
            List of sales values
        """
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        # Query database
        sales_records = SalesHistory.query.filter(
            SalesHistory.product_id == product_id,
            SalesHistory.date.between(start_date, end_date)
        ).order_by(SalesHistory.date.asc()).all()
        
        # Extract sales values
        sales_values = [record.sales_units for record in sales_records]
        dates = [record.date for record in sales_records]
        
        return {
            'sales': sales_values,
            'dates': dates,
            'count': len(sales_values)
        }
    
    def calculate_linear_forecast(self, sales_history, forecast_periods):
        """
        Step 2.1.2: Calculate linear regression forecast
        
        Formula: ŷ(t) = α + β × t
        
        Args:
            sales_history: Array of historical sales
            forecast_periods: Number of future periods
            
        Returns:
            Dictionary with forecast and statistics
        """
        n = len(sales_history)
        
        # Check minimum data requirement
        if n < 14:
            raise ValueError("Minimum 14 days of data required")
        
        # Create time index
        t = np.arange(1, n + 1)
        
        # Calculate linear regression
        slope, intercept, r_value, p_value, std_err = stats.linregress(
            t, sales_history
        )
        
        # Generate forecast
        forecast_t = np.arange(n + 1, n + forecast_periods + 1)
        forecast_values = intercept + slope * forecast_t
        
        # Ensure non-negative forecasts
        forecast_values = np.maximum(forecast_values, 0)
        
        return {
            'forecast': forecast_values.tolist(),
            'slope': float(slope),
            'intercept': float(intercept),
            'r_squared': float(r_value ** 2),
            'std_error': float(std_err),
            'model_type': 'linear'
        }
```

### Step 2.2: Implement Confidence Intervals

```
START: Build Confidence Bands
  ↓
┌─────────────────────────────────────┐
│ Function: calculate_confidence()     │
│                                      │
│ Input: forecast[], sales_history[]   │
│ Output: lower_bounds[], upper_bounds[]│
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 1: Calculate Residuals          │
│                                      │
│ fitted = α + β × t (for history)    │
│ residuals = actual - fitted          │
│ s = √[Σ(residuals²) / (n-2)]        │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 2: Calculate Standard Error     │
│                                      │
│ SE = s × √[1 + 1/n + (t-t̄)²/Σ(t-t̄)²]│
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 3: Apply Z-Score                │
│                                      │
│ z = 1.96 (for 95% confidence)       │
│ Lower = forecast - (z × SE)          │
│ Upper = forecast + (z × SE)          │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 4: Ensure Bounds Make Sense     │
│                                      │
│ IF lower_bound < 0:                  │
│    lower_bound = 0                   │
└─────────────────────────────────────┘
  ↓
CONTINUE TO STEP 2.3
```

**Implementation Code:**
```python
def calculate_confidence_intervals(self, forecast_values, sales_history, 
                                   confidence=0.95):
    """
    Step 2.2: Calculate confidence intervals
    
    Formula: CI = ŷ ± (z × SE)
    
    Args:
        forecast_values: Array of predicted values
        sales_history: Historical sales data
        confidence: Confidence level (0.95 = 95%)
        
    Returns:
        Dictionary with bounds
    """
    import scipy.stats as stats
    
    n = len(sales_history)
    
    # Step 2.2.1: Calculate residual standard error
    t = np.arange(1, n + 1)
    slope, intercept, _, _, _ = stats.linregress(t, sales_history)
    fitted = intercept + slope * t
    residuals = np.array(sales_history) - fitted
    s = np.sqrt(np.sum(residuals ** 2) / (n - 2))
    
    # Step 2.2.2: Z-score for confidence level
    z = stats.norm.ppf((1 + confidence) / 2)
    
    # Step 2.2.3: Calculate bounds for each forecast point
    lower_bounds = []
    upper_bounds = []
    
    t_mean = np.mean(t)
    t_var = np.sum((t - t_mean) ** 2)
    
    for i, forecast in enumerate(forecast_values):
        # Time point for this forecast
        t_forecast = n + i + 1
        
        # Standard error for this point
        se = s * np.sqrt(1 + 1/n + (t_forecast - t_mean)**2 / t_var)
        
        # Confidence interval
        margin = z * se
        lower = max(0, forecast - margin)  # Ensure non-negative
        upper = forecast + margin
        
        lower_bounds.append(round(lower, 2))
        upper_bounds.append(round(upper, 2))
    
    return {
        'lower_bounds': lower_bounds,
        'upper_bounds': upper_bounds,
        'confidence_level': confidence,
        'standard_error': float(s)
    }
```

### Step 2.3: Implement Exponential Smoothing

```
START: Build Exponential Smoothing
  ↓
┌─────────────────────────────────────┐
│ Function: exponential_smoothing()    │
│                                      │
│ Method: Holt's Double Exponential    │
│ (Captures trend)                     │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 1: Initialize                   │
│                                      │
│ level[0] = sales_history[0]         │
│ trend[0] = sales[1] - sales[0]      │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 2: Smooth Historical Data       │
│                                      │
│ FOR each period in history:          │
│   level[t] = α×sales[t] +            │
│              (1-α)×(level[t-1] +     │
│                     trend[t-1])      │
│   trend[t] = β×(level[t]-level[t-1]) │
│              + (1-β)×trend[t-1]      │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 3: Generate Future Forecast     │
│                                      │
│ last_level = level[-1]               │
│ last_trend = trend[-1]               │
│                                      │
│ FOR h = 1 to forecast_periods:       │
│   forecast[h] = last_level +         │
│                 h × last_trend       │
└─────────────────────────────────────┘
  ↓
CONTINUE TO PHASE 3
```

**Implementation Code:**
```python
def calculate_exponential_smoothing(self, sales_history, forecast_periods, 
                                   alpha=0.3, beta=0.1):
    """
    Step 2.3: Double exponential smoothing (Holt's method)
    
    Formula:
    Level: L(t) = α×D(t) + (1-α)×(L(t-1)+T(t-1))
    Trend: T(t) = β×(L(t)-L(t-1)) + (1-β)×T(t-1)
    
    Args:
        sales_history: Array of historical sales
        forecast_periods: Number of periods to forecast
        alpha: Level smoothing (0.1-0.5)
        beta: Trend smoothing (0.05-0.3)
        
    Returns:
        Dictionary with forecast
    """
    n = len(sales_history)
    
    # Check minimum data
    if n < 30:
        raise ValueError("Minimum 30 days required for exponential smoothing")
    
    # Step 2.3.1: Initialize
    level = [float(sales_history[0])]
    trend = [float(sales_history[1] - sales_history[0])]
    
    # Step 2.3.2: Smooth historical data
    for i in range(1, n):
        new_level = (alpha * sales_history[i] + 
                    (1 - alpha) * (level[i-1] + trend[i-1]))
        new_trend = (beta * (new_level - level[i-1]) + 
                    (1 - beta) * trend[i-1])
        level.append(new_level)
        trend.append(new_trend)
    
    # Step 2.3.3: Generate future forecast
    last_level = level[-1]
    last_trend = trend[-1]
    
    future_forecast = []
    for h in range(1, forecast_periods + 1):
        forecast_value = last_level + h * last_trend
        future_forecast.append(max(0, round(forecast_value, 2)))
    
    return {
        'forecast': future_forecast,
        'last_level': float(last_level),
        'last_trend': float(last_trend),
        'model_type': 'exponential_smoothing'
    }
```

---

## 📈 Phase 3: Analytics Implementation

### Step 3.1: Growth Metrics Calculator

```
START: Build Growth Analytics
  ↓
┌─────────────────────────────────────┐
│ Function: calculate_growth_metrics() │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 1: Calculate Averages           │
│                                      │
│ hist_avg = mean(historical_sales)    │
│ forecast_avg = mean(forecast_sales)  │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 2: Calculate Growth Rate        │
│                                      │
│ growth_rate = (forecast_avg -        │
│                hist_avg) /           │
│                hist_avg × 100        │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 3: Calculate CAGR               │
│                                      │
│ years = days / 365                   │
│ CAGR = ((final/initial)^(1/years)    │
│         - 1) × 100                   │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 4: Determine Trend Direction    │
│                                      │
│ recent_avg = mean(last 7 days)       │
│ previous_avg = mean(7 days before)   │
│                                      │
│ IF recent_avg > previous_avg:        │
│    trend = "up"                      │
│ ELSE:                                │
│    trend = "down"                    │
└─────────────────────────────────────┘
  ↓
CONTINUE TO STEP 3.2
```

**Implementation Code:**
```python
# services/analytics_service.py

class AnalyticsService:
    
    def calculate_growth_metrics(self, historical_sales, forecast_sales):
        """
        Step 3.1: Calculate comprehensive growth statistics
        
        Formulas:
        - Growth% = (Forecast_Avg - Hist_Avg) / Hist_Avg × 100
        - CAGR = ((Final/Initial)^(1/years) - 1) × 100
        
        Args:
            historical_sales: Array of past sales
            forecast_sales: Array of predicted sales
            
        Returns:
            Dictionary with growth metrics
        """
        # Step 3.1.1: Calculate averages
        hist_avg = np.mean(historical_sales)
        forecast_avg = np.mean(forecast_sales)
        
        # Step 3.1.2: Simple growth rate
        growth_rate = ((forecast_avg - hist_avg) / hist_avg) * 100
        
        # Step 3.1.3: CAGR (assuming daily data)
        n_days = len(historical_sales)
        years = n_days / 365.0
        initial_value = historical_sales[0]
        final_value = forecast_sales[-1]
        
        if initial_value > 0 and years > 0:
            cagr = (np.power(final_value / initial_value, 1/years) - 1) * 100
        else:
            cagr = 0
        
        # Step 3.1.4: Trend direction
        if len(historical_sales) >= 14:
            recent_avg = np.mean(historical_sales[-7:])
            previous_avg = np.mean(historical_sales[-14:-7])
            trend_direction = 'up' if recent_avg > previous_avg else 'down'
        else:
            trend_direction = 'neutral'
        
        # Step 3.1.5: Momentum (30-day)
        if len(historical_sales) >= 30:
            momentum = ((historical_sales[-1] - historical_sales[-30]) / 
                       historical_sales[-30]) * 100
        else:
            momentum = 0
        
        return {
            'historical_avg': round(hist_avg, 2),
            'forecast_avg': round(forecast_avg, 2),
            'growth_rate_percent': round(growth_rate, 2),
            'cagr_percent': round(cagr, 2),
            'trend_direction': trend_direction,
            'momentum_percent': round(momentum, 2)
        }
```

### Step 3.2: Accuracy Metrics Calculator

```
START: Build Accuracy Calculator
  ↓
┌─────────────────────────────────────┐
│ Function: calculate_accuracy()       │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 1: Split Data                   │
│                                      │
│ train_data = history[:-30]           │
│ test_data = history[-30:]            │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 2: Generate Forecast on Train   │
│                                      │
│ predicted = forecast(train_data, 30) │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 3: Calculate MAPE               │
│                                      │
│ MAPE = (100/n) × Σ|(actual-pred)/   │
│                     actual|          │
│ Accuracy% = 100 - MAPE               │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 4: Calculate RMSE               │
│                                      │
│ RMSE = √[(Σ(actual-pred)²) / n]     │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 5: Calculate R²                 │
│                                      │
│ SS_res = Σ(actual-pred)²             │
│ SS_tot = Σ(actual-mean)²             │
│ R² = 1 - (SS_res/SS_tot)             │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 6: Determine Quality Level      │
│                                      │
│ IF MAPE < 10: quality = "excellent"  │
│ ELIF MAPE < 20: quality = "good"     │
│ ELIF MAPE < 50: quality = "fair"     │
│ ELSE: quality = "poor"               │
└─────────────────────────────────────┘
  ↓
CONTINUE TO PHASE 4
```

**Implementation Code:**
```python
def calculate_accuracy_metrics(self, actual, predicted):
    """
    Step 3.2: Calculate comprehensive accuracy metrics
    
    Formulas:
    - MAPE = (100/n) × Σ|(actual-forecast)/actual|
    - RMSE = √[(Σ(actual-forecast)²) / n]
    - R² = 1 - (SS_res/SS_tot)
    
    Args:
        actual: Array of actual values
        predicted: Array of predicted values
        
    Returns:
        Dictionary with accuracy metrics
    """
    actual = np.array(actual)
    predicted = np.array(predicted)
    n = len(actual)
    
    # Step 3.2.1: MAPE (Mean Absolute Percentage Error)
    # Avoid division by zero
    non_zero_mask = actual != 0
    if np.sum(non_zero_mask) > 0:
        mape = np.mean(
            np.abs((actual[non_zero_mask] - predicted[non_zero_mask]) / 
                   actual[non_zero_mask])
        ) * 100
        accuracy_percent = 100 - mape
    else:
        mape = 100
        accuracy_percent = 0
    
    # Step 3.2.2: RMSE
    rmse = np.sqrt(np.mean((actual - predicted) ** 2))
    
    # Step 3.2.3: MAE
    mae = np.mean(np.abs(actual - predicted))
    
    # Step 3.2.4: R-squared
    ss_res = np.sum((actual - predicted) ** 2)
    ss_tot = np.sum((actual - np.mean(actual)) ** 2)
    
    if ss_tot > 0:
        r_squared = 1 - (ss_res / ss_tot)
    else:
        r_squared = 0
    
    # Step 3.2.5: Bias
    bias = np.mean(predicted - actual)
    
    # Step 3.2.6: Determine quality level
    if mape < 10:
        quality = 'excellent'
    elif mape < 20:
        quality = 'good'
    elif mape < 50:
        quality = 'fair'
    else:
        quality = 'poor'
    
    return {
        'mape_percent': round(mape, 2),
        'accuracy_percent': round(accuracy_percent, 2),
        'rmse': round(rmse, 2),
        'mae': round(mae, 2),
        'r_squared': round(r_squared, 3),
        'bias': round(bias, 2),
        'quality': quality
    }
```

---

## 🎭 Phase 4: Scenario Analysis Implementation

### Step 4.1: Price Scenario Calculator

```
START: Build Price Scenario Engine
  ↓
┌─────────────────────────────────────┐
│ Function: calculate_price_scenario() │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ INPUT PARAMETERS:                    │
│ - current_price                      │
│ - current_demand                     │
│ - cost_per_unit                      │
│ - price_change_percent               │
│ - elasticity (default: -1.5)        │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 1: Calculate New Price          │
│                                      │
│ new_price = current_price ×          │
│             (1 + price_change%/100)  │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 2: Calculate Demand Impact      │
│                                      │
│ demand_change = elasticity ×         │
│                 (price_change/100)   │
│ new_demand = current_demand ×        │
│              (1 + demand_change)     │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 3: Calculate Revenue Impact     │
│                                      │
│ current_revenue = current_price ×    │
│                   current_demand     │
│ new_revenue = new_price × new_demand │
│ revenue_change% = (new - current) /  │
│                   current × 100      │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ STEP 4: Calculate Profit Impact      │
│                                      │
│ current_profit = (price - cost) ×    │
│                  demand              │
│ new_profit = (new_price - cost) ×    │
│              new_demand              │
│ profit_change% = (new - current) /   │
│                  current × 100       │
└─────────────────────────────────────┘
  ↓
CONTINUE TO STEP 4.2
```

**Implementation Code:**
```python
# services/scenario_service.py

class ScenarioService:
    
    def calculate_price_scenario(self, current_price, current_demand, 
                                cost, price_change_percent, 
                                elasticity=-1.5):
        """
        Step 4.1: Calculate what-if scenario for price change
        
        Formulas:
        - New Demand = Current × (1 + Elasticity × Price_Change%)
        - Revenue = Price × Demand
        - Profit = (Price - Cost) × Demand
        
        Args:
            current_price: Current selling price
            current_demand: Current demand (units)
            cost: Per-unit cost
            price_change_percent: Price change (-15 to +15)
            elasticity: Price elasticity coefficient
            
        Returns:
            Dictionary with scenario outcomes
        """
        # Step 4.1.1: Calculate new price
        price_change_decimal = price_change_percent / 100
        new_price = current_price * (1 + price_change_decimal)
        
        # Step 4.1.2: Calculate demand impact
        demand_change_decimal = elasticity * price_change_decimal
        new_demand = current_demand * (1 + demand_change_decimal)
        
        # Ensure non-negative demand
        new_demand = max(0, new_demand)
        
        # Step 4.1.3: Current metrics
        current_revenue = current_price * current_demand
        current_profit = (current_price - cost) * current_demand
        
        # Step 4.1.4: New metrics
        new_revenue = new_price * new_demand
        new_profit = (new_price - cost) * new_demand
        
        # Step 4.1.5: Calculate changes
        revenue_change = ((new_revenue - current_revenue) / 
                         current_revenue) * 100 if current_revenue > 0 else 0
        profit_change = ((new_profit - current_profit) / 
                        current_profit) * 100 if current_profit > 0 else 0
        demand_change = demand_change_decimal * 100
        
        return {
            'price_change_percent': round(price_change_percent, 2),
            'new_price': round(new_price, 2),
            'demand_change_percent': round(demand_change, 2),
            'new_demand': round(new_demand),
            'revenue_change_percent': round(revenue_change, 2),
            'new_revenue': round(new_revenue, 2),
            'profit_change_percent': round(profit_change, 2),
            'new_profit': round(new_profit, 2)
        }
```

### Step 4.2: Multi-Factor Scenario Calculator

```
START: Build Multi-Factor Engine
  ↓
┌─────────────────────────────────────┐
│ Function:                            │
│ calculate_multi_factor_scenario()    │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ INPUT FACTORS:                       │
│ 1. Price Change (%)                  │
│ 2. Marketing Spend ($)               │
│ 3. Seasonal Factor (0.5-1.5)         │
│ 4. Competitor Change (%)             │
│ 5. Discount (%)                      │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ CALCULATE INDIVIDUAL IMPACTS:        │
│                                      │
│ 1. price_impact =                    │
│    elasticity × (price_change/100)   │
│                                      │
│ 2. marketing_impact =                │
│    ln(1 + spend/1000) × 0.15         │
│                                      │
│ 3. seasonal_impact =                 │
│    seasonal_factor - 1               │
│                                      │
│ 4. competitor_impact =               │
│    -(competitor_change/100) × 0.3    │
│                                      │
│ 5. discount_impact =                 │
│    (discount/100) × 0.8              │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ SUM ALL IMPACTS:                     │
│                                      │
│ total_change = price_impact +        │
│                marketing_impact +    │
│                seasonal_impact +     │
│                competitor_impact +   │
│                discount_impact       │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ CALCULATE NEW DEMAND:                │
│                                      │
│ new_demand = base_demand ×           │
│              (1 + total_change)      │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ CALCULATE EFFECTIVE PRICE:           │
│                                      │
│ effective_price = current_price ×    │
│   (1 + price_change%) ×              │
│   (1 - discount%)                    │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ CALCULATE REVENUE & PROFIT:          │
│                                      │
│ revenue = effective_price × demand   │
│ profit = (effective_price - cost) ×  │
│          demand                      │
└─────────────────────────────────────┘
  ↓
CONTINUE TO PHASE 5
```

**Implementation Code:**
```python
def calculate_multi_factor_scenario(self, base_demand, current_price, 
                                   cost, price_change=0, 
                                   marketing_spend=0, seasonal_factor=1.0,
                                   competitor_change=0, discount=0, 
                                   elasticity=-1.5):
    """
    Step 4.2: Calculate scenario with multiple factors
    
    Total Impact = Sum of all individual factor impacts
    
    Args:
        base_demand: Baseline demand (units)
        current_price: Current price
        cost: Unit cost
        price_change: Price change percentage
        marketing_spend: Marketing budget ($)
        seasonal_factor: Seasonal multiplier (0.5-1.5)
        competitor_change: Competitor price change (%)
        discount: Discount percentage (0-50)
        elasticity: Price elasticity
        
    Returns:
        Dictionary with comprehensive results
    """
    # Step 4.2.1: Calculate individual impacts
    price_impact = elasticity * (price_change / 100)
    
    marketing_impact = np.log(1 + marketing_spend / 1000) * 0.15
    
    seasonal_impact = seasonal_factor - 1
    
    competitor_impact = -(competitor_change / 100) * 0.3
    
    discount_impact = (discount / 100) * 0.8
    
    # Step 4.2.2: Total demand change
    total_demand_change = (price_impact + marketing_impact + 
                          seasonal_impact + competitor_impact + 
                          discount_impact)
    
    # Step 4.2.3: Calculate new demand
    new_demand = base_demand * (1 + total_demand_change)
    new_demand = max(0, new_demand)
    
    # Step 4.2.4: Calculate effective price
    effective_price = (current_price * (1 + price_change / 100) * 
                      (1 - discount / 100))
    
    # Step 4.2.5: Revenue and profit
    current_revenue = current_price * base_demand
    new_revenue = effective_price * new_demand
    revenue_change = ((new_revenue - current_revenue) / 
                     current_revenue) * 100 if current_revenue > 0 else 0
    
    current_profit = (current_price - cost) * base_demand
    new_profit = (effective_price - cost) * new_demand
    profit_change = ((new_profit - current_profit) / 
                    current_profit) * 100 if current_profit > 0 else 0
    
    return {
        'factors': {
            'price_impact_percent': round(price_impact * 100, 2),
            'marketing_impact_percent': round(marketing_impact * 100, 2),
            'seasonal_impact_percent': round(seasonal_impact * 100, 2),
            'competitor_impact_percent': round(competitor_impact * 100, 2),
            'discount_impact_percent': round(discount_impact * 100, 2)
        },
        'total_demand_change_percent': round(total_demand_change * 100, 2),
        'new_demand': round(new_demand),
        'effective_price': round(effective_price, 2),
        'new_revenue': round(new_revenue, 2),
        'revenue_change_percent': round(revenue_change, 2),
        'new_profit': round(new_profit, 2),
        'profit_change_percent': round(profit_change, 2)
    }
```

---

## 🌐 Phase 5: API Endpoints & Testing

### Step 5.1: Create API Routes

```
START: Build API Endpoints
  ↓
┌─────────────────────────────────────┐
│ ENDPOINT 1:                          │
│ GET /api/sales/history/:productId    │
│                                      │
│ Returns: Historical sales data       │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ ENDPOINT 2:                          │
│ GET /api/forecast/sales/:productId   │
│                                      │
│ Query Params:                        │
│ - period (7d, 30d, 90d, 1y)         │
│ - model (ai, linear, exponential)    │
│                                      │
│ Returns: Forecast with confidence    │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ ENDPOINT 3:                          │
│ GET /api/analytics/growth/:productId │
│                                      │
│ Returns: Growth metrics              │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ ENDPOINT 4:                          │
│ GET /api/forecast/accuracy/:productId│
│                                      │
│ Returns: Model accuracy metrics      │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ ENDPOINT 5:                          │
│ POST /api/forecast/scenarios         │
│                                      │
│ Body: scenario parameters            │
│ Returns: Preset scenarios results    │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ ENDPOINT 6:                          │
│ POST /api/forecast/custom            │
│                                      │
│ Body: custom factors                 │
│ Returns: Multi-factor results        │
└─────────────────────────────────────┘
  ↓
CONTINUE TO STEP 5.2
```

**Implementation Code:**
```python
# routes/forecast_routes.py

from flask import Blueprint, request, jsonify
from services.forecast_service import ForecastService
from services.analytics_service import AnalyticsService
from services.scenario_service import ScenarioService

forecast_bp = Blueprint('forecast', __name__)
forecast_service = ForecastService()
analytics_service = AnalyticsService()
scenario_service = ScenarioService()

@forecast_bp.route('/api/sales/history/<product_id>', methods=['GET'])
def get_sales_history(product_id):
    """
    Step 5.1.1: Sales history endpoint
    """
    try:
        period = request.args.get('period', '30d')
        days = parse_period_to_days(period)
        
        history = forecast_service.get_sales_history(product_id, days)
        
        return jsonify({
            'product_id': product_id,
            'period': period,
            'data_points': history['count'],
            'history': history['data']
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@forecast_bp.route('/api/forecast/sales/<product_id>', methods=['GET'])
def get_sales_forecast(product_id):
    """
    Step 5.1.2: Sales forecast endpoint
    """
    try:
        period = request.args.get('period', '30d')
        model = request.args.get('model', 'ai')
        include_confidence = request.args.get('include_confidence', 'true') == 'true'
        
        days = parse_period_to_days(period)
        
        # Get historical data
        history = forecast_service.get_sales_history(product_id, days * 3)
        sales_history = history['sales']
        
        # Generate forecast based on model
        if model == 'linear':
            forecast_result = forecast_service.calculate_linear_forecast(
                sales_history, days
            )
        elif model == 'exponential':
            forecast_result = forecast_service.calculate_exponential_smoothing(
                sales_history, days
            )
        else:  # ai (default to exponential smoothing)
            forecast_result = forecast_service.calculate_exponential_smoothing(
                sales_history, days
            )
        
        # Calculate confidence intervals if requested
        if include_confidence:
            confidence = forecast_service.calculate_confidence_intervals(
                forecast_result['forecast'], 
                sales_history
            )
            forecast_result.update(confidence)
        
        return jsonify({
            'product_id': product_id,
            'model': model,
            'forecast_period': period,
            'forecast': forecast_result
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@forecast_bp.route('/api/analytics/growth/<product_id>', methods=['GET'])
def get_growth_analytics(product_id):
    """
    Step 5.1.3: Growth analytics endpoint
    """
    try:
        # Get historical and forecast data
        history = forecast_service.get_sales_history(product_id, 90)
        forecast = forecast_service.calculate_linear_forecast(
            history['sales'], 30
        )
        
        # Calculate growth metrics
        metrics = analytics_service.calculate_growth_metrics(
            history['sales'],
            forecast['forecast']
        )
        
        return jsonify({
            'product_id': product_id,
            'growth_metrics': metrics
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@forecast_bp.route('/api/forecast/scenarios', methods=['POST'])
def calculate_scenarios():
    """
    Step 5.1.4: Price scenarios endpoint
    """
    try:
        data = request.get_json()
        
        scenarios = []
        preset_changes = [-15, -10, 0, 5, 12]
        names = ['Aggressive Discount', 'Moderate Discount', 'Base Case', 
                'Slight Increase', 'Premium Pricing']
        
        for i, change in enumerate(preset_changes):
            result = scenario_service.calculate_price_scenario(
                data['current_price'],
                data['current_demand'],
                data['cost'],
                change,
                data.get('elasticity', -1.5)
            )
            result['name'] = names[i]
            scenarios.append(result)
        
        return jsonify({
            'scenarios': scenarios
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@forecast_bp.route('/api/forecast/custom', methods=['POST'])
def calculate_custom_scenario():
    """
    Step 5.1.5: Custom scenario endpoint
    """
    try:
        data = request.get_json()
        factors = data.get('factors', {})
        
        result = scenario_service.calculate_multi_factor_scenario(
            data['base_demand'],
            data['current_price'],
            data['cost'],
            factors.get('price_change', 0),
            factors.get('marketing_spend', 0),
            factors.get('seasonal_factor', 1.0),
            factors.get('competitor_change', 0),
            factors.get('discount', 0),
            data.get('elasticity', -1.5)
        )
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def parse_period_to_days(period):
    """Helper function to convert period string to days"""
    mapping = {'7d': 7, '30d': 30, '90d': 90, '1y': 365}
    return mapping.get(period, 30)
```

### Step 5.2: Testing Flow

```
START: Testing Phase
  ↓
┌─────────────────────────────────────┐
│ TEST 1: Unit Tests                   │
│                                      │
│ □ Test linear forecast calculation   │
│ □ Test confidence interval calc      │
│ □ Test growth metrics                │
│ □ Test accuracy metrics              │
│ □ Test price scenario                │
│ □ Test multi-factor scenario         │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ TEST 2: Integration Tests            │
│                                      │
│ □ Test API endpoint responses        │
│ □ Test database queries              │
│ □ Test error handling                │
│ □ Test data validation               │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ TEST 3: Frontend Integration         │
│                                      │
│ □ Connect frontend to API            │
│ □ Test data flow                     │
│ □ Verify chart rendering             │
│ □ Test scenario interactions         │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ TEST 4: Performance Tests            │
│                                      │
│ □ Test with large datasets           │
│ □ Measure response times             │
│ □ Test concurrent requests           │
│ □ Optimize queries if needed         │
└─────────────────────────────────────┘
  ↓
DEPLOYMENT READY
```

---

## 🔄 Complete Implementation Flow

### Master Flowchart

```
                    START BACKEND DEVELOPMENT
                              ↓
        ┌─────────────────────────────────────────────┐
        │         PHASE 1: SETUP (Week 1)              │
        ├─────────────────────────────────────────────┤
        │ □ Install dependencies                       │
        │ □ Create project structure                   │
        │ □ Setup database schema                      │
        │ □ Seed test data                             │
        └────────────────┬────────────────────────────┘
                         ↓
        ┌─────────────────────────────────────────────┐
        │    PHASE 2: CORE FORECASTING (Week 2-3)     │
        ├─────────────────────────────────────────────┤
        │ □ Implement get_sales_history()             │
        │ □ Implement linear_forecast()                │
        │ □ Implement confidence_intervals()           │
        │ □ Implement exponential_smoothing()          │
        │ □ Test forecasting accuracy                  │
        └────────────────┬────────────────────────────┘
                         ↓
        ┌─────────────────────────────────────────────┐
        │       PHASE 3: ANALYTICS (Week 4)            │
        ├─────────────────────────────────────────────┤
        │ □ Implement growth_metrics()                 │
        │ □ Implement accuracy_metrics()               │
        │ □ Create analytics endpoints                 │
        │ □ Test calculations                          │
        └────────────────┬────────────────────────────┘
                         ↓
        ┌─────────────────────────────────────────────┐
        │     PHASE 4: SCENARIOS (Week 5-6)            │
        ├─────────────────────────────────────────────┤
        │ □ Implement price_scenario()                 │
        │ □ Implement multi_factor_scenario()          │
        │ □ Create scenario endpoints                  │
        │ □ Test all scenarios                         │
        └────────────────┬────────────────────────────┘
                         ↓
        ┌─────────────────────────────────────────────┐
        │    PHASE 5: INTEGRATION (Week 7-8)           │
        ├─────────────────────────────────────────────┤
        │ □ Create all API endpoints                   │
        │ □ Add error handling                         │
        │ □ Add request validation                     │
        │ □ Connect to frontend                        │
        │ □ Comprehensive testing                      │
        │ □ Performance optimization                   │
        │ □ Documentation                              │
        └────────────────┬────────────────────────────┘
                         ↓
                  DEPLOYMENT READY
```

---

## 🎯 Priority Checklist for Developers

### Week 1: Foundation
- [ ] Setup Python environment
- [ ] Install all dependencies
- [ ] Create database tables
- [ ] Insert test data (at least 90 days)
- [ ] Test database connections

### Week 2: Core Forecasting
- [ ] Implement `get_sales_history()`
- [ ] Implement `calculate_linear_forecast()`
- [ ] Implement `calculate_confidence_intervals()`
- [ ] Create `/api/forecast/sales/:id` endpoint
- [ ] Test with frontend chart

### Week 3: Additional Models
- [ ] Implement `calculate_exponential_smoothing()`
- [ ] Add model selection logic
- [ ] Test all 3 models (AI, Linear, Exponential)
- [ ] Verify confidence bands display

### Week 4: Analytics
- [ ] Implement `calculate_growth_metrics()`
- [ ] Implement `calculate_accuracy_metrics()`
- [ ] Create `/api/analytics/growth/:id` endpoint
- [ ] Create `/api/forecast/accuracy/:id` endpoint
- [ ] Connect to frontend cards

### Week 5-6: Scenarios
- [ ] Implement `calculate_price_scenario()`
- [ ] Implement `calculate_multi_factor_scenario()`
- [ ] Create `/api/forecast/scenarios` endpoint
- [ ] Create `/api/forecast/custom` endpoint
- [ ] Test with frontend sliders

### Week 7-8: Polish & Deploy
- [ ] Add comprehensive error handling
- [ ] Add input validation
- [ ] Write unit tests (80%+ coverage)
- [ ] Performance optimization
- [ ] API documentation
- [ ] Deploy to staging
- [ ] Integration testing with frontend
- [ ] Deploy to production

---

## 📚 Quick Reference: Formula → Code Mapping

| Formula | Function | File | Line |
|---------|----------|------|------|
| `ŷ(t) = α + β × t` | `calculate_linear_forecast()` | forecast_service.py | 45 |
| `CI = ŷ ± 1.96 × SE` | `calculate_confidence_intervals()` | forecast_service.py | 95 |
| `Growth% = (F_avg - H_avg) / H_avg × 100` | `calculate_growth_metrics()` | analytics_service.py | 12 |
| `MAPE = (100/n) × Σ\|(A-F)/A\|` | `calculate_accuracy_metrics()` | analytics_service.py | 58 |
| `New_D = Curr_D × (1 + E × ΔP%)` | `calculate_price_scenario()` | scenario_service.py | 15 |
| `Total = Σ(all factors)` | `calculate_multi_factor_scenario()` | scenario_service.py | 78 |

---

## ⚠️ Common Pitfalls to Avoid

```
┌────────────────────────────────────────────────────────┐
│ PITFALL 1: Not checking for minimum data               │
│ SOLUTION: Always verify len(sales_history) >= 14       │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ PITFALL 2: Division by zero in MAPE calculation        │
│ SOLUTION: Filter out zero values before calculation    │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ PITFALL 3: Negative forecast values                    │
│ SOLUTION: Use max(0, forecast_value) after calculation │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ PITFALL 4: Not handling missing data                   │
│ SOLUTION: Interpolate or skip missing dates            │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ PITFALL 5: Slow queries on large datasets              │
│ SOLUTION: Add database indexes, use caching            │
└────────────────────────────────────────────────────────┘
```

---

**Document Version**: 1.0  
**Last Updated**: January 3, 2026  
**Maintained By**: Clouvie Development Team  
**Status**: Ready for Implementation

---

## Next Steps

1. Review this flowchart completely
2. Set up your development environment
3. Start with Phase 1 (Setup)
4. Follow each phase sequentially
5. Test after each implementation
6. Connect to frontend incrementally
7. Iterate based on testing results

**Good luck with the implementation! 🚀**
