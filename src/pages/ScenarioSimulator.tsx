import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { topMovers } from '../data/mockData';
import { 
  Target, Zap, TrendingUp, DollarSign, Package, AlertCircle, 
  ChevronDown, RotateCcw, BarChart3, Activity,
  Sparkles, ShieldCheck, AlertTriangle, Info, Save, X
} from 'lucide-react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { AllFactors, Scenario, PresetScenario, Product } from '../types/scenario';
import { calculateScenarioOutcome, generateRecommendation, createDefaultFactors } from '../utils/scenarioCalculations';

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'aggressive-growth',
    name: 'Aggressive Market Entry',
    description: 'Capture market share with aggressive pricing and high marketing',
    emoji: '🚀',
    color: 'from-red-500 to-orange-600',
    factors: {
      pricing: { priceChange: -15, discount: 10, costVariation: 0, priceElasticity: -1.5 },
      demand: { marketingSpend: 25000, promotionIntensity: 8, seasonalMultiplier: 1.0, holidayEffect: 'none', weatherImpact: 0 },
      competitive: { competitorPriceChange: 0, competitorPromotion: 'none', marketShareGoal: 10 },
    },
  },
  {
    id: 'clearance-sale',
    name: 'Clearance Sale Optimization',
    description: 'Move excess inventory quickly with deep discounts',
    emoji: '🏷️',
    color: 'from-purple-500 to-pink-600',
    factors: {
      pricing: { priceChange: -25, discount: 30, costVariation: 0, priceElasticity: -1.8 },
      demand: { marketingSpend: 5000, promotionIntensity: 9, seasonalMultiplier: 1.0, holidayEffect: 'none', weatherImpact: 0 },
      inventory: { orderQuantity: -40, leadTime: 0, safetyStockLevel: 'low', demandVariability: 'high' },
    },
  },
  {
    id: 'premium-position',
    name: 'Premium Repositioning',
    description: 'Build premium brand with higher prices and quality perception',
    emoji: '💎',
    color: 'from-indigo-500 to-purple-600',
    factors: {
      pricing: { priceChange: 20, discount: 0, costVariation: 10, priceElasticity: -0.8 },
      demand: { marketingSpend: 15000, promotionIntensity: 2, seasonalMultiplier: 1.0, holidayEffect: 'none', weatherImpact: 0 },
      competitive: { competitorPriceChange: 0, competitorPromotion: 'none', marketShareGoal: -5 },
    },
  },
  {
    id: 'seasonal-peak',
    name: 'Seasonal Peak Preparation',
    description: 'Optimize for high-demand season with inventory buildup',
    emoji: '🎄',
    color: 'from-green-500 to-teal-600',
    factors: {
      pricing: { priceChange: 5, discount: 0, costVariation: 0, priceElasticity: -1.2 },
      demand: { marketingSpend: 10000, promotionIntensity: 5, seasonalMultiplier: 1.8, holidayEffect: 'major', weatherImpact: 0.5 },
      inventory: { orderQuantity: 50, leadTime: -20, safetyStockLevel: 'high', demandVariability: 'high' },
    },
  },
  {
    id: 'competitor-response',
    name: 'Competitor Response Defense',
    description: 'Match competitor actions to maintain market position',
    emoji: '🛡️',
    color: 'from-blue-500 to-cyan-600',
    factors: {
      pricing: { priceChange: -10, discount: 15, costVariation: 0, priceElasticity: -1.5 },
      demand: { marketingSpend: 12000, promotionIntensity: 6, seasonalMultiplier: 1.0, holidayEffect: 'none', weatherImpact: 0 },
      competitive: { competitorPriceChange: -15, competitorPromotion: 'heavy', marketShareGoal: 0 },
    },
  },
  {
    id: 'cost-reduction',
    name: 'Cost Reduction Impact',
    description: 'Analyze effect of operational cost improvements',
    emoji: '💰',
    color: 'from-yellow-500 to-orange-600',
    factors: {
      pricing: { priceChange: -5, discount: 5, costVariation: -15, priceElasticity: -1.5 },
      demand: { marketingSpend: 8000, promotionIntensity: 4, seasonalMultiplier: 1.0, holidayEffect: 'none', weatherImpact: 0 },
      operational: { serviceLevelTarget: 95, stockoutCostImpact: 'low', holdingCostRate: 20 },
    },
  },
  {
    id: 'inventory-liquidation',
    name: 'Inventory Liquidation',
    description: 'Reduce excess stock with targeted promotions',
    emoji: '📦',
    color: 'from-orange-500 to-red-600',
    factors: {
      pricing: { priceChange: -20, discount: 25, costVariation: 0, priceElasticity: -1.8 },
      demand: { marketingSpend: 3000, promotionIntensity: 8, seasonalMultiplier: 1.0, holidayEffect: 'none', weatherImpact: 0 },
      inventory: { orderQuantity: -50, leadTime: 0, safetyStockLevel: 'low', demandVariability: 'medium' },
    },
  },
  {
    id: 'new-product-launch',
    name: 'New Product Launch',
    description: 'Build awareness and trial with introductory pricing',
    emoji: '🆕',
    color: 'from-pink-500 to-rose-600',
    factors: {
      pricing: { priceChange: -10, discount: 20, costVariation: 5, priceElasticity: -2.0 },
      demand: { marketingSpend: 30000, promotionIntensity: 9, seasonalMultiplier: 1.0, holidayEffect: 'minor', weatherImpact: 0 },
      inventory: { orderQuantity: 30, leadTime: -10, safetyStockLevel: 'medium', demandVariability: 'high' },
    },
  },
  {
    id: 'sustainable-growth',
    name: 'Sustainable Growth',
    description: 'Balanced approach for steady long-term growth',
    emoji: '🌱',
    color: 'from-emerald-500 to-green-600',
    factors: {
      pricing: { priceChange: 3, discount: 0, costVariation: 0, priceElasticity: -1.3 },
      demand: { marketingSpend: 8000, promotionIntensity: 3, seasonalMultiplier: 1.0, holidayEffect: 'none', weatherImpact: 0 },
      inventory: { orderQuantity: 10, leadTime: 0, safetyStockLevel: 'medium', demandVariability: 'low' },
    },
  },
  {
    id: 'market-disruption',
    name: 'Market Disruption Defense',
    description: 'Respond to major market changes or new entrants',
    emoji: '⚡',
    color: 'from-violet-500 to-purple-600',
    factors: {
      pricing: { priceChange: -12, discount: 18, costVariation: -5, priceElasticity: -1.6 },
      demand: { marketingSpend: 20000, promotionIntensity: 7, seasonalMultiplier: 1.0, holidayEffect: 'none', weatherImpact: 0 },
      competitive: { competitorPriceChange: -20, competitorPromotion: 'heavy', marketShareGoal: 5 },
    },
  },
];

export default function ScenarioSimulator() {
  const [searchParams] = useSearchParams();
  
  // Get initial product from URL or default to first
  const getInitialProduct = () => {
    const productId = searchParams.get('productId');
    if (productId) {
      const product = topMovers.find(p => p.id === productId);
      if (product) return product;
    }
    return topMovers[0];
  };

  const [selectedProduct, setSelectedProduct] = useState(getInitialProduct());
  const [customFactors, setCustomFactors] = useState<AllFactors>(createDefaultFactors());
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [simpleMode, setSimpleMode] = useState(true); // Simple mode for SMEs
  
  // Simple what-if analysis state
  const [testPrice, setTestPrice] = useState(selectedProduct.currentPrice);
  const [productCost, setProductCost] = useState(selectedProduct.currentPrice * 0.6);
  const [demandTrend, setDemandTrend] = useState(50); // 0=Declining, 50=Stable, 100=Growing
  const [marketingBudget, setMarketingBudget] = useState(5000);
  const [seasonType, setSeasonType] = useState(50); // 0=Off-Season, 50=Normal, 100=Peak
  const [discountPercent, setDiscountPercent] = useState(0);
  const [competitionLevel, setCompetitionLevel] = useState(50); // 0=Low, 50=Medium, 100=High
  const [stockStatus, setStockStatus] = useState(50); // 0=Low, 50=Good, 100=High
  const [stockUnits, setStockUnits] = useState(150); // Actual stock quantity
  const [supplierSpeed, setSupplierSpeed] = useState(50); // 0=Slow, 50=Normal, 100=Fast

  // Convert topMovers product to Product type
  const convertToProduct = (product: typeof topMovers[0]): Product => ({
    id: product.id,
    name: product.name,
    currentPrice: product.currentPrice,
    recommendedPrice: product.recommendedPrice,
    cost: product.currentPrice * 0.6, // Assume 40% margin
    currentDemand: 1000, // Base demand
    category: product.id.includes('latte') ? 'Beverages' : 'Other',
  });

  const currentProduct = convertToProduct(selectedProduct);

  // Calculate current scenario outcome
  const currentOutcome = calculateScenarioOutcome(currentProduct, customFactors);
  const currentRecommendation = generateRecommendation(currentOutcome, customFactors);

  // Apply preset scenario
  const applyPreset = (preset: PresetScenario) => {
    setActivePreset(preset.id);
    const newFactors = createDefaultFactors();
    
    // Merge preset factors with defaults
    if (preset.factors.pricing) {
      newFactors.pricing = { ...newFactors.pricing, ...preset.factors.pricing };
    }
    if (preset.factors.demand) {
      newFactors.demand = { ...newFactors.demand, ...preset.factors.demand };
    }
    if (preset.factors.competitive) {
      newFactors.competitive = { ...newFactors.competitive, ...preset.factors.competitive };
    }
    if (preset.factors.inventory) {
      newFactors.inventory = { ...newFactors.inventory, ...preset.factors.inventory };
    }
    if (preset.factors.operational) {
      newFactors.operational = { ...newFactors.operational, ...preset.factors.operational };
    }
    
    setCustomFactors(newFactors);
  };

  // Save scenario
  const saveScenario = () => {
    const newScenario: Scenario = {
      id: `scenario-${Date.now()}`,
      name: activePreset 
        ? PRESET_SCENARIOS.find(p => p.id === activePreset)?.name || 'Custom Scenario'
        : 'Custom Scenario',
      description: `Scenario for ${currentProduct.name}`,
      factors: customFactors,
      outcome: currentOutcome,
      recommendation: currentRecommendation,
      createdAt: new Date(),
      isPreset: activePreset !== null,
    };
    
    setScenarios([...scenarios, newScenario]);
  };

  // Reset to defaults
  const resetFactors = () => {
    setCustomFactors(createDefaultFactors());
    setActivePreset(null);
  };

  // Generate comparison data
  const getComparisonData = () => {
    if (scenarios.length === 0) return [];
    
    return scenarios.slice(-5).map(scenario => ({
      name: scenario.name.substring(0, 15) + '...',
      revenue: scenario.outcome.revenue / 1000,
      profit: scenario.outcome.profit / 1000,
      units: scenario.outcome.unitsSold,
      margin: scenario.outcome.margin,
    }));
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    if (risk === 'low') return 'text-green-700 bg-green-100 border-green-300';
    if (risk === 'medium') return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    return 'text-red-700 bg-red-100 border-red-300';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Scenario Simulator</h1>
              <p className="text-gray-600">Comprehensive what-if analysis across all business factors</p>
            </div>
          </div>
        </div>

        {/* Product Selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
              <div className="relative max-w-md">
                <select
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const product = topMovers.find(p => p.id === e.target.value);
                    if (product) setSelectedProduct(product);
                  }}
                  className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pr-10 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {topMovers.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveScenario}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Scenario
              </button>
              <button
                onClick={resetFactors}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Preset Scenarios */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="text-purple-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Preset Scenarios</h2>
            </div>
            <span className="text-sm text-gray-500">One-click scenario analysis</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {PRESET_SCENARIOS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  activePreset === preset.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="text-2xl mb-2">{preset.emoji}</div>
                <div className="font-bold text-gray-800 text-sm mb-1">{preset.name}</div>
                <div className="text-xs text-gray-600">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Scenario Builder */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="text-purple-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">What-If Analysis</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSimpleMode(!simpleMode)}
                className="text-sm px-4 py-2 rounded-lg font-semibold transition-colors bg-purple-100 text-purple-700 hover:bg-purple-200"
              >
                {simpleMode ? '🔧 Advanced Mode' : '✨ Simple Mode'}
              </button>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-indigo-600 font-semibold hover:text-indigo-700"
              >
                {showAdvanced ? 'Hide' : 'Show'} All Factors
              </button>
            </div>
          </div>

          {simpleMode ? (
            /* Simple Mode - SME Friendly with All 4 Modules */
            <div className="space-y-6">
              {/* Price Optimization Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                <h3 className="text-sm font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price Optimization
                </h3>
                
                {/* Test Price */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Test Price
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">$</span>
                      <input
                        type="number"
                        value={testPrice}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
                            setTestPrice(val);
                            setCustomFactors({
                              ...customFactors,
                              pricing: {
                                ...customFactors.pricing,
                                priceChange: ((val - selectedProduct.currentPrice) / selectedProduct.currentPrice) * 100
                              }
                            });
                          }
                        }}
                        className="w-24 px-3 py-1 text-lg font-bold text-purple-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min={selectedProduct.currentPrice * 0.5}
                    max={selectedProduct.currentPrice * 1.5}
                    step="0.01"
                    value={testPrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setTestPrice(val);
                      setCustomFactors({
                        ...customFactors,
                        pricing: {
                          ...customFactors.pricing,
                          priceChange: ((val - selectedProduct.currentPrice) / selectedProduct.currentPrice) * 100
                        }
                      });
                    }}
                    className="w-full h-3 bg-gradient-to-r from-purple-300 to-purple-500 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>${(selectedProduct.currentPrice * 0.5).toFixed(2)}</span>
                    <span>${(selectedProduct.currentPrice * 1.5).toFixed(2)}</span>
                  </div>
                </div>

                {/* Discount Percentage */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Discount
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={discountPercent}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 0 && val <= 50) {
                            setDiscountPercent(val);
                            setCustomFactors({
                              ...customFactors,
                              pricing: {
                                ...customFactors.pricing,
                                discount: val
                              }
                            });
                          }
                        }}
                        className="w-20 px-3 py-1 text-lg font-bold text-pink-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      <span className="text-xs text-gray-500">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={discountPercent}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setDiscountPercent(val);
                      setCustomFactors({
                        ...customFactors,
                        pricing: {
                          ...customFactors.pricing,
                          discount: val
                        }
                      });
                    }}
                    className="w-full h-3 bg-gradient-to-r from-pink-300 to-pink-500 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Product Cost */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Cost
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">$</span>
                      <input
                        type="number"
                        value={productCost.toFixed(2)}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val >= selectedProduct.currentPrice * 0.3 && val <= selectedProduct.currentPrice * 0.8) {
                            setProductCost(val);
                            setCustomFactors({
                              ...customFactors,
                              pricing: {
                                ...customFactors.pricing,
                                costVariation: ((val - (selectedProduct.currentPrice * 0.6)) / (selectedProduct.currentPrice * 0.6)) * 100
                              }
                            });
                          }
                        }}
                        className="w-24 px-3 py-1 text-lg font-bold text-orange-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min={selectedProduct.currentPrice * 0.3}
                    max={selectedProduct.currentPrice * 0.8}
                    step="0.01"
                    value={productCost}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setProductCost(val);
                      setCustomFactors({
                        ...customFactors,
                        pricing: {
                          ...customFactors.pricing,
                          costVariation: ((val - (selectedProduct.currentPrice * 0.6)) / (selectedProduct.currentPrice * 0.6)) * 100
                        }
                      });
                    }}
                    className="w-full h-3 bg-gradient-to-r from-orange-300 to-orange-500 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>${(selectedProduct.currentPrice * 0.3).toFixed(2)}</span>
                    <span>${(selectedProduct.currentPrice * 0.8).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Demand & Sales Forecasting Section */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
                <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Demand & Sales Forecasting
                </h3>

                {/* Product Demand Trend */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Demand Trend
                    </label>
                    <div className="px-3 py-1 rounded-lg font-bold text-sm"
                         style={{
                           background: demandTrend < 33 ? '#fef3c7' : demandTrend < 67 ? '#dbeafe' : '#d1fae5',
                           color: demandTrend < 33 ? '#92400e' : demandTrend < 67 ? '#1e40af' : '#065f46'
                         }}>
                      {demandTrend < 33 ? '📉 Declining' : demandTrend < 67 ? '➡️ Stable' : '📈 Growing'}
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={demandTrend}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setDemandTrend(val);
                      // Map 0-100 to elasticity: Declining=more elastic (1.8), Stable=normal (1.2), Growing=less elastic (0.8)
                      const elasticity = -1.8 + (val / 100) * 1.0; // -1.8 to -0.8
                      setCustomFactors({
                        ...customFactors,
                        pricing: {
                          ...customFactors.pricing,
                          priceElasticity: elasticity
                        },
                        demand: {
                          ...customFactors.demand,
                          promotionIntensity: val < 33 ? 7 : val < 67 ? 5 : 3
                        }
                      });
                    }}
                    className="w-full h-3 bg-gradient-to-r from-yellow-400 via-blue-400 to-green-500 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Declining</span>
                    <span>Stable</span>
                    <span>Growing</span>
                  </div>
                </div>

                {/* Marketing Budget */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Marketing Budget
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">$</span>
                      <input
                        type="number"
                        step="100"
                        value={marketingBudget}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 0 && val <= 30000) {
                            setMarketingBudget(val);
                            setCustomFactors({
                              ...customFactors,
                              demand: {
                                ...customFactors.demand,
                                marketingSpend: val
                              }
                            });
                          }
                        }}
                        className="w-24 px-3 py-1 text-lg font-bold text-cyan-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30000"
                    step="1000"
                    value={marketingBudget}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setMarketingBudget(val);
                      setCustomFactors({
                        ...customFactors,
                        demand: {
                          ...customFactors.demand,
                          marketingSpend: val
                        }
                      });
                    }}
                    className="w-full h-3 bg-gradient-to-r from-cyan-300 to-cyan-500 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span>$30k</span>
                  </div>
                </div>

                {/* Sales Period / Season */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Sales Period / Season
                    </label>
                    <div className="px-3 py-1 rounded-lg font-bold text-sm"
                         style={{
                           background: seasonType < 33 ? '#fef3c7' : seasonType < 67 ? '#e0e7ff' : '#d1fae5',
                           color: seasonType < 33 ? '#92400e' : seasonType < 67 ? '#3730a3' : '#065f46'
                         }}>
                      {seasonType < 33 ? '❄️ Off-Season' : seasonType < 67 ? '📅 Normal' : '🎉 Peak Season'}
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={seasonType}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setSeasonType(val);
                      // Map 0-100 to multiplier: Off=0.6, Normal=1.0, Peak=1.7
                      const multiplier = 0.6 + (val / 100) * 1.1;
                      const holidayEffect = val > 75 ? 'major' : val > 50 ? 'minor' : 'none';
                      setCustomFactors({
                        ...customFactors,
                        demand: {
                          ...customFactors.demand,
                          seasonalMultiplier: multiplier,
                          holidayEffect: holidayEffect as 'none' | 'minor' | 'major'
                        }
                      });
                    }}
                    className="w-full h-3 bg-gradient-to-r from-amber-300 via-indigo-400 to-green-500 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Off-Season</span>
                    <span>Normal</span>
                    <span>Peak</span>
                  </div>
                </div>

                {/* Competition Level */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Competition Level
                    </label>
                    <div className="px-3 py-1 rounded-lg font-bold text-sm"
                         style={{
                           background: competitionLevel < 33 ? '#d1fae5' : competitionLevel < 67 ? '#fef3c7' : '#fecaca',
                           color: competitionLevel < 33 ? '#065f46' : competitionLevel < 67 ? '#92400e' : '#991b1b'
                         }}>
                      {competitionLevel < 33 ? '✅ Low' : competitionLevel < 67 ? '⚠️ Medium' : '🔥 High'}
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={competitionLevel}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setCompetitionLevel(val);
                      // Map to competitor factors: Low=less impact, High=more impact
                      const competitorPriceChange = -5 - (val / 100) * 10; // -5 to -15
                      const competitorPromo = val > 66 ? 'heavy' : val > 33 ? 'moderate' : 'light';
                      setCustomFactors({
                        ...customFactors,
                        competitive: {
                          ...customFactors.competitive,
                          competitorPriceChange: competitorPriceChange,
                          competitorPromotion: competitorPromo as 'none' | 'light' | 'moderate' | 'heavy'
                        }
                      });
                    }}
                    className="w-full h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low Competition</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              {/* Inventory Intelligence Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                <h3 className="text-sm font-bold text-green-900 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Inventory Intelligence
                </h3>

                {/* Current Stock Status */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Stock Status
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="10"
                        value={stockUnits}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 0 && val <= 1000) {
                            setStockUnits(val);
                            // Map units to status: 0-100=Low, 101-250=Good, 251+=High
                            const statusPercent = val <= 100 ? (val / 100) * 33 : 
                                                 val <= 250 ? 33 + ((val - 100) / 150) * 34 :
                                                 67 + Math.min(33, ((val - 250) / 250) * 33);
                            setStockStatus(Math.min(100, statusPercent));
                            
                            const orderQty = -50 + statusPercent * 1.0;
                            const safetyLevel = statusPercent < 33 ? 'low' : statusPercent < 67 ? 'medium' : 'high';
                            setCustomFactors({
                              ...customFactors,
                              inventory: {
                                ...customFactors.inventory,
                                orderQuantity: orderQty,
                                safetyStockLevel: safetyLevel as 'low' | 'medium' | 'high',
                                demandVariability: statusPercent < 33 ? 'high' : statusPercent < 67 ? 'medium' : 'low'
                              }
                            });
                          }
                        }}
                        className="w-20 px-3 py-1 text-lg font-bold text-green-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <span className="text-xs text-gray-500">units</span>
                      <div className="px-2 py-1 rounded-lg font-bold text-xs"
                           style={{
                             background: stockStatus < 33 ? '#fecaca' : stockStatus < 67 ? '#fef3c7' : '#d1fae5',
                             color: stockStatus < 33 ? '#991b1b' : stockStatus < 67 ? '#92400e' : '#065f46'
                           }}>
                        {stockStatus < 33 ? '⚠️ Low' : stockStatus < 67 ? '📦 Good' : '✅ High'}
                      </div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={stockStatus}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setStockStatus(val);
                      // Map status to approximate units: 0-33%=0-100, 34-66%=100-250, 67-100%=250-500
                      const units = val < 33 ? Math.round((val / 33) * 100) :
                                   val < 67 ? Math.round(100 + ((val - 33) / 34) * 150) :
                                   Math.round(250 + ((val - 67) / 33) * 250);
                      setStockUnits(units);
                      
                      const orderQty = -50 + val * 1.0;
                      const safetyLevel = val < 33 ? 'low' : val < 67 ? 'medium' : 'high';
                      setCustomFactors({
                        ...customFactors,
                        inventory: {
                          ...customFactors.inventory,
                          orderQuantity: orderQty,
                          safetyStockLevel: safetyLevel as 'low' | 'medium' | 'high',
                          demandVariability: val < 33 ? 'high' : val < 67 ? 'medium' : 'low'
                        }
                      });
                    }}
                    className="w-full h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low Stock</span>
                    <span>Good</span>
                    <span>High Stock</span>
                  </div>
                </div>

                {/* Supplier Delivery Speed */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Supplier Delivery Speed
                    </label>
                    <div className="px-3 py-1 rounded-lg font-bold text-sm"
                         style={{
                           background: supplierSpeed < 33 ? '#fecaca' : supplierSpeed < 67 ? '#fef3c7' : '#d1fae5',
                           color: supplierSpeed < 33 ? '#991b1b' : supplierSpeed < 67 ? '#92400e' : '#065f46'
                         }}>
                      {supplierSpeed < 33 ? '🐌 Slow' : supplierSpeed < 67 ? '📦 Normal' : '⚡ Fast'}
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={supplierSpeed}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setSupplierSpeed(val);
                      // Map 0-100 to lead time: Slow=+50%, Normal=0%, Fast=-50%
                      const leadTimeChange = 50 - val; // 50 to -50
                      const serviceLevel = val < 33 ? 85 : val < 67 ? 95 : 99;
                      setCustomFactors({
                        ...customFactors,
                        inventory: {
                          ...customFactors.inventory,
                          leadTime: leadTimeChange
                        },
                        operational: {
                          ...customFactors.operational,
                          serviceLevelTarget: serviceLevel
                        }
                      });
                    }}
                    className="w-full h-3 bg-gradient-to-r from-red-400 via-amber-400 to-green-500 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slow Delivery</span>
                    <span>Normal</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-yellow-900" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {currentRecommendation.riskLevel === 'low' ? '🟢 Low Risk' :
                       currentRecommendation.riskLevel === 'medium' ? '🟡 Moderate Risk' :
                       '🔴 High Risk'}
                    </div>
                    <div className="text-sm text-gray-700">
                      {((testPrice - selectedProduct.currentPrice) / selectedProduct.currentPrice * 100).toFixed(1)}% price change
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Results Preview */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="text-sm text-gray-600 mb-1">Projected Revenue</div>
                  <div className="text-2xl font-bold text-green-700">
                    ${(currentOutcome.revenue / 1000).toFixed(1)}k
                  </div>
                  <div className={`text-sm font-semibold ${currentOutcome.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentOutcome.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(currentOutcome.revenueChange).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-sm text-gray-600 mb-1">Projected Profit</div>
                  <div className="text-2xl font-bold text-blue-700">
                    ${(currentOutcome.profit / 1000).toFixed(1)}k
                  </div>
                  <div className={`text-sm font-semibold ${currentOutcome.profitChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentOutcome.profitChange >= 0 ? '↑' : '↓'} {Math.abs(currentOutcome.profitChange).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <div className="text-sm text-gray-600 mb-1">Margin</div>
                  <div className="text-2xl font-bold text-purple-700">
                    {currentOutcome.margin.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Profit margin</div>
                </div>
              </div>
            </div>
          ) : (
            /* Advanced Mode - Original Complex Interface */
            <div>
              {/* Pricing Factors */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Pricing Factors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Change: {customFactors.pricing.priceChange}%
                </label>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="1"
                  value={customFactors.pricing.priceChange}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    pricing: { ...customFactors.pricing, priceChange: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-30%</span>
                  <span>0%</span>
                  <span>+30%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Level: {customFactors.pricing.discount}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={customFactors.pricing.discount}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    pricing: { ...customFactors.pricing, discount: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Variation: {customFactors.pricing.costVariation > 0 ? '+' : ''}{customFactors.pricing.costVariation}%
                </label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={customFactors.pricing.costVariation}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    pricing: { ...customFactors.pricing, costVariation: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-20%</span>
                  <span>0%</span>
                  <span>+20%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Elasticity: {customFactors.pricing.priceElasticity.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="-3.0"
                  max="-0.5"
                  step="0.1"
                  value={customFactors.pricing.priceElasticity}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    pricing: { ...customFactors.pricing, priceElasticity: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-3.0 (Elastic)</span>
                  <span>-1.5</span>
                  <span>-0.5 (Inelastic)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cross-Price Elasticity: {(customFactors.pricing as any).crossPriceElasticity?.toFixed(2) ?? '0.30'}
                  <span className="ml-2 text-xs text-gray-500">(Related products impact)</span>
                </label>
                <input
                  type="range"
                  min="-0.5"
                  max="1.5"
                  step="0.05"
                  value={(customFactors.pricing as any).crossPriceElasticity ?? 0.3}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    pricing: { ...customFactors.pricing, crossPriceElasticity: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-0.5 (Complement)</span>
                  <span>0 (No effect)</span>
                  <span>+1.5 (Substitute)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cannibalization Rate: {((customFactors.pricing as any).cannibalizationRate ?? 0) * 100}%
                  <span className="ml-2 text-xs text-gray-500">(Sales from own products)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={(customFactors.pricing as any).cannibalizationRate ?? 0}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    pricing: { ...customFactors.pricing, cannibalizationRate: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bundle Pricing Effect: {((customFactors.pricing as any).bundleEffect ?? 0) * 100}%
                  <span className="ml-2 text-xs text-gray-500">(Multi-product discount impact)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.4"
                  step="0.05"
                  value={(customFactors.pricing as any).bundleEffect ?? 0}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    pricing: { ...customFactors.pricing, bundleEffect: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>20%</span>
                  <span>40%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competitive Response Lag: {(customFactors.pricing as any).competitiveResponseLag ?? 2} weeks
                  <span className="ml-2 text-xs text-gray-500">(Time to market reaction)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="1"
                  value={(customFactors.pricing as any).competitiveResponseLag ?? 2}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    pricing: { ...customFactors.pricing, competitiveResponseLag: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Immediate</span>
                  <span>4 weeks</span>
                  <span>8 weeks</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Psychological Price Threshold
                  <span className="ml-2 text-xs text-gray-500">(e.g., $9.99 vs $10.00)</span>
                </label>
                <select
                  value={(customFactors.pricing as any).psychologicalThreshold ?? 'none'}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    pricing: { ...customFactors.pricing, psychologicalThreshold: e.target.value }
                  })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="none">None (Round pricing)</option>
                  <option value="below">Below threshold (.99 pricing)</option>
                  <option value="above">Above threshold (Premium signal)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Demand Factors */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Demand Factors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marketing Spend: ${customFactors.demand.marketingSpend.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={customFactors.demand.marketingSpend}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    demand: { ...customFactors.demand, marketingSpend: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$0</span>
                  <span>$25k</span>
                  <span>$50k</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion Intensity: {customFactors.demand.promotionIntensity}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={customFactors.demand.promotionIntensity}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    demand: { ...customFactors.demand, promotionIntensity: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>None</span>
                  <span>Medium</span>
                  <span>Heavy</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seasonal Multiplier: {customFactors.demand.seasonalMultiplier.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={customFactors.demand.seasonalMultiplier}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    demand: { ...customFactors.demand, seasonalMultiplier: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5x</span>
                  <span>1.0x</span>
                  <span>2.0x</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Holiday Effect
                </label>
                <select
                  value={customFactors.demand.holidayEffect}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    demand: { ...customFactors.demand, holidayEffect: e.target.value as any }
                  })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="none">None</option>
                  <option value="minor">Minor</option>
                  <option value="major">Major</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weather Impact: {customFactors.demand.weatherImpact > 0 ? '+' : ''}{customFactors.demand.weatherImpact.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.1"
                  value={customFactors.demand.weatherImpact}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    demand: { ...customFactors.demand, weatherImpact: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-1.0 (Negative)</span>
                  <span>0</span>
                  <span>+1.0 (Positive)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Acquisition Cost: ${(customFactors.demand as any).customerAcquisitionCost?.toLocaleString() ?? '125'}
                  <span className="ml-2 text-xs text-gray-500">(CAC per new customer)</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="25"
                  value={(customFactors.demand as any).customerAcquisitionCost ?? 125}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    demand: { ...customFactors.demand, customerAcquisitionCost: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$50</span>
                  <span>$275</span>
                  <span>$500</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Lifetime Value: ${(customFactors.demand as any).customerLifetimeValue?.toLocaleString() ?? '2500'}
                  <span className="ml-2 text-xs text-gray-500">(CLV projection)</span>
                </label>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={(customFactors.demand as any).customerLifetimeValue ?? 2500}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    demand: { ...customFactors.demand, customerLifetimeValue: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$500</span>
                  <span>$5k</span>
                  <span>$10k</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Churn Rate: {((customFactors.demand as any).churnRate ?? 0.05) * 100}% monthly
                  <span className="ml-2 text-xs text-gray-500">(Customer attrition)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.25"
                  step="0.01"
                  value={(customFactors.demand as any).churnRate ?? 0.05}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    demand: { ...customFactors.demand, churnRate: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>12.5%</span>
                  <span>25%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repeat Purchase Rate: {((customFactors.demand as any).repeatPurchaseRate ?? 0.35) * 100}%
                  <span className="ml-2 text-xs text-gray-500">(Customer loyalty)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.05"
                  value={(customFactors.demand as any).repeatPurchaseRate ?? 0.35}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    demand: { ...customFactors.demand, repeatPurchaseRate: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>40%</span>
                  <span>80%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Mix Distribution
                  <span className="ml-2 text-xs text-gray-500">(Primary sales channel)</span>
                </label>
                <select
                  value={(customFactors.demand as any).channelMix ?? 'balanced'}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    demand: { ...customFactors.demand, channelMix: e.target.value }
                  })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="online-heavy">Online Heavy (70% digital)</option>
                  <option value="balanced">Balanced (50/50)</option>
                  <option value="retail-heavy">Retail Heavy (70% physical)</option>
                  <option value="omnichannel">Omnichannel (Integrated)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Segment Focus
                  <span className="ml-2 text-xs text-gray-500">(Target demographic)</span>
                </label>
                <select
                  value={(customFactors.demand as any).customerSegment ?? 'mass-market'}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    demand: { ...customFactors.demand, customerSegment: e.target.value }
                  })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="budget-conscious">Budget Conscious</option>
                  <option value="mass-market">Mass Market</option>
                  <option value="premium">Premium/Luxury</option>
                  <option value="early-adopters">Early Adopters/Tech</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  External Event Impact
                  <span className="ml-2 text-xs text-gray-500">(Market disruptions)</span>
                </label>
                <select
                  value={(customFactors.demand as any).externalEvent ?? 'none'}
                  onChange={(e) => setCustomFactors({
                    ...customFactors,
                    demand: { ...customFactors.demand, externalEvent: e.target.value }
                  })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="none">No External Events</option>
                  <option value="positive-minor">Positive Minor (+5-10%)</option>
                  <option value="positive-major">Positive Major (+15-30%)</option>
                  <option value="negative-minor">Negative Minor (-5-10%)</option>
                  <option value="negative-major">Negative Major (-15-30%)</option>
                  <option value="crisis">Market Crisis (-40%+)</option>
                </select>
              </div>
            </div>
          </div>

          {showAdvanced && (
            <>
              {/* Competitive Factors */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  Competitive Factors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Competitor Price Change: {customFactors.competitive.competitorPriceChange}%
                    </label>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      step="1"
                      value={customFactors.competitive.competitorPriceChange}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        competitive: { ...customFactors.competitive, competitorPriceChange: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Competitor Promotion Level
                    </label>
                    <select
                      value={customFactors.competitive.competitorPromotion}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        competitive: { ...customFactors.competitive, competitorPromotion: e.target.value as any }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="none">None</option>
                      <option value="light">Light</option>
                      <option value="moderate">Moderate</option>
                      <option value="heavy">Heavy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Market Share Goal: {customFactors.competitive.marketShareGoal > 0 ? '+' : ''}{customFactors.competitive.marketShareGoal}%
                    </label>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="1"
                      value={customFactors.competitive.marketShareGoal}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        competitive: { ...customFactors.competitive, marketShareGoal: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>-10%</span>
                      <span>0%</span>
                      <span>+10%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Market Concentration (HHI)
                      <span className="ml-2 text-xs text-gray-500">(Herfindahl Index)</span>
                    </label>
                    <select
                      value={(customFactors.competitive as any).marketConcentration ?? 'moderate'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        competitive: { ...customFactors.competitive, marketConcentration: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="fragmented">Fragmented (High competition)</option>
                      <option value="moderate">Moderate Competition</option>
                      <option value="oligopoly">Oligopoly (Few players)</option>
                      <option value="monopolistic">Monopolistic (Dominant)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Strength Index: {((customFactors.competitive as any).brandStrength ?? 0.6) * 100}%
                      <span className="ml-2 text-xs text-gray-500">(Market perception)</span>
                    </label>
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      value={(customFactors.competitive as any).brandStrength ?? 0.6}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        competitive: { ...customFactors.competitive, brandStrength: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Weak</span>
                      <span>Moderate</span>
                      <span>Strong</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Switching Costs
                      <span className="ml-2 text-xs text-gray-500">(Barrier to leave)</span>
                    </label>
                    <select
                      value={(customFactors.competitive as any).switchingCosts ?? 'medium'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        competitive: { ...customFactors.competitive, switchingCosts: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="very-low">Very Low (Easy to switch)</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High (Locked in)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Network Effects Strength
                      <span className="ml-2 text-xs text-gray-500">(Value from user base)</span>
                    </label>
                    <select
                      value={(customFactors.competitive as any).networkEffects ?? 'none'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        competitive: { ...customFactors.competitive, networkEffects: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="none">None</option>
                      <option value="weak">Weak (Local effects)</option>
                      <option value="moderate">Moderate</option>
                      <option value="strong">Strong (Platform effect)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Competitive Position
                      <span className="ml-2 text-xs text-gray-500">(Market standing)</span>
                    </label>
                    <select
                      value={(customFactors.competitive as any).marketPosition ?? 'challenger'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        competitive: { ...customFactors.competitive, marketPosition: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="leader">Market Leader (Top 3)</option>
                      <option value="challenger">Challenger (Growth mode)</option>
                      <option value="follower">Follower (Me-too)</option>
                      <option value="nicher">Nicher (Specialized)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Inventory Factors */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Inventory & Supply Chain Factors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Quantity Adjustment: {customFactors.inventory.orderQuantity > 0 ? '+' : ''}{customFactors.inventory.orderQuantity}%
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="5"
                      value={customFactors.inventory.orderQuantity}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        inventory: { ...customFactors.inventory, orderQuantity: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>-50%</span>
                      <span>0%</span>
                      <span>+50%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Time Change: {customFactors.inventory.leadTime > 0 ? '+' : ''}{customFactors.inventory.leadTime}%
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="5"
                      value={customFactors.inventory.leadTime}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        inventory: { ...customFactors.inventory, leadTime: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>-50%</span>
                      <span>0%</span>
                      <span>+50%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Safety Stock Level
                    </label>
                    <select
                      value={customFactors.inventory.safetyStockLevel}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        inventory: { ...customFactors.inventory, safetyStockLevel: e.target.value as any }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Demand Variability
                    </label>
                    <select
                      value={customFactors.inventory.demandVariability}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        inventory: { ...customFactors.inventory, demandVariability: e.target.value as any }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      EOQ Model Application
                      <span className="ml-2 text-xs text-gray-500">(Economic Order Quantity)</span>
                    </label>
                    <select
                      value={(customFactors.inventory as any).eoqModel ?? 'standard'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        inventory: { ...customFactors.inventory, eoqModel: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="standard">Standard EOQ</option>
                      <option value="with-backorders">EOQ with Backorders</option>
                      <option value="quantity-discounts">With Quantity Discounts</option>
                      <option value="jit">Just-in-Time (JIT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reorder Point Strategy
                      <span className="ml-2 text-xs text-gray-500">(When to reorder)</span>
                    </label>
                    <select
                      value={(customFactors.inventory as any).reorderStrategy ?? 'fixed-quantity'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        inventory: { ...customFactors.inventory, reorderStrategy: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="fixed-quantity">Fixed Order Quantity</option>
                      <option value="fixed-period">Fixed Order Period</option>
                      <option value="min-max">Min-Max System</option>
                      <option value="two-bin">Two-Bin System</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ABC Classification
                      <span className="ml-2 text-xs text-gray-500">(Inventory priority)</span>
                    </label>
                    <select
                      value={(customFactors.inventory as any).abcClassification ?? 'B'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        inventory: { ...customFactors.inventory, abcClassification: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="A">Class A (High value, 80% revenue)</option>
                      <option value="B">Class B (Medium value, 15% revenue)</option>
                      <option value="C">Class C (Low value, 5% revenue)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inventory Turnover Target: {(customFactors.inventory as any).turnoverTarget ?? 8}x/year
                      <span className="ml-2 text-xs text-gray-500">(Times per year)</span>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="24"
                      step="1"
                      value={(customFactors.inventory as any).turnoverTarget ?? 8}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        inventory: { ...customFactors.inventory, turnoverTarget: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>2x (Slow)</span>
                      <span>12x</span>
                      <span>24x (Fast)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier Reliability: {((customFactors.inventory as any).supplierReliability ?? 0.95) * 100}%
                      <span className="ml-2 text-xs text-gray-500">(On-time delivery rate)</span>
                    </label>
                    <input
                      type="range"
                      min="0.7"
                      max="1.0"
                      step="0.05"
                      value={(customFactors.inventory as any).supplierReliability ?? 0.95}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        inventory: { ...customFactors.inventory, supplierReliability: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>70%</span>
                      <span>85%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Multi-Sourcing Strategy
                      <span className="ml-2 text-xs text-gray-500">(Supply diversification)</span>
                    </label>
                    <select
                      value={(customFactors.inventory as any).sourcingStrategy ?? 'single'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        inventory: { ...customFactors.inventory, sourcingStrategy: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="single">Single Source</option>
                      <option value="dual">Dual Source (Backup)</option>
                      <option value="multiple">Multiple Sources</option>
                      <option value="global">Global Sourcing Network</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Obsolescence Risk
                      <span className="ml-2 text-xs text-gray-500">(Product lifecycle)</span>
                    </label>
                    <select
                      value={(customFactors.inventory as any).obsolescenceRisk ?? 'low'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        inventory: { ...customFactors.inventory, obsolescenceRisk: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="very-low">Very Low (Staple goods)</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High (Fashion/Tech)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Warehouse Capacity Utilization: {((customFactors.inventory as any).warehouseUtilization ?? 0.75) * 100}%
                    </label>
                    <input
                      type="range"
                      min="0.4"
                      max="0.95"
                      step="0.05"
                      value={(customFactors.inventory as any).warehouseUtilization ?? 0.75}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        inventory: { ...customFactors.inventory, warehouseUtilization: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>40%</span>
                      <span>70%</span>
                      <span>95%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operational Factors */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Operational Factors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Level Target: {customFactors.operational.serviceLevelTarget}%
                    </label>
                    <input
                      type="range"
                      min="90"
                      max="99.9"
                      step="0.5"
                      value={customFactors.operational.serviceLevelTarget}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        operational: { ...customFactors.operational, serviceLevelTarget: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>90%</span>
                      <span>95%</span>
                      <span>99.9%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Holding Cost Rate: {customFactors.operational.holdingCostRate}%
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="35"
                      step="1"
                      value={customFactors.operational.holdingCostRate}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        operational: { ...customFactors.operational, holdingCostRate: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>15%</span>
                      <span>25%</span>
                      <span>35%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stockout Cost Impact
                    </label>
                    <select
                      value={customFactors.operational.stockoutCostImpact}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        operational: { ...customFactors.operational, stockoutCostImpact: e.target.value as any }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Processing Cost: ${(customFactors.operational as any).orderProcessingCost ?? 150}
                      <span className="ml-2 text-xs text-gray-500">(Per order)</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="25"
                      value={(customFactors.operational as any).orderProcessingCost ?? 150}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        operational: { ...customFactors.operational, orderProcessingCost: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>$50</span>
                      <span>$275</span>
                      <span>$500</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quality Defect Rate: {((customFactors.operational as any).defectRate ?? 0.02) * 100}%
                      <span className="ml-2 text-xs text-gray-500">(Returns/defects)</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.1"
                      step="0.005"
                      value={(customFactors.operational as any).defectRate ?? 0.02}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        operational: { ...customFactors.operational, defectRate: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>5%</span>
                      <span>10%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity Utilization: {((customFactors.operational as any).capacityUtilization ?? 0.8) * 100}%
                      <span className="ml-2 text-xs text-gray-500">(Production/fulfillment)</span>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.0"
                      step="0.05"
                      value={(customFactors.operational as any).capacityUtilization ?? 0.8}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        operational: { ...customFactors.operational, capacityUtilization: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Factors */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Financial Factors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Terms (Days)
                      <span className="ml-2 text-xs text-gray-500">(Cash flow impact)</span>
                    </label>
                    <select
                      value={(customFactors as any).financial?.paymentTerms ?? 'net-30'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        financial: { ...(customFactors as any).financial, paymentTerms: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="immediate">Immediate Payment</option>
                      <option value="net-15">Net 15 Days</option>
                      <option value="net-30">Net 30 Days</option>
                      <option value="net-60">Net 60 Days</option>
                      <option value="net-90">Net 90 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Early Payment Discount: {((customFactors as any).financial?.earlyPaymentDiscount ?? 0.02) * 100}%
                      <span className="ml-2 text-xs text-gray-500">(2/10 net 30)</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.05"
                      step="0.005"
                      value={(customFactors as any).financial?.earlyPaymentDiscount ?? 0.02}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        financial: { ...(customFactors as any).financial, earlyPaymentDiscount: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>2.5%</span>
                      <span>5%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Capital Requirement: {((customFactors as any).financial?.workingCapitalRatio ?? 0.15) * 100}%
                      <span className="ml-2 text-xs text-gray-500">(% of revenue)</span>
                    </label>
                    <input
                      type="range"
                      min="0.05"
                      max="0.4"
                      step="0.05"
                      value={(customFactors as any).financial?.workingCapitalRatio ?? 0.15}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        financial: { ...(customFactors as any).financial, workingCapitalRatio: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5%</span>
                      <span>20%</span>
                      <span>40%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost of Capital (WACC): {((customFactors as any).financial?.costOfCapital ?? 0.12) * 100}%
                      <span className="ml-2 text-xs text-gray-500">(Annual rate)</span>
                    </label>
                    <input
                      type="range"
                      min="0.05"
                      max="0.25"
                      step="0.01"
                      value={(customFactors as any).financial?.costOfCapital ?? 0.12}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        financial: { ...(customFactors as any).financial, costOfCapital: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5%</span>
                      <span>15%</span>
                      <span>25%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credit Policy
                      <span className="ml-2 text-xs text-gray-500">(Accounts receivable)</span>
                    </label>
                    <select
                      value={(customFactors as any).financial?.creditPolicy ?? 'moderate'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        financial: { ...(customFactors as any).financial, creditPolicy: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="strict">Strict (Low risk, lower sales)</option>
                      <option value="moderate">Moderate (Balanced)</option>
                      <option value="lenient">Lenient (High risk, higher sales)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bad Debt Rate: {((customFactors as any).financial?.badDebtRate ?? 0.01) * 100}%
                      <span className="ml-2 text-xs text-gray-500">(Uncollectible)</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.05"
                      step="0.005"
                      value={(customFactors as any).financial?.badDebtRate ?? 0.01}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        financial: { ...(customFactors as any).financial, badDebtRate: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>2.5%</span>
                      <span>5%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate: {((customFactors as any).financial?.taxRate ?? 0.25) * 100}%
                      <span className="ml-2 text-xs text-gray-500">(Corporate tax)</span>
                    </label>
                    <input
                      type="range"
                      min="0.15"
                      max="0.4"
                      step="0.05"
                      value={(customFactors as any).financial?.taxRate ?? 0.25}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        financial: { ...(customFactors as any).financial, taxRate: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>15%</span>
                      <span>27.5%</span>
                      <span>40%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency Risk Exposure
                      <span className="ml-2 text-xs text-gray-500">(FX volatility)</span>
                    </label>
                    <select
                      value={(customFactors as any).financial?.currencyRisk ?? 'low'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        financial: { ...(customFactors as any).financial, currencyRisk: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="none">None (Domestic only)</option>
                      <option value="low">Low (Hedged)</option>
                      <option value="medium">Medium (Partial hedge)</option>
                      <option value="high">High (Unhedged)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Market & External Factors */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Market & External Factors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Economic Growth (GDP): {((customFactors as any).market?.gdpGrowth ?? 0.03) * 100}%
                      <span className="ml-2 text-xs text-gray-500">(Annual rate)</span>
                    </label>
                    <input
                      type="range"
                      min="-0.05"
                      max="0.10"
                      step="0.01"
                      value={(customFactors as any).market?.gdpGrowth ?? 0.03}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        market: { ...(customFactors as any).market, gdpGrowth: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>-5% (Recession)</span>
                      <span>2.5%</span>
                      <span>10% (Boom)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inflation Rate: {((customFactors as any).market?.inflationRate ?? 0.03) * 100}%
                      <span className="ml-2 text-xs text-gray-500">(CPI annual)</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.15"
                      step="0.01"
                      value={(customFactors as any).market?.inflationRate ?? 0.03}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        market: { ...(customFactors as any).market, inflationRate: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>7.5%</span>
                      <span>15%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consumer Confidence Index: {(customFactors as any).market?.consumerConfidence ?? 100}
                      <span className="ml-2 text-xs text-gray-500">(Base = 100)</span>
                    </label>
                    <input
                      type="range"
                      min="60"
                      max="140"
                      step="5"
                      value={(customFactors as any).market?.consumerConfidence ?? 100}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        market: { ...(customFactors as any).market, consumerConfidence: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>60 (Low)</span>
                      <span>100</span>
                      <span>140 (High)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Market Growth Rate: {((customFactors as any).market?.marketGrowthRate ?? 0.05) * 100}%
                      <span className="ml-2 text-xs text-gray-500">(Industry CAGR)</span>
                    </label>
                    <input
                      type="range"
                      min="-0.05"
                      max="0.30"
                      step="0.01"
                      value={(customFactors as any).market?.marketGrowthRate ?? 0.05}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        market: { ...(customFactors as any).market, marketGrowthRate: Number(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>-5% (Declining)</span>
                      <span>12.5%</span>
                      <span>30% (Emerging)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Regulatory Environment
                      <span className="ml-2 text-xs text-gray-500">(Compliance burden)</span>
                    </label>
                    <select
                      value={(customFactors as any).market?.regulatoryEnvironment ?? 'moderate'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        market: { ...(customFactors as any).market, regulatoryEnvironment: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="light">Light (Minimal regulations)</option>
                      <option value="moderate">Moderate</option>
                      <option value="strict">Strict (High compliance costs)</option>
                      <option value="changing">Changing (Uncertain)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technology Disruption Level
                      <span className="ml-2 text-xs text-gray-500">(Innovation pace)</span>
                    </label>
                    <select
                      value={(customFactors as any).market?.technologyDisruption ?? 'moderate'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        market: { ...(customFactors as any).market, technologyDisruption: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="stable">Stable (Traditional)</option>
                      <option value="moderate">Moderate Evolution</option>
                      <option value="high">High (Digital transformation)</option>
                      <option value="disruptive">Disruptive (Revolutionary)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supply Chain Risk Level
                      <span className="ml-2 text-xs text-gray-500">(Global disruptions)</span>
                    </label>
                    <select
                      value={(customFactors as any).market?.supplyChainRisk ?? 'medium'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        market: { ...(customFactors as any).market, supplyChainRisk: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="low">Low (Stable supply)</option>
                      <option value="medium">Medium</option>
                      <option value="high">High (Frequent disruptions)</option>
                      <option value="critical">Critical (Crisis mode)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ESG/Sustainability Impact
                      <span className="ml-2 text-xs text-gray-500">(Environmental, Social, Governance)</span>
                    </label>
                    <select
                      value={(customFactors as any).market?.esgImpact ?? 'neutral'}
                      onChange={(e) => setCustomFactors({
                        ...customFactors,
                        market: { ...(customFactors as any).market, esgImpact: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="positive">Positive (Competitive advantage)</option>
                      <option value="neutral">Neutral (No impact)</option>
                      <option value="negative">Negative (Compliance costs)</option>
                      <option value="critical">Critical (Major transition needed)</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
            </div>
          )}
        </div>

        {/* Outcome Metrics Dashboard */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6 mb-6">\n          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-indigo-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Scenario Outcomes</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Revenue</div>
              <div className="text-2xl font-bold text-gray-900">${(currentOutcome.revenue / 1000).toFixed(1)}k</div>
              <div className={`text-sm font-semibold ${currentOutcome.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentOutcome.revenueChange >= 0 ? '+' : ''}{currentOutcome.revenueChange}%
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Profit</div>
              <div className="text-2xl font-bold text-gray-900">${(currentOutcome.profit / 1000).toFixed(1)}k</div>
              <div className={`text-sm font-semibold ${currentOutcome.profitChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentOutcome.profitChange >= 0 ? '+' : ''}{currentOutcome.profitChange}%
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Units Sold</div>
              <div className="text-2xl font-bold text-gray-900">{currentOutcome.unitsSold.toLocaleString()}</div>
              <div className={`text-sm font-semibold ${currentOutcome.demandChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentOutcome.demandChange >= 0 ? '+' : ''}{currentOutcome.demandChange}%
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Margin</div>
              <div className="text-2xl font-bold text-gray-900">{currentOutcome.margin.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Profit margin</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">ROI</div>
              <div className="text-2xl font-bold text-gray-900">{currentOutcome.roi.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Return on investment</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Stockout Risk</div>
              <div className={`text-lg font-bold ${currentOutcome.stockoutRisk === 'low' ? 'text-green-600' : currentOutcome.stockoutRisk === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                {currentOutcome.stockoutRisk.toUpperCase()}
              </div>
              <div className="text-sm text-gray-600">Inventory risk</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Service Level</div>
              <div className="text-2xl font-bold text-gray-900">{currentOutcome.serviceLevel}%</div>
              <div className="text-sm text-gray-600">Target fulfillment</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Cash Flow</div>
              <div className="text-2xl font-bold text-gray-900">${(currentOutcome.cashFlow / 1000).toFixed(0)}k</div>
              <div className={`text-sm font-semibold ${currentOutcome.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentOutcome.cashFlow >= 0 ? 'Positive' : 'Negative'}
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className={`border-2 rounded-xl p-4 ${currentRecommendation.bestScenario ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {currentRecommendation.bestScenario ? (
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                ) : currentRecommendation.riskLevel === 'high' ? (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                ) : (
                  <Info className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900">AI Recommendation</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getRiskColor(currentRecommendation.riskLevel)}`}>
                    {currentRecommendation.riskLevel.toUpperCase()} RISK
                  </span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                    {currentRecommendation.confidence}% Confidence
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{currentRecommendation.recommendation}</p>
                {currentRecommendation.warnings.length > 0 && (
                  <div className="space-y-1">
                    {currentRecommendation.warnings.map((warning, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                        <AlertCircle className="w-3 h-3 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Saved Scenarios Comparison */}
        {scenarios.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="text-purple-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Saved Scenarios ({scenarios.length})</h2>
              </div>
              <button
                onClick={() => setComparisonMode(!comparisonMode)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                {comparisonMode ? 'Hide' : 'Show'} Comparison
              </button>
            </div>

            {comparisonMode && (
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={getComparisonData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="#8b5cf6" name="Revenue ($k)" />
                    <Bar yAxisId="left" dataKey="profit" fill="#10b981" name="Profit ($k)" />
                    <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#f59e0b" strokeWidth={2} name="Margin %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Scenario</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Profit</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Margin</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Units</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Risk</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {scenarios.slice(-10).reverse().map((scenario) => (
                    <tr key={scenario.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{scenario.name}</div>
                        <div className="text-xs text-gray-500">{new Date(scenario.createdAt).toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ${(scenario.outcome.revenue / 1000).toFixed(1)}k
                        <span className={`ml-2 text-xs ${scenario.outcome.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {scenario.outcome.revenueChange >= 0 ? '+' : ''}{scenario.outcome.revenueChange}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ${(scenario.outcome.profit / 1000).toFixed(1)}k
                        <span className={`ml-2 text-xs ${scenario.outcome.profitChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {scenario.outcome.profitChange >= 0 ? '+' : ''}{scenario.outcome.profitChange}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{scenario.outcome.margin.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-right">{scenario.outcome.unitsSold.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(scenario.recommendation.riskLevel)}`}>
                          {scenario.recommendation.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setScenarios(scenarios.filter(s => s.id !== scenario.id))}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
