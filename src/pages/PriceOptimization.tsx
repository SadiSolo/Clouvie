import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { topMovers } from '../data/mockData';
import { TrendingUp, AlertCircle, Target, Zap, DollarSign, Users, Package, ChevronDown, Info, ArrowRight, Sparkles, ShieldCheck, AlertTriangle, Download, RotateCcw, Clock, Calendar, TrendingUpIcon, Layers } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function PriceOptimization() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize product from URL parameter or default to first product
  const getInitialProduct = () => {
    const productId = searchParams.get('productId');
    if (productId) {
      const product = topMovers.find(p => p.id === productId);
      if (product) return product;
    }
    return topMovers[0];
  };
  
  const [selectedProduct, setSelectedProduct] = useState(getInitialProduct());
  const [customPrice, setCustomPrice] = useState(selectedProduct.recommendedPrice);
  const [customCost, setCustomCost] = useState(selectedProduct.currentPrice * 0.6);
  const [demandFactor, setDemandFactor] = useState(1);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Update when URL parameter changes
  useEffect(() => {
    const productId = searchParams.get('productId');
    if (productId) {
      const product = topMovers.find(p => p.id === productId);
      if (product && product.id !== selectedProduct.id) {
        setSelectedProduct(product);
      }
    }
  }, [searchParams]);

  // Update prices when product changes
  useEffect(() => {
    console.log('Product changed to:', selectedProduct.name);
    setCustomPrice(selectedProduct.recommendedPrice);
    setCustomCost(selectedProduct.currentPrice * 0.6);
    setDemandFactor(1);
    setActivePreset(null);
  }, [selectedProduct]);

  // Calculate metrics based on inputs
  const currentProfit = (selectedProduct.currentPrice - customCost) * 1000;
  const recommendedProfit = (selectedProduct.recommendedPrice - customCost) * 1200;
  const customProfit = (customPrice - customCost) * (1000 + (selectedProduct.currentPrice - customPrice) * 50 * demandFactor);
  
  // Calculate AI confidence based on data quality
  const calculateConfidence = () => {
    let confidence = 85; // Base confidence
    
    // Adjust based on price deviation
    const priceDeviation = Math.abs((customPrice - selectedProduct.recommendedPrice) / selectedProduct.recommendedPrice);
    if (priceDeviation < 0.05) confidence += 10;
    else if (priceDeviation > 0.2) confidence -= 15;
    
    // Adjust based on demand factor (more data = more confidence)
    if (demandFactor >= 0.8 && demandFactor <= 1.2) confidence += 5;
    
    return Math.min(Math.max(confidence, 50), 98);
  };

  const confidence = calculateConfidence();
  
  const getConfidenceColor = () => {
    if (confidence >= 90) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', icon: '🟢' };
    if (confidence >= 70) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', icon: '🟡' };
    return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', icon: '🟠' };
  };

  const confidenceStyle = getConfidenceColor();

  // Generate profit curve data
  const profitCurveData = [];
  for (let price = customCost * 1.1; price <= selectedProduct.currentPrice * 2; price += (selectedProduct.currentPrice * 2 - customCost * 1.1) / 50) {
    const demand = 1000 + (selectedProduct.currentPrice - price) * 50 * demandFactor;
    const profit = (price - customCost) * Math.max(0, demand);
    const revenue = price * Math.max(0, demand);
    profitCurveData.push({
      price: parseFloat(price.toFixed(2)),
      profit: parseFloat(profit.toFixed(0)),
      revenue: parseFloat(revenue.toFixed(0)),
      demand: Math.max(0, Math.round(demand))
    });
  }

  // Find optimal price
  const optimalPoint = profitCurveData.reduce((max, point) => point.profit > max.profit ? point : max, profitCurveData[0]);

  // Strategy Presets
  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    switch (preset) {
      case 'maximize-profit':
        // Set to optimal price point
        setCustomPrice(optimalPoint.price);
        setDemandFactor(1);
        break;
      case 'maximize-revenue':
        // Lower price to boost volume
        setCustomPrice(selectedProduct.currentPrice * 0.92);
        setDemandFactor(1.3);
        break;
      case 'market-leader':
        // Aggressive pricing
        setCustomPrice(selectedProduct.currentPrice * 0.85);
        setDemandFactor(1.5);
        break;
      case 'balanced':
        // Middle ground
        setCustomPrice((selectedProduct.currentPrice + selectedProduct.recommendedPrice) / 2);
        setDemandFactor(1);
        break;
      case 'premium':
        // High margin positioning
        setCustomPrice(selectedProduct.currentPrice * 1.15);
        setDemandFactor(0.8);
        break;
    }
  };

  const resetAnalysis = () => {
    setCustomPrice(selectedProduct.recommendedPrice);
    setCustomCost(selectedProduct.currentPrice * 0.6);
    setDemandFactor(1);
    setActivePreset(null);
  };

  // Export to PDF (simplified - in production use a library like jsPDF)
  const exportToPDF = () => {
    const reportContent = `
CLOUVIE PRICE OPTIMIZATION REPORT
=================================

Product: ${selectedProduct.name}
Analysis Date: ${new Date().toLocaleDateString()}
AI Confidence: ${confidence}%

CURRENT METRICS
--------------
Current Price: $${selectedProduct.currentPrice.toFixed(2)}
AI Recommended: $${selectedProduct.recommendedPrice.toFixed(2)}
Your Test Price: $${customPrice.toFixed(2)}

PROFIT ANALYSIS
--------------
Current Profit: $${currentProfit.toLocaleString()}
Recommended Profit: $${recommendedProfit.toLocaleString()}
Your Scenario Profit: $${customProfit.toLocaleString()}

Potential Gain: $${(recommendedProfit - currentProfit).toLocaleString()}
Improvement: ${((recommendedProfit - currentProfit) / currentProfit * 100).toFixed(1)}%

RISK ASSESSMENT
--------------
Risk Level: ${risk.level}
Price Change: ${((customPrice - selectedProduct.currentPrice) / selectedProduct.currentPrice * 100).toFixed(1)}%

AI RECOMMENDATION
----------------
Optimal Price: $${optimalPoint.price.toFixed(2)}
Expected Profit: $${optimalPoint.profit.toLocaleString()}

Generated by Clouvie AI - Price Optimization Engine
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Clouvie_Price_Analysis_${selectedProduct.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const scenarios = [
    {
      name: 'Current',
      price: selectedProduct.currentPrice,
      profit: currentProfit,
      revenue: selectedProduct.currentPrice * 1000,
      demand: 1000,
      margin: ((selectedProduct.currentPrice - customCost) / selectedProduct.currentPrice * 100),
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      icon: '📊'
    },
    {
      name: 'AI Recommended',
      price: selectedProduct.recommendedPrice,
      profit: recommendedProfit,
      revenue: selectedProduct.recommendedPrice * 1200,
      demand: 1200,
      margin: ((selectedProduct.recommendedPrice - customCost) / selectedProduct.recommendedPrice * 100),
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-700',
      icon: '✨'
    },
    {
      name: 'Your Scenario',
      price: customPrice,
      profit: customProfit,
      revenue: customPrice * (1000 + (selectedProduct.currentPrice - customPrice) * 50 * demandFactor),
      demand: Math.round(1000 + (selectedProduct.currentPrice - customPrice) * 50 * demandFactor),
      margin: ((customPrice - customCost) / customPrice * 100),
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      icon: '🎯'
    }
  ];

  // Risk assessment
  const getRiskLevel = () => {
    const priceChange = ((customPrice - selectedProduct.currentPrice) / selectedProduct.currentPrice) * 100;
    if (Math.abs(priceChange) < 5) return { level: 'Low', color: 'green', icon: '🟢' };
    if (Math.abs(priceChange) < 15) return { level: 'Moderate', color: 'yellow', icon: '🟡' };
    return { level: 'High', color: 'red', icon: '🔴' };
  };

  const risk = getRiskLevel();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Price Optimization" />
      
      <div className="p-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-2xl p-4">
                <Target size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Price Optimization Engine</h1>
                <p className="text-sm opacity-90">AI-powered pricing intelligence with real-time what-if analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
              <Sparkles className="text-yellow-300" size={20} />
              <span className="text-sm font-semibold">AI Insights Active</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
              >
                <Download size={18} />
                Export Report
              </button>
              <button
                onClick={resetAnalysis}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-medium"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            </div>
            
            {/* AI Confidence Meter */}
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border-2 ${confidenceStyle.border} ${confidenceStyle.bg}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{confidenceStyle.icon}</span>
                <div>
                  <div className="text-xs font-medium text-gray-600">AI Confidence</div>
                  <div className={`text-lg font-bold ${confidenceStyle.text}`}>{confidence}%</div>
                </div>
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    confidence >= 90 ? 'bg-green-500' : 
                    confidence >= 70 ? 'bg-yellow-500' : 
                    'bg-orange-500'
                  }`}
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Presets */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="text-purple-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Quick Strategy Presets</h2>
            </div>
            <span className="text-sm text-gray-500">One-click pricing strategies</span>
          </div>
          
          <div className="grid md:grid-cols-5 gap-3">
            <button
              onClick={() => applyPreset('maximize-profit')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                activePreset === 'maximize-profit'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-bold text-gray-800 text-sm mb-1">Maximize Profit</div>
              <div className="text-xs text-gray-600">Optimal price point</div>
            </button>

            <button
              onClick={() => applyPreset('maximize-revenue')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                activePreset === 'maximize-revenue'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-2xl mb-2">📈</div>
              <div className="font-bold text-gray-800 text-sm mb-1">Maximize Revenue</div>
              <div className="text-xs text-gray-600">Focus on volume</div>
            </button>

            <button
              onClick={() => applyPreset('market-leader')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                activePreset === 'market-leader'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-bold text-gray-800 text-sm mb-1">Market Leader</div>
              <div className="text-xs text-gray-600">Aggressive pricing</div>
            </button>

            <button
              onClick={() => applyPreset('balanced')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                activePreset === 'balanced'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <div className="text-2xl mb-2">⚖️</div>
              <div className="font-bold text-gray-800 text-sm mb-1">Balanced Growth</div>
              <div className="text-xs text-gray-600">Middle ground</div>
            </button>

            <button
              onClick={() => applyPreset('premium')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                activePreset === 'premium'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <div className="text-2xl mb-2">💰</div>
              <div className="font-bold text-gray-800 text-sm mb-1">Premium Position</div>
              <div className="text-xs text-gray-600">High margin</div>
            </button>
          </div>
        </div>

        {/* Product Selector */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Product to Analyze</label>
              <div className="relative">
                <select
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const product = topMovers.find(p => p.id === e.target.value);
                    if (product) {
                      setSelectedProduct(product);
                    }
                  }}
                  className="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pr-10 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[300px]"
                >
                  {topMovers.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
            <button
              onClick={() => navigate(`/product/${selectedProduct.id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium"
            >
              View Details <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Current Metrics Cards with Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`bg-white rounded-xl p-4 border-l-4 ${(selectedProduct.margin || 0) < 20 ? 'border-red-500' : 'border-amber-500'} relative`}>
            {(selectedProduct.margin || 0) < 20 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <AlertTriangle size={14} />
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Profit Margin</span>
              <DollarSign className={`${(selectedProduct.margin || 0) < 20 ? 'text-red-500' : 'text-amber-500'}`} size={20} />
            </div>
            <div className={`text-2xl font-bold ${(selectedProduct.margin || 0) < 20 ? 'text-red-600' : 'text-gray-800'}`}>
              {selectedProduct.margin?.toFixed(1) || 'N/A'}%
            </div>
            {(selectedProduct.margin || 0) < 20 && (
              <div className="text-xs text-red-600 mt-1 font-semibold">⚠️ Below 20% threshold</div>
            )}
          </div>
          <div className={`bg-white rounded-xl p-4 border-l-4 ${(selectedProduct.stockLevel || 0) < 10 ? 'border-orange-500' : 'border-teal-500'} relative`}>
            {(selectedProduct.stockLevel || 0) < 10 && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <AlertTriangle size={14} />
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Stock Level</span>
              <Package className={`${(selectedProduct.stockLevel || 0) < 10 ? 'text-orange-500' : 'text-teal-500'}`} size={20} />
            </div>
            <div className={`text-2xl font-bold ${(selectedProduct.stockLevel || 0) < 10 ? 'text-orange-600' : 'text-gray-800'}`}>
              {selectedProduct.stockLevel || 'N/A'}
            </div>
            {(selectedProduct.stockLevel || 0) < 10 && (
              <div className="text-xs text-orange-600 mt-1 font-semibold">📦 Low stock - consider clearance pricing</div>
            )}
          </div>
          <div className="bg-white rounded-xl p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Potential Gain</span>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <div className="text-2xl font-bold text-green-600">+${selectedProduct.profitGainLoss.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Demand Impact</span>
              <Users className="text-blue-500" size={20} />
            </div>
            <div className="text-2xl font-bold text-blue-600">{selectedProduct.demandChange > 0 ? '+' : ''}{selectedProduct.demandChange.toFixed(1)}%</div>
          </div>
        </div>

        {/* Competitor & ROI Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Competitor Price Comparison */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Competitor Comparison</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Your Current Price</div>
                  <div className="text-2xl font-bold text-gray-800">${selectedProduct.currentPrice.toFixed(2)}</div>
                </div>
                <div className="text-gray-400">━━</div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Competitor Avg</div>
                  <div className="text-2xl font-bold text-blue-600">${selectedProduct.competitorPrice?.toFixed(2) || 'N/A'}</div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="text-blue-600 flex-shrink-0 mt-1" size={18} />
                  <div>
                    <div className="font-semibold text-blue-800 mb-1">Market Position</div>
                    <div className="text-sm text-blue-700">
                      {selectedProduct.competitorPrice && selectedProduct.currentPrice > selectedProduct.competitorPrice ? (
                        <>You're <strong>{(((selectedProduct.currentPrice - selectedProduct.competitorPrice) / selectedProduct.competitorPrice) * 100).toFixed(1)}% higher</strong> than competitors. Consider price reduction to capture market share.</>
                      ) : selectedProduct.competitorPrice ? (
                        <>You're <strong>{(((selectedProduct.competitorPrice - selectedProduct.currentPrice) / selectedProduct.competitorPrice) * 100).toFixed(1)}% lower</strong> than competitors. Room to increase margins!</>
                      ) : (
                        'Competitor data not available'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Annual ROI Calculator */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-md p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUpIcon className="text-green-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Annual ROI Projection</h2>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">If you adopt AI recommendations:</div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  +${((recommendedProfit - currentProfit) * 12).toLocaleString()}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Annual profit increase</strong> (12-month projection)
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-600">Monthly Gain</div>
                  <div className="text-lg font-bold text-gray-800">
                    ${(recommendedProfit - currentProfit).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-600">ROI Improvement</div>
                  <div className="text-lg font-bold text-green-600">
                    {((recommendedProfit - currentProfit) / currentProfit * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 italic">
                * Based on consistent monthly sales volume
              </div>
            </div>
          </div>
        </div>

        {/* Price Change History */}
        {selectedProduct.priceHistory && selectedProduct.priceHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-purple-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Price Change History</h2>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-4">
                {selectedProduct.priceHistory.map((entry, index) => (
                  <div key={index} className="relative pl-12">
                    <div className="absolute left-0 top-1 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center border-4 border-white">
                      <Calendar className="text-purple-600" size={16} />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-800">${entry.price.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{entry.reason}</div>
                      <div className={`text-xs font-semibold ${entry.profitImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Profit Impact: {entry.profitImpact >= 0 ? '+' : ''}${entry.profitImpact.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category-Specific Strategy Recommendations */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-md p-6 border border-purple-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="text-purple-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Category: {selectedProduct.category || 'Unknown'}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {selectedProduct.category === 'Food' && (
              <>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">🍽️</div>
                  <div className="font-bold text-gray-800 mb-1">Perishable Strategy</div>
                  <div className="text-sm text-gray-600">Monitor expiry dates and apply progressive discounts to minimize waste.</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">⏰</div>
                  <div className="font-bold text-gray-800 mb-1">Time-Based Pricing</div>
                  <div className="text-sm text-gray-600">Consider happy hour pricing during off-peak times to boost volume.</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">📦</div>
                  <div className="font-bold text-gray-800 mb-1">Bundle Opportunity</div>
                  <div className="text-sm text-gray-600">Pair with beverages to create combo offers and increase average order value.</div>
                </div>
              </>
            )}
            {selectedProduct.category === 'Beverage' && (
              <>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">☀️</div>
                  <div className="font-bold text-gray-800 mb-1">Seasonal Adjustment</div>
                  <div className="text-sm text-gray-600">Premium pricing during summer months for cold beverages.</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">💎</div>
                  <div className="font-bold text-gray-800 mb-1">Size Tiering</div>
                  <div className="text-sm text-gray-600">Offer small/medium/large with strategic margin stacking.</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-bold text-gray-800 mb-1">Loyalty Program</div>
                  <div className="text-sm text-gray-600">Implement "buy 5 get 1 free" to encourage repeat purchases.</div>
                </div>
              </>
            )}
            {selectedProduct.category === 'Combo' && (
              <>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">🎁</div>
                  <div className="font-bold text-gray-800 mb-1">Value Perception</div>
                  <div className="text-sm text-gray-600">Highlight savings vs individual items to justify pricing.</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="font-bold text-gray-800 mb-1">Mix & Match</div>
                  <div className="text-sm text-gray-600">Allow customization to increase perceived value and reduce waste.</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-bold text-gray-800 mb-1">Upsell Strategy</div>
                  <div className="text-sm text-gray-600">Price just below combined individual prices to encourage combo purchases.</div>
                </div>
              </>
            )}
            {selectedProduct.category === 'Snack' && (
              <>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">🛒</div>
                  <div className="font-bold text-gray-800 mb-1">Impulse Buy Pricing</div>
                  <div className="text-sm text-gray-600">Keep price points low to encourage spontaneous purchases.</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">📦</div>
                  <div className="font-bold text-gray-800 mb-1">Multi-Pack Deals</div>
                  <div className="text-sm text-gray-600">Offer 3-for-2 or family packs to increase unit sales.</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">📍</div>
                  <div className="font-bold text-gray-800 mb-1">Shelf Placement</div>
                  <div className="text-sm text-gray-600">Premium pricing at checkout counters where convenience matters.</div>
                </div>
              </>
            )}
            {!selectedProduct.category && (
              <div className="col-span-3 text-center text-gray-500 py-4">
                Category-specific recommendations not available
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Main Chart Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Profit Prediction Curve</h2>
                <p className="text-sm text-gray-500">Visualize profit at different price points</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Profit</span>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600">Revenue</span>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={profitCurveData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="price" 
                  tickFormatter={(value) => `$${value}`}
                  stroke="#6b7280"
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="url(#colorProfit)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="text-green-600" size={20} />
                  <span className="font-semibold text-green-800">Optimal Price Point</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${optimalPoint.price.toFixed(2)}</div>
                  <div className="text-sm text-green-700">Max Profit: ${optimalPoint.profit.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* What-If Controls */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-purple-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">What-If Analysis</h2>
            </div>

            <div className="space-y-6">
              {/* Custom Price Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Test Price</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      value={customPrice.toFixed(2)}
                      onChange={(e) => setCustomPrice(parseFloat(e.target.value) || customCost * 1.1)}
                      step="0.01"
                      min={customCost * 1.1}
                      max={selectedProduct.currentPrice * 2}
                      className="w-24 px-3 py-1 border border-purple-300 rounded-lg text-lg font-bold text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={customCost * 1.1}
                  max={selectedProduct.currentPrice * 2}
                  step="0.01"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(parseFloat(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>${(customCost * 1.1).toFixed(2)}</span>
                  <span>${(selectedProduct.currentPrice * 2).toFixed(2)}</span>
                </div>
              </div>

              {/* Cost Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Product Cost</label>
                  <span className="text-lg font-bold text-orange-600">${customCost.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={selectedProduct.currentPrice * 0.3}
                  max={selectedProduct.currentPrice * 0.8}
                  step="0.01"
                  value={customCost}
                  onChange={(e) => setCustomCost(parseFloat(e.target.value))}
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>${(selectedProduct.currentPrice * 0.3).toFixed(2)}</span>
                  <span>${(selectedProduct.currentPrice * 0.8).toFixed(2)}</span>
                </div>
              </div>

              {/* Demand Sensitivity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Demand Elasticity</label>
                  <span className="text-lg font-bold text-blue-600">{demandFactor.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={demandFactor}
                  onChange={(e) => setDemandFactor(parseFloat(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Inelastic (0.5x)</span>
                  <span>Elastic (2x)</span>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className={`p-4 rounded-lg border-2 ${
                risk.color === 'green' ? 'bg-green-50 border-green-300' :
                risk.color === 'yellow' ? 'bg-yellow-50 border-yellow-300' :
                'bg-red-50 border-red-300'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{risk.icon}</span>
                  <div>
                    <div className="font-bold text-gray-800">{risk.level} Risk</div>
                    <div className="text-xs text-gray-600">
                      {((customPrice - selectedProduct.currentPrice) / selectedProduct.currentPrice * 100).toFixed(1)}% price change
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario Comparison */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Scenario Comparison</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {scenarios.map((scenario, index) => (
              <div key={index} className={`${scenario.bgColor} rounded-xl p-6 border-2 ${index === 1 ? 'border-indigo-400' : 'border-transparent'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{scenario.icon}</span>
                    <h3 className="font-bold text-gray-800">{scenario.name}</h3>
                  </div>
                  {index === 1 && (
                    <span className="px-2 py-1 bg-indigo-600 text-white text-xs font-bold rounded">RECOMMENDED</span>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Price</div>
                    <div className="text-2xl font-bold text-gray-800">${scenario.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Profit</div>
                    <div className="text-xl font-bold text-green-600">${scenario.profit.toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-gray-600">Revenue</div>
                      <div className="text-sm font-semibold text-gray-700">${scenario.revenue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Margin</div>
                      <div className="text-sm font-semibold text-gray-700">{scenario.margin.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Est. Demand</div>
                    <div className="text-sm font-semibold text-gray-700">{scenario.demand.toLocaleString()} units</div>
                  </div>
                </div>

                {index > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">vs Current</span>
                      <span className={`font-bold ${scenario.profit > currentProfit ? 'text-green-600' : 'text-red-600'}`}>
                        {scenario.profit > currentProfit ? '+' : ''}{((scenario.profit - currentProfit) / currentProfit * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-md p-6 border border-indigo-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">AI-Powered Insights</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-green-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Optimal Strategy</h3>
                  <p className="text-sm text-gray-600">
                    Setting price to <strong>${optimalPoint.price.toFixed(2)}</strong> maximizes profit while maintaining healthy demand. 
                    This represents a <strong>{((optimalPoint.price - selectedProduct.currentPrice) / selectedProduct.currentPrice * 100).toFixed(1)}%</strong> adjustment from current pricing.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Market Position</h3>
                  <p className="text-sm text-gray-600">
                    Your product is currently priced <strong>{selectedProduct.currentPrice > (customCost * 2) ? 'above' : 'below'}</strong> market average. 
                    Recommended price offers better competitive positioning and margin optimization.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="text-purple-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Revenue Impact</h3>
                  <p className="text-sm text-gray-600">
                    Adopting recommended pricing could increase total revenue by <strong>${(recommendedProfit - currentProfit).toLocaleString()}</strong>, 
                    representing a <strong>{((recommendedProfit - currentProfit) / currentProfit * 100).toFixed(1)}%</strong> improvement.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Considerations</h3>
                  <p className="text-sm text-gray-600">
                    Monitor competitor reactions and customer feedback during price adjustment. 
                    Consider implementing changes gradually to minimize demand shock.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
