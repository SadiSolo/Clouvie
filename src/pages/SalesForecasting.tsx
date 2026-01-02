import { useState } from 'react';
import Header from '../components/Header';
import { topMovers } from '../data/mockData';
import { TrendingUp, TrendingDown, DollarSign, Package, Zap, Download, RefreshCw, Sparkles, BarChart3, Target, Activity, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart } from 'recharts';

interface Scenario {
  id: string;
  name: string;
  priceChange: number;
  demandImpact: number;
  revenueChange: number;
  profitChange: number;
  color: string;
}

interface ForecastDataPoint {
  date: string;
  sales: number;
  price: number;
  revenue: number;
  profit: number;
  lowerBound?: number;
  upperBound?: number;
  isForecast?: boolean;
}

export default function SalesForecasting() {
  const [selectedProduct, setSelectedProduct] = useState(topMovers[0]);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [forecastMethod, setForecastMethod] = useState<'ai' | 'linear' | 'exponential'>('ai');
  const [showScenarios, setShowScenarios] = useState(true);
  const [customScenario, setCustomScenario] = useState({
    priceChange: 0,
    marketingSpend: 0,
    seasonalFactor: 1,
    competitorAction: 0,
    discount: 0
  });

  // Generate historical data
  const generateHistoricalData = (): ForecastDataPoint[] => {
    const data: ForecastDataPoint[] = [];
    const basePrice = selectedProduct.currentPrice;
    const baseSales = 1000;
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
    
    for (let i = -days; i <= 0; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const trend = i * 0.5;
      const seasonality = Math.sin(i / 7) * 50;
      const noise = (Math.random() - 0.5) * 100;
      
      const sales = Math.round(baseSales + trend + seasonality + noise);
      const price = basePrice + (Math.random() - 0.5) * 10;
      const revenue = sales * price;
      const profit = revenue * 0.35;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales,
        price: parseFloat(price.toFixed(2)),
        revenue: parseFloat(revenue.toFixed(0)),
        profit: parseFloat(profit.toFixed(0))
      });
    }
    return data;
  };

  // Generate forecast data with confidence intervals
  const generateForecast = (): ForecastDataPoint[] => {
    const historicalData = generateHistoricalData();
    const lastDataPoint = historicalData[historicalData.length - 1];
    const data: ForecastDataPoint[] = [];
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
    
    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      let growth = 1;
      if (forecastMethod === 'ai') {
        growth = 1 + (i / days) * 0.1 + Math.sin(i / 7) * 0.05;
      } else if (forecastMethod === 'exponential') {
        growth = Math.pow(1.002, i);
      } else {
        growth = 1 + (i / days) * 0.05;
      }
      
      const sales = Math.round(lastDataPoint.sales * growth * (1 + (Math.random() - 0.5) * 0.1));
      const price = selectedProduct.recommendedPrice;
      const revenue = sales * price;
      const profit = revenue * 0.35;
      
      const uncertainty = i / days * 0.2;
      const lower = sales * (1 - uncertainty);
      const upper = sales * (1 + uncertainty);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales,
        price: parseFloat(price.toFixed(2)),
        revenue: parseFloat(revenue.toFixed(0)),
        profit: parseFloat(profit.toFixed(0)),
        lowerBound: Math.round(lower),
        upperBound: Math.round(upper),
        isForecast: true
      });
    }
    return data;
  };

  const historicalData = generateHistoricalData();
  const forecastData = generateForecast();
  const combinedData = [...historicalData, ...forecastData];

  // Calculate What-If Scenarios
  const calculateScenario = (name: string, priceChange: number, color: string): Scenario => {
    const elasticity = selectedProduct.bpe || -1.5;
    const demandImpact = elasticity * (priceChange / 100);
    const newPrice = selectedProduct.currentPrice * (1 + priceChange / 100);
    const newDemand = 1000 * (1 + demandImpact);
    const currentRevenue = selectedProduct.currentPrice * 1000;
    const newRevenue = newPrice * newDemand;
    const revenueChange = ((newRevenue - currentRevenue) / currentRevenue) * 100;
    const profitChange = revenueChange * 1.2;
    
    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      priceChange,
      demandImpact: demandImpact * 100,
      revenueChange,
      profitChange,
      color
    };
  };

  const scenarios: Scenario[] = [
    calculateScenario('Aggressive Discount', -15, '#ef4444'),
    calculateScenario('Moderate Discount', -10, '#f97316'),
    calculateScenario('Base Case', 0, '#3b82f6'),
    calculateScenario('Slight Increase', +5, '#8b5cf6'),
    calculateScenario('Premium Pricing', +12, '#ec4899'),
  ];

  const generateScenarioData = () => {
    return scenarios.map(scenario => {
      const baseSales = 1000;
      const demandChange = scenario.demandImpact / 100;
      const newSales = baseSales * (1 + demandChange);
      const newPrice = selectedProduct.currentPrice * (1 + scenario.priceChange / 100);
      const revenue = newSales * newPrice;
      const profit = revenue * 0.35;
      
      return {
        name: scenario.name,
        sales: Math.round(newSales),
        revenue: Math.round(revenue),
        profit: Math.round(profit),
        fill: scenario.color
      };
    });
  };

  const scenarioComparisonData = generateScenarioData();

  // Custom Scenario Calculator
  const calculateCustomScenario = () => {
    const { priceChange, marketingSpend, seasonalFactor, competitorAction, discount } = customScenario;
    
    const elasticity = selectedProduct.bpe || -1.5;
    const baseDemand = 1000;
    
    const priceImpact = elasticity * (priceChange / 100);
    const marketingImpact = Math.log(1 + marketingSpend / 1000) * 0.15;
    const seasonalImpact = (seasonalFactor - 1);
    const competitorImpact = -(competitorAction / 100) * 0.3;
    const discountImpact = (discount / 100) * 0.8; // Discount boosts demand
    
    const totalDemandChange = priceImpact + marketingImpact + seasonalImpact + competitorImpact + discountImpact;
    const newDemand = baseDemand * (1 + totalDemandChange);
    const effectivePrice = selectedProduct.currentPrice * (1 + priceChange / 100) * (1 - discount / 100);
    const newRevenue = effectivePrice * newDemand;
    const currentRevenue = selectedProduct.currentPrice * baseDemand;
    const revenueChange = ((newRevenue - currentRevenue) / currentRevenue) * 100;
    
    return {
      demand: Math.round(newDemand),
      demandChange: totalDemandChange * 100,
      revenue: Math.round(newRevenue),
      revenueChange,
      profit: Math.round(newRevenue * 0.35),
      profitChange: revenueChange * 1.2
    };
  };

  const customResults = calculateCustomScenario();

  // Key Metrics
  const avgHistoricalSales = Math.round(historicalData.reduce((sum, d) => sum + d.sales, 0) / historicalData.length);
  const avgForecastSales = Math.round(forecastData.reduce((sum, d) => sum + d.sales, 0) / forecastData.length);
  const forecastGrowth = ((avgForecastSales - avgHistoricalSales) / avgHistoricalSales) * 100;
  const totalForecastRevenue = forecastData.reduce((sum, d) => sum + d.revenue, 0);
  const totalForecastProfit = forecastData.reduce((sum, d) => sum + d.profit, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Sales Forecasting" subtitle="AI-Powered Demand Prediction & What-If Analysis" />
      
      <div className="p-8">
        {/* Controls */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product</label>
              <select
                value={selectedProduct.id}
                onChange={(e) => {
                  const product = topMovers.find(p => p.id === e.target.value);
                  if (product) setSelectedProduct(product);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {topMovers.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Forecast Period</label>
              <div className="grid grid-cols-4 gap-2">
                {(['7d', '30d', '90d', '1y'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-3 py-3 rounded-lg font-medium transition-all ${
                      timeframe === period
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Forecast Model</label>
              <select
                value={forecastMethod}
                onChange={(e) => setForecastMethod(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="ai">AI Multi-Factor Model</option>
                <option value="linear">Linear Regression</option>
                <option value="exponential">Exponential Growth</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <Package className="w-8 h-8 opacity-80" />
              <div className="flex items-center gap-1 text-sm">
                {forecastGrowth >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{forecastGrowth >= 0 ? '+' : ''}{forecastGrowth.toFixed(1)}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{avgForecastSales}</div>
            <div className="text-blue-100 text-sm">Avg Daily Sales (Forecast)</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 opacity-80" />
              <Sparkles className="w-5 h-5 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">${(totalForecastRevenue / 1000).toFixed(0)}k</div>
            <div className="text-emerald-100 text-sm">Projected Revenue</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">${(totalForecastProfit / 1000).toFixed(0)}k</div>
            <div className="text-purple-100 text-sm">Projected Profit</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <Activity className="w-8 h-8 opacity-80" />
              <div className="px-2 py-1 bg-white/20 rounded text-xs font-semibold">
                {forecastMethod === 'ai' ? 'AI' : forecastMethod === 'linear' ? 'LINEAR' : 'EXPO'}
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">94%</div>
            <div className="text-orange-100 text-sm">Model Accuracy</div>
          </div>
        </div>

        {/* Main Forecast Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sales Forecast</h2>
              <p className="text-sm text-gray-600 mt-1">
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  Past sales 
                  <span className="ml-3 w-8 h-0.5 bg-purple-500" style={{ borderTop: '2px dashed' }}></span>
                  Future predictions
                  <span className="ml-3 w-8 h-3 bg-purple-100 rounded"></span>
                  Confidence range
                </span>
              </p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={combinedData}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                label={{ value: 'Units Sold', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'Forecast') return [Math.round(value) + ' units', 'Predicted Sales'];
                  if (name === 'Actual') return [Math.round(value) + ' units', 'Past Sales'];
                  if (name === 'Lower Bound') return [Math.round(value), 'Lower Bound'];
                  if (name === 'Upper Bound') return [Math.round(value), 'Upper Bound'];
                  return [value, name];
                }}
                labelStyle={{ color: '#374151', fontWeight: 600 }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="none"
                fill="url(#confidenceGradient)"
                fillOpacity={1}
                isAnimationActive={false}
                legendType="none"
                hide={true}
              />
              <Area
                type="monotone"
                dataKey="lowerBound"
                stroke="none"
                fill="#fff"
                fillOpacity={1}
                isAnimationActive={false}
                legendType="none"
                hide={true}
              />
              
              <Line 
                type="monotone" 
                dataKey={(d: any) => !d.isForecast ? d.sales : null}
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={false}
                name="Actual"
                connectNulls={false}
              />
              
              <Line 
                type="monotone" 
                dataKey={(d: any) => d.isForecast ? d.sales : null}
                stroke="#8b5cf6" 
                strokeWidth={3}
                strokeDasharray="8 4"
                dot={false}
                name="Forecast"
                connectNulls={false}
              />
              
              <Line 
                type="monotone" 
                dataKey={(d: any) => d.isForecast ? d.lowerBound : null}
                stroke="#c084fc" 
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
                name="Lower Bound"
                connectNulls={false}
              />
              
              <Line 
                type="monotone" 
                dataKey={(d: any) => d.isForecast ? d.upperBound : null}
                stroke="#c084fc" 
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
                name="Upper Bound"
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* What-If Analysis Section */}
        <div className="mb-8">
          <button
            onClick={() => setShowScenarios(!showScenarios)}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white flex items-center justify-between hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold mb-1">What-If Analysis Simulator</h2>
                <p className="text-sm text-white/80">Test price changes and market scenarios to predict outcomes</p>
              </div>
            </div>
            {showScenarios ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>

          {showScenarios && (
            <div className="space-y-6">
              {/* Preset Scenarios */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Price Change Scenarios</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {scenarios.map((scenario) => (
                      <div
                        key={scenario.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                        style={{ borderLeftWidth: '4px', borderLeftColor: scenario.color }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">{scenario.name}</h4>
                          <span className="text-sm font-semibold px-2 py-1 bg-gray-100 rounded">
                            {scenario.priceChange > 0 ? '+' : ''}{scenario.priceChange}%
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <div className="text-gray-600">Demand</div>
                            <div className={`font-semibold ${scenario.demandImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {scenario.demandImpact >= 0 ? '+' : ''}{scenario.demandImpact.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Revenue</div>
                            <div className={`font-semibold ${scenario.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {scenario.revenueChange >= 0 ? '+' : ''}{scenario.revenueChange.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Profit</div>
                            <div className={`font-semibold ${scenario.profitChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {scenario.profitChange >= 0 ? '+' : ''}{scenario.profitChange.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Scenario Comparison</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={scenarioComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 11 }}
                          angle={-15}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Bar dataKey="profit" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Custom Scenario Builder */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Custom Scenario Builder
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price Change (%)
                      </label>
                      <input
                        type="range"
                        min="-30"
                        max="30"
                        value={customScenario.priceChange}
                        onChange={(e) => setCustomScenario({ ...customScenario, priceChange: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>-30%</span>
                        <span className="font-bold text-indigo-600">{customScenario.priceChange}%</span>
                        <span>+30%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Marketing Spend ($)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={customScenario.marketingSpend}
                        onChange={(e) => setCustomScenario({ ...customScenario, marketingSpend: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>$0</span>
                        <span className="font-bold text-indigo-600">${customScenario.marketingSpend}</span>
                        <span>$5,000</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Seasonal Factor
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={customScenario.seasonalFactor}
                        onChange={(e) => setCustomScenario({ ...customScenario, seasonalFactor: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>0.5x (Low)</span>
                        <span className="font-bold text-indigo-600">{customScenario.seasonalFactor}x</span>
                        <span>1.5x (High)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Competitor Price Change (%)
                      </label>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={customScenario.competitorAction}
                        onChange={(e) => setCustomScenario({ ...customScenario, competitorAction: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>-20%</span>
                        <span className="font-bold text-indigo-600">{customScenario.competitorAction}%</span>
                        <span>+20%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Discount (%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={customScenario.discount}
                        onChange={(e) => setCustomScenario({ ...customScenario, discount: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>0%</span>
                        <span className="font-bold text-indigo-600">{customScenario.discount}%</span>
                        <span>50%</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setCustomScenario({ priceChange: 0, marketingSpend: 0, seasonalFactor: 1, competitorAction: 0, discount: 0 })}
                      className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset Scenario
                    </button>
                  </div>

                  <div>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        Projected Outcomes
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="text-sm text-gray-600 mb-1">Demand Change</div>
                          <div className="flex items-baseline gap-2">
                            <div className={`text-3xl font-bold ${customResults.demandChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {customResults.demandChange >= 0 ? '+' : ''}{customResults.demandChange.toFixed(1)}%
                            </div>
                            <div className="text-gray-600">({customResults.demand} units)</div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="text-sm text-gray-600 mb-1">Revenue Impact</div>
                          <div className="flex items-baseline gap-2">
                            <div className={`text-3xl font-bold ${customResults.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {customResults.revenueChange >= 0 ? '+' : ''}{customResults.revenueChange.toFixed(1)}%
                            </div>
                            <div className="text-gray-600">(${(customResults.revenue / 1000).toFixed(1)}k)</div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="text-sm text-gray-600 mb-1">Profit Impact</div>
                          <div className="flex items-baseline gap-2">
                            <div className={`text-3xl font-bold ${customResults.profitChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {customResults.profitChange >= 0 ? '+' : ''}{customResults.profitChange.toFixed(1)}%
                            </div>
                            <div className="text-gray-600">(${(customResults.profit / 1000).toFixed(1)}k)</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p>Results are based on AI models trained on historical data, elasticity ({(selectedProduct.bpe || -1.5).toFixed(2)}), and market conditions.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
