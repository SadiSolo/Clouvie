# Sales Forecasting Module - Backend Formulas & Logic

## 📋 Document Overview

This document provides the complete mathematical foundation for the Sales Forecasting backend. Each section maps directly to frontend features in `src/pages/SalesForecasting.tsx`.

---

## 🗂️ Table of Contents

### Part A: Core Formulas (Basic Implementation)
1. [Time Series Forecasting Models](#1-time-series-forecasting-models)
2. [Confidence Interval Calculation](#2-confidence-interval-calculation)
3. [Trend Analysis & Growth Rates](#3-trend-analysis--growth-rates)
4. [Accuracy Metrics & Validation](#4-accuracy-metrics--validation)

### Part B: Advanced Features (Enhanced Implementation)
5. [What-If Scenario Analysis](#5-what-if-scenario-analysis)
6. [Multi-Factor Impact Modeling](#6-multi-factor-impact-modeling)
7. [Seasonal Decomposition](#7-seasonal-decomposition)
8. [Scenario Comparison Engine](#8-scenario-comparison-engine)

### Part C: Implementation Guide
9. [Frontend-Backend Mapping](#9-frontend-backend-mapping)
10. [API Endpoints Structure](#10-api-endpoints-structure)
11. [Data Requirements](#11-data-requirements)
12. [Implementation Phases](#12-implementation-phases)

---

## 🔗 Quick Frontend-Backend Mapping

| Frontend Feature | Backend Formula Section | API Endpoint (Future) |
|-----------------|------------------------|----------------------|
| Forecast Chart (Main) | [Section 1](#1-time-series-forecasting-models) | `GET /api/forecast/sales/:productId` |
| Confidence Bands | [Section 2](#2-confidence-interval-calculation) | Part of sales response |
| Avg Daily Sales Card | [Section 3](#3-trend-analysis--growth-rates) | `GET /api/analytics/growth/:productId` |
| Model Accuracy Badge | [Section 4](#4-accuracy-metrics--validation) | `GET /api/forecast/accuracy/:productId` |
| Preset Scenarios | [Section 5](#5-what-if-scenario-analysis) | `POST /api/forecast/scenarios` |
| Custom Scenario Builder | [Section 6](#6-multi-factor-impact-modeling) | `POST /api/forecast/custom-scenario` |
| Seasonal Adjustments | [Section 7](#7-seasonal-decomposition) | `GET /api/analytics/seasonality/:productId` |
| Scenario Comparison Chart | [Section 8](#8-scenario-comparison-engine) | Part of scenarios response |

---

---

# PART A: CORE FORMULAS (Basic Implementation)

## 1. Time Series Forecasting Models

### 🎯 Purpose
Generate future sales predictions using historical data and multiple forecasting algorithms (AI, Linear, Exponential).

### 📍 Frontend Location
- **File**: `src/pages/SalesForecasting.tsx`
- **Component**: Main Forecast Chart (Lines 315-435)
- **Visual**: Purple dashed line showing predicted sales with confidence bands
- **Controls**: Forecast Model selector (AI/Linear/Exponential) at Lines 256-266

### 📐 Formulas

#### Linear Regression Forecast
```
ŷ(t) = α + β × t

Where:
- ŷ(t) = Predicted sales at time t
- α = Intercept (baseline sales)
- β = Slope (trend coefficient)
- t = Time period

Calculating β and α:
β = Σ[(t - t̄)(y - ȳ)] / Σ(t - t̄)²
α = ȳ - β × t̄
```

#### Exponential Smoothing (AI Model Base)
```
S(t) = α × Y(t-1) + (1 - α) × S(t-1)

Where:
- S(t) = Smoothed value at time t
- Y(t-1) = Actual value at previous period
- α = Smoothing parameter (0 < α < 1)
- Typical α = 0.3 for sales data

For forecast:
F(t+h) = S(t) + h × b(t)
b(t) = β × (S(t) - S(t-1)) + (1 - β) × b(t-1)
```

#### Exponential Growth Model
```
ŷ(t) = a × e^(b×t)

Or in log form:
ln(ŷ(t)) = ln(a) + b × t

Growth rate per period: g = e^b - 1
```

### 📝 Step-by-Step Example

**Given**: 30 days of historical sales data
- Day 1: 950 units
- Day 2: 980 units
- ...
- Day 30: 1150 units

**Calculate Linear Forecast for Day 31-60**:

```javascript
// Step 1: Calculate mean
const t_values = Array.from({length: 30}, (_, i) => i + 1);
const t_mean = 15.5;
const y_mean = 1045; // Average sales

// Step 2: Calculate slope
let numerator = 0;
let denominator = 0;
for (let i = 0; i < 30; i++) {
  numerator += (t_values[i] - t_mean) * (sales[i] - y_mean);
  denominator += Math.pow(t_values[i] - t_mean, 2);
}
const beta = numerator / denominator; // = 5.2

// Step 3: Calculate intercept
const alpha = y_mean - beta * t_mean; // = 964.4

// Step 4: Forecast Day 31
const forecast_day_31 = alpha + beta * 31;
// = 964.4 + 5.2 × 31 = 1125.6 units
```

### 📊 Backend Implementation

```python
import numpy as np
from scipy import stats

def forecast_linear(sales_history, forecast_periods):
    """
    Linear regression forecast
    
    Args:
        sales_history: array of historical sales [y1, y2, ..., yn]
        forecast_periods: number of future periods to predict
    
    Returns:
        dict: forecast values and statistics
    """
    n = len(sales_history)
    t = np.arange(1, n + 1)
    
    # Calculate linear regression
    slope, intercept, r_value, p_value, std_err = stats.linregress(t, sales_history)
    
    # Generate forecast
    forecast_t = np.arange(n + 1, n + forecast_periods + 1)
    forecast_values = intercept + slope * forecast_t
    
    return {
        'forecast': forecast_values.tolist(),
        'slope': slope,
        'intercept': intercept,
        'r_squared': r_value ** 2,
        'std_error': std_err
    }


def forecast_exponential_smoothing(sales_history, forecast_periods, alpha=0.3, beta=0.1):
    """
    Double exponential smoothing (Holt's method)
    
    Args:
        sales_history: array of historical sales
        forecast_periods: number of periods to forecast
        alpha: level smoothing parameter
        beta: trend smoothing parameter
    
    Returns:
        dict: forecast values
    """
    n = len(sales_history)
    
    # Initialize
    level = [sales_history[0]]
    trend = [sales_history[1] - sales_history[0]]
    forecast = [level[0] + trend[0]]
    
    # Smooth historical data
    for i in range(1, n):
        level.append(alpha * sales_history[i] + (1 - alpha) * (level[i-1] + trend[i-1]))
        trend.append(beta * (level[i] - level[i-1]) + (1 - beta) * trend[i-1])
        forecast.append(level[i] + trend[i])
    
    # Generate future forecast
    last_level = level[-1]
    last_trend = trend[-1]
    
    future_forecast = []
    for h in range(1, forecast_periods + 1):
        future_forecast.append(last_level + h * last_trend)
    
    return {
        'forecast': future_forecast,
        'last_level': last_level,
        'last_trend': last_trend
    }


def forecast_exponential_growth(sales_history, forecast_periods):
    """
    Exponential growth model
    
    Args:
        sales_history: array of historical sales
        forecast_periods: number of periods to forecast
    
    Returns:
        dict: forecast and growth rate
    """
    n = len(sales_history)
    t = np.arange(1, n + 1)
    
    # Log transform
    log_sales = np.log(sales_history)
    
    # Linear regression on log values
    slope, intercept, r_value, _, _ = stats.linregress(t, log_sales)
    
    # Calculate growth rate
    growth_rate = np.exp(slope) - 1
    
    # Generate forecast
    forecast_t = np.arange(n + 1, n + forecast_periods + 1)
    log_forecast = intercept + slope * forecast_t
    forecast_values = np.exp(log_forecast)
    
    return {
        'forecast': forecast_values.tolist(),
        'growth_rate': growth_rate,
        'growth_rate_percent': growth_rate * 100
    }
```

---

## 2. Confidence Interval Calculation

### 🎯 Purpose
Calculate upper and lower bounds for forecast predictions to show uncertainty range.

### 📍 Frontend Location
- **File**: `src/pages/SalesForecasting.tsx`
- **Component**: Shaded area on forecast chart (Lines 370-395)
- **Visual**: Purple gradient confidence band around forecast line
- **Variable**: `lowerBound` and `upperBound` in data (Lines 107-109)

### 📐 Formulas

#### Standard Error of Forecast
```
SE(ŷ) = s × √[1 + 1/n + (t - t̄)² / Σ(t - t̄)²]

Where:
- s = Standard deviation of residuals
- n = Number of historical observations
- t = Forecast time point
- t̄ = Mean of historical time points

Residual standard deviation:
s = √[Σ(y - ŷ)² / (n - 2)]
```

#### Confidence Interval (95%)
```
CI(95%) = ŷ ± (1.96 × SE(ŷ))

Lower Bound = ŷ - 1.96 × SE(ŷ)
Upper Bound = ŷ + 1.96 × SE(ŷ)

For different confidence levels:
- 90% CI: ŷ ± 1.645 × SE(ŷ)
- 95% CI: ŷ ± 1.96 × SE(ŷ)
- 99% CI: ŷ ± 2.576 × SE(ŷ)
```

#### Time-Dependent Uncertainty
```
Uncertainty increases with forecast horizon:

Uncertainty(t) = base_uncertainty × (1 + 0.2 × t/T)

Where:
- t = Days into forecast
- T = Total forecast period
- Base uncertainty = 0.15 (15% initial)
```

### 📊 Backend Implementation

```python
def calculate_confidence_intervals(forecast_values, sales_history, confidence=0.95):
    """
    Calculate confidence intervals for forecast
    
    Args:
        forecast_values: array of predicted values
        sales_history: historical sales data
        confidence: confidence level (0.95 = 95%)
    
    Returns:
        dict: lower and upper bounds
    """
    import scipy.stats as stats
    
    n = len(sales_history)
    
    # Calculate residual standard error
    t = np.arange(1, n + 1)
    slope, intercept, _, _, _ = stats.linregress(t, sales_history)
    fitted = intercept + slope * t
    residuals = sales_history - fitted
    s = np.sqrt(np.sum(residuals ** 2) / (n - 2))
    
    # Z-score for confidence level
    z = stats.norm.ppf((1 + confidence) / 2)
    
    # Calculate bounds for each forecast point
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
        lower_bounds.append(forecast - margin)
        upper_bounds.append(forecast + margin)
    
    return {
        'lower_bounds': lower_bounds,
        'upper_bounds': upper_bounds,
        'confidence_level': confidence,
        'standard_error': s
    }


def calculate_expanding_uncertainty(forecast_values, base_uncertainty=0.15):
    """
    Calculate time-expanding confidence bands
    
    Args:
        forecast_values: array of predicted values
        base_uncertainty: initial uncertainty (15% default)
    
    Returns:
        dict: bounds with expanding uncertainty
    """
    n = len(forecast_values)
    lower_bounds = []
    upper_bounds = []
    
    for i, value in enumerate(forecast_values):
        # Uncertainty grows with forecast horizon
        uncertainty = base_uncertainty * (1 + 0.2 * i / n)
        
        lower = value * (1 - uncertainty)
        upper = value * (1 + uncertainty)
        
        lower_bounds.append(lower)
        upper_bounds.append(upper)
    
    return {
        'lower_bounds': lower_bounds,
        'upper_bounds': upper_bounds,
        'uncertainty_range': [base_uncertainty, uncertainty]
    }
```

---

## 3. Trend Analysis & Growth Rates

### 🎯 Purpose
Calculate growth trends, compare historical vs forecast performance, and identify sales momentum.

### 📍 Frontend Location
- **File**: `src/pages/SalesForecasting.tsx`
- **Component**: "Avg Daily Sales" card (Lines 267-286)
- **Visual**: Blue gradient card with growth percentage badge
- **Calculation**: Lines 234-238 (`avgHistoricalSales`, `avgForecastSales`, `forecastGrowth`)

### 📐 Formulas

#### Average Growth Rate
```
Growth Rate = ((Forecast_Avg - Historical_Avg) / Historical_Avg) × 100%

Historical Average:
Avg_hist = (Σ Sales_historical) / n_hist

Forecast Average:
Avg_forecast = (Σ Sales_forecast) / n_forecast
```

#### Compound Annual Growth Rate (CAGR)
```
CAGR = ((Final_Value / Initial_Value)^(1/n) - 1) × 100%

Where:
- n = Number of years (or periods/365 for daily data)
```

#### Moving Average Trend
```
MA(t, k) = (Σ Sales(t-k+1 to t)) / k

Where:
- k = Window size (e.g., 7 for weekly, 30 for monthly)

Trend direction:
If MA(t) > MA(t-1): Uptrend
If MA(t) < MA(t-1): Downtrend
```

#### Momentum Indicator
```
Momentum = (Current_Value - Value_n_periods_ago) / Value_n_periods_ago × 100%

Rate of Change (ROC):
ROC = ((Price(t) - Price(t-n)) / Price(t-n)) × 100
```

### 📊 Backend Implementation

```python
def calculate_growth_metrics(historical_sales, forecast_sales):
    """
    Calculate comprehensive growth statistics
    
    Args:
        historical_sales: array of past sales
        forecast_sales: array of predicted sales
    
    Returns:
        dict: growth metrics
    """
    # Averages
    hist_avg = np.mean(historical_sales)
    forecast_avg = np.mean(forecast_sales)
    
    # Simple growth rate
    growth_rate = ((forecast_avg - hist_avg) / hist_avg) * 100
    
    # CAGR (assuming daily data, annualized)
    n_days = len(historical_sales)
    years = n_days / 365
    initial_value = historical_sales[0]
    final_value = forecast_sales[-1]
    cagr = (np.power(final_value / initial_value, 1/years) - 1) * 100
    
    # Trend direction
    recent_avg = np.mean(historical_sales[-7:])  # Last week
    previous_avg = np.mean(historical_sales[-14:-7])  # Week before
    trend_direction = 'up' if recent_avg > previous_avg else 'down'
    
    # Momentum
    momentum = ((historical_sales[-1] - historical_sales[-30]) / historical_sales[-30]) * 100
    
    return {
        'historical_avg': round(hist_avg, 2),
        'forecast_avg': round(forecast_avg, 2),
        'growth_rate_percent': round(growth_rate, 2),
        'cagr_percent': round(cagr, 2),
        'trend_direction': trend_direction,
        'momentum_percent': round(momentum, 2)
    }


def calculate_moving_averages(sales_data, windows=[7, 30]):
    """
    Calculate multiple moving averages
    
    Args:
        sales_data: array of sales values
        windows: list of MA window sizes
    
    Returns:
        dict: moving averages for each window
    """
    mas = {}
    
    for window in windows:
        ma_values = []
        for i in range(len(sales_data)):
            if i < window - 1:
                ma_values.append(None)
            else:
                ma = np.mean(sales_data[i-window+1:i+1])
                ma_values.append(round(ma, 2))
        
        mas[f'MA{window}'] = ma_values
    
    # Detect crossovers (bullish/bearish signals)
    if 7 in windows and 30 in windows:
        ma7 = mas['MA7'][-1]
        ma30 = mas['MA30'][-1]
        signal = 'bullish' if ma7 > ma30 else 'bearish' if ma7 < ma30 else 'neutral'
        mas['signal'] = signal
    
    return mas
```

---

## 4. Accuracy Metrics & Validation

### 🎯 Purpose
Measure forecast model accuracy and reliability to build user confidence.

### 📍 Frontend Location
- **File**: `src/pages/SalesForecasting.tsx`
- **Component**: "Model Accuracy" card (Lines 305-314)
- **Visual**: Orange gradient card showing 94% accuracy
- **Display**: Model type badge (AI/LINEAR/EXPO)

### 📐 Formulas

#### Mean Absolute Percentage Error (MAPE)
```
MAPE = (100% / n) × Σ|((Actual - Forecast) / Actual)|

Interpretation:
- MAPE < 10%: Excellent accuracy
- MAPE 10-20%: Good accuracy
- MAPE 20-50%: Reasonable accuracy
- MAPE > 50%: Poor accuracy

Accuracy % = 100% - MAPE
```

#### Root Mean Square Error (RMSE)
```
RMSE = √[(Σ(Actual - Forecast)²) / n]

Lower RMSE = Better accuracy
```

#### Mean Absolute Error (MAE)
```
MAE = (Σ|Actual - Forecast|) / n
```

#### R-Squared (Coefficient of Determination)
```
R² = 1 - (SS_res / SS_tot)

Where:
- SS_res = Σ(y_actual - y_forecast)² (Residual sum of squares)
- SS_tot = Σ(y_actual - y_mean)² (Total sum of squares)

Interpretation:
- R² = 1.0: Perfect fit
- R² > 0.9: Excellent
- R² 0.7-0.9: Good
- R² < 0.7: Needs improvement
```

#### Forecast Bias
```
Bias = (Σ(Forecast - Actual)) / n

Positive bias: Model over-predicts
Negative bias: Model under-predicts
Near zero: Unbiased model (ideal)
```

### 📊 Backend Implementation

```python
def calculate_accuracy_metrics(actual, predicted):
    """
    Calculate comprehensive accuracy metrics
    
    Args:
        actual: array of actual sales values
        predicted: array of predicted sales values
    
    Returns:
        dict: accuracy metrics
    """
    actual = np.array(actual)
    predicted = np.array(predicted)
    n = len(actual)
    
    # MAPE
    mape = np.mean(np.abs((actual - predicted) / actual)) * 100
    accuracy_percent = 100 - mape
    
    # RMSE
    rmse = np.sqrt(np.mean((actual - predicted) ** 2))
    
    # MAE
    mae = np.mean(np.abs(actual - predicted))
    
    # R-squared
    ss_res = np.sum((actual - predicted) ** 2)
    ss_tot = np.sum((actual - np.mean(actual)) ** 2)
    r_squared = 1 - (ss_res / ss_tot)
    
    # Bias
    bias = np.mean(predicted - actual)
    
    # Determine quality level
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


def validate_forecast_model(historical_data, forecast_function, validation_size=30):
    """
    Validate forecast accuracy using hold-out method
    
    Args:
        historical_data: full historical dataset
        forecast_function: function that generates forecast
        validation_size: number of recent periods to hold out
    
    Returns:
        dict: validation results
    """
    # Split data
    train_data = historical_data[:-validation_size]
    test_data = historical_data[-validation_size:]
    
    # Generate forecast on training data
    forecast = forecast_function(train_data, validation_size)
    
    # Calculate accuracy metrics
    metrics = calculate_accuracy_metrics(test_data, forecast['forecast'])
    
    return {
        'validation_metrics': metrics,
        'train_size': len(train_data),
        'test_size': validation_size,
        'validated': True
    }
```

---

---

# PART B: ADVANCED FEATURES (Enhanced Implementation)

## 5. What-If Scenario Analysis

### 🎯 Purpose
Calculate impact of price changes on sales, revenue, and profit using elasticity models.

### 📍 Frontend Location
- **File**: `src/pages/SalesForecasting.tsx`
- **Component**: Preset Scenarios section (Lines 462-508)
- **Visual**: 5 scenario cards showing price changes from -15% to +12%
- **Calculation**: `calculateScenario` function (Lines 119-140)

### 📐 Formulas

#### Price Elasticity of Demand
```
Elasticity (E) = (% Change in Quantity) / (% Change in Price)

For elastic demand (E < -1):
- Price ↑ 10% → Quantity ↓ more than 10%
- Revenue impact uncertain

For inelastic demand (-1 < E < 0):
- Price ↑ 10% → Quantity ↓ less than 10%
- Revenue increases
```

#### Demand Impact from Price Change
```
New Demand = Current Demand × (1 + E × Price_Change%)

Example:
- Current demand: 1000 units
- Elasticity: -1.5
- Price change: +10%

New Demand = 1000 × (1 + (-1.5) × 0.10)
           = 1000 × (1 - 0.15)
           = 850 units
```

#### Revenue Impact
```
Current Revenue = Current_Price × Current_Demand
New Revenue = New_Price × New_Demand

Revenue Change % = ((New_Revenue - Current_Revenue) / Current_Revenue) × 100%
```

#### Profit Impact
```
Profit = (Price - Cost) × Demand

Assuming Cost stays constant:
New Profit = (New_Price - Cost) × New_Demand
Profit Change % = ((New_Profit - Current_Profit) / Current_Profit) × 100%
```

### 📊 Backend Implementation

```python
def calculate_price_scenario(current_price, current_demand, cost, 
                             price_change_percent, elasticity):
    """
    Calculate what-if scenario for price change
    
    Args:
        current_price: current selling price
        current_demand: current demand (units)
        cost: per-unit cost
        price_change_percent: price change as percentage (e.g., 10 for +10%)
        elasticity: price elasticity coefficient (negative number)
    
    Returns:
        dict: scenario outcomes
    """
    # Calculate new price
    price_change_decimal = price_change_percent / 100
    new_price = current_price * (1 + price_change_decimal)
    
    # Calculate demand impact
    demand_change_decimal = elasticity * price_change_decimal
    new_demand = current_demand * (1 + demand_change_decimal)
    
    # Current metrics
    current_revenue = current_price * current_demand
    current_profit = (current_price - cost) * current_demand
    
    # New metrics
    new_revenue = new_price * new_demand
    new_profit = (new_price - cost) * new_demand
    
    # Changes
    revenue_change = ((new_revenue - current_revenue) / current_revenue) * 100
    profit_change = ((new_profit - current_profit) / current_profit) * 100
    demand_change = (demand_change_decimal) * 100
    
    return {
        'price_change_percent': price_change_percent,
        'new_price': round(new_price, 2),
        'demand_change_percent': round(demand_change, 2),
        'new_demand': round(new_demand),
        'revenue_change_percent': round(revenue_change, 2),
        'new_revenue': round(new_revenue, 2),
        'profit_change_percent': round(profit_change, 2),
        'new_profit': round(new_profit, 2)
    }


def generate_scenario_matrix(current_price, current_demand, cost, elasticity):
    """
    Generate multiple preset scenarios
    
    Returns:
        list: array of scenario results
    """
    scenarios = [
        {'name': 'Aggressive Discount', 'change': -15, 'color': '#ef4444'},
        {'name': 'Moderate Discount', 'change': -10, 'color': '#f97316'},
        {'name': 'Base Case', 'change': 0, 'color': '#3b82f6'},
        {'name': 'Slight Increase', 'change': 5, 'color': '#8b5cf6'},
        {'name': 'Premium Pricing', 'change': 12, 'color': '#ec4899'}
    ]
    
    results = []
    for scenario in scenarios:
        calc = calculate_price_scenario(
            current_price, current_demand, cost, 
            scenario['change'], elasticity
        )
        calc.update({'name': scenario['name'], 'color': scenario['color']})
        results.append(calc)
    
    return results
```

---

## 6. Multi-Factor Impact Modeling

### 🎯 Purpose
Model complex scenarios with multiple variables: price, marketing, seasonality, competition, discounts.

### 📍 Frontend Location
- **File**: `src/pages/SalesForecasting.tsx`
- **Component**: Custom Scenario Builder (Lines 540-695)
- **Visual**: 5 sliders for different factors with real-time results
- **Calculation**: `calculateCustomScenario` function (Lines 177-201)

### 📐 Formulas

#### Multi-Factor Demand Model
```
Total Demand Change = Price Impact + Marketing Impact + 
                     Seasonal Impact + Competitor Impact + Discount Impact

New Demand = Base Demand × (1 + Total Demand Change)
```

#### Individual Factor Impacts

**1. Price Impact**:
```
Price Impact = Elasticity × (Price_Change% / 100)
```

**2. Marketing Impact** (Logarithmic):
```
Marketing Impact = ln(1 + Marketing_Spend / 1000) × 0.15

Rationale: Diminishing returns on marketing spend
```

**3. Seasonal Factor**:
```
Seasonal Impact = Seasonal_Multiplier - 1

Where Seasonal_Multiplier ranges:
- 0.5 = Low season (50% of normal)
- 1.0 = Normal season
- 1.5 = Peak season (150% of normal)
```

**4. Competitor Impact**:
```
Competitor Impact = -(Competitor_Price_Change% / 100) × 0.3

If competitor drops price 10%:
Impact = -0.10 × 0.3 = -3% demand loss
```

**5. Discount Impact**:
```
Discount Impact = (Discount% / 100) × 0.8

20% discount → +16% demand boost
```

#### Effective Price Calculation
```
Effective Price = Listed_Price × (1 + Price_Change%) × (1 - Discount%)
```

### 📊 Backend Implementation

```python
def calculate_multi_factor_scenario(base_demand, current_price, cost, 
                                   price_change=0, marketing_spend=0,
                                   seasonal_factor=1.0, competitor_change=0,
                                   discount=0, elasticity=-1.5):
    """
    Calculate scenario with multiple factors
    
    Args:
        base_demand: baseline demand (units)
        current_price: current price
        cost: unit cost
        price_change: price change percentage
        marketing_spend: marketing budget ($)
        seasonal_factor: seasonal multiplier (0.5-1.5)
        competitor_change: competitor price change (%)
        discount: discount percentage (0-50)
        elasticity: price elasticity
    
    Returns:
        dict: comprehensive scenario results
    """
    # Calculate individual impacts
    price_impact = elasticity * (price_change / 100)
    
    marketing_impact = np.log(1 + marketing_spend / 1000) * 0.15
    
    seasonal_impact = seasonal_factor - 1
    
    competitor_impact = -(competitor_change / 100) * 0.3
    
    discount_impact = (discount / 100) * 0.8
    
    # Total demand change
    total_demand_change = (price_impact + marketing_impact + 
                          seasonal_impact + competitor_impact + discount_impact)
    
    new_demand = base_demand * (1 + total_demand_change)
    
    # Calculate effective price
    effective_price = current_price * (1 + price_change / 100) * (1 - discount / 100)
    
    # Revenue and profit
    current_revenue = current_price * base_demand
    new_revenue = effective_price * new_demand
    revenue_change = ((new_revenue - current_revenue) / current_revenue) * 100
    
    current_profit = (current_price - cost) * base_demand
    new_profit = (effective_price - cost) * new_demand
    profit_change = ((new_profit - current_profit) / current_profit) * 100
    
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

## 7. Seasonal Decomposition

### 🎯 Purpose
Separate sales data into trend, seasonal, and random components for better forecasting.

### 📍 Frontend Location
- **File**: `src/pages/SalesForecasting.tsx`
- **Component**: Historical data generation (Lines 41-72)
- **Calculation**: Seasonality pattern using sine wave (Line 52: `Math.sin(i / 7) * 50`)
- **Note**: Not explicitly visualized but built into forecast calculations

### 📐 Formulas

#### Additive Decomposition
```
Y(t) = T(t) + S(t) + R(t)

Where:
- Y(t) = Observed value at time t
- T(t) = Trend component
- S(t) = Seasonal component
- R(t) = Random/Residual component
```

#### Multiplicative Decomposition
```
Y(t) = T(t) × S(t) × R(t)

Better for data where seasonal variation increases with trend level
```

#### Seasonal Index Calculation
```
Seasonal Index(month) = (Avg for that month) / (Overall average) × 100

Example:
- December average sales: 1500 units
- Overall monthly average: 1200 units
- December seasonal index = (1500/1200) × 100 = 125

Index > 100: Above-average season
Index < 100: Below-average season
```

#### Deseasonalized Data
```
Deseasonalized Value = Actual Value / Seasonal Index × 100
```

### 📊 Backend Implementation

```python
from statsmodels.tsa.seasonal import seasonal_decompose

def decompose_sales_series(sales_data, period=7):
    """
    Decompose sales time series into components
    
    Args:
        sales_data: array of sales values
        period: seasonal period (7 for weekly, 30 for monthly)
    
    Returns:
        dict: decomposed components
    """
    # Perform decomposition
    decomposition = seasonal_decompose(sales_data, model='additive', period=period)
    
    trend = decomposition.trend
    seasonal = decomposition.seasonal
    residual = decomposition.resid
    
    return {
        'trend': [float(x) if not np.isnan(x) else None for x in trend],
        'seasonal': [float(x) for x in seasonal],
        'residual': [float(x) if not np.isnan(x) else None for x in residual],
        'period': period
    }


def calculate_seasonal_indices(sales_data, period=12):
    """
    Calculate seasonal indices for each period
    
    Args:
        sales_data: array of sales values
        period: number of seasons (12 for monthly, 4 for quarterly)
    
    Returns:
        dict: seasonal indices
    """
    n = len(sales_data)
    
    # Group by season
    seasonal_groups = [[] for _ in range(period)]
    for i, value in enumerate(sales_data):
        season = i % period
        seasonal_groups[season].append(value)
    
    # Calculate average for each season
    seasonal_avgs = [np.mean(group) for group in seasonal_groups]
    overall_avg = np.mean(sales_data)
    
    # Calculate indices
    seasonal_indices = [(avg / overall_avg) * 100 for avg in seasonal_avgs]
    
    return {
        'indices': [round(idx, 2) for idx in seasonal_indices],
        'season_averages': [round(avg, 2) for avg in seasonal_avgs],
        'overall_average': round(overall_avg, 2),
        'period': period
    }


def forecast_with_seasonality(trend_forecast, seasonal_indices):
    """
    Apply seasonal adjustment to trend forecast
    
    Args:
        trend_forecast: array of trend-based forecasts
        seasonal_indices: seasonal index for each period
    
    Returns:
        array: seasonally-adjusted forecast
    """
    adjusted_forecast = []
    period = len(seasonal_indices)
    
    for i, forecast_value in enumerate(trend_forecast):
        season = i % period
        seasonal_factor = seasonal_indices[season] / 100
        adjusted_value = forecast_value * seasonal_factor
        adjusted_forecast.append(round(adjusted_value, 2))
    
    return adjusted_forecast
```

---

## 8. Scenario Comparison Engine

### 🎯 Purpose
Compare multiple scenarios side-by-side to identify optimal pricing strategy.

### 📍 Frontend Location
- **File**: `src/pages/SalesForecasting.tsx`
- **Component**: Scenario Comparison Chart (Lines 509-536)
- **Visual**: Bar chart showing profit for each scenario
- **Data**: `scenarioComparisonData` generated at Lines 167-175

### 📐 Formulas

#### Scenario Ranking
```
Score = (Profit_Weight × Profit_Change%) + 
        (Revenue_Weight × Revenue_Change%) + 
        (Risk_Weight × (100 - Risk%))

Default weights:
- Profit_Weight = 0.5
- Revenue_Weight = 0.3
- Risk_Weight = 0.2
```

#### Risk Assessment
```
Risk Score = |Price_Change%| × Demand_Volatility × Market_Uncertainty

Where:
- Demand_Volatility = Standard deviation of historical demand / Mean
- Market_Uncertainty = External factor (0.5-1.5)

Risk Level:
- Low: Risk Score < 20
- Medium: Risk Score 20-40
- High: Risk Score > 40
```

#### Optimal Scenario Selection
```
Best Scenario = MAX(Expected_Profit × (1 - Risk_Factor))

Risk-Adjusted Return = Expected_Profit / (1 + Risk_Score/100)
```

### 📊 Backend Implementation

```python
def compare_scenarios(scenarios_list, profit_weight=0.5, revenue_weight=0.3, risk_weight=0.2):
    """
    Compare and rank multiple scenarios
    
    Args:
        scenarios_list: list of scenario dicts
        profit_weight: importance of profit (0-1)
        revenue_weight: importance of revenue (0-1)
        risk_weight: importance of risk mitigation (0-1)
    
    Returns:
        list: ranked scenarios with scores
    """
    scored_scenarios = []
    
    for scenario in scenarios_list:
        # Calculate risk score
        risk_score = abs(scenario['price_change_percent']) * 2
        
        # Calculate composite score
        score = (profit_weight * scenario['profit_change_percent'] +
                revenue_weight * scenario['revenue_change_percent'] +
                risk_weight * (100 - risk_score))
        
        # Risk-adjusted return
        risk_adjusted_return = scenario['new_profit'] / (1 + risk_score / 100)
        
        scenario['score'] = round(score, 2)
        scenario['risk_score'] = round(risk_score, 2)
        scenario['risk_adjusted_return'] = round(risk_adjusted_return, 2)
        scenario['risk_level'] = 'low' if risk_score < 20 else 'medium' if risk_score < 40 else 'high'
        
        scored_scenarios.append(scenario)
    
    # Sort by score (descending)
    scored_scenarios.sort(key=lambda x: x['score'], reverse=True)
    
    # Add rank
    for i, scenario in enumerate(scored_scenarios):
        scenario['rank'] = i + 1
    
    return scored_scenarios


def find_optimal_scenario(scenarios_list, objective='profit'):
    """
    Find optimal scenario based on objective
    
    Args:
        scenarios_list: list of scenario dicts
        objective: 'profit', 'revenue', 'risk_adjusted', or 'balanced'
    
    Returns:
        dict: optimal scenario
    """
    if objective == 'profit':
        optimal = max(scenarios_list, key=lambda x: x['new_profit'])
    elif objective == 'revenue':
        optimal = max(scenarios_list, key=lambda x: x['new_revenue'])
    elif objective == 'risk_adjusted':
        optimal = max(scenarios_list, key=lambda x: x.get('risk_adjusted_return', 0))
    else:  # balanced
        optimal = max(scenarios_list, key=lambda x: x.get('score', 0))
    
    optimal['is_optimal'] = True
    optimal['objective'] = objective
    
    return optimal


def generate_comparison_chart_data(scenarios_list, metric='profit'):
    """
    Prepare data for scenario comparison visualization
    
    Args:
        scenarios_list: list of scenario dicts
        metric: 'profit', 'revenue', or 'sales'
    
    Returns:
        list: chart-ready data
    """
    chart_data = []
    
    for scenario in scenarios_list:
        if metric == 'profit':
            value = scenario['new_profit']
        elif metric == 'revenue':
            value = scenario['new_revenue']
        else:  # sales
            value = scenario['new_demand']
        
        chart_data.append({
            'name': scenario['name'],
            metric: round(value),
            'fill': scenario.get('color', '#3b82f6')
        })
    
    return chart_data
```

---

---

# PART C: IMPLEMENTATION GUIDE

## 9. Frontend-Backend Mapping

### Complete Integration Map

| Frontend Component | Location | Backend Formula | API Endpoint | Data Flow |
|-------------------|----------|-----------------|--------------|-----------|
| **Product Selector** | Lines 223-236 | N/A | `GET /api/products/list` | Load product options |
| **Forecast Period Buttons** | Lines 238-253 | N/A | Query parameter | ?period=7d/30d/90d/1y |
| **Forecast Model Selector** | Lines 255-267 | [Section 1](#1-time-series-forecasting-models) | Query parameter | ?model=ai/linear/exponential |
| **Historical Line (Blue)** | Lines 396-403 | N/A | `GET /api/sales/history/:id` | Past sales data |
| **Forecast Line (Purple)** | Lines 405-412 | [Section 1](#1-time-series-forecasting-models) | `GET /api/forecast/sales/:id` | Predicted sales |
| **Confidence Bands** | Lines 370-395 | [Section 2](#2-confidence-interval-calculation) | Part of forecast response | Upper/lower bounds |
| **Avg Daily Sales Card** | Lines 267-286 | [Section 3](#3-trend-analysis--growth-rates) | `GET /api/analytics/growth/:id` | Growth metrics |
| **Projected Revenue Card** | Lines 288-296 | Calculated | Summed from forecast | Total forecast revenue |
| **Projected Profit Card** | Lines 298-303 | Calculated | Summed from forecast | Total forecast profit |
| **Model Accuracy Card** | Lines 305-314 | [Section 4](#4-accuracy-metrics--validation) | `GET /api/forecast/accuracy/:id` | MAPE/R² metrics |
| **Preset Scenarios** | Lines 462-508 | [Section 5](#5-what-if-scenario-analysis) | `POST /api/forecast/scenarios` | Price change impacts |
| **Custom Sliders** | Lines 540-628 | [Section 6](#6-multi-factor-impact-modeling) | `POST /api/forecast/custom` | Multi-factor analysis |
| **Scenario Comparison Chart** | Lines 509-536 | [Section 8](#8-scenario-comparison-engine) | Part of scenarios response | Bar chart data |

---

## 10. API Endpoints Structure

### 1. Sales History Endpoint

**GET /api/sales/history/:productId**

```json
Query Parameters:
{
  "period": "30d",  // 7d, 30d, 90d, 1y
  "include_prices": true
}

Response:
{
  "product_id": "P001",
  "period": "30d",
  "data_points": 30,
  "history": [
    {
      "date": "2025-11-29",
      "sales_units": 1020,
      "price": 12.99,
      "revenue": 13249.80,
      "profit": 4637.43
    },
    ...
  ],
  "summary": {
    "avg_daily_sales": 1045,
    "total_revenue": 408390,
    "avg_price": 12.99
  }
}
```

### 2. Sales Forecast Endpoint

**GET /api/forecast/sales/:productId**

Uses: [Section 1 - Time Series Forecasting](#1-time-series-forecasting-models)

```json
Query Parameters:
{
  "period": "30d",
  "model": "ai",  // ai, linear, exponential
  "include_confidence": true
}

Response:
{
  "product_id": "P001",
  "model": "ai",
  "forecast_period": "30d",
  "forecast": [
    {
      "date": "2025-12-30",
      "predicted_sales": 1125,
      "predicted_price": 14.49,
      "predicted_revenue": 16301.25,
      "predicted_profit": 5705.44,
      "lower_bound": 956,
      "upper_bound": 1294
    },
    ...
  ],
  "model_info": {
    "accuracy_percent": 94.2,
    "rmse": 45.3,
    "r_squared": 0.91
  }
}
```

### 3. Growth Analytics Endpoint

**GET /api/analytics/growth/:productId**

Uses: [Section 3 - Trend Analysis](#3-trend-analysis--growth-rates)

```json
Response:
{
  "product_id": "P001",
  "historical_avg": 1045,
  "forecast_avg": 1128,
  "growth_rate_percent": 7.9,
  "cagr_percent": 31.2,
  "trend_direction": "up",
  "momentum_percent": 15.3,
  "moving_averages": {
    "MA7": 1098,
    "MA30": 1045,
    "signal": "bullish"
  }
}
```

### 4. Model Accuracy Endpoint

**GET /api/forecast/accuracy/:productId**

Uses: [Section 4 - Accuracy Metrics](#4-accuracy-metrics--validation)

```json
Response:
{
  "product_id": "P001",
  "model": "ai",
  "accuracy_percent": 94.2,
  "mape_percent": 5.8,
  "rmse": 45.3,
  "mae": 38.7,
  "r_squared": 0.91,
  "bias": -2.3,
  "quality": "excellent",
  "validation": {
    "method": "hold_out",
    "test_size": 30,
    "validated": true
  }
}
```

### 5. Price Scenarios Endpoint

**POST /api/forecast/scenarios**

Uses: [Section 5 - What-If Analysis](#5-what-if-scenario-analysis)

```json
Request:
{
  "product_id": "P001",
  "current_price": 12.99,
  "current_demand": 1000,
  "cost": 8.50,
  "elasticity": -1.5,
  "scenarios": [
    {"name": "Aggressive Discount", "price_change": -15},
    {"name": "Moderate Discount", "price_change": -10},
    {"name": "Base Case", "price_change": 0},
    {"name": "Slight Increase", "price_change": 5},
    {"name": "Premium Pricing", "price_change": 12}
  ]
}

Response:
{
  "scenarios": [
    {
      "name": "Aggressive Discount",
      "price_change_percent": -15,
      "new_price": 11.04,
      "demand_change_percent": 22.5,
      "new_demand": 1225,
      "revenue_change_percent": 4.1,
      "new_revenue": 13524,
      "profit_change_percent": -12.3,
      "new_profit": 3111,
      "risk_level": "medium"
    },
    ...
  ],
  "optimal_scenario": {
    "name": "Slight Increase",
    "reason": "Highest risk-adjusted profit"
  }
}
```

### 6. Custom Scenario Endpoint

**POST /api/forecast/custom**

Uses: [Section 6 - Multi-Factor Impact Modeling](#6-multi-factor-impact-modeling)

```json
Request:
{
  "product_id": "P001",
  "base_demand": 1000,
  "current_price": 12.99,
  "cost": 8.50,
  "factors": {
    "price_change": 5,
    "marketing_spend": 2000,
    "seasonal_factor": 1.2,
    "competitor_change": -10,
    "discount": 0
  },
  "elasticity": -1.5
}

Response:
{
  "factor_impacts": {
    "price_impact_percent": -7.5,
    "marketing_impact_percent": 10.2,
    "seasonal_impact_percent": 20.0,
    "competitor_impact_percent": 3.0,
    "discount_impact_percent": 0.0
  },
  "total_demand_change_percent": 25.7,
  "new_demand": 1257,
  "effective_price": 13.64,
  "new_revenue": 17145,
  "revenue_change_percent": 32.0,
  "new_profit": 6462,
  "profit_change_percent": 82.1
}
```

---

## 11. Data Requirements

### Database Schema

#### Sales History Table
```sql
CREATE TABLE sales_history (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    sales_units INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    revenue DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    profit DECIMAL(10,2) NOT NULL,
    promotion_active BOOLEAN DEFAULT FALSE,
    INDEX idx_product_date (product_id, date DESC)
);
```

#### Forecast Cache Table
```sql
CREATE TABLE forecast_cache (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    model_type VARCHAR(20) NOT NULL,
    forecast_period VARCHAR(10) NOT NULL,
    forecast_date DATE NOT NULL,
    predicted_sales INTEGER,
    lower_bound INTEGER,
    upper_bound INTEGER,
    confidence DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_forecast_lookup (product_id, model_type, forecast_period)
);
```

#### Model Accuracy Table
```sql
CREATE TABLE model_accuracy (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    model_type VARCHAR(20) NOT NULL,
    evaluation_date DATE NOT NULL,
    mape DECIMAL(5,2),
    rmse DECIMAL(10,2),
    mae DECIMAL(10,2),
    r_squared DECIMAL(5,4),
    data_points INTEGER,
    INDEX idx_model_accuracy (product_id, model_type, evaluation_date DESC)
);
```

### Minimum Data Requirements

| Calculation | Minimum Data | Recommended |
|------------|-------------|-------------|
| **Linear Forecast** | 14 days | 30+ days |
| **Exponential Smoothing** | 30 days | 90+ days |
| **Seasonal Decomposition** | 2 full cycles | 12+ months |
| **Accuracy Validation** | 30 days test set | 90 days |
| **Elasticity Calculation** | 2+ price changes | 5+ price changes |

---

## 12. Implementation Phases

### Phase 1: Core Forecasting (Week 1-2)

**Tasks:**
1. Implement linear regression forecast ([Section 1](#1-time-series-forecasting-models))
2. Build confidence interval calculator ([Section 2](#2-confidence-interval-calculation))
3. Create sales history API endpoint
4. Implement forecast API endpoint

**Deliverables:**
- `GET /api/sales/history/:id` working
- `GET /api/forecast/sales/:id` with linear model
- Basic confidence bands

**Frontend Integration:**
- Connect forecast chart to API
- Display confidence bands
- Show historical vs forecast data

---

### Phase 2: Model Enhancement (Week 3-4)

**Tasks:**
1. Add exponential smoothing model
2. Add exponential growth model
3. Implement model accuracy metrics ([Section 4](#4-accuracy-metrics--validation))
4. Build model comparison system

**Deliverables:**
- All 3 forecast models operational
- Model accuracy endpoint
- Validation framework

**Frontend Integration:**
- Enable model selector dropdown
- Display accuracy percentage
- Update charts based on model selection

---

### Phase 3: What-If Analysis (Week 5-6)

**Tasks:**
1. Implement price scenario calculator ([Section 5](#5-what-if-scenario-analysis))
2. Build preset scenarios endpoint
3. Add elasticity-based demand modeling
4. Create scenario comparison engine ([Section 8](#8-scenario-comparison-engine))

**Deliverables:**
- `POST /api/forecast/scenarios` working
- 5 preset scenarios calculated
- Scenario ranking algorithm

**Frontend Integration:**
- Display preset scenario cards
- Show scenario comparison chart
- Enable scenario selection

---

### Phase 4: Advanced Modeling (Week 7-8)

**Tasks:**
1. Implement multi-factor model ([Section 6](#6-multi-factor-impact-modeling))
2. Add seasonal decomposition ([Section 7](#7-seasonal-decomposition))
3. Build custom scenario endpoint
4. Add growth analytics ([Section 3](#3-trend-analysis--growth-rates))

**Deliverables:**
- `POST /api/forecast/custom` working
- `GET /api/analytics/growth/:id` working
- Seasonal adjustment capability

**Frontend Integration:**
- Connect all 5 custom sliders
- Display real-time calculated results
- Show growth metrics in cards

---

## Quick Start Implementation

### Step 1: Implement Linear Forecast

```python
# File: backend/services/forecast.py

import numpy as np
from scipy import stats

def create_linear_forecast(product_id, periods=30):
    # Fetch historical sales
    sales_history = db.get_sales_history(product_id, days=90)
    
    # Extract sales values
    sales_values = [day['sales_units'] for day in sales_history]
    
    # Linear regression
    n = len(sales_values)
    t = np.arange(1, n + 1)
    slope, intercept, r_value, _, std_err = stats.linregress(t, sales_values)
    
    # Generate forecast
    forecast_t = np.arange(n + 1, n + periods + 1)
    forecast = intercept + slope * forecast_t
    
    # Confidence intervals
    z = 1.96  # 95% confidence
    lower = forecast - z * std_err * np.sqrt(forecast_t)
    upper = forecast + z * std_err * np.sqrt(forecast_t)
    
    return {
        'forecast': forecast.tolist(),
        'lower_bound': lower.tolist(),
        'upper_bound': upper.tolist(),
        'r_squared': r_value ** 2
    }
```

### Step 2: Create API Endpoint

```python
# File: backend/routes/forecast.py

@app.route('/api/forecast/sales/<product_id>', methods=['GET'])
def get_sales_forecast(product_id):
    period = request.args.get('period', '30d')
    model = request.args.get('model', 'linear')
    
    # Convert period to days
    period_days = parse_period(period)  # '30d' -> 30
    
    # Generate forecast
    if model == 'linear':
        result = create_linear_forecast(product_id, period_days)
    elif model == 'exponential':
        result = create_exponential_forecast(product_id, period_days)
    else:  # ai
        result = create_ai_forecast(product_id, period_days)
    
    # Calculate accuracy
    accuracy = calculate_model_accuracy(product_id, model)
    
    return jsonify({
        'product_id': product_id,
        'model': model,
        'forecast': result['forecast'],
        'confidence_bands': {
            'lower': result['lower_bound'],
            'upper': result['upper_bound']
        },
        'accuracy_percent': accuracy['accuracy_percent']
    })
```

### Step 3: Connect Frontend

```typescript
// File: frontend/src/services/forecastApi.ts

export const getForecast = async (
  productId: string, 
  period: string, 
  model: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/forecast/sales/${productId}?period=${period}&model=${model}`
  );
  return response.json();
};

// In SalesForecasting.tsx
useEffect(() => {
  const loadForecast = async () => {
    const data = await getForecast(
      selectedProduct.id,
      timeframe,
      forecastMethod
    );
    setForecastData(data.forecast);
    setConfidenceBands(data.confidence_bands);
    setAccuracy(data.accuracy_percent);
  };
  loadForecast();
}, [selectedProduct, timeframe, forecastMethod]);
```

---

**Document Version**: 1.0  
**Last Updated**: December 29, 2025  
**Status**: Ready for Implementation  
**Maintained By**: Clouvie Development Team

---

## Quick Reference Card

```
CORE FORMULAS SUMMARY
=====================

1. Linear Forecast:    ŷ(t) = α + β × t
2. Confidence Band:    CI = ŷ ± 1.96 × SE
3. Growth Rate:        Growth% = (Forecast_Avg - Hist_Avg) / Hist_Avg × 100
4. MAPE Accuracy:      MAPE = (100/n) × Σ|((Actual - Forecast)/Actual)|
5. Price Scenario:     New_Demand = Current × (1 + E × ΔP%)
6. Multi-Factor:       Total_Change = Σ(all factor impacts)

WHERE TO USE
============
Frontend Component      → Backend Formula → API Endpoint
Forecast Chart Line     → Formula 1       → GET /api/forecast/sales/:id
Confidence Bands        → Formula 2       → Part of forecast response
Growth Card             → Formula 3       → GET /api/analytics/growth/:id
Accuracy Badge          → Formula 4       → GET /api/forecast/accuracy/:id
Preset Scenarios        → Formula 5       → POST /api/forecast/scenarios
Custom Builder          → Formula 6       → POST /api/forecast/custom
```
