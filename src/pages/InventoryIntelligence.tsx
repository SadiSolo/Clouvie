import { useState } from 'react';
import Header from '../components/Header';
import { topMovers } from '../data/mockData';
import { Package, AlertTriangle, AlertCircle, Clock, DollarSign, BarChart3, Target, RefreshCw, Download, Zap, Info, ChevronDown, ChevronUp, Calendar, Layers, ShoppingCart } from 'lucide-react';
import { Bar, Line, Area, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie } from 'recharts';

interface InventoryItem {
  date: string;
  stockLevel: number;
  reorderPoint: number;
  safetyStock: number;
  optimalStock: number;
  demand: number;
  leadTime: number;
}

interface ABCCategory {
  category: string;
  value: number;
  percentage: number;
  color: string;
  count: number;
}

interface StockAlert {
  product: string;
  type: 'stockout' | 'overstock' | 'reorder' | 'deadstock';
  severity: 'high' | 'medium' | 'low';
  message: string;
  daysToStockout?: number;
  excessUnits?: number;
}

export default function InventoryIntelligence() {
  const [selectedProduct, setSelectedProduct] = useState(topMovers[0]);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [showOptimization, setShowOptimization] = useState(true);
  const [showExplainer, setShowExplainer] = useState(true);
  const [showABCAnalysis, setShowABCAnalysis] = useState(true);
  
  // Generate inventory data
  const generateInventoryData = (): InventoryItem[] => {
    const data: InventoryItem[] = [];
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
    const baseStock = 500;
    const baseReorderPoint = 200;
    const baseSafetyStock = 100;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      // Simulate stock depletion and replenishment
      const demand = Math.floor(20 + Math.random() * 30);
      const stockLevel = baseStock - (i % 20) * 25 + (i % 20 === 0 ? 400 : 0);
      const leadTime = 3 + Math.floor(Math.random() * 4);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        stockLevel: Math.max(50, stockLevel),
        reorderPoint: baseReorderPoint,
        safetyStock: baseSafetyStock,
        optimalStock: baseStock,
        demand,
        leadTime
      });
    }
    
    return data;
  };

  const inventoryData = generateInventoryData();

  // Calculate key metrics
  const currentStock = inventoryData[inventoryData.length - 1].stockLevel;
  const reorderPoint = inventoryData[inventoryData.length - 1].reorderPoint;
  const safetyStock = inventoryData[inventoryData.length - 1].safetyStock;
  const averageDemand = inventoryData.reduce((sum, item) => sum + item.demand, 0) / inventoryData.length;
  const daysToStockout = Math.floor(currentStock / averageDemand);
  const turnoverRate = ((averageDemand * 365) / currentStock).toFixed(2);
  const carryingCost = (currentStock * selectedProduct.currentPrice * 0.25).toFixed(2);
  
  // Calculate EOQ (Economic Order Quantity)
  const annualDemand = averageDemand * 365;
  const orderingCost = 50; // Fixed cost per order
  const holdingCostPerUnit = selectedProduct.currentPrice * 0.25;
  const eoq = Math.sqrt((2 * annualDemand * orderingCost) / holdingCostPerUnit);

  // ABC Analysis Data
  const abcAnalysis: ABCCategory[] = [
    { category: 'A - High Value', value: 80, percentage: 80, color: '#10b981', count: 8 },
    { category: 'B - Medium Value', value: 15, percentage: 15, color: '#f59e0b', count: 12 },
    { category: 'C - Low Value', value: 5, percentage: 5, color: '#ef4444', count: 28 }
  ];

  // Stock Alerts
  const stockAlerts: StockAlert[] = [
    {
      product: 'Iced Latte 720',
      type: 'stockout',
      severity: 'high',
      message: 'Critical stock level - Order immediately',
      daysToStockout: 3
    },
    {
      product: 'Espresso Double Shot',
      type: 'reorder',
      severity: 'medium',
      message: 'Approaching reorder point',
      daysToStockout: 7
    },
    {
      product: 'Green Tea 500ml',
      type: 'overstock',
      severity: 'low',
      message: 'Excess inventory detected',
      excessUnits: 450
    },
    {
      product: 'Vanilla Syrup 750ml',
      type: 'deadstock',
      severity: 'medium',
      message: 'No sales in 60 days - Consider clearance',
      excessUnits: 120
    }
  ];

  // Inventory Performance Metrics
  const performanceMetrics = [
    { metric: 'Stock Accuracy', value: 94.5, target: 95, unit: '%', color: '#10b981' },
    { metric: 'Fill Rate', value: 96.2, target: 98, unit: '%', color: '#3b82f6' },
    { metric: 'Order Cycle Time', value: 4.2, target: 3, unit: 'days', color: '#f59e0b' },
    { metric: 'Perfect Order Rate', value: 88.7, target: 90, unit: '%', color: '#8b5cf6' }
  ];

  // Reorder Recommendations
  const reorderRecommendations = [
    { product: 'Iced Latte 720', currentStock: 85, reorderPoint: 200, recommendedOrder: 500, urgency: 'high', cost: 1250 },
    { product: 'Cappuccino Mix', currentStock: 180, reorderPoint: 150, recommendedOrder: 400, urgency: 'medium', cost: 800 },
    { product: 'Mocha Syrup', currentStock: 120, reorderPoint: 100, recommendedOrder: 300, urgency: 'low', cost: 450 }
  ];

  // Seasonal Demand Forecast
  const seasonalForecast = [
    { month: 'Jan', demand: 800, forecast: 850, inventory: 900 },
    { month: 'Feb', demand: 750, forecast: 780, inventory: 850 },
    { month: 'Mar', demand: 900, forecast: 920, inventory: 1000 },
    { month: 'Apr', demand: 1100, forecast: 1150, inventory: 1200 },
    { month: 'May', demand: 1300, forecast: 1280, inventory: 1350 },
    { month: 'Jun', demand: 1400, forecast: 1420, inventory: 1500 }
  ];

  // Stock Health Score (0-100)
  const stockHealthScore = Math.min(100, Math.round(
    (currentStock / reorderPoint) * 30 +
    (parseFloat(turnoverRate) / 12) * 30 +
    (daysToStockout / 30) * 40
  ));

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'stockout': return <AlertTriangle className="w-5 h-5" />;
      case 'reorder': return <Clock className="w-5 h-5" />;
      case 'overstock': return <Package className="w-5 h-5" />;
      case 'deadstock': return <AlertCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-amber-500 bg-amber-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getStockHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Inventory Intelligence" />

      <div className="p-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <Package size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Inventory Intelligence Hub</h1>
                <p className="text-sm opacity-90">AI-powered inventory optimization with predictive analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
              <Zap className="text-yellow-300" size={20} />
              <span className="text-sm font-semibold">Smart Monitoring Active</span>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Product Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Product</label>
              <div className="relative">
                <select
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const product = topMovers.find(p => p.id === e.target.value);
                    if (product) setSelectedProduct(product);
                  }}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {topMovers.slice(0, 8).map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            {/* Timeframe Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Time Period</label>
              <div className="flex gap-2">
                {(['7d', '30d', '90d', '1y'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                      timeframe === period
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {period.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Actions</label>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-sm">
                  <RefreshCw size={16} />
                  Refresh Data
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all font-medium shadow-sm">
                  <Download size={16} />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Current Stock Level */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-90">Current Stock</span>
            </div>
            <div className="text-3xl font-bold mb-1">{currentStock}</div>
            <div className="text-sm opacity-90">units available</div>
          </div>

          {/* Days to Stockout */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-90">Days to Stockout</span>
            </div>
            <div className="text-3xl font-bold mb-1">{daysToStockout}</div>
            <div className="text-sm opacity-90">at current rate</div>
          </div>

          {/* Turnover Rate */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <RefreshCw className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-90">Turnover Rate</span>
            </div>
            <div className="text-3xl font-bold mb-1">{turnoverRate}x</div>
            <div className="text-sm opacity-90">times per year</div>
          </div>

          {/* Carrying Cost */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-90">Carrying Cost</span>
            </div>
            <div className="text-3xl font-bold mb-1">${carryingCost}</div>
            <div className="text-sm opacity-90">annual estimate</div>
          </div>

          {/* Stock Health Score */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-90">Health Score</span>
            </div>
            <div className={`text-3xl font-bold mb-1`}>{stockHealthScore}/100</div>
            <div className="text-sm opacity-90">
              {stockHealthScore >= 80 ? 'Excellent' : stockHealthScore >= 60 ? 'Good' : 'Needs Attention'}
            </div>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Active Stock Alerts</h2>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
              {stockAlerts.filter(a => a.severity === 'high').length} Critical
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stockAlerts.map((alert, index) => (
              <div key={index} className={`border-l-4 rounded-lg p-4 ${getAlertColor(alert.severity)}`}>
                <div className="flex items-start gap-3">
                  <div className={`${alert.severity === 'high' ? 'text-red-600' : alert.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 mb-1">{alert.product}</div>
                    <div className="text-sm text-gray-700 mb-2">{alert.message}</div>
                    {alert.daysToStockout && (
                      <div className="text-xs font-semibold text-gray-600">
                        Estimated stockout in {alert.daysToStockout} days
                      </div>
                    )}
                    {alert.excessUnits && (
                      <div className="text-xs font-semibold text-gray-600">
                        Excess inventory: {alert.excessUnits} units
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Inventory Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Stock Level Monitoring</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={inventoryData}>
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="stockLevel" 
                fill="url(#stockGradient)" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Current Stock"
              />
              <Line 
                type="monotone" 
                dataKey="reorderPoint" 
                stroke="#f59e0b" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Reorder Point"
              />
              <Line 
                type="monotone" 
                dataKey="safetyStock" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
                name="Safety Stock"
              />
              <Line 
                type="monotone" 
                dataKey="optimalStock" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Optimal Stock"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Optimization Section */}
        <div className="mb-8">
          <button
            onClick={() => setShowOptimization(!showOptimization)}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white flex items-center justify-between hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold mb-1">Inventory Optimization Insights</h2>
                <p className="text-sm text-white/80">Economic Order Quantity, reorder recommendations, and cost analysis</p>
              </div>
            </div>
            {showOptimization ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>

          {showOptimization && (
            <>
              {/* Explainer Section */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-100">
                <button
                  onClick={() => setShowExplainer(!showExplainer)}
                  className="w-full flex items-start justify-between gap-4 text-left hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <Info className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Understanding Inventory Optimization</h3>
                      <p className="text-sm text-gray-600">
                        {showExplainer ? 'Click to hide explanation' : 'Click to learn how we optimize your inventory'}
                      </p>
                    </div>
                  </div>
                  {showExplainer ? <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" /> : <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />}
                </button>
                
                {showExplainer && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-4">
                      We use advanced algorithms to help you maintain optimal inventory levels, minimize costs, and prevent stockouts:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                          <span className="font-bold text-blue-900">EOQ Analysis</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Economic Order Quantity calculates the ideal order size that minimizes total inventory costs (ordering + holding).
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-green-600" />
                          <span className="font-bold text-green-900">Reorder Points</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          When stock reaches this level, it's time to reorder. Based on lead time, demand variability, and desired service level.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-5 h-5 text-orange-600" />
                          <span className="font-bold text-orange-900">Safety Stock</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Extra inventory buffer to protect against demand spikes or supply delays. Prevents costly stockouts.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* EOQ Recommendation */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Economic Order Quantity</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <div className="text-sm text-blue-700 font-medium mb-2">Recommended Order Size</div>
                      <div className="text-4xl font-bold text-blue-900 mb-2">{Math.round(eoq)}</div>
                      <div className="text-sm text-blue-700">units per order</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Annual Demand</span>
                        <span className="font-bold text-gray-900">{Math.round(annualDemand)} units</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Ordering Cost</span>
                        <span className="font-bold text-gray-900">${orderingCost} per order</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Holding Cost</span>
                        <span className="font-bold text-gray-900">${holdingCostPerUnit.toFixed(2)} per unit/year</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Orders Per Year</span>
                        <span className="font-bold text-gray-900">{Math.round(annualDemand / eoq)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reorder Recommendations */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingCart className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-lg font-bold text-gray-900">Reorder Recommendations</h3>
                  </div>
                  <div className="space-y-3">
                    {reorderRecommendations.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-bold text-gray-900">{item.product}</div>
                            <div className="text-sm text-gray-600">Current: {item.currentStock} units</div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.urgency === 'high' ? 'bg-red-100 text-red-700' :
                            item.urgency === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {item.urgency.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="text-gray-600">Order: </span>
                            <span className="font-bold text-emerald-600">{item.recommendedOrder} units</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Cost: </span>
                            <span className="font-bold text-gray-900">${item.cost}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ABC Analysis & Performance */}
        <div className="mb-8">
          <button
            onClick={() => setShowABCAnalysis(!showABCAnalysis)}
            className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-2xl p-6 text-white flex items-center justify-between hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 transition-all mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Layers className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold mb-1">ABC Analysis & Performance Metrics</h2>
                <p className="text-sm text-white/80">Category distribution, turnover analysis, and operational metrics</p>
              </div>
            </div>
            {showABCAnalysis ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>

          {showABCAnalysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ABC Analysis Chart */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">ABC Analysis Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={abcAnalysis}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category.split(' ')[0]}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {abcAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {abcAnalysis.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-700">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">{item.count} products</span>
                        <span className="text-gray-600 ml-2">({item.percentage}% of value)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="space-y-6">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">{metric.metric}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">Target: {metric.target}{metric.unit}</span>
                          <span className="text-lg font-bold" style={{ color: metric.color }}>
                            {metric.value}{metric.unit}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${(metric.value / metric.target) * 100}%`,
                            backgroundColor: metric.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seasonal Demand Forecast */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Seasonal Demand & Inventory Planning</h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={seasonalForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="demand" fill="#3b82f6" name="Actual Demand" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="forecast" stroke="#8b5cf6" strokeWidth={3} name="Forecasted Demand" />
              <Line type="monotone" dataKey="inventory" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" name="Planned Inventory" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
