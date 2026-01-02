# Price Optimization Module - Backend Formulas & Logic

## 📋 Document Overview

This document provides the complete mathematical foundation for the Price Optimization backend. Each section maps directly to frontend features in `src/pages/PriceOptimization.tsx`.

---

## 🗂️ Table of Contents

### Part A: Core Formulas (Basic Implementation)
1. [Price Elasticity Calculation](#1-price-elasticity-calculation)
2. [Optimal Price Calculation](#2-optimal-price-calculation)
3. [Profit & Margin Analysis](#3-profit--margin-analysis)
4. [Revenue Impact Projections](#4-revenue-impact-projections)

### Part B: Advanced Features (Enhanced Implementation)
5. [Demand Forecasting Models](#5-demand-forecasting-models)
6. [Competitive Pricing Intelligence](#6-competitive-pricing-intelligence)
7. [Dynamic Pricing Algorithms](#7-dynamic-pricing-algorithms)
8. [Multi-Product Optimization](#8-multi-product-optimization)

### Part C: Implementation Guide
9. [Frontend-Backend Mapping](#9-frontend-backend-mapping)
10. [API Endpoints Structure](#10-api-endpoints-structure)
11. [Data Requirements](#11-data-requirements)
12. [Implementation Phases](#12-implementation-phases)

---

## 🔗 Quick Frontend-Backend Mapping

| Frontend Feature | Backend Formula Section | API Endpoint (Future) |
|-----------------|------------------------|----------------------|
| Recommended Price Display | [Section 2](#2-optimal-price-calculation) | `GET /api/price/recommend/:productId` |
| Price Elasticity Card | [Section 1](#1-price-elasticity-calculation) | `GET /api/analytics/elasticity/:productId` |
| What-If Analysis Slider | [Section 4](#4-revenue-impact-projections) | `POST /api/price/simulate` |
| Profit Impact Chart | [Section 3](#3-profit--margin-analysis) | `GET /api/analytics/profit-impact/:productId` |
| Competitive Analysis | [Section 6](#6-competitive-pricing-intelligence) | `GET /api/market/competitors/:productId` |
| Demand Forecast Chart | [Section 5](#5-demand-forecasting-models) | `GET /api/forecast/demand/:productId` |
| Scenario Comparison | [Section 4](#4-revenue-impact-projections) | `POST /api/price/scenarios` |

---

---

# PART A: CORE FORMULAS (Basic Implementation)

## 1. Price Elasticity Calculation

### 🎯 Purpose
Measures how sensitive customer demand is to price changes. Essential for all pricing decisions.

### 📍 Frontend Location
- **File**: `src/pages/PriceOptimization.tsx`
- **Component**: Price elasticity display card (lines ~420-450)
- **Visual**: Shows as `-1.2` with "Elastic Demand" label

### 📐 Formulas

#### Basic Elasticity Formula
```
E = (% Change in Quantity) / (% Change in Price)
```

**Detailed Calculation**:
```
E = ((Q2 - Q1) / Q1) / ((P2 - P1) / P1)
```

**Example**:
```javascript
// Inputs:
Q1 = 1000 units (sales at $10)
Q2 = 800 units (sales at $12)
P1 = $10
P2 = $12

// Calculation:
Quantity_Change = (800 - 1000) / 1000 = -0.20 (-20%)
Price_Change = (12 - 10) / 10 = 0.20 (+20%)
E = -0.20 / 0.20 = -1.0
```

#### Arc Elasticity (More Accurate for Large Changes)
```
E = ((Q2 - Q1) × (P2 + P1)) / ((P2 - P1) × (Q2 + Q1))
```

**Use When**: Price change > 10%

### 🏷️ Elasticity Classification

```javascript
if (Math.abs(E) > 1) {
  return "Elastic - Demand is sensitive to price";
} else if (Math.abs(E) === 1) {
  return "Unit Elastic - Proportional response";
} else {
  return "Inelastic - Demand is insensitive to price";
}
```

### 📊 Backend Implementation

```python
def calculate_elasticity(historical_data):
    """
    Calculate price elasticity from historical sales data
    
    Args:
        historical_data: List of {price, quantity, date}
    
    Returns:
        float: Price elasticity coefficient
    """
    # Method 1: Simple two-point calculation
    if len(historical_data) >= 2:
        recent = historical_data[-1]
        previous = historical_data[-2]
        
        q_change = (recent['quantity'] - previous['quantity']) / previous['quantity']
        p_change = (recent['price'] - previous['price']) / previous['price']
        
        if p_change != 0:
            elasticity = q_change / p_change
            return elasticity
    
    # Method 2: Regression-based (more accurate with more data)
    # Use log-linear regression: ln(Q) = β0 + β1 × ln(P)
    # β1 is the elasticity
    
    return -1.2  # Default assumption for most consumer goods
```

---

## 2. Optimal Price Calculation

### 🎯 Purpose
Calculate the price that maximizes profit based on costs, desired margins, and demand elasticity.

### 📍 Frontend Location
- **File**: `src/pages/PriceOptimization.tsx`
- **Component**: "Recommended Price" card (lines ~385-415)
- **Visual**: Large number with green background showing optimal price

### 📐 Core Formula

```
P* = (C × (1 + Target_Margin)) / (1 + (1 / E))
```

**Where**:
- `P*` = Optimal price
- `C` = Cost per unit
- `Target_Margin` = Desired margin as decimal (e.g., 0.25 = 25%)
- `E` = Price elasticity (negative value)

### 📝 Step-by-Step Calculation

**Example**:
```javascript
// Inputs:
Cost = $8.00
Target_Margin = 0.30 (30%)
Elasticity = -1.5

// Step 1: Calculate base price with margin
Base_Price = Cost × (1 + Target_Margin)
Base_Price = $8.00 × 1.30 = $10.40

// Step 2: Apply elasticity adjustment
Elasticity_Factor = 1 + (1 / Elasticity)
Elasticity_Factor = 1 + (1 / -1.5) = 1 - 0.667 = 0.333

// Step 3: Calculate optimal price
Optimal_Price = Base_Price / Elasticity_Factor
Optimal_Price = $10.40 / 0.333 = $31.23

// Note: This may seem high, but high elasticity means customers 
// are willing to pay more without significant demand drop
```

### 🔄 Alternative Formulas

#### Revenue Maximization (No Margin Constraint)
```
P* = C / (1 + (1 / E))
```

#### Markup-Based Pricing
```
P* = C × (1 + Markup_Percentage)
```

### 📊 Backend Implementation

```python
def calculate_optimal_price(cost, target_margin, elasticity, constraints=None):
    """
    Calculate optimal price point
    
    Args:
        cost: float - Unit cost
        target_margin: float - Target margin (0.25 = 25%)
        elasticity: float - Price elasticity (negative)
        constraints: dict - Optional {min_price, max_price}
    
    Returns:
        dict: {
            'optimal_price': float,
            'expected_margin': float,
            'rationale': str
        }
    """
    # Base calculation
    base_price = cost * (1 + target_margin)
    
    if elasticity != 0:
        elasticity_factor = 1 + (1 / elasticity)
        optimal_price = base_price / elasticity_factor
    else:
        optimal_price = base_price
    
    # Apply constraints
    if constraints:
        optimal_price = max(constraints.get('min_price', 0), optimal_price)
        optimal_price = min(constraints.get('max_price', float('inf')), optimal_price)
    
    # Apply psychological pricing
    optimal_price = round(optimal_price - 0.01, 2)  # e.g., $10.99
    
    # Calculate actual margin at optimal price
    actual_margin = (optimal_price - cost) / optimal_price
    
    return {
        'optimal_price': optimal_price,
        'expected_margin': actual_margin,
        'rationale': generate_rationale(elasticity, actual_margin)
    }
```

---

## 3. Profit & Margin Analysis

### 🎯 Purpose
Calculate profitability metrics and margin percentages for pricing decisions.

### 📍 Frontend Location
- **File**: `src/pages/PriceOptimization.tsx`
- **Components**: 
  - Current margin card (lines ~397-410)
  - Profit impact calculation (lines ~440-465)
  - Scenario comparison (lines ~835-880)

### 📐 Formulas

#### Gross Margin
```
Margin% = ((Price - Cost) / Price) × 100
```

**Example**:
```javascript
Price = $15.00
Cost = $10.00
Margin = ((15 - 10) / 15) × 100 = 33.3%
```

#### Markup (Inverse of Margin)
```
Markup% = ((Price - Cost) / Cost) × 100
```

**Example**:
```javascript
Markup = ((15 - 10) / 10) × 100 = 50%
```

#### Conversion Between Margin and Markup
```
Margin = Markup / (1 + Markup)
Markup = Margin / (1 - Margin)
```

#### Total Profit Calculation
```
Total_Profit = (Price - Cost) × Quantity_Sold
```

#### Profit Impact from Price Change
```
Profit_Change = (New_Price - Cost) × New_Quantity - (Old_Price - Cost) × Old_Quantity
```

### 📊 Backend Implementation

```python
def analyze_profit_margin(price, cost, quantity):
    """
    Comprehensive profit and margin analysis
    
    Returns:
        dict: Complete profit metrics
    """
    # Basic calculations
    revenue = price * quantity
    total_cost = cost * quantity
    gross_profit = revenue - total_cost
    
    # Margin calculations
    margin_percent = ((price - cost) / price) * 100 if price > 0 else 0
    markup_percent = ((price - cost) / cost) * 100 if cost > 0 else 0
    
    # Unit economics
    profit_per_unit = price - cost
    
    return {
        'revenue': revenue,
        'total_cost': total_cost,
        'gross_profit': gross_profit,
        'margin_percent': margin_percent,
        'markup_percent': markup_percent,
        'profit_per_unit': profit_per_unit,
        'break_even_units': 0 if profit_per_unit <= 0 else total_cost / profit_per_unit
    }
```

---

## 4. Revenue Impact Projections

### 🎯 Purpose
Predict how revenue, profit, and demand will change with different pricing strategies.

### 📍 Frontend Location
- **File**: `src/pages/PriceOptimization.tsx`
- **Components**:
  - What-If Analysis slider (lines ~195-230)
  - Demand curve chart (lines ~680-730)
  - Scenario comparison table (lines ~838-885)

### 📐 Formulas

#### Demand Change from Price Change
```
New_Quantity = Old_Quantity × (1 + Elasticity × Price_Change%)
```

**Example**:
```javascript
Current_Quantity = 1000 units
Elasticity = -1.2
Price_Change = +10% (0.10)

Demand_Change = Elasticity × Price_Change
Demand_Change = -1.2 × 0.10 = -0.12 (-12%)

New_Quantity = 1000 × (1 - 0.12) = 880 units
```

#### Revenue Impact
```
New_Revenue = New_Price × New_Quantity
Revenue_Change = New_Revenue - Old_Revenue
Revenue_Change% = (Revenue_Change / Old_Revenue) × 100
```

#### Profit Impact (Complete Formula)
```
Old_Profit = (Old_Price - Cost) × Old_Quantity
New_Profit = (New_Price - Cost) × New_Quantity
Profit_Impact = New_Profit - Old_Profit
```

### 📊 Backend Implementation

```python
def project_revenue_impact(current_price, new_price, current_quantity, cost, elasticity):
    """
    Project complete impact of price change
    
    Returns:
        dict: Projected metrics and impacts
    """
    # Calculate price change percentage
    price_change_pct = (new_price - current_price) / current_price
    
    # Project new quantity using elasticity
    demand_change_pct = elasticity * price_change_pct
    new_quantity = current_quantity * (1 + demand_change_pct)
    
    # Current state
    current_revenue = current_price * current_quantity
    current_profit = (current_price - cost) * current_quantity
    
    # Projected state
    projected_revenue = new_price * new_quantity
    projected_profit = (new_price - cost) * new_quantity
    
    # Impact calculations
    revenue_change = projected_revenue - current_revenue
    revenue_change_pct = (revenue_change / current_revenue) * 100
    
    profit_change = projected_profit - current_profit
    profit_change_pct = (profit_change / current_profit) * 100 if current_profit > 0 else 0
    
    return {
        'current': {
            'price': current_price,
            'quantity': current_quantity,
            'revenue': current_revenue,
            'profit': current_profit
        },
        'projected': {
            'price': new_price,
            'quantity': new_quantity,
            'revenue': projected_revenue,
            'profit': projected_profit
        },
        'impact': {
            'quantity_change': new_quantity - current_quantity,
            'quantity_change_pct': demand_change_pct * 100,
            'revenue_change': revenue_change,
            'revenue_change_pct': revenue_change_pct,
            'profit_change': profit_change,
            'profit_change_pct': profit_change_pct
        },
        'recommendation': 'Increase' if profit_change > 0 else 'Decrease'
    }
```

---

---

# PART B: ADVANCED FEATURES (Enhanced Implementation)

## 5. Demand Forecasting Models

### 🎯 Purpose
Predict future demand to inform pricing decisions and inventory planning.

### 📍 Frontend Location
- **File**: `src/pages/PriceOptimization.tsx`
- **Component**: Demand forecast chart (lines ~680-730)
- **Visual**: Line chart showing historical and projected demand

### 📐 Formulas

#### Exponential Smoothing (Simple)
```
Forecast(t+1) = α × Actual(t) + (1 - α) × Forecast(t)
```

**Where**:
- `α` = Smoothing constant (0.1 to 0.3 for stable data)
- Higher α = more responsive to recent changes
- Lower α = more smoothing

**Example**:
```javascript
α = 0.2
Last_Week_Actual = 1000 units
Last_Week_Forecast = 950 units

This_Week_Forecast = 0.2 × 1000 + 0.8 × 950
                   = 200 + 760 = 960 units
```

#### Linear Trend Forecast
```
Demand(t) = a + b × t
```

Calculate coefficients:
```
b = (n × Σ(t × Q) - Σt × ΣQ) / (n × Σt² - (Σt)²)
a = (ΣQ - b × Σt) / n
```

#### Seasonal Adjustment
```
Adjusted_Forecast = Base_Forecast × Seasonal_Index
```

**Seasonal Index**:
```
Seasonal_Index = Average_for_Period / Overall_Average
```

### 📊 Backend Implementation

```python
def forecast_demand(historical_data, periods_ahead=30):
    """
    Generate demand forecast using exponential smoothing
    
    Args:
        historical_data: List of {date, quantity}
        periods_ahead: Number of days to forecast
    
    Returns:
        list: Forecasted quantities
    """
    alpha = 0.2  # Smoothing constant
    
    # Initialize with first actual value
    forecast = [historical_data[0]['quantity']]
    
    # Generate forecasts
    for i in range(1, len(historical_data)):
        next_forecast = (alpha * historical_data[i-1]['quantity'] + 
                        (1 - alpha) * forecast[-1])
        forecast.append(next_forecast)
    
    # Project future periods
    future_forecasts = []
    last_forecast = forecast[-1]
    
    for _ in range(periods_ahead):
        future_forecasts.append(last_forecast)
        # Optionally apply trend
        # last_forecast = last_forecast * 1.01  # 1% growth
    
    return future_forecasts
```

---

## 6. Competitive Pricing Intelligence

### 🎯 Purpose
Analyze competitor pricing to inform positioning strategy.

### 📍 Frontend Location
- **File**: `src/pages/PriceOptimization.tsx`
- **Component**: Competitor price comparison (currently in mockData)
- **Future UI**: Competitive analysis section

### 📐 Formulas

#### Price Positioning Index
```
PPI = (Your_Price - Min_Competitor_Price) / (Max_Competitor_Price - Min_Competitor_Price)
```

**Result**: 0 = lowest price, 1 = highest price, 0.5 = middle of market

#### Competitive Price Gap
```
Price_Gap% = ((Your_Price - Avg_Competitor_Price) / Avg_Competitor_Price) × 100
```

#### Market Share Estimation (Attraction Model)
```
Your_Market_Share = Your_Utility / Σ(All_Competitors_Utility)

Where Utility = (Price^-β) × (Quality^γ)
```

- β = Price sensitivity (higher = more price-sensitive market)
- γ = Quality sensitivity

### 📊 Backend Implementation

```python
def analyze_competitive_pricing(your_price, competitor_prices):
    """
    Analyze competitive position
    
    Args:
        your_price: float
        competitor_prices: list of floats
    
    Returns:
        dict: Competitive analysis metrics
    """
    min_price = min(competitor_prices)
    max_price = max(competitor_prices)
    avg_price = sum(competitor_prices) / len(competitor_prices)
    
    # Position index
    price_range = max_price - min_price
    if price_range > 0:
        position_index = (your_price - min_price) / price_range
    else:
        position_index = 0.5
    
    # Price gap
    price_gap_pct = ((your_price - avg_price) / avg_price) * 100
    
    # Competitive position
    if your_price < min_price * 1.05:
        position = "Price Leader"
    elif your_price > max_price * 0.95:
        position = "Premium Position"
    else:
        position = "Mid-Market"
    
    return {
        'your_price': your_price,
        'market_min': min_price,
        'market_max': max_price,
        'market_avg': avg_price,
        'position_index': position_index,
        'price_gap_percent': price_gap_pct,
        'competitive_position': position,
        'recommendation': generate_competitive_recommendation(position, price_gap_pct)
    }
```

---

## 7. Dynamic Pricing Algorithms

### 🎯 Purpose
Adjust prices automatically based on real-time factors like demand, inventory, and time.

### 📍 Frontend Location
- **Future Feature**: Not yet implemented in frontend
- **Planned Location**: Real-time pricing dashboard

### 📐 Formulas

#### Time-Based Pricing (Peak Hours)
```
P(t) = Base_Price × (1 + Peak_Multiplier × Peak_Function(t))
```

**Example**:
```javascript
Base_Price = $10
Peak_Hours = [11-13, 18-20]  // Lunch and dinner
Peak_Multiplier = 0.2  // 20% increase

if (current_hour in Peak_Hours) {
  Price = $10 × 1.2 = $12
} else {
  Price = $10
}
```

#### Inventory-Based Pricing
```
Price_Adjustment = (Current_Stock / Target_Stock)^(-γ)
Adjusted_Price = Base_Price × Price_Adjustment
```

- γ = Urgency factor (0.2-0.5)
- Low stock → Higher multiplier → Higher price
- High stock → Lower multiplier → Lower price

#### Demand Surge Pricing
```
Surge_Multiplier = 1 + μ × max(0, (Actual_Demand / Expected_Demand) - 1)
Surge_Price = Base_Price × Surge_Multiplier
```

- μ = Maximum surge factor (e.g., 2 = can double price)

### 📊 Backend Implementation

```python
def calculate_dynamic_price(base_price, current_stock, target_stock, 
                           current_demand, expected_demand, time_of_day):
    """
    Calculate dynamically adjusted price
    
    Returns:
        dict: Adjusted price with breakdown
    """
    adjustments = {'base_price': base_price}
    final_price = base_price
    
    # 1. Inventory adjustment
    if current_stock > 0 and target_stock > 0:
        stock_ratio = current_stock / target_stock
        inventory_factor = stock_ratio ** (-0.3)  # Urgency factor
        final_price *= inventory_factor
        adjustments['inventory_adjustment'] = inventory_factor
    
    # 2. Demand surge adjustment
    if expected_demand > 0:
        demand_ratio = current_demand / expected_demand
        if demand_ratio > 1:
            surge_factor = 1 + 0.5 * (demand_ratio - 1)  # Max 50% increase
            surge_factor = min(surge_factor, 2.0)  # Cap at 2x
            final_price *= surge_factor
            adjustments['surge_adjustment'] = surge_factor
    
    # 3. Time-based adjustment
    peak_hours = [11, 12, 13, 18, 19, 20]
    if time_of_day in peak_hours:
        peak_factor = 1.15  # 15% increase
        final_price *= peak_factor
        adjustments['peak_hour_adjustment'] = peak_factor
    
    adjustments['final_price'] = round(final_price, 2)
    
    return adjustments
```

---

## 8. Multi-Product Optimization

### 🎯 Purpose
Optimize pricing across multiple related products considering substitutes and complements.

### 📍 Frontend Location
- **Future Feature**: Bulk optimization page
- **Planned**: Cross-product impact analysis

### 📐 Formulas

#### Cross-Price Elasticity
```
E_xy = (% Change in Demand for Product X) / (% Change in Price of Product Y)
```

**Interpretation**:
- `E_xy > 0` : Substitutes (price of Y ↑ → demand for X ↑)
- `E_xy < 0` : Complements (price of Y ↑ → demand for X ↓)
- `E_xy = 0` : Independent products

#### Bundle Pricing
```
Bundle_Price = α × (Price_A + Price_B)
```

**Where**:
- α = Discount factor (typically 0.80-0.90)
- Constraint: `Bundle_Price > Cost_A + Cost_B`

**Optimal Bundle Discount**:
```
Optimal_α = 1 - (Customer_Savings_Expectation / (Price_A + Price_B))
```

#### Joint Profit Maximization (2 Products)
```
Total_Profit = Profit_Product_1 + Profit_Product_2
             = (P1 - C1) × Q1(P1, P2) + (P2 - C2) × Q2(P1, P2)
```

Solve system of equations:
```
∂Total_Profit/∂P1 = 0
∂Total_Profit/∂P2 = 0
```

### 📊 Backend Implementation

```python
def optimize_product_bundle(product_a, product_b, cross_elasticity):
    """
    Optimize pricing for product bundle
    
    Args:
        product_a: dict {price, cost, quantity}
        product_b: dict {price, cost, quantity}
        cross_elasticity: float (positive for substitutes)
    
    Returns:
        dict: Bundle pricing recommendation
    """
    # Individual prices
    price_a = product_a['price']
    price_b = product_b['price']
    
    # Calculate perceived value of bundle
    combined_value = price_a + price_b
    
    # Recommended discount (typically 10-20%)
    discount_pct = 0.15  # 15% discount
    bundle_price = combined_value * (1 - discount_pct)
    
    # Ensure profitability
    min_bundle_price = product_a['cost'] + product_b['cost'] + 2  # $2 minimum profit
    bundle_price = max(bundle_price, min_bundle_price)
    
    # Project bundle demand
    # Customers who buy both increase when bundled
    bundle_demand = min(product_a['quantity'], product_b['quantity']) * 1.3
    
    return {
        'individual_total': combined_value,
        'bundle_price': round(bundle_price, 2),
        'savings': combined_value - bundle_price,
        'savings_percent': discount_pct * 100,
        'projected_bundles_sold': int(bundle_demand),
        'incremental_revenue': bundle_price * bundle_demand - 
                              (price_a * product_a['quantity'] + 
                               price_b * product_b['quantity']) * 0.5
    }
```

---

---

# PART C: IMPLEMENTATION GUIDE

## 9. Frontend-Backend Mapping

### Complete Integration Map

| Frontend Component | Location | Backend Formula | API Endpoint | Data Flow |
|-------------------|----------|-----------------|--------------|-----------|
| **Product Selector Dropdown** | Lines 250-265 | N/A | `GET /api/products/list` | Frontend → Backend: product_id<br>Backend → Frontend: product details |
| **Current Price Display** | Lines 385-395 | N/A | `GET /api/products/:id` | Display current pricing data |
| **Recommended Price Card** | Lines 397-425 | [Section 2](#2-optimal-price-calculation) | `GET /api/price/recommend/:id` | Backend calculates optimal price using elasticity + margins |
| **Price Elasticity Badge** | Lines 430-450 | [Section 1](#1-price-elasticity-calculation) | `GET /api/analytics/elasticity/:id` | Historical sales → elasticity coefficient |
| **Current Margin Display** | Lines 397-410 | [Section 3](#3-profit--margin-analysis) | Calculated client-side | (price - cost) / price × 100 |
| **What-If Slider** | Lines 195-230 | [Section 4](#4-revenue-impact-projections) | `POST /api/price/simulate` | Price change → projected demand/revenue |
| **Projected Revenue** | Lines 440-465 | [Section 4](#4-revenue-impact-projections) | Part of simulate response | New_price × new_quantity |
| **Profit Impact** | Lines 440-465 | [Section 3](#3-profit--margin-analysis) | Part of simulate response | Profit difference calculation |
| **Demand Curve Chart** | Lines 680-730 | [Section 4](#4-revenue-impact-projections) | `GET /api/analytics/demand-curve/:id` | Price points → quantity mapping |
| **Scenario Cards** | Lines 838-885 | [Section 4](#4-revenue-impact-projections) | `POST /api/price/scenarios` | Multiple what-if calculations |
| **Competitor Prices** | mockData | [Section 6](#6-competitive-pricing-intelligence) | `GET /api/market/competitors/:id` | Market intelligence data |
| **AI Insights Panel** | Lines 894-950 | Multiple sections | `GET /api/insights/:id` | Aggregated recommendations |

### Data Flow Diagram

```
Frontend Request Flow:
======================

1. User selects product
   ↓
   Frontend: GET /api/products/:id
   ↓
   Backend: Fetch product data (price, cost, sales history)
   ↓
   Frontend: Display current metrics

2. Backend calculations (automatic)
   ↓
   Calculate elasticity [Section 1]
   ↓
   Calculate optimal price [Section 2]
   ↓
   Project impacts [Section 4]
   ↓
   Return recommendations

3. User adjusts price slider
   ↓
   Frontend: POST /api/price/simulate { product_id, new_price }
   ↓
   Backend: 
     - Get elasticity
     - Calculate demand change [Section 4]
     - Calculate revenue/profit [Section 3]
   ↓
   Frontend: Update charts and metrics in real-time
```

---

## 10. API Endpoints Structure

### Recommended API Architecture

#### 1. Product Endpoints

**GET /api/products/list**
```json
Response:
{
  "products": [
    {
      "id": "P001",
      "name": "Iced Latte 720",
      "category": "Beverage",
      "current_price": 12.99,
      "cost": 8.50,
      "current_margin": 34.6,
      "monthly_sales": 1200
    }
  ]
}
```

**GET /api/products/:id**
```json
Response:
{
  "id": "P001",
  "name": "Iced Latte 720",
  "current_price": 12.99,
  "cost": 8.50,
  "competitor_price": 13.49,
  "stock_level": 450,
  "monthly_sales": 1200,
  "sales_history": [
    {"date": "2025-01-01", "quantity": 45, "price": 12.99},
    ...
  ]
}
```

#### 2. Price Optimization Endpoints

**GET /api/price/recommend/:id**

Uses: [Section 2 - Optimal Price Calculation](#2-optimal-price-calculation)

```json
Response:
{
  "product_id": "P001",
  "current_price": 12.99,
  "recommended_price": 14.49,
  "price_change": 1.50,
  "price_change_percent": 11.5,
  "rationale": "High elasticity allows increase",
  "confidence": 0.85,
  "calculations": {
    "elasticity": -1.2,
    "target_margin": 0.30,
    "cost": 8.50
  }
}
```

**POST /api/price/simulate**

Uses: [Section 4 - Revenue Impact Projections](#4-revenue-impact-projections)

```json
Request:
{
  "product_id": "P001",
  "new_price": 15.00
}

Response:
{
  "current": {
    "price": 12.99,
    "quantity": 1200,
    "revenue": 15588,
    "profit": 5388
  },
  "projected": {
    "price": 15.00,
    "quantity": 1056,
    "revenue": 15840,
    "profit": 6864
  },
  "impact": {
    "revenue_change": 252,
    "revenue_change_percent": 1.6,
    "profit_change": 1476,
    "profit_change_percent": 27.4,
    "quantity_change": -144,
    "quantity_change_percent": -12.0
  }
}
```

**POST /api/price/scenarios**

Uses: [Section 4](#4-revenue-impact-projections)

```json
Request:
{
  "product_id": "P001",
  "scenarios": [
    {"name": "Conservative", "price": 13.49},
    {"name": "Recommended", "price": 14.49},
    {"name": "Aggressive", "price": 15.99}
  ]
}

Response:
{
  "scenarios": [
    {
      "name": "Conservative",
      "price": 13.49,
      "projected_revenue": 15720,
      "projected_profit": 5880,
      "risk_level": "low"
    },
    ...
  ]
}
```

#### 3. Analytics Endpoints

**GET /api/analytics/elasticity/:id**

Uses: [Section 1 - Price Elasticity Calculation](#1-price-elasticity-calculation)

```json
Response:
{
  "product_id": "P001",
  "elasticity": -1.2,
  "classification": "Elastic",
  "confidence": 0.82,
  "data_points": 90,
  "calculation_method": "arc_elasticity",
  "last_updated": "2025-12-29T10:00:00Z"
}
```

**GET /api/analytics/demand-curve/:id**

Uses: [Section 4](#4-revenue-impact-projections)

```json
Response:
{
  "product_id": "P001",
  "curve_points": [
    {"price": 10.00, "quantity": 1500},
    {"price": 12.00, "quantity": 1260},
    {"price": 14.00, "quantity": 1050},
    {"price": 16.00, "quantity": 876},
    {"price": 18.00, "quantity": 732}
  ]
}
```

#### 4. Market Intelligence Endpoints

**GET /api/market/competitors/:id**

Uses: [Section 6 - Competitive Pricing Intelligence](#6-competitive-pricing-intelligence)

```json
Response:
{
  "product_id": "P001",
  "your_price": 12.99,
  "competitors": [
    {"name": "Competitor A", "price": 13.49},
    {"name": "Competitor B", "price": 12.49},
    {"name": "Competitor C", "price": 14.99}
  ],
  "market_position": {
    "position_index": 0.33,
    "market_min": 12.49,
    "market_max": 14.99,
    "market_avg": 13.66,
    "position": "Below Average"
  }
}
```

---

## 11. Data Requirements

### Database Schema

#### Products Table
```sql
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    current_price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    stock_level INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Sales History Table
```sql
CREATE TABLE sales_history (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES products(id),
    date DATE NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    revenue DECIMAL(10,2),
    cost DECIMAL(10,2),
    promotion_applied BOOLEAN DEFAULT FALSE,
    INDEX idx_product_date (product_id, date)
);
```

#### Price Changes Table
```sql
CREATE TABLE price_changes (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES products(id),
    old_price DECIMAL(10,2),
    new_price DECIMAL(10,2),
    changed_at TIMESTAMP,
    reason VARCHAR(255),
    applied_by VARCHAR(100)
);
```

#### Competitor Prices Table
```sql
CREATE TABLE competitor_prices (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES products(id),
    competitor_name VARCHAR(255),
    price DECIMAL(10,2),
    recorded_at TIMESTAMP,
    source VARCHAR(100)
);
```

### Minimum Data for Accurate Calculations

| Calculation | Minimum Data Required |
|------------|----------------------|
| **Elasticity** | 30+ days of sales history with at least 1 price change |
| **Optimal Price** | Cost, current price, 30 days sales data |
| **Demand Forecast** | 90+ days of historical sales |
| **Competitive Analysis** | Current competitor prices (updated weekly) |
| **Seasonal Patterns** | 12+ months of sales history |

---

## 12. Implementation Phases

### Phase 1: Foundation (Week 1-2)
**Backend Setup**

✅ **Tasks:**
1. Set up database schema
2. Create data models
3. Implement data import/ETL
4. Build basic API endpoints

✅ **Deliverables:**
- Working database
- API endpoints for products
- Basic CRUD operations

✅ **Frontend Integration:**
- Connect product selector to API
- Display current product data
- Test API connectivity

---

### Phase 2: Core Calculations (Week 3-4)
**Implement Essential Formulas**

✅ **Tasks:**
1. Implement elasticity calculation ([Section 1](#1-price-elasticity-calculation))
2. Implement optimal price formula ([Section 2](#2-optimal-price-calculation))
3. Build profit/margin calculators ([Section 3](#3-profit--margin-analysis))
4. Create revenue impact projector ([Section 4](#4-revenue-impact-projections))

✅ **Deliverables:**
- `/api/analytics/elasticity/:id` working
- `/api/price/recommend/:id` working
- `/api/price/simulate` working

✅ **Frontend Integration:**
- Display recommended price
- Show elasticity badge
- Enable What-If slider functionality
- Update profit impact in real-time

✅ **Testing:**
```javascript
// Test optimal price calculation
const testData = {
  cost: 8.50,
  target_margin: 0.30,
  elasticity: -1.2
};

const result = await api.get('/api/price/recommend/P001');
// Expected: recommended_price ≈ $14.49
```

---

### Phase 3: Advanced Features (Week 5-6)
**Demand Forecasting & Competitive Analysis**

✅ **Tasks:**
1. Implement demand forecasting ([Section 5](#5-demand-forecasting-models))
2. Build competitive analysis ([Section 6](#6-competitive-pricing-intelligence))
3. Create scenario comparison
4. Build demand curve generation

✅ **Deliverables:**
- `/api/forecast/demand/:id`
- `/api/market/competitors/:id`
- `/api/price/scenarios`
- `/api/analytics/demand-curve/:id`

✅ **Frontend Integration:**
- Add demand forecast chart
- Display competitor analysis
- Enable scenario comparison table
- Show demand curve visualization

---

### Phase 4: Dynamic Pricing (Week 7-8)
**Real-Time Price Optimization**

✅ **Tasks:**
1. Implement dynamic pricing algorithms ([Section 7](#7-dynamic-pricing-algorithms))
2. Build inventory-based adjustments
3. Create time-based pricing
4. Add surge pricing logic

✅ **Deliverables:**
- `/api/price/dynamic/:id`
- Real-time price adjustment system
- Automated repricing triggers

✅ **Frontend Integration:**
- Real-time price updates
- Dynamic pricing toggle
- Alert system for auto-adjustments

---

### Phase 5: Multi-Product Optimization (Week 9-10)
**Cross-Product Analysis**

✅ **Tasks:**
1. Implement cross-price elasticity ([Section 8](#8-multi-product-optimization))
2. Build bundle pricing optimizer
3. Create bulk optimization
4. Implement category-level optimization

✅ **Deliverables:**
- `/api/price/optimize-bulk`
- `/api/price/bundle`
- Category optimization dashboard

---

### Phase 6: ML Enhancement (Week 11-12)
**Machine Learning Integration**

✅ **Tasks:**
1. Train elasticity prediction models
2. Build demand forecasting ML models
3. Implement recommendation engine
4. Create A/B testing framework

✅ **Deliverables:**
- ML-powered elasticity estimation
- Improved forecast accuracy
- Automated recommendation system

---

## 13. Testing Checklist

### Unit Tests

```python
# Test: Elasticity Calculation
def test_elasticity_calculation():
    result = calculate_elasticity(
        q1=1000, q2=800, p1=10, p2=12
    )
    assert result == -1.0

# Test: Optimal Price
def test_optimal_price():
    result = calculate_optimal_price(
        cost=8.50, target_margin=0.30, elasticity=-1.2
    )
    assert 14.00 <= result['optimal_price'] <= 15.00

# Test: Revenue Impact
def test_revenue_impact():
    result = project_revenue_impact(
        current_price=12.99, new_price=14.49,
        current_quantity=1200, cost=8.50, elasticity=-1.2
    )
    assert result['impact']['profit_change'] > 0
```

### Integration Tests

```javascript
// Test: Complete workflow
describe('Price Optimization Workflow', () => {
  it('should calculate and return optimal price', async () => {
    // 1. Get product
    const product = await api.get('/api/products/P001');
    
    // 2. Get elasticity
    const elasticity = await api.get('/api/analytics/elasticity/P001');
    expect(elasticity.elasticity).toBeLessThan(0);
    
    // 3. Get recommendation
    const recommendation = await api.get('/api/price/recommend/P001');
    expect(recommendation.recommended_price).toBeGreaterThan(product.cost);
    
    // 4. Simulate price change
    const simulation = await api.post('/api/price/simulate', {
      product_id: 'P001',
      new_price: recommendation.recommended_price
    });
    expect(simulation.impact.profit_change).toBeDefined();
  });
});
```

---

## 14. Quick Start Implementation

### Step-by-Step for Developers

#### Step 1: Set Up Backend Service

```bash
# Create backend project
mkdir clouvie-backend
cd clouvie-backend
npm init -y
npm install express pg dotenv

# Or for Python
pip install flask sqlalchemy psycopg2
```

#### Step 2: Implement First Formula (Elasticity)

```python
# backend/services/elasticity.py
def calculate_elasticity(sales_history):
    """Implement Section 1 formula"""
    # Get last two price points
    recent = sales_history[-1]
    previous = sales_history[-2]
    
    # Calculate percentage changes
    q_change_pct = (recent['qty'] - previous['qty']) / previous['qty']
    p_change_pct = (recent['price'] - previous['price']) / previous['price']
    
    # Calculate elasticity
    if p_change_pct != 0:
        elasticity = q_change_pct / p_change_pct
        return elasticity
    return -1.2  # Default
```

#### Step 3: Create API Endpoint

```python
# backend/routes/analytics.py
@app.route('/api/analytics/elasticity/<product_id>', methods=['GET'])
def get_elasticity(product_id):
    # Fetch sales history from database
    sales_history = db.get_sales_history(product_id)
    
    # Calculate elasticity
    elasticity = calculate_elasticity(sales_history)
    
    return jsonify({
        'product_id': product_id,
        'elasticity': elasticity,
        'classification': classify_elasticity(elasticity)
    })
```

#### Step 4: Connect Frontend

```typescript
// frontend/src/services/api.ts
export const getElasticity = async (productId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/analytics/elasticity/${productId}`
  );
  return response.json();
};

// frontend/src/pages/PriceOptimization.tsx
const fetchElasticity = async () => {
  const data = await getElasticity(selectedProduct.id);
  setElasticity(data.elasticity);
};
```

---

## 15. Performance Optimization

### Caching Strategy

```python
# Cache expensive calculations
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def get_cached_elasticity(product_id, data_hash):
    """Cache elasticity calculations for 1 hour"""
    return calculate_elasticity(product_id)

# Usage
data_hash = hashlib.md5(str(sales_data).encode()).hexdigest()
elasticity = get_cached_elasticity(product_id, data_hash)
```

### Database Optimization

```sql
-- Index for fast queries
CREATE INDEX idx_sales_product_date 
ON sales_history(product_id, date DESC);

-- Materialized view for elasticity
CREATE MATERIALIZED VIEW product_elasticity AS
SELECT 
    product_id,
    calculate_elasticity(product_id) as elasticity,
    NOW() as calculated_at
FROM products;

-- Refresh hourly
REFRESH MATERIALIZED VIEW product_elasticity;
```

---

## 16. Error Handling

### Common Issues & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Division by zero | No price change in history | Return default elasticity (-1.2) |
| Insufficient data | Less than 30 days sales | Show warning, use industry benchmarks |
| Negative elasticity = 0 | Perfect inelasticity (unlikely) | Flag for manual review |
| Elasticity > 0 | Giffen good (very rare) | Flag as data quality issue |
| Optimal price > 10x cost | Extreme elasticity value | Apply ceiling constraint |

```python
def safe_calculate_optimal_price(cost, margin, elasticity):
    try:
        optimal = calculate_optimal_price(cost, margin, elasticity)
        
        # Apply sanity checks
        if optimal < cost * 1.1:
            return cost * 1.1  # Minimum 10% markup
        if optimal > cost * 5:
            return cost * 2.5  # Cap at 2.5x markup
            
        return optimal
    except ZeroDivisionError:
        return cost * 1.3  # Default 30% markup
    except Exception as e:
        log_error(e)
        return cost * 1.3
```

---

**Document Version**: 2.0  
**Last Updated**: December 29, 2025  
**Status**: Ready for Implementation  
**Maintained By**: Clouvie Development Team

---

## Quick Reference Card

```
CORE FORMULAS SUMMARY
=====================

1. Elasticity:     E = (ΔQ / Q) / (ΔP / P)
2. Optimal Price:  P* = (C × (1 + M)) / (1 + (1/E))
3. Margin:         Margin% = ((P - C) / P) × 100
4. Demand Change:  Q_new = Q_old × (1 + E × ΔP%)
5. Profit:         π = (P - C) × Q

WHERE TO USE
============
Frontend Line → Backend Formula → API Endpoint
Line 397-425   → Formula 2      → GET /api/price/recommend/:id
Line 430-450   → Formula 1      → GET /api/analytics/elasticity/:id  
Line 195-230   → Formula 4      → POST /api/price/simulate
Line 440-465   → Formula 5      → Part of simulate response
```
