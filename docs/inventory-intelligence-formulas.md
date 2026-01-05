# Inventory Intelligence Formulas

## Overview
This document contains the mathematical formulas and algorithms used in the inventory intelligence module.

## Basic Inventory Metrics

### 1. Economic Order Quantity (EOQ)
```
EOQ = √((2 × D × S) / H)
```
Where:
- `D` = Annual demand (units)
- `S` = Ordering cost per order
- `H` = Holding cost per unit per year

### 2. Reorder Point (ROP)
```
ROP = (d × L) + SS
```
Where:
- `d` = Average daily demand
- `L` = Lead time (days)
- `SS` = Safety stock

### 3. Safety Stock
```
SS = z × σ × √L
```
Where:
- `z` = Service level z-score
- `σ` = Standard deviation of demand
- `L` = Lead time

### 4. Service Level to Z-Score Mapping
```
Service Level 90% → z = 1.28
Service Level 95% → z = 1.65
Service Level 99% → z = 2.33
Service Level 99.9% → z = 3.09
```

## Inventory Costs

### 1. Total Inventory Cost
```
TIC = Purchase Cost + Ordering Cost + Holding Cost + Stockout Cost
```

### 2. Annual Ordering Cost
```
AOC = (D / Q) × S
```
Where:
- `D` = Annual demand
- `Q` = Order quantity
- `S` = Cost per order

### 3. Annual Holding Cost
```
AHC = (Q / 2) × H
```
Where:
- `Q` = Order quantity
- `H` = Holding cost per unit per year

### 4. Total Annual Cost (TAC)
```
TAC = (D × C) + (D / Q × S) + (Q / 2 × H)
```
Where:
- `C` = Unit cost

### 5. Stockout Cost
```
Stockout Cost = Number of units short × Cost per stockout
```

## Inventory Turnover Metrics

### 1. Inventory Turnover Ratio
```
ITR = COGS / Average Inventory
```
Where:
- `COGS` = Cost of Goods Sold
- `Average Inventory` = (Beginning Inventory + Ending Inventory) / 2

### 2. Days Inventory Outstanding (DIO)
```
DIO = (Average Inventory / COGS) × 365
```

### 3. Inventory Holding Period
```
IHP = 365 / Inventory Turnover Ratio
```

### 4. Weeks of Supply
```
WOS = Current Inventory / Average Weekly Demand
```

### 5. Stock-to-Sales Ratio
```
SSR = Ending Inventory Value / Sales for Period
```

## Demand Variability Metrics

### 1. Coefficient of Variation (CV)
```
CV = (σ / μ) × 100%
```
Where:
- `σ` = Standard deviation of demand
- `μ` = Mean demand

### 2. Variability of Lead Time Demand
```
σ_LT = √(L × σ_d² + d² × σ_L²)
```
Where:
- `L` = Average lead time
- `σ_d` = Standard deviation of demand
- `d` = Average demand per period
- `σ_L` = Standard deviation of lead time

### 3. Safety Stock with Variable Demand and Lead Time
```
SS = z × √(L × σ_d² + d² × σ_L²)
```

## ABC Analysis

### 1. ABC Classification
```
A items: Top 20% of items accounting for 80% of value
B items: Next 30% of items accounting for 15% of value
C items: Remaining 50% of items accounting for 5% of value
```

### 2. Cumulative Value Percentage
```
Cumulative % = (Σ Item Values up to i / Total Value) × 100%
```

### 3. Item Value
```
Item Value = Annual Demand × Unit Cost
```

## XYZ Analysis

### XYZ Classification (by Demand Variability)
```
X items: CV < 20% (predictable demand)
Y items: 20% ≤ CV < 50% (variable demand)
Z items: CV ≥ 50% (uncertain demand)
```

## Inventory Optimization Models

### 1. Economic Production Quantity (EPQ)
```
EPQ = √((2 × D × S) / (H × (1 - d/p)))
```
Where:
- `D` = Annual demand
- `S` = Setup cost
- `H` = Holding cost per unit per year
- `d` = Demand rate
- `p` = Production rate

### 2. Quantity Discount Model - Total Cost
```
TC(Q) = (D × C) + (D / Q × S) + (Q / 2 × H × C × i)
```
Where:
- `C` = Unit price (varies by quantity bracket)
- `i` = Inventory carrying charge (as percentage)

### 3. Newsvendor Model (Single Period)
```
Q* = F⁻¹(Cu / (Cu + Co))
```
Where:
- `Q*` = Optimal order quantity
- `F⁻¹` = Inverse cumulative distribution function
- `Cu` = Cost of understocking (lost profit)
- `Co` = Cost of overstocking (excess inventory)

### 4. Base Stock Level (S)
```
S = μ_LT + SS
```
Where:
- `μ_LT` = Expected demand during lead time
- `SS` = Safety stock

### 5. (s, S) Policy
```
If inventory ≤ s, order up to S
```
Where:
- `s` = Reorder point
- `S` = Order-up-to level

## Fill Rate and Service Levels

### 1. Cycle Service Level (CSL)
```
CSL = P(Demand during lead time ≤ Inventory at reorder)
CSL = 1 - P(Stockout)
```

### 2. Fill Rate (FR)
```
FR = 1 - (Expected shortage per cycle / Order quantity)
```

### 3. Expected Shortage per Cycle
```
E(shortage) = σ_LT × L(z)
```
Where:
- `L(z)` = Unit normal loss function
- `σ_LT` = Standard deviation of lead time demand

### 4. Item Fill Rate
```
IFR = Units fulfilled / Units ordered
```

### 5. Order Fill Rate
```
OFR = Orders completely filled / Total orders
```

## Multi-Echelon Inventory

### 1. Distribution Requirements Planning (DRP)
```
Net Requirements = Gross Requirements - Scheduled Receipts - On Hand Inventory + Safety Stock
```

### 2. Echelon Stock
```
Echelon Stock_i = On-hand_i + In-transit_i + Σ(Echelon Stock_downstream)
```

### 3. Installation Stock
```
Installation Stock = On-hand inventory at location + In-transit to location
```

## Inventory Accuracy Metrics

### 1. Inventory Record Accuracy
```
IRA = (Number of accurate records / Total records checked) × 100%
```

### 2. Absolute Deviation
```
AD = |Physical Count - System Count|
```

### 3. Inventory Accuracy Percentage
```
IAP = (1 - |Physical Count - System Count| / Physical Count) × 100%
```

### 4. Weighted Inventory Accuracy
```
WIA = Σ(Item Value × Accuracy) / Σ(Item Value)
```

## Dead Stock and Obsolescence

### 1. Dead Stock Percentage
```
DSP = (Value of dead stock / Total inventory value) × 100%
```

### 2. Slow-Moving Item Identification
```
If (Days since last sale > Threshold) → Flag as slow-moving
```

### 3. Obsolescence Rate
```
OR = (Value of obsolete inventory / Average inventory value) × 100%
```

### 4. Inventory Age
```
Age = Current Date - Receipt Date
```

### 5. Aged Inventory Percentage
```
AIP = (Inventory older than X days / Total inventory) × 100%
```

## Inventory Allocation and Distribution

### 1. Fair Share Allocation
```
Allocation_i = Available Stock × (Demand_i / Total Demand)
```

### 2. Weighted Allocation
```
Allocation_i = Available Stock × (Weight_i / Σ Weights)
```

### 3. Priority-Based Allocation
```
Allocate to highest priority customer first until fulfilled or stock depleted
```

## Working Capital Metrics

### 1. Days Sales of Inventory (DSI)
```
DSI = (Average Inventory / COGS) × 365
```

### 2. Cash-to-Cash Cycle Time
```
C2C = DIO + DSO - DPO
```
Where:
- `DIO` = Days Inventory Outstanding
- `DSO` = Days Sales Outstanding
- `DPO` = Days Payable Outstanding

### 3. Inventory Investment
```
II = Units on Hand × Unit Cost
```

### 4. Gross Margin Return on Investment (GMROI)
```
GMROI = Gross Margin / Average Inventory Cost
```

## Replenishment Models

### 1. Min-Max Inventory System
```
If Inventory ≤ Min, Order (Max - Current Inventory)
```

### 2. Periodic Review (R, S) Policy
```
Every R periods, order up to S
Order Quantity = S - Inventory Position
```

### 3. Continuous Review (s, Q) Policy
```
When inventory ≤ s, order Q units
```

### 4. Target Stock Level
```
TSL = Expected Demand during (Lead Time + Review Period) + Safety Stock
```

## Advanced Analytics

### 1. Inventory Risk Score
```
Risk Score = w₁ × CV + w₂ × Lead Time Variability + w₃ × Supplier Risk
```
Where:
- `wᵢ` = Weights (sum to 1)

### 2. Inventory Health Index
```
IHI = (w₁ × Turnover + w₂ × Accuracy + w₃ × (1 - Dead Stock %)) / 3
```

### 3. Bullwhip Effect Ratio
```
BE = Variance of Orders / Variance of Demand
```

### 4. Demand Forecast Error
```
FE = (Actual Demand - Forecasted Demand) / Actual Demand × 100%
```

### 5. Inventory Positioning Index
```
IPI = (Actual Inventory / Optimal Inventory) × 100%
```

## Capacity and Space Utilization

### 1. Warehouse Utilization
```
WU = (Used Space / Available Space) × 100%
```

### 2. Cubic Utilization
```
CU = (Volume of stored items / Total warehouse volume) × 100%
```

### 3. Slot Utilization
```
SU = (Occupied slots / Total slots) × 100%
```

## Inventory Valuation Methods

### 1. Weighted Average Cost
```
WAC = Total Cost of Inventory / Total Units
```

### 2. FIFO (First-In-First-Out)
```
COGS = Cost of oldest inventory
Ending Inventory = Cost of newest inventory
```

### 3. LIFO (Last-In-First-Out)
```
COGS = Cost of newest inventory
Ending Inventory = Cost of oldest inventory
```

### 4. Specific Identification
```
Each unit tracked individually with its actual cost
```

## Notes
- Service levels should be set based on product importance and customer expectations
- Regular cycle counts improve inventory accuracy
- Consider lead time variability in safety stock calculations
- ABC-XYZ matrix helps prioritize inventory management strategies
- Inventory optimization should balance costs with service levels
