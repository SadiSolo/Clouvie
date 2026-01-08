import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import { topMovers } from '../data/mockData';
import { TrendingUp, TrendingDown, DollarSign, Package, Sparkles, Target, Activity, ChevronDown } from 'lucide-react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart } from 'recharts';


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

  // Key Metrics
  const avgHistoricalSales = Math.round(historicalData.reduce((sum, d) => sum + d.sales, 0) / historicalData.length);
  const avgForecastSales = Math.round(forecastData.reduce((sum, d) => sum + d.sales, 0) / forecastData.length);
  const forecastGrowth = ((avgForecastSales - avgHistoricalSales) / avgHistoricalSales) * 100;
  const totalForecastRevenue = forecastData.reduce((sum, d) => sum + d.revenue, 0);
  const totalForecastProfit = forecastData.reduce((sum, d) => sum + d.profit, 0);

  return (
    <>
      <Helmet>
        <title>Sales Forecasting | Clouvie</title>
        <meta
          name="description"
          content="Use Clouvie to generate AI-powered sales forecasts, compare scenarios, and understand projected revenue and profit with confidence ranges."
        />
      </Helmet>
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

        {/* Scenario Comparison */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Scenario Comparison</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Scenario */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <h3 className="font-bold text-gray-800">Current</h3>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Price</div>
                  <div className="text-2xl font-bold text-gray-800">${selectedProduct.currentPrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Profit</div>
                  <div className="text-xl font-bold text-green-600">${totalForecastProfit.toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-600">Revenue</div>
                    <div className="text-sm font-semibold text-gray-700">${totalForecastRevenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Margin</div>
                    <div className="text-sm font-semibold text-gray-700">35.0%</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Est. Demand</div>
                  <div className="text-sm font-semibold text-gray-700">{avgHistoricalSales.toLocaleString()} units</div>
                </div>
              </div>
            </div>

            {/* AI Recommended Scenario */}
            <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-400">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <h3 className="font-bold text-gray-800">AI Recommended</h3>
                </div>
                <span className="px-2 py-1 bg-indigo-600 text-white text-xs font-bold rounded">RECOMMENDED</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Price</div>
                  <div className="text-2xl font-bold text-gray-800">${selectedProduct.recommendedPrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Profit</div>
                  <div className="text-xl font-bold text-green-600">${(totalForecastProfit * 1.15).toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-600">Revenue</div>
                    <div className="text-sm font-semibold text-gray-700">${(totalForecastRevenue * 1.12).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Margin</div>
                    <div className="text-sm font-semibold text-gray-700">37.2%</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Est. Demand</div>
                  <div className="text-sm font-semibold text-gray-700">{avgForecastSales.toLocaleString()} units</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-indigo-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">vs Current</span>
                  <span className="font-bold text-green-600">+{forecastGrowth.toFixed(1)}%</span>
                </div>
              </div>
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

        {/* Current Scenario Forecast Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Current Scenario Forecast</h2>
              <p className="text-sm text-gray-600 mt-1">
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                  Past sales 
                  <span className="ml-3 w-8 h-0.5 bg-gray-500" style={{ borderTop: '2px dashed' }}></span>
                  Current trajectory
                  <span className="ml-3 w-8 h-3 bg-gray-100 rounded"></span>
                  Confidence range
                </span>
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={combinedData}>
              <defs>
                <linearGradient id="currentConfidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6b7280" stopOpacity={0.05}/>
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
                formatter={(value: any, name: string = '') => {
                  if (name === 'Current Forecast') return [Math.round(value) + ' units', 'Predicted Sales (Current)'];
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
                fill="url(#currentConfidenceGradient)"
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
                stroke="#6b7280" 
                strokeWidth={3}
                dot={false}
                name="Actual"
                connectNulls={false}
              />
              
              <Line 
                type="monotone" 
                dataKey={(d: any) => d.isForecast ? d.sales : null}
                stroke="#6b7280" 
                strokeWidth={3}
                strokeDasharray="8 4"
                dot={false}
                name="Current Forecast"
                connectNulls={false}
              />
              
              <Line 
                type="monotone" 
                dataKey={(d: any) => d.isForecast ? d.lowerBound : null}
                stroke="#9ca3af" 
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
                name="Lower Bound"
                connectNulls={false}
              />
              
              <Line 
                type="monotone" 
                dataKey={(d: any) => d.isForecast ? d.upperBound : null}
                stroke="#9ca3af" 
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
                name="Upper Bound"
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* AI Recommended Forecast Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Recommended Forecast</h2>
              <p className="text-sm text-gray-600 mt-1">
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  Past sales 
                  <span className="ml-3 w-8 h-0.5 bg-purple-500" style={{ borderTop: '2px dashed' }}></span>
                  AI optimized predictions
                  <span className="ml-3 w-8 h-3 bg-purple-100 rounded"></span>
                  Confidence range
                </span>
              </p>
            </div>
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
                formatter={(value: any, name: string = '') => {
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

        {/* Scenario Simulator Link */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Need comprehensive scenario analysis?</h2>
                <p className="text-white/90 text-sm mb-3">
                  Test sales forecasts with multiple factors including price changes, marketing spend, 
                  seasonality, competitor actions, and more - all in one powerful simulator.
                </p>
                <button
                  onClick={() => window.location.href = `/scenario-simulator?productId=${selectedProduct.id}`}
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  <Target className="w-5 h-5" />
                  Open Scenario Simulator
                  <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
