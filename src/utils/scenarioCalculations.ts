// Scenario Calculation Engine - All formulas consolidated from backend flowchart

import type { AllFactors, ScenarioOutcome, AIRecommendation, Product } from '../types/scenario';

/**
 * Calculate price elasticity impact on demand
 * Formula: demand_change = elasticity × (price_change / 100)
 */
export function calculatePriceImpact(
  priceChange: number,
  elasticity: number
): number {
  return elasticity * (priceChange / 100);
}

/**
 * Calculate marketing spend impact on demand
 * Formula: marketing_impact = ln(1 + spend/1000) × 0.15
 */
export function calculateMarketingImpact(marketingSpend: number): number {
  return Math.log(1 + marketingSpend / 1000) * 0.15;
}

/**
 * Calculate seasonal impact
 * Formula: seasonal_impact = seasonal_factor - 1
 */
export function calculateSeasonalImpact(seasonalMultiplier: number): number {
  return seasonalMultiplier - 1;
}

/**
 * Calculate competitor impact on demand
 * Formula: competitor_impact = -(competitor_change/100) × 0.3
 */
export function calculateCompetitorImpact(competitorPriceChange: number): number {
  return -(competitorPriceChange / 100) * 0.3;
}

/**
 * Calculate discount impact on demand
 * Formula: discount_impact = (discount/100) × 0.8
 */
export function calculateDiscountImpact(discount: number): number {
  return (discount / 100) * 0.8;
}

/**
 * Calculate promotion intensity impact
 * Formula: promotion_impact = (intensity / 10) × 0.25
 */
export function calculatePromotionImpact(intensity: number): number {
  return (intensity / 10) * 0.25;
}

/**
 * Calculate holiday effect impact
 */
export function calculateHolidayImpact(effect: 'none' | 'minor' | 'major'): number {
  const impacts = { none: 0, minor: 0.1, major: 0.3 };
  return impacts[effect];
}

/**
 * Calculate weather impact
 */
export function calculateWeatherImpact(impact: number): number {
  return impact * 0.15;
}

/**
 * Calculate competitor promotion impact
 */
export function calculateCompetitorPromotionImpact(
  promotion: 'none' | 'light' | 'moderate' | 'heavy'
): number {
  const impacts = { none: 0, light: -0.05, moderate: -0.12, heavy: -0.25 };
  return impacts[promotion];
}

/**
 * Main scenario calculation engine
 * Combines all factors to calculate comprehensive outcomes
 */
export function calculateScenarioOutcome(
  product: Product,
  factors: AllFactors
): ScenarioOutcome {
  const { pricing, demand, competitive, inventory, operational, financial, market } = factors;

  // ============================================
  // STEP 1: CALCULATE ALL DEMAND IMPACTS
  // ============================================
  
  // Basic price impact
  const priceImpact = calculatePriceImpact(pricing.priceChange, pricing.priceElasticity);
  
  // Cross-price elasticity impact (related products)
  const crossPriceImpact = (pricing.crossPriceElasticity || 0) * (pricing.priceChange / 100) * 0.5;
  
  // Cannibalization effect (negative impact from own products)
  const cannibalizationImpact = -(pricing.cannibalizationRate || 0) * Math.abs(pricing.priceChange / 100);
  
  // Bundle pricing boost
  const bundleImpact = (pricing.bundleEffect || 0) * (pricing.discount / 100);
  
  // Psychological pricing effect
  const psychologicalImpact = pricing.psychologicalThreshold === 'below' ? 0.08 : 
                             pricing.psychologicalThreshold === 'above' ? -0.03 : 0;
  
  // Marketing and promotion impacts
  const marketingImpact = calculateMarketingImpact(demand.marketingSpend);
  const promotionImpact = calculatePromotionImpact(demand.promotionIntensity);
  
  // Customer behavior impacts
  const churnImpact = -(demand.churnRate || 0.05) * 0.3;
  const repeatPurchaseImpact = (demand.repeatPurchaseRate || 0.35) * 0.2;
  const clvMultiplier = Math.log(1 + (demand.customerLifetimeValue || 2500) / 1000) * 0.05;
  
  // Channel mix impact
  const channelImpact = demand.channelMix === 'online-heavy' ? 0.12 : 
                       demand.channelMix === 'omnichannel' ? 0.08 :
                       demand.channelMix === 'retail-heavy' ? -0.05 : 0;
  
  // Customer segment impact
  const segmentImpact = demand.customerSegment === 'premium' ? 0.15 :
                       demand.customerSegment === 'early-adopters' ? 0.10 :
                       demand.customerSegment === 'budget-conscious' ? -0.08 : 0;
  
  // External events impact
  const externalEventImpact = demand.externalEvent === 'positive-major' ? 0.25 :
                             demand.externalEvent === 'positive-minor' ? 0.08 :
                             demand.externalEvent === 'negative-minor' ? -0.08 :
                             demand.externalEvent === 'negative-major' ? -0.20 :
                             demand.externalEvent === 'crisis' ? -0.45 : 0;
  
  // Seasonal and environmental impacts
  const seasonalImpact = calculateSeasonalImpact(demand.seasonalMultiplier);
  const holidayImpact = calculateHolidayImpact(demand.holidayEffect);
  const weatherImpact = calculateWeatherImpact(demand.weatherImpact);
  
  // Competitive impacts
  const competitorImpact = calculateCompetitorImpact(competitive.competitorPriceChange);
  const competitorPromotionImpact = calculateCompetitorPromotionImpact(competitive.competitorPromotion);
  
  // Brand strength impact (stronger brand = less price sensitivity)
  const brandStrengthImpact = ((competitive.brandStrength || 0.6) - 0.6) * 0.15;
  
  // Market concentration impact
  const concentrationImpact = competitive.marketConcentration === 'monopolistic' ? 0.10 :
                             competitive.marketConcentration === 'oligopoly' ? 0.05 :
                             competitive.marketConcentration === 'fragmented' ? -0.08 : 0;
  
  // Switching costs impact
  const switchingCostsImpact = competitive.switchingCosts === 'high' ? 0.12 :
                              competitive.switchingCosts === 'medium' ? 0.05 :
                              competitive.switchingCosts === 'low' ? -0.03 : -0.06;
  
  // Network effects impact
  const networkEffectsImpact = competitive.networkEffects === 'strong' ? 0.18 :
                              competitive.networkEffects === 'moderate' ? 0.08 :
                              competitive.networkEffects === 'weak' ? 0.03 : 0;
  
  // Market position impact
  const positionImpact = competitive.marketPosition === 'leader' ? 0.10 :
                        competitive.marketPosition === 'challenger' ? 0.05 :
                        competitive.marketPosition === 'nicher' ? 0.03 : -0.02;
  
  // Discount impact
  const discountImpact = calculateDiscountImpact(pricing.discount);
  
  // Market and external factors
  const gdpImpact = (market?.gdpGrowth || 0.03) * 2;
  const inflationImpact = -(market?.inflationRate || 0.03) * 0.5;
  const consumerConfidenceImpact = ((market?.consumerConfidence || 100) - 100) / 100 * 0.3;
  const marketGrowthImpact = (market?.marketGrowthRate || 0.05) * 1.5;
  
  // Regulatory impact
  const regulatoryImpact = market?.regulatoryEnvironment === 'strict' ? -0.05 :
                          market?.regulatoryEnvironment === 'changing' ? -0.03 : 0;
  
  // Technology disruption impact
  const techDisruptionImpact = market?.technologyDisruption === 'disruptive' ? 0.15 :
                              market?.technologyDisruption === 'high' ? 0.08 :
                              market?.technologyDisruption === 'moderate' ? 0.03 : 0;
  
  // Supply chain risk impact (negative)
  const supplyChainRiskImpact = market?.supplyChainRisk === 'critical' ? -0.20 :
                               market?.supplyChainRisk === 'high' ? -0.10 :
                               market?.supplyChainRisk === 'medium' ? -0.03 : 0;
  
  // ESG impact
  const esgImpact = market?.esgImpact === 'positive' ? 0.08 :
                   market?.esgImpact === 'negative' ? -0.05 :
                   market?.esgImpact === 'critical' ? -0.12 : 0;

  // ============================================
  // STEP 2: TOTAL DEMAND CHANGE
  // ============================================
  const totalDemandChange =
    priceImpact + crossPriceImpact + cannibalizationImpact + bundleImpact + psychologicalImpact +
    marketingImpact + promotionImpact +
    churnImpact + repeatPurchaseImpact + clvMultiplier +
    channelImpact + segmentImpact + externalEventImpact +
    seasonalImpact + holidayImpact + weatherImpact +
    competitorImpact + competitorPromotionImpact +
    brandStrengthImpact + concentrationImpact + switchingCostsImpact + 
    networkEffectsImpact + positionImpact +
    discountImpact +
    gdpImpact + inflationImpact + consumerConfidenceImpact + marketGrowthImpact +
    regulatoryImpact + techDisruptionImpact + supplyChainRiskImpact + esgImpact;

  // ============================================
  // STEP 3: CALCULATE NEW DEMAND
  // ============================================
  const baseDemand = product.currentDemand;
  const newDemand = Math.max(0, baseDemand * (1 + totalDemandChange));
  const demandChangePercent = ((newDemand - baseDemand) / baseDemand) * 100;

  // ============================================
  // STEP 4: PRICING AND COST CALCULATIONS
  // ============================================
  const adjustedCost = product.cost * (1 + pricing.costVariation / 100);
  const effectivePrice =
    product.currentPrice * (1 + pricing.priceChange / 100) * (1 - pricing.discount / 100);

  // ============================================
  // STEP 5: REVENUE CALCULATIONS
  // ============================================
  const currentRevenue = product.currentPrice * baseDemand;
  const newRevenue = effectivePrice * newDemand;
  const revenueChange = ((newRevenue - currentRevenue) / currentRevenue) * 100;

  // ============================================
  // STEP 6: PROFIT CALCULATIONS WITH FINANCIAL FACTORS
  // ============================================
  
  // Base costs
  const productionCost = adjustedCost * newDemand;
  
  // Operational costs
  const defectCost = productionCost * (operational.defectRate || 0.02);
  const orderProcessingCost = (operational.orderProcessingCost || 150);
  
  // Financial costs
  const workingCapitalCost = newRevenue * (financial?.workingCapitalRatio || 0.15) * (financial?.costOfCapital || 0.12);
  const badDebtCost = newRevenue * (financial?.badDebtRate || 0.01);
  
  // Payment terms impact on cash
  const paymentTermsImpact = financial?.paymentTerms === 'net-90' ? 0.03 :
                            financial?.paymentTerms === 'net-60' ? 0.02 :
                            financial?.paymentTerms === 'net-30' ? 0.01 : 0;
  const financingCost = newRevenue * paymentTermsImpact * (financial?.costOfCapital || 0.12);
  
  // Currency risk cost
  const currencyRiskCost = financial?.currencyRisk === 'high' ? newRevenue * 0.02 :
                          financial?.currencyRisk === 'medium' ? newRevenue * 0.01 :
                          financial?.currencyRisk === 'low' ? newRevenue * 0.005 : 0;
  
  // Total costs before tax
  const totalCostsBeforeTax = productionCost + demand.marketingSpend + defectCost + 
                              orderProcessingCost + workingCapitalCost + badDebtCost +
                              financingCost + currencyRiskCost;
  
  // Profit before tax
  const profitBeforeTax = newRevenue - totalCostsBeforeTax;
  
  // Tax calculation
  const taxAmount = profitBeforeTax > 0 ? profitBeforeTax * (financial?.taxRate || 0.25) : 0;
  
  // Net profit after tax
  const newProfit = profitBeforeTax - taxAmount;
  
  // Current profit for comparison
  const currentProfit = (product.currentPrice - product.cost) * baseDemand * (1 - (financial?.taxRate || 0.25));
  const profitChange = currentProfit > 0 ? ((newProfit - currentProfit) / currentProfit) * 100 : 0;

  // Margin calculation
  const margin = newRevenue > 0 ? ((newProfit / newRevenue) * 100) : 0;

  // ROI calculation
  const totalInvestment = demand.marketingSpend + productionCost + workingCapitalCost;
  const roi = totalInvestment > 0 ? ((newProfit / totalInvestment) * 100) : 0;

  // ============================================
  // STEP 7: INVENTORY CALCULATIONS WITH ADVANCED FACTORS
  // ============================================
  
  // Base EOQ calculation
  const annualDemand = newDemand * 12;
  const baseOrderCost = operational.orderProcessingCost || 150;
  const annualHoldingCostRate = operational.holdingCostRate / 100;
  const unitHoldingCost = effectivePrice * annualHoldingCostRate;
  
  // Economic Order Quantity
  const eoq = Math.sqrt((2 * annualDemand * baseOrderCost) / unitHoldingCost);
  
  // Adjust based on EOQ model type
  const eoqMultiplier = inventory.eoqModel === 'jit' ? 0.3 :
                       inventory.eoqModel === 'quantity-discounts' ? 1.5 :
                       inventory.eoqModel === 'with-backorders' ? 0.8 : 1.0;
  
  const adjustedEOQ = eoq * eoqMultiplier * (1 + inventory.orderQuantity / 100);
  
  // Lead time calculation
  const baseLeadTime = 7;
  const supplierReliabilityFactor = 1 - (inventory.supplierReliability || 0.95);
  const leadTimeVariability = baseLeadTime * supplierReliabilityFactor * 2;
  const adjustedLeadTime = (baseLeadTime + leadTimeVariability) * (1 + inventory.leadTime / 100);
  
  // Safety stock calculation with ABC classification
  const abcMultiplier = inventory.abcClassification === 'A' ? 1.5 :
                       inventory.abcClassification === 'B' ? 1.0 : 0.6;
  
  const safetyStockMultipliers = { low: 0.5, medium: 1.0, high: 1.5 };
  const safetyStockLevel = safetyStockMultipliers[inventory.safetyStockLevel] * abcMultiplier;
  
  const demandVariabilityMultipliers = { low: 0.8, medium: 1.2, high: 1.8 };
  const demandVariability = demandVariabilityMultipliers[inventory.demandVariability];
  
  // Obsolescence risk impact on safety stock
  const obsolescenceMultiplier = inventory.obsolescenceRisk === 'high' ? 0.6 :
                                inventory.obsolescenceRisk === 'medium' ? 0.8 : 1.0;
  
  const dailyDemand = newDemand / 30;
  const safetyStock = dailyDemand * adjustedLeadTime * safetyStockLevel * 
                     demandVariability * obsolescenceMultiplier;
  
  // Total inventory level
  const inventoryLevel = adjustedEOQ / 2 + safetyStock; // Average inventory + safety stock
  
  // Warehouse utilization impact
  const warehouseUtilization = inventory.warehouseUtilization || 0.75;
  const warehouseConstraint = warehouseUtilization > 0.90 ? 0.85 : 1.0;
  const constrainedInventory = inventoryLevel * warehouseConstraint;
  
  // Carrying costs
  const carryingCost = constrainedInventory * unitHoldingCost;
  
  // Ordering cost
  const numberOfOrders = annualDemand / adjustedEOQ;
  const orderingCost = numberOfOrders * baseOrderCost;
  
  // Multi-sourcing impact on costs
  const sourcingCostMultiplier = inventory.sourcingStrategy === 'global' ? 1.15 :
                                inventory.sourcingStrategy === 'multiple' ? 1.10 :
                                inventory.sourcingStrategy === 'dual' ? 1.05 : 1.0;
  const totalInventoryCost = (carryingCost + orderingCost) * sourcingCostMultiplier;

  // ============================================
  // STEP 8: RISK ASSESSMENTS
  // ============================================
  
  // Stockout risk
  const stockoutRisk = calculateStockoutRisk(
    dailyDemand,
    constrainedInventory,
    adjustedLeadTime,
    demandVariability
  );

  // Overstock risk
  const overstockRisk = calculateOverstockRisk(constrainedInventory, dailyDemand);

  // Service level adjustment
  const capacityUtilization = operational.capacityUtilization || 0.8;
  const capacityAdjustedServiceLevel = operational.serviceLevelTarget * 
                                       Math.min(1, capacityUtilization * 1.2);

  // ============================================
  // STEP 9: CASH FLOW CALCULATIONS
  // ============================================
  
  // Cash inflow
  const cashInflow = newRevenue;
  
  // Cash outflow
  const cashOutflow = totalCostsBeforeTax + taxAmount + totalInventoryCost;
  
  // Net cash flow
  const cashFlow = cashInflow - cashOutflow;

  // ============================================
  // STEP 10: BREAK-EVEN ANALYSIS
  // ============================================
  const fixedCosts = demand.marketingSpend + orderingCost + orderProcessingCost;
  const variableCostPerUnit = adjustedCost + (defectCost / newDemand);
  const contributionMargin = effectivePrice - variableCostPerUnit;
  const breakEvenPoint = contributionMargin > 0 ? fixedCosts / contributionMargin : 0;

  return {
    revenue: Math.round(newRevenue),
    revenueChange: Number(revenueChange.toFixed(2)),
    profit: Math.round(newProfit),
    profitChange: Number(profitChange.toFixed(2)),
    margin: Number(margin.toFixed(2)),
    roi: Number(roi.toFixed(2)),
    unitsSold: Math.round(newDemand),
    demandChange: Number(demandChangePercent.toFixed(2)),
    inventoryLevel: Math.round(constrainedInventory),
    stockoutRisk,
    overstockRisk,
    carryingCost: Math.round(totalInventoryCost),
    orderingCost: Math.round(orderingCost),
    serviceLevel: Number(capacityAdjustedServiceLevel.toFixed(2)),
    leadTimeImpact: Number(adjustedLeadTime.toFixed(1)),
    cashFlow: Math.round(cashFlow),
    breakEvenPoint: Math.round(breakEvenPoint),
    effectivePrice: Number(effectivePrice.toFixed(2)),
    totalCost: Math.round(totalCostsBeforeTax + taxAmount),
  };
}

/**
 * Calculate stockout risk based on inventory metrics
 */
function calculateStockoutRisk(
  dailyDemand: number,
  inventoryLevel: number,
  leadTime: number,
  demandVariability: number
): 'low' | 'medium' | 'high' {
  const daysOfStock = inventoryLevel / dailyDemand;
  const riskThreshold = leadTime * demandVariability;

  if (daysOfStock > riskThreshold * 2) return 'low';
  if (daysOfStock > riskThreshold) return 'medium';
  return 'high';
}

/**
 * Calculate overstock risk
 */
function calculateOverstockRisk(
  inventoryLevel: number,
  dailyDemand: number
): 'low' | 'medium' | 'high' {
  const daysOfStock = inventoryLevel / dailyDemand;

  if (daysOfStock < 30) return 'low';
  if (daysOfStock < 60) return 'medium';
  return 'high';
}

/**
 * Generate AI recommendation based on scenario outcome
 */
export function generateRecommendation(
  outcome: ScenarioOutcome,
  factors: AllFactors
): AIRecommendation {
  const warnings: string[] = [];
  let confidence = 90; // Base confidence

  // Pricing risk adjustments
  if (Math.abs(factors.pricing.priceChange) > 25) {
    confidence -= 20;
    warnings.push('Extreme price change may cause market disruption and customer loss');
  } else if (Math.abs(factors.pricing.priceChange) > 15) {
    confidence -= 10;
    warnings.push('Large price change may have unpredictable market effects');
  }

  // Discount risk
  if (factors.pricing.discount > 35) {
    confidence -= 15;
    warnings.push('Heavy discounting may erode brand value and profit margins');
  }

  // Cannibalization warning
  if ((factors.pricing.cannibalizationRate || 0) > 0.3) {
    confidence -= 12;
    warnings.push('High cannibalization risk - sales may come from existing products');
  }

  // Marketing spend efficiency
  if (factors.demand.marketingSpend > 30000) {
    const marketingROI = (outcome.profit / factors.demand.marketingSpend) * 100;
    if (marketingROI < 200) {
      confidence -= 15;
      warnings.push('High marketing spend with low ROI - consider reducing budget');
    } else {
      warnings.push('High marketing investment - monitor ROI closely');
    }
  }

  // Customer metrics warnings
  if ((factors.demand.churnRate || 0.05) > 0.15) {
    confidence -= 10;
    warnings.push('High customer churn rate - focus on retention strategies');
  }

  // External event risks
  const externalEvent = factors.demand.externalEvent;
  if (externalEvent === 'crisis' || externalEvent === 'negative-major') {
    confidence -= 25;
    warnings.push('Severe external conditions - scenario highly uncertain');
  } else if (externalEvent === 'negative-minor') {
    confidence -= 10;
    warnings.push('Negative external factors may impact results');
  }

  // Competitive risks
  if (Math.abs(factors.competitive.competitorPriceChange) > 20) {
    confidence -= 12;
    warnings.push('Major competitor price movement - market share at risk');
  }

  // Brand strength considerations
  if ((factors.competitive.brandStrength || 0.6) < 0.4) {
    confidence -= 8;
    warnings.push('Weak brand strength limits pricing power');
  }

  // Market concentration risk
  if (factors.competitive.marketConcentration === 'monopolistic') {
    warnings.push('Dominant market position - regulatory scrutiny possible');
  } else if (factors.competitive.marketConcentration === 'fragmented') {
    confidence -= 5;
    warnings.push('Fragmented market increases competitive pressure');
  }

  // Inventory risks
  if (outcome.stockoutRisk === 'high') {
    confidence -= 15;
    warnings.push('HIGH STOCKOUT RISK - increase safety stock or reduce lead time');
  } else if (outcome.stockoutRisk === 'medium') {
    confidence -= 8;
    warnings.push('Moderate stockout risk - monitor inventory levels closely');
  }

  if (outcome.overstockRisk === 'high') {
    confidence -= 10;
    warnings.push('HIGH OVERSTOCK RISK - excess inventory increases carrying costs');
  }

  // Obsolescence warning
  if (factors.inventory.obsolescenceRisk === 'high') {
    confidence -= 12;
    warnings.push('High obsolescence risk - minimize inventory levels');
  }

  // Warehouse capacity warning
  if ((factors.inventory.warehouseUtilization || 0.75) > 0.90) {
    confidence -= 8;
    warnings.push('Warehouse near capacity - may constrain operations');
  }

  // Supplier reliability
  if ((factors.inventory.supplierReliability || 0.95) < 0.80) {
    confidence -= 15;
    warnings.push('Low supplier reliability - consider backup suppliers');
  }

  // Operational risks
  if ((factors.operational.defectRate || 0.02) > 0.05) {
    confidence -= 10;
    warnings.push('High defect rate - quality improvements needed');
  }

  if ((factors.operational.capacityUtilization || 0.8) > 0.95) {
    confidence -= 8;
    warnings.push('Operating at maximum capacity - scalability limited');
  } else if ((factors.operational.capacityUtilization || 0.8) < 0.60) {
    warnings.push('Low capacity utilization - fixed costs not optimized');
  }

  // Financial risks
  if (factors.financial) {
    if ((factors.financial.badDebtRate || 0.01) > 0.03) {
      confidence -= 10;
      warnings.push('High bad debt rate - tighten credit policy');
    }

    if ((factors.financial.workingCapitalRatio || 0.15) > 0.30) {
      confidence -= 8;
      warnings.push('High working capital requirement strains cash flow');
    }

    if (factors.financial.currencyRisk === 'high') {
      confidence -= 12;
      warnings.push('High currency risk - consider hedging strategies');
    }

    if (factors.financial.creditPolicy === 'lenient') {
      warnings.push('Lenient credit policy increases sales but raises risk');
    }
  }

  // Market risks
  if (factors.market) {
    if ((factors.market.gdpGrowth || 0.03) < 0) {
      confidence -= 15;
      warnings.push('Economic recession conditions - demand highly uncertain');
    }

    if ((factors.market.inflationRate || 0.03) > 0.10) {
      confidence -= 10;
      warnings.push('High inflation erodes purchasing power');
    }

    if ((factors.market.consumerConfidence || 100) < 80) {
      confidence -= 12;
      warnings.push('Low consumer confidence dampens demand');
    }

    if (factors.market.regulatoryEnvironment === 'strict' || 
        factors.market.regulatoryEnvironment === 'changing') {
      confidence -= 8;
      warnings.push('Regulatory uncertainty increases compliance risks');
    }

    if (factors.market.supplyChainRisk === 'critical' || 
        factors.market.supplyChainRisk === 'high') {
      confidence -= 15;
      warnings.push('Supply chain disruptions threaten operations');
    }

    if (factors.market.technologyDisruption === 'disruptive') {
      warnings.push('Disruptive technology - rapid adaptation required');
    }
  }

  // Profitability warnings
  if (outcome.margin < 10) {
    confidence -= 15;
    warnings.push('CRITICAL: Very low profit margin - pricing not sustainable');
  } else if (outcome.margin < 20) {
    confidence -= 8;
    warnings.push('Low profit margin - limited room for cost increases');
  }

  if (outcome.profitChange < -20) {
    confidence -= 25;
    warnings.push('CRITICAL: Major profit decline - strategy not viable');
  } else if (outcome.profitChange < -10) {
    confidence -= 15;
    warnings.push('Significant profit decline - reconsider strategy');
  }

  // Cash flow warning
  if (outcome.cashFlow < 0) {
    confidence -= 20;
    warnings.push('NEGATIVE CASH FLOW - immediate liquidity concerns');
  } else if (outcome.cashFlow < outcome.revenue * 0.10) {
    confidence -= 10;
    warnings.push('Tight cash flow - monitor working capital');
  }

  // ROI validation
  if (outcome.roi < 10) {
    confidence -= 12;
    warnings.push('Low ROI - investment returns below expectations');
  }

  // Service level check
  if (outcome.serviceLevel < 90) {
    confidence -= 10;
    warnings.push('Low service level - customer satisfaction at risk');
  }

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  
  if (confidence < 50 || outcome.profitChange < -20 || outcome.cashFlow < 0) {
    riskLevel = 'high';
  } else if (confidence < 70 || outcome.profitChange < 0 || warnings.length > 5) {
    riskLevel = 'medium';
  }

  // Generate recommendation text
  let recommendation = '';
  
  if (outcome.profitChange > 20 && outcome.stockoutRisk === 'low' && outcome.cashFlow > 0 && confidence > 75) {
    recommendation = '🎯 EXCELLENT SCENARIO: Strong profit growth with manageable risks. Highly recommended for implementation.';
  } else if (outcome.profitChange > 10 && outcome.cashFlow > 0 && confidence > 65) {
    recommendation = '✅ GOOD SCENARIO: Positive profit improvement with acceptable risk levels. Recommended with monitoring.';
  } else if (outcome.profitChange > 0 && confidence > 55) {
    recommendation = '⚠️ MODERATE SCENARIO: Slight profit gain but several risk factors present. Consider optimizations before implementing.';
  } else if (outcome.profitChange > -10 && confidence > 50) {
    recommendation = '⚠️ RISKY SCENARIO: Limited upside with notable risks. Explore alternative strategies for better results.';
  } else {
    recommendation = '❌ HIGH RISK SCENARIO: Significant profit decline and/or major risk factors. NOT RECOMMENDED without substantial modifications.';
  }

  // Add specific guidance based on key issues
  if (outcome.stockoutRisk === 'high') {
    recommendation += ' Increase inventory safety stock immediately.';
  }
  if (outcome.cashFlow < 0) {
    recommendation += ' Address cash flow issues before proceeding.';
  }
  if (outcome.margin < 15) {
    recommendation += ' Improve pricing or reduce costs to achieve sustainable margins.';
  }

  const bestScenario = outcome.profitChange > 15 && 
                       outcome.stockoutRisk === 'low' && 
                       outcome.cashFlow > outcome.revenue * 0.15 &&
                       confidence > 80 &&
                       warnings.length < 3;

  return {
    confidence: Math.max(30, Math.min(98, confidence)),
    riskLevel,
    recommendation,
    warnings: warnings.slice(0, 8), // Limit to 8 most important warnings
    bestScenario,
  };
}

/**
 * Create default/neutral factors
 */
export function createDefaultFactors(): AllFactors {
  return {
    pricing: {
      priceChange: 0,
      discount: 0,
      costVariation: 0,
      priceElasticity: -1.5,
    },
    demand: {
      marketingSpend: 0,
      promotionIntensity: 0,
      seasonalMultiplier: 1.0,
      holidayEffect: 'none',
      weatherImpact: 0,
    },
    competitive: {
      competitorPriceChange: 0,
      competitorPromotion: 'none',
      marketShareGoal: 0,
    },
    inventory: {
      orderQuantity: 0,
      leadTime: 0,
      safetyStockLevel: 'medium',
      demandVariability: 'medium',
    },
    operational: {
      serviceLevelTarget: 95,
      stockoutCostImpact: 'medium',
      holdingCostRate: 25,
    },
  };
}
