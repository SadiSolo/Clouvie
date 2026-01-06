# Demand Forecasting Formulas

## Overview
This document contains the mathematical formulas and algorithms used in the demand forecasting module.

## Time Series Forecasting Methods

### 1. Moving Average (MA)
```
MA(t) = (D(t-1) + D(t-2) + ... + D(t-n)) / n
```
Where:
- `MA(t)` = Moving average forecast for period t
- `D(t)` = Actual demand in period t
- `n` = Number of periods in the moving average

### 2. Weighted Moving Average (WMA)
```
WMA(t) = (w₁ × D(t-1) + w₂ × D(t-2) + ... + wₙ × D(t-n)) / Σwᵢ
```
Where:
- `wᵢ` = Weight assigned to period i
- Σwᵢ = Sum of all weights

### 3. Exponential Smoothing (ES)
```
F(t+1) = α × D(t) + (1 - α) × F(t)
```
Where:
- `F(t)` = Forecast for period t
- `α` = Smoothing constant (0 < α < 1)
- `D(t)` = Actual demand in period t

### 4. Double Exponential Smoothing (Holt's Method)
```
Level: L(t) = α × D(t) + (1 - α) × (L(t-1) + T(t-1))
Trend: T(t) = β × (L(t) - L(t-1)) + (1 - β) × T(t-1)
Forecast: F(t+k) = L(t) + k × T(t)
```
Where:
- `L(t)` = Level at time t
- `T(t)` = Trend at time t
- `α` = Level smoothing parameter
- `β` = Trend smoothing parameter
- `k` = Number of periods ahead

### 5. Triple Exponential Smoothing (Holt-Winters Method)

#### Multiplicative Seasonality
```
Level: L(t) = α × (D(t) / S(t-s)) + (1 - α) × (L(t-1) + T(t-1))
Trend: T(t) = β × (L(t) - L(t-1)) + (1 - β) × T(t-1)
Seasonal: S(t) = γ × (D(t) / L(t)) + (1 - γ) × S(t-s)
Forecast: F(t+k) = (L(t) + k × T(t)) × S(t+k-s)
```

#### Additive Seasonality
```
Level: L(t) = α × (D(t) - S(t-s)) + (1 - α) × (L(t-1) + T(t-1))
Trend: T(t) = β × (L(t) - L(t-1)) + (1 - β) × T(t-1)
Seasonal: S(t) = γ × (D(t) - L(t)) + (1 - γ) × S(t-s)
Forecast: F(t+k) = L(t) + k × T(t) + S(t+k-s)
```
Where:
- `s` = Length of seasonal cycle
- `γ` = Seasonal smoothing parameter

## Regression Models

### 1. Linear Regression
```
D(t) = β₀ + β₁ × t + ε
```
Where:
- `β₀` = Intercept
- `β₁` = Slope (trend coefficient)
- `t` = Time period
- `ε` = Error term

### 2. Multiple Linear Regression
```
D = β₀ + β₁X₁ + β₂X₂ + ... + βₙXₙ + ε
```
Where:
- `Xᵢ` = Independent variables (price, promotions, seasonality, etc.)
- `βᵢ` = Regression coefficients

### 3. Polynomial Regression
```
D(t) = β₀ + β₁t + β₂t² + ... + βₙtⁿ + ε
```

## ARIMA Models

### AutoRegressive Integrated Moving Average (ARIMA)
```
ARIMA(p, d, q)
```

#### AR(p) - AutoRegressive Component
```
D(t) = c + φ₁D(t-1) + φ₂D(t-2) + ... + φₚD(t-p) + ε(t)
```

#### MA(q) - Moving Average Component
```
D(t) = μ + ε(t) + θ₁ε(t-1) + θ₂ε(t-2) + ... + θₑε(t-q)
```

#### Full ARIMA Model
```
(1 - ΣφᵢBⁱ)(1-B)ᵈD(t) = (1 + ΣθⱼBʲ)ε(t)
```
Where:
- `p` = Order of autoregression
- `d` = Degree of differencing
- `q` = Order of moving average
- `B` = Backshift operator
- `φᵢ` = AR parameters
- `θⱼ` = MA parameters

## Demand Patterns and Metrics

### 1. Seasonal Index
```
SI(m) = Average demand in period m / Average overall demand
```

### 2. Trend Analysis
```
Trend = (D(n) - D(1)) / (n - 1)
```

### 3. Coefficient of Variation (CV)
```
CV = (σ / μ) × 100%
```
Where:
- `σ` = Standard deviation of demand
- `μ` = Mean demand

### 4. Safety Stock Calculation
```
SS = z × σ × √LT
```
Where:
- `z` = Service level factor (z-score)
- `σ` = Standard deviation of demand
- `LT` = Lead time

### 5. Reorder Point
```
ROP = (Average daily demand × Lead time) + Safety stock
```

## Forecast Accuracy Metrics

### 1. Mean Absolute Error (MAE)
```
MAE = (1/n) × Σ|D(t) - F(t)|
```

### 2. Mean Squared Error (MSE)
```
MSE = (1/n) × Σ(D(t) - F(t))²
```

### 3. Root Mean Squared Error (RMSE)
```
RMSE = √(MSE)
```

### 4. Mean Absolute Percentage Error (MAPE)
```
MAPE = (1/n) × Σ|(D(t) - F(t)) / D(t)| × 100%
```

### 5. Symmetric MAPE (sMAPE)
```
sMAPE = (1/n) × Σ(2|D(t) - F(t)| / (|D(t)| + |F(t)|)) × 100%
```

### 6. Mean Absolute Scaled Error (MASE)
```
MASE = MAE / MAE(naive)

MAE(naive) = (1/(n-1)) × Σ|D(t) - D(t-1)|
```

### 7. Tracking Signal
```
TS = Σ(D(t) - F(t)) / MAD

MAD = (1/n) × Σ|D(t) - F(t)|
```

## Machine Learning Approaches

### 1. Random Forest Feature Importance
```
Importance(Xᵢ) = Σ(Error_before - Error_after) / n_trees
```

### 2. Gradient Boosting
```
F(x) = F₀(x) + Σ(ηᵢ × hᵢ(x))
```
Where:
- `F₀` = Initial prediction
- `ηᵢ` = Learning rate
- `hᵢ` = Weak learners

### 3. Neural Network Forecast
```
y = f(Σ(wᵢxᵢ) + b)
```
Where:
- `wᵢ` = Weights
- `xᵢ` = Input features
- `b` = Bias
- `f` = Activation function

## Demand Classification (ABC-XYZ Analysis)

### ABC Classification (Value)
```
A items: Top 80% of cumulative value
B items: Next 15% of cumulative value
C items: Last 5% of cumulative value
```

### XYZ Classification (Variability)
```
X items: CV < 20% (stable demand)
Y items: 20% ≤ CV ≤ 50% (moderate variability)
Z items: CV > 50% (high variability)
```

## Causal Forecasting Factors

### Price Elasticity of Demand
```
E = (% Change in Quantity) / (% Change in Price)
E = (ΔQ/Q) / (ΔP/P)
```

### Promotional Lift
```
Lift = (Sales during promotion - Baseline sales) / Baseline sales × 100%
```

### Seasonality Factor
```
SF(period) = Demand(period) / Average demand across all periods
```

## Notes
- All formulas assume stationary demand unless otherwise specified
- For non-stationary data, differencing or transformation may be required
- Model selection should be based on forecast accuracy metrics and business context
- Hybrid approaches combining multiple methods often yield better results
