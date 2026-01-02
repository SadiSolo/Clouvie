export interface Product {
  id: string;
  name: string;
  currentPrice: number;
  recommendedPrice: number;
  predictedProfit: number;
  profitGainLoss: number;
  demandChange: number;
  bpe: number;
  elasticity?: number;
  productCost?: number;
  category?: string;
  stockLevel?: number;
  competitorPrice?: number;
  margin?: number;
  lastPriceChange?: string;
  priceHistory?: PriceHistoryEntry[];
}

export interface PriceHistoryEntry {
  date: string;
  price: number;
  reason: string;
  profitImpact: number;
}

export interface StatCardData {
  icon: string;
  value: string | number;
  label: string;
  color: string;
}

export interface ProductAnalysisRow {
  [key: string]: string | number;
}

export interface ModelCoefficient {
  variable: string;
  coefficient: number;
  stdError: number;
  tValue: number;
  pValue: number;
  significance: string;
}

export interface PriceRecommendation {
  type: string;
  label: string;
  value: number;
  color: string;
}
