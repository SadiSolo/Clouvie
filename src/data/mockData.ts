import type { Product, StatCardData, ProductAnalysisRow, ModelCoefficient, PriceRecommendation } from '../types';

export const statsData: StatCardData[] = [
  {
    icon: 'target',
    value: '47',
    label: 'Opportunities Found',
    color: 'from-indigo-500 to-purple-600'
  },
  {
    icon: 'trending-up',
    value: '$44594.47',
    label: 'Potential Profit Uplift',
    color: 'from-teal-400 to-emerald-500'
  },
  {
    icon: 'file-text',
    value: '48',
    label: 'Products Optimized',
    color: 'from-amber-400 to-orange-500'
  },
  {
    icon: 'activity',
    value: '-1.200',
    label: 'Average Elasticity',
    color: 'from-rose-400 to-red-500'
  }
];

export const topMovers: Product[] = [
  {
    id: '723',
    name: 'Chicken Pepperoni & Cheese Bagel 723',
    currentPrice: 393.70,
    recommendedPrice: 343.08,
    predictedProfit: 92.01,
    profitGainLoss: 6.21,
    demandChange: 44.37,
    bpe: -0.918,
    category: 'Food',
    stockLevel: 45,
    competitorPrice: 385.00,
    margin: 32.5,
    lastPriceChange: '2024-11-15',
    priceHistory: [
      { date: '2024-11-15', price: 393.70, reason: 'Cost increase', profitImpact: -120 },
      { date: '2024-09-01', price: 380.00, reason: 'Seasonal adjustment', profitImpact: 450 },
      { date: '2024-06-10', price: 375.00, reason: 'Market analysis', profitImpact: 200 }
    ]
  },
  {
    id: '734',
    name: 'Chipotle Chicken Sandwich & Coffee Combo 734',
    currentPrice: 427.24,
    recommendedPrice: 341.79,
    predictedProfit: 91.30,
    profitGainLoss: 787.56,
    demandChange: 3978.20,
    bpe: -2.333,
    category: 'Combo',
    stockLevel: 120,
    competitorPrice: 410.00,
    margin: 28.3,
    lastPriceChange: '2024-10-20',
    priceHistory: [
      { date: '2024-10-20', price: 427.24, reason: 'Premium positioning', profitImpact: 350 },
      { date: '2024-08-15', price: 415.00, reason: 'Competitor match', profitImpact: 180 }
    ]
  },
  {
    id: '720',
    name: 'Iced Latte 720',
    currentPrice: 214.85,
    recommendedPrice: 171.88,
    predictedProfit: 795.91,
    profitGainLoss: 144.70,
    demandChange: 104.33,
    bpe: -2.865,
    category: 'Beverage',
    stockLevel: 8,
    competitorPrice: 195.00,
    margin: 45.2,
    lastPriceChange: '2024-12-01',
    priceHistory: [
      { date: '2024-12-01', price: 214.85, reason: 'Holiday pricing', profitImpact: 520 },
      { date: '2024-10-05', price: 205.00, reason: 'Standard increase', profitImpact: 220 }
    ]
  },
  {
    id: '703',
    name: 'Latte 703',
    currentPrice: 198.49,
    recommendedPrice: 158.79,
    predictedProfit: 75.63,
    profitGainLoss: 140.06,
    demandChange: 709.42,
    bpe: -3.021,
    category: 'Beverage',
    stockLevel: 15,
    competitorPrice: 180.00,
    margin: 42.8,
    lastPriceChange: '2024-11-10',
    priceHistory: [
      { date: '2024-11-10', price: 198.49, reason: 'Cost adjustment', profitImpact: -80 }
    ]
  },
  {
    id: '718',
    name: 'Original Icedpresso 718',
    currentPrice: 237.85,
    recommendedPrice: 217.49,
    predictedProfit: 712.14,
    profitGainLoss: 10.08,
    demandChange: 22.42,
    bpe: -1.957,
    category: 'Beverage',
    stockLevel: 92,
    competitorPrice: 225.00,
    margin: 38.5,
    lastPriceChange: '2024-09-22',
    priceHistory: [
      { date: '2024-09-22', price: 237.85, reason: 'Competitor analysis', profitImpact: 150 }
    ]
  },
  {
    id: '745',
    name: 'Strawberry Cream MilkShake 745',
    currentPrice: 224.54,
    recommendedPrice: 256.62,
    predictedProfit: 71.63,
    profitGainLoss: 2.03,
    demandChange: -19.96,
    bpe: -0.595,
    category: 'Beverage',
    stockLevel: 156,
    competitorPrice: 240.00,
    margin: 35.7,
    lastPriceChange: '2024-08-30',
    priceHistory: [
      { date: '2024-08-30', price: 224.54, reason: 'Summer promotion', profitImpact: -200 }
    ]
  },
  {
    id: '748',
    name: 'Oatmeal Cranberry Cookie 748',
    currentPrice: 100.32,
    recommendedPrice: 80.26,
    predictedProfit: 691.51,
    profitGainLoss: 487.95,
    demandChange: 393.46,
    bpe: -6.473,
    category: 'Snack',
    stockLevel: 3,
    competitorPrice: 95.00,
    margin: 18.5,
    lastPriceChange: '2024-12-15',
    priceHistory: [
      { date: '2024-12-15', price: 100.32, reason: 'Clear stock', profitImpact: -450 },
      { date: '2024-11-01', price: 110.00, reason: 'Standard pricing', profitImpact: 100 }
    ]
  },
  {
    id: '705',
    name: 'Mini Choux 705',
    currentPrice: 131.22,
    recommendedPrice: 104.97,
    predictedProfit: 69.69,
    profitGainLoss: 22.24,
    demandChange: 144.77,
    bpe: -2.128
  },
  {
    id: '704',
    name: 'Cappuccino 704',
    currentPrice: 107.62,
    recommendedPrice: 158.10,
    predictedProfit: 680.91,
    profitGainLoss: 439.18,
    demandChange: 369.47,
    bpe: -5.768
  }
];

export const productAnalysisData: ProductAnalysisRow[] = [
  {
    BILL_NUMBER: '16/003949',
    DATE: '01-Jan-25',
    LOCATION_ID: '142534',
    LOCATION_NAME: 'ROF-Blackwater Coffee Pvt. Ltd. - POS',
    CITY: 'Gurugram',
    COST: 89.5,
    BRAND_NAME: '-',
    ORDER_TYPE: 'In-Store',
    BILL_TYPE: 'sale',
    BILLING_TYPE: 'takeaway',
    BILL_STATUS: 'Settled',
    AREA_NAME: 'Takeaway',
    PLATFORM_NAME: '-',
    PLATFORM_ID: '-',
    ITEM_ID: '830359',
    ITEM_NAME: 'Flat White',
    POS_CODE: '1005',
    DEFAULT_SALES_PRICE: 199.0,
    AGGREGATOR_SALES_PRICE: 209.0
  },
  {
    BILL_NUMBER: '16/003950',
    DATE: '01-Jan-25',
    LOCATION_ID: '142534',
    LOCATION_NAME: 'ROF-Blackwater Coffee Pvt. Ltd. - POS',
    CITY: 'Gurugram',
    COST: 89.5,
    BRAND_NAME: '-',
    ORDER_TYPE: 'In-Store',
    BILL_TYPE: 'sale',
    BILLING_TYPE: 'takeaway',
    BILL_STATUS: 'Settled',
    AREA_NAME: 'Takeaway',
    PLATFORM_NAME: '-',
    PLATFORM_ID: '-',
    ITEM_ID: '830358',
    ITEM_NAME: 'Latte',
    POS_CODE: '1004',
    DEFAULT_SALES_PRICE: 189.0,
    AGGREGATOR_SALES_PRICE: 199.0
  },
  {
    BILL_NUMBER: '16/003951',
    DATE: '01-Jan-25',
    LOCATION_ID: '142534',
    LOCATION_NAME: 'ROF-Blackwater Coffee Pvt. Ltd. - POS',
    CITY: 'Gurugram',
    COST: 89.5,
    BRAND_NAME: '-',
    ORDER_TYPE: 'In-Store',
    BILL_TYPE: 'sale',
    BILLING_TYPE: 'takeaway',
    BILL_STATUS: 'Settled',
    AREA_NAME: 'Takeaway',
    PLATFORM_NAME: '-',
    PLATFORM_ID: '-',
    ITEM_ID: '830357',
    ITEM_NAME: 'Cappuccino',
    POS_CODE: '1003',
    DEFAULT_SALES_PRICE: 189.0,
    AGGREGATOR_SALES_PRICE: 199.0
  }
];

export const modelCoefficients: ModelCoefficient[] = [
  { variable: 'Intercept', coefficient: 1.2345, stdError: 0.1234, tValue: 10.0, pValue: 0.000, significance: '***' },
  { variable: 'log_price', coefficient: -1.2341, stdError: 0.0512, tValue: -24.1, pValue: 0.000, significance: '***' },
  { variable: 'weekend_yn', coefficient: 0.3449, stdError: 0.0442, tValue: 7.8, pValue: 0.000, significance: '***' },
  { variable: 'weekend_ind', coefficient: -0.1234, stdError: 0.0234, tValue: -5.3, pValue: 0.000, significance: '***' },
  { variable: 'promotion_active', coefficient: 0.4562, stdError: 0.0345, tValue: 13.2, pValue: 0.000, significance: '***' }
];

export const priceRecommendations: PriceRecommendation[] = [
  { type: 'current', label: 'CURRENT PRICE', value: 393.70, color: 'gray' },
  { type: 'recommended', label: 'RECOMMENDED PRICE', value: 343.08, color: 'teal' },
  { type: 'minimum', label: 'MINIMUM VIABLE', value: 275.59, color: 'blue' },
  { type: 'maximum', label: 'MAXIMUM VIABLE', value: 410.82, color: 'red' },
  { type: 'optimal', label: 'PROFIT OPTIMAL', value: 343.08, color: 'green' }
];
