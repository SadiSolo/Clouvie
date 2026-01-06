// Scenario Simulator Type Definitions

export interface Product {
  id: string;
  name: string;
  currentPrice: number;
  recommendedPrice: number;
  cost: number;
  currentDemand: number;
  category: string;
}

export interface PricingFactors {
  priceChange: number; // -30 to +30 percent
  discount: number; // 0 to 50 percent
  costVariation: number; // -20 to +20 percent
  priceElasticity: number; // -3.0 to -0.5
  crossPriceElasticity?: number; // -0.5 to 1.5 (complement to substitute)
  cannibalizationRate?: number; // 0 to 0.5 (50%)
  bundleEffect?: number; // 0 to 0.4 (40%)
  competitiveResponseLag?: number; // 0 to 8 weeks
  psychologicalThreshold?: string; // 'none', 'below', 'above'
}

export interface DemandFactors {
  marketingSpend: number; // $0 to $50,000
  promotionIntensity: number; // 0 to 10
  seasonalMultiplier: number; // 0.5 to 2.0
  holidayEffect: 'none' | 'minor' | 'major';
  weatherImpact: number; // -1 (negative) to +1 (positive)
  customerAcquisitionCost?: number; // $50 to $500
  customerLifetimeValue?: number; // $500 to $10,000
  churnRate?: number; // 0 to 0.25 (25% monthly)
  repeatPurchaseRate?: number; // 0 to 0.8 (80%)
  channelMix?: string; // 'online-heavy', 'balanced', 'retail-heavy', 'omnichannel'
  customerSegment?: string; // 'budget-conscious', 'mass-market', 'premium', 'early-adopters'
  externalEvent?: string; // 'none', 'positive-minor', 'positive-major', 'negative-minor', 'negative-major', 'crisis'
}

export interface CompetitiveFactors {
  competitorPriceChange: number; // -30 to +30 percent
  competitorPromotion: 'none' | 'light' | 'moderate' | 'heavy';
  marketShareGoal: number; // -10 to +10 percent
  marketConcentration?: string; // 'fragmented', 'moderate', 'oligopoly', 'monopolistic'
  brandStrength?: number; // 0.2 to 1.0 (20% to 100%)
  switchingCosts?: string; // 'very-low', 'low', 'medium', 'high'
  networkEffects?: string; // 'none', 'weak', 'moderate', 'strong'
  marketPosition?: string; // 'leader', 'challenger', 'follower', 'nicher'
}

export interface InventoryFactors {
  orderQuantity: number; // -50 to +50 percent of current
  leadTime: number; // -50 to +50 percent of current
  safetyStockLevel: 'low' | 'medium' | 'high';
  demandVariability: 'low' | 'medium' | 'high';
  eoqModel?: string; // 'standard', 'with-backorders', 'quantity-discounts', 'jit'
  reorderStrategy?: string; // 'fixed-quantity', 'fixed-period', 'min-max', 'two-bin'
  abcClassification?: string; // 'A', 'B', 'C'
  turnoverTarget?: number; // 2 to 24 times per year
  supplierReliability?: number; // 0.7 to 1.0 (70% to 100%)
  sourcingStrategy?: string; // 'single', 'dual', 'multiple', 'global'
  obsolescenceRisk?: string; // 'very-low', 'low', 'medium', 'high'
  warehouseUtilization?: number; // 0.4 to 0.95 (40% to 95%)
}

export interface OperationalFactors {
  serviceLevelTarget: number; // 90 to 99.9 percent
  stockoutCostImpact: 'low' | 'medium' | 'high';
  holdingCostRate: number; // 15 to 35 percent
  orderProcessingCost?: number; // $50 to $500
  defectRate?: number; // 0 to 0.1 (10%)
  capacityUtilization?: number; // 0.5 to 1.0 (50% to 100%)
}

export interface FinancialFactors {
  paymentTerms?: string; // 'immediate', 'net-15', 'net-30', 'net-60', 'net-90'
  earlyPaymentDiscount?: number; // 0 to 0.05 (5%)
  workingCapitalRatio?: number; // 0.05 to 0.4 (5% to 40%)
  costOfCapital?: number; // 0.05 to 0.25 (5% to 25% WACC)
  creditPolicy?: string; // 'strict', 'moderate', 'lenient'
  badDebtRate?: number; // 0 to 0.05 (5%)
  taxRate?: number; // 0.15 to 0.4 (15% to 40%)
  currencyRisk?: string; // 'none', 'low', 'medium', 'high'
}

export interface MarketFactors {
  gdpGrowth?: number; // -0.05 to 0.10 (-5% to 10%)
  inflationRate?: number; // 0 to 0.15 (0% to 15%)
  consumerConfidence?: number; // 60 to 140 index
  marketGrowthRate?: number; // -0.05 to 0.30 (-5% to 30% CAGR)
  regulatoryEnvironment?: string; // 'light', 'moderate', 'strict', 'changing'
  technologyDisruption?: string; // 'stable', 'moderate', 'high', 'disruptive'
  supplyChainRisk?: string; // 'low', 'medium', 'high', 'critical'
  esgImpact?: string; // 'positive', 'neutral', 'negative', 'critical'
}

export interface AllFactors {
  pricing: PricingFactors;
  demand: DemandFactors;
  competitive: CompetitiveFactors;
  inventory: InventoryFactors;
  operational: OperationalFactors;
  financial?: FinancialFactors;
  market?: MarketFactors;
}

export interface ScenarioOutcome {
  revenue: number;
  revenueChange: number; // percent
  profit: number;
  profitChange: number; // percent
  margin: number; // percent
  roi: number; // percent
  unitsSold: number;
  demandChange: number; // percent
  inventoryLevel: number;
  stockoutRisk: 'low' | 'medium' | 'high';
  overstockRisk: 'low' | 'medium' | 'high';
  carryingCost: number;
  orderingCost: number;
  serviceLevel: number; // percent
  leadTimeImpact: number; // days
  cashFlow: number;
  breakEvenPoint: number; // units
  effectivePrice: number;
  totalCost: number;
}

export interface AIRecommendation {
  confidence: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
  warnings: string[];
  bestScenario: boolean;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  factors: AllFactors;
  outcome: ScenarioOutcome;
  recommendation: AIRecommendation;
  createdAt: Date;
  isPreset: boolean;
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  factors: Partial<AllFactors>;
}

export interface ComparisonResult {
  scenarios: Scenario[];
  bestByRevenue: string; // scenario id
  bestByProfit: string;
  bestByRoi: string;
  lowestRisk: string;
}

export interface ScenarioChartData {
  name: string;
  revenue: number;
  profit: number;
  units: number;
  risk: number;
}
