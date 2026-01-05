import { useState } from 'react';
import Header from '../components/Header';
import { topMovers } from '../data/mockData';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, Zap, Target, BarChart3, Calendar, CloudRain, Megaphone, DollarSign, Users, Download, RefreshCw, Info, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface DemandDataPoint {
  date: string;
  actual: number;
  forecast: number;
  trend: number;
  seasonal: number;
  residual: number;
  lowerBound: number;
  upperBound: number;
  isAnomaly?: boolean;
}

interface ModelAccuracy {
  name: string;
  mape: number;
  rmse: number;
  accuracy: number;
  color: string;
}

export default function DemandForecasting() {
  const [selectedProduct, setSelectedProduct] = useState(topMovers[0]);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [forecastModel, setForecastModel] = useState<'arima' | 'prophet' | 'ensemble' | 'deeplearning'>('ensemble');
  const [showDecomposition, setShowDecomposition] = useState(true);
  const [showExplainer, setShowExplainer] = useState(true);
  const [showScenarios, setShowScenarios] = useState(true);

  // Generate demand data with decomposition
  const generateDemandData = (): DemandDataPoint[] => {
    const data: DemandDataPoint[] = [];
    const days = timeframe === '7d' ? 14 : timeframe === '30d' ? 60 : timeframe === '90d' ? 180 : 365;
    const baseDemand = 1200;
    
    for (let i = -Math.floor(days / 2); i <= Math.floor(days / 2); i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Trend component
      const trend = baseDemand + (i * 2);
      
      // Seasonal component (weekly and monthly patterns)
      const dayOfWeek = date.getDay();
      const weekendEffect = (dayOfWeek === 0 || dayOfWeek === 6) ? 150 : -50;
      const monthlyEffect = Math.sin((i / 30) * Math.PI * 2) * 100;
      const seasonal = weekendEffect + monthlyEffect;
      
      // Residual (random noise)
      const residual = (Math.random() - 0.5) * 80;
      
      // Actual demand
      const actual = i < 0 ? Math.round(trend + seasonal + residual) : 0;
      
      // Forecast with model variations
      let modelMultiplier = 1;
      if (forecastModel === 'arima') modelMultiplier = 1 + (Math.random() - 0.5) * 0.05;
      else if (forecastModel === 'prophet') modelMultiplier = 1 + Math.sin(i / 10) * 0.03;
      else if (forecastModel === 'deeplearning') modelMultiplier = 1 + (Math.random() - 0.5) * 0.02;
      else modelMultiplier = 1; // ensemble is most stable
      
      const forecast = i >= 0 ? Math.round((trend + seasonal) * modelMultiplier) : 0;
      
      // Confidence intervals
      const uncertainty = Math.abs(i) / days * 0.15;
      const lowerBound = forecast * (1 - uncertainty);
      const upperBound = forecast * (1 + uncertainty);
      
      // Anomaly detection
      const isAnomaly = i < 0 && Math.abs(actual - (trend + seasonal)) > 200;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        actual,
        forecast,
        trend: Math.round(trend),
        seasonal: Math.round(seasonal),
        residual: Math.round(residual),
        lowerBound: Math.round(lowerBound),
        upperBound: Math.round(upperBound),
        isAnomaly
      });
    }
    return data;
  };

  const demandData = generateDemandData();
  const historicalData = demandData.filter(d => d.actual > 0);
  const forecastedData = demandData.filter(d => d.forecast > 0);
  
  // Calculate metrics for scenarios
  const avgHistoricalDemand = Math.round(historicalData.reduce((sum, d) => sum + d.actual, 0) / historicalData.length);
  const avgForecastDemand = Math.round(forecastedData.reduce((sum, d) => sum + d.forecast, 0) / forecastedData.length);
  const demandGrowth = ((avgForecastDemand - avgHistoricalDemand) / avgHistoricalDemand) * 100;
  const currentRevenue = avgHistoricalDemand * selectedProduct.currentPrice;
  const forecastRevenue = avgForecastDemand * selectedProduct.recommendedPrice;
  // ...existing code...

  // Model accuracy comparison
  const modelAccuracies: ModelAccuracy[] = [
    { name: 'ARIMA', mape: 8.5, rmse: 125, accuracy: 91.5, color: '#3b82f6' },
    { name: 'Prophet', mape: 7.2, rmse: 105, accuracy: 92.8, color: '#8b5cf6' },
    { name: 'Ensemble', mape: 5.8, rmse: 85, accuracy: 94.2, color: '#10b981' },
    { name: 'Deep Learning', mape: 6.5, rmse: 95, accuracy: 93.5, color: '#f59e0b' },
  ];

  // Demand drivers analysis
  const demandDrivers = [
    { factor: 'Price', impact: 85, trend: 'negative' },
    { factor: 'Marketing', impact: 72, trend: 'positive' },
    { factor: 'Season', impact: 68, trend: 'positive' },
    { factor: 'Competition', impact: 55, trend: 'negative' },
    { factor: 'Weather', impact: 45, trend: 'neutral' },
    { factor: 'Promotions', impact: 80, trend: 'positive' },
  ];

  // Pattern detection
  const patterns = [
    { type: 'Peak Period', description: 'Weekends show 40% higher demand', icon: TrendingUp, color: 'text-green-600' },
    { type: 'Low Season', description: 'Midweek (Tue-Wed) sees 20% lower demand', icon: TrendingDown, color: 'text-red-600' },
    { type: 'Monthly Cycle', description: 'End-of-month spike of 25%', icon: Calendar, color: 'text-blue-600' },
    { type: 'Anomaly Detected', description: '3 unusual spikes in past 30 days', icon: AlertTriangle, color: 'text-yellow-600' },
  ];

  // Risk metrics
  const volatility = 12.5;
  const anomalyCount = demandData.filter(d => d.isAnomaly).length;
  const riskScore = Math.min(100, volatility * 2 + anomalyCount * 5);

  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Demand Forecasting</h1>
          <p className="text-gray-600">AI-powered demand prediction with pattern recognition and scenario analysis</p>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Product</label>
            <select 
              value={selectedProduct.id}
              onChange={(e) => setSelectedProduct(topMovers.find(p => p.id === e.target.value) || topMovers[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {topMovers.map(product => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Forecast Horizon</label>
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
              <option value="1y">1 Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">AI Model</label>
            <select 
              value={forecastModel}
              onChange={(e) => setForecastModel(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="arima">ARIMA/SARIMA</option>
              <option value="prophet">Prophet</option>
              <option value="ensemble">ML Ensemble ⭐</option>
              <option value="deeplearning">Deep Learning</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Actions</label>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex-1 px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors inline-flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-10 h-10 opacity-80" />
              <span className="text-2xl font-bold">{modelAccuracies.find(m => m.name === forecastModel.charAt(0).toUpperCase() + forecastModel.slice(1))?.accuracy || 94.2}%</span>
            </div>
            <div className="text-sm opacity-90">Model Accuracy</div>
            <div className="text-xs opacity-75 mt-1">MAPE: {modelAccuracies.find(m => m.name === forecastModel.charAt(0).toUpperCase() + forecastModel.slice(1))?.mape || 5.8}%</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 opacity-80" />
              <span className="text-2xl font-bold">+8.5%</span>
            </div>
            <div className="text-sm opacity-90">Projected Growth</div>
            <div className="text-xs opacity-75 mt-1">Next {timeframe === '7d' ? '7 days' : timeframe === '30d' ? '30 days' : timeframe === '90d' ? '90 days' : 'year'}</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-10 h-10 opacity-80" />
              <span className="text-2xl font-bold">{volatility}%</span>
            </div>
            <div className="text-sm opacity-90">Demand Volatility</div>
            <div className="text-xs opacity-75 mt-1">Risk Score: {riskScore.toFixed(0)}/100</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-10 h-10 opacity-80" />
              <span className="text-2xl font-bold">{anomalyCount}</span>
            </div>
            <div className="text-sm opacity-90">Anomalies Detected</div>
            <div className="text-xs opacity-75 mt-1">Past {timeframe === '7d' ? '7 days' : '30 days'}</div>
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
                  <div className="text-xl font-bold text-green-600">${(currentRevenue * 0.35).toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-600">Revenue</div>
                    <div className="text-sm font-semibold text-gray-700">${currentRevenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Margin</div>
                    <div className="text-sm font-semibold text-gray-700">35.0%</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Est. Demand</div>
                  <div className="text-sm font-semibold text-gray-700">{avgHistoricalDemand.toLocaleString()} units</div>
                </div>
              </div>
            </div>

            {/* AI Recommended Scenario */}
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-400">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <h3 className="font-bold text-gray-800">AI Recommended</h3>
                </div>
                <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">RECOMMENDED</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Price</div>
                  <div className="text-2xl font-bold text-gray-800">${selectedProduct.recommendedPrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Profit</div>
                  <div className="text-xl font-bold text-green-600">${(forecastRevenue * 0.37).toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-600">Revenue</div>
                    <div className="text-sm font-semibold text-gray-700">${forecastRevenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Margin</div>
                    <div className="text-sm font-semibold text-gray-700">37.0%</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Est. Demand</div>
                  <div className="text-sm font-semibold text-gray-700">{avgForecastDemand.toLocaleString()} units</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">vs Current</span>
                  <span className={`font-bold ${demandGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {demandGrowth >= 0 ? '+' : ''}{demandGrowth.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Forecast Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Demand Forecast with Confidence Intervals</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Historical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Forecast</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-purple-300"></div>
                <span className="text-gray-600">Confidence Range</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={demandData}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" label={{ value: 'Demand Units', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="none"
                fill="url(#confidenceGradient)"
                fillOpacity={1}
                legendType="none"
              />
              <Area
                type="monotone"
                dataKey="lowerBound"
                stroke="none"
                fill="#fff"
                fillOpacity={1}
                legendType="none"
              />
              
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={(props: any) => {
                  const point = demandData[props.index];
                  if (point?.isAnomaly) {
                    return <circle {...props} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />;
                  }
                  return null;
                }}
                name="Actual Demand"
              />
              
              <Line 
                type="monotone" 
                dataKey="forecast" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                strokeDasharray="8 4"
                dot={false}
                name="Forecast"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Pattern Recognition */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detected Patterns & Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {patterns.map((pattern, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gray-50 ${pattern.color}`}>
                    <pattern.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{pattern.type}</h3>
                    <p className="text-xs text-gray-600">{pattern.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demand Decomposition */}
        <div className="mb-8">
          <button
            onClick={() => setShowDecomposition(!showDecomposition)}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white flex items-center justify-between hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold mb-1">Demand Decomposition Analysis</h2>
                <p className="text-sm text-white/80">Break down demand into trend, seasonal, and residual components</p>
              </div>
            </div>
            {showDecomposition ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>

          {showDecomposition && (
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
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Understanding Demand Decomposition</h3>
                      <p className="text-sm text-gray-600">
                        {showExplainer ? 'Click to hide explanation' : 'Click to learn what these components mean'}
                      </p>
                    </div>
                  </div>
                  {showExplainer ? <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" /> : <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />}
                </button>
                
                {showExplainer && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-4">
                      We break down your historical demand into three key components to help you understand what's driving your sales:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <span className="font-bold text-blue-900">Trend</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          The long-term direction of your demand. Is your business growing, declining, or staying flat over time?
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-5 h-5 text-green-600" />
                          <span className="font-bold text-green-900">Seasonal</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Predictable patterns that repeat. Think weekends vs weekdays, holidays, or seasonal changes in demand.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-orange-600" />
                          <span className="font-bold text-orange-900">Noise</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Random fluctuations that can't be predicted. External events, one-time promotions, or unpredictable factors.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trend Component */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Trend Component</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-4">Your business's overall growth direction</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="trend" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">Overall upward trend of +8.5% growth</p>
                    <p className="text-xs text-gray-600 mt-1">This shows your demand is steadily increasing over time</p>
                  </div>
                </div>

                {/* Seasonal Component */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Seasonal Component</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-4">Repeating patterns in your demand</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="seasonal" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-semibold text-green-900">Weekly patterns: Weekend peaks, midweek lows</p>
                    <p className="text-xs text-gray-600 mt-1">Your demand spikes on weekends and dips midweek</p>
                  </div>
                </div>

                {/* Residual Component */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-bold text-gray-900">Residual (Noise)</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-4">Unpredictable day-to-day variations</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="residual" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm font-semibold text-orange-900">Random variation: ±80 units average</p>
                    <p className="text-xs text-gray-600 mt-1">Normal fluctuations from unexpected events or factors</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Model Comparison & Demand Drivers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Model Accuracy Comparison */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Model Accuracy Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modelAccuracies}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                  {modelAccuracies.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-semibold mb-2">Metrics explained:</p>
              <ul className="space-y-1">
                <li>• <span className="font-medium">MAPE:</span> Mean Absolute Percentage Error (lower is better)</li>
                <li>• <span className="font-medium">RMSE:</span> Root Mean Square Error (lower is better)</li>
                <li>• <span className="font-medium">Accuracy:</span> Overall prediction accuracy</li>
              </ul>
            </div>
          </div>

          {/* Demand Drivers */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Demand Drivers</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={demandDrivers}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="factor" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis tick={{ fontSize: 12 }} />
                <Radar name="Impact Score" dataKey="impact" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {demandDrivers.slice(0, 3).map((driver, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{driver.factor}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${driver.impact}%` }}></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-8">{driver.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scenario Simulator Link */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Run advanced demand scenarios</h2>
                <p className="text-white/90 text-sm mb-3">
                  Test comprehensive demand forecasts with promotions, weather, seasonality, competitor actions,
                  pricing changes, and inventory impacts - all in one place.
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
  );
}
