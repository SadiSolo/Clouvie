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
  const [customScenario, setCustomScenario] = useState({
    promotionIntensity: 0,
    priceChange: 0,
    marketingSpend: 0,
    competitorPromotion: 0,
    weatherImpact: 1,
    holidayEffect: 0
  });

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
  const forecastData = demandData.filter(d => d.forecast > 0);

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

  // Calculate custom scenario impact
  const calculateScenarioImpact = () => {
    const { promotionIntensity, priceChange, marketingSpend, competitorPromotion, weatherImpact, holidayEffect } = customScenario;
    
    const baseDemand = 1200;
    const elasticity = -1.5;
    
    const promoEffect = (promotionIntensity / 100) * 0.4;
    const priceEffect = elasticity * (priceChange / 100);
    const marketingEffect = Math.log(1 + marketingSpend / 1000) * 0.12;
    const competitorEffect = -(competitorPromotion / 100) * 0.25;
    const weatherEffect = (weatherImpact - 1);
    const holidayBoost = (holidayEffect / 100) * 0.35;
    
    const totalImpact = promoEffect + priceEffect + marketingEffect + competitorEffect + weatherEffect + holidayBoost;
    const newDemand = baseDemand * (1 + totalImpact);
    const demandChange = totalImpact * 100;
    
    return {
      newDemand: Math.round(newDemand),
      demandChange,
      breakdown: {
        promotion: promoEffect * 100,
        price: priceEffect * 100,
        marketing: marketingEffect * 100,
        competitor: competitorEffect * 100,
        weather: weatherEffect * 100,
        holiday: holidayBoost * 100
      }
    };
  };

  const scenarioImpact = calculateScenarioImpact();

  // Risk metrics
  const volatility = 12.5;
  const anomalyCount = demandData.filter(d => d.isAnomaly).length;
  const riskScore = Math.min(100, volatility * 2 + anomalyCount * 5);

  return (
    <div>
      <Header />
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

        {/* What-If Scenario Builder */}
        <div className="mb-8">
          <button
            onClick={() => setShowScenarios(!showScenarios)}
            className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-2xl p-6 text-white flex items-center justify-between hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 transition-all mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold mb-1">What-If Scenario Builder</h2>
                <p className="text-sm text-white/80">Simulate various market conditions and their impact on demand</p>
              </div>
            </div>
            {showScenarios ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>

          {showScenarios && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Scenario Controls */}
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Megaphone className="w-4 h-4" />
                      Promotion Intensity (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={customScenario.promotionIntensity}
                      onChange={(e) => setCustomScenario({ ...customScenario, promotionIntensity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>0%</span>
                      <span className="font-bold text-indigo-600">{customScenario.promotionIntensity}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4" />
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
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Target className="w-4 h-4" />
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
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Users className="w-4 h-4" />
                      Competitor Promotion (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={customScenario.competitorPromotion}
                      onChange={(e) => setCustomScenario({ ...customScenario, competitorPromotion: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>0%</span>
                      <span className="font-bold text-indigo-600">{customScenario.competitorPromotion}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <CloudRain className="w-4 h-4" />
                      Weather Impact
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.1"
                      value={customScenario.weatherImpact}
                      onChange={(e) => setCustomScenario({ ...customScenario, weatherImpact: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>0.5x (Bad)</span>
                      <span className="font-bold text-indigo-600">{customScenario.weatherImpact}x</span>
                      <span>1.5x (Good)</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4" />
                      Holiday Effect (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={customScenario.holidayEffect}
                      onChange={(e) => setCustomScenario({ ...customScenario, holidayEffect: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>0%</span>
                      <span className="font-bold text-indigo-600">{customScenario.holidayEffect}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCustomScenario({ 
                      promotionIntensity: 0, 
                      priceChange: 0, 
                      marketingSpend: 0, 
                      competitorPromotion: 0, 
                      weatherImpact: 1, 
                      holidayEffect: 0 
                    })}
                    className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Scenario
                  </button>
                </div>

                {/* Results */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Scenario Impact Analysis</h3>
                  
                  {/* Overall Impact */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">{scenarioImpact.newDemand}</div>
                      <div className="text-sm text-gray-600 mb-1">Projected Demand (units)</div>
                      <div className={`text-lg font-bold ${scenarioImpact.demandChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {scenarioImpact.demandChange >= 0 ? '+' : ''}{scenarioImpact.demandChange.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">vs baseline (1,200 units)</div>
                    </div>
                  </div>

                  {/* Impact Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Factor Breakdown:</h4>
                    {Object.entries(scenarioImpact.breakdown).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">{key}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${value >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(Math.abs(value), 100)}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-semibold w-16 text-right ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {value >= 0 ? '+' : ''}{value.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Insights */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-blue-900 text-sm mb-1">AI Insights</div>
                        <p className="text-xs text-blue-700">
                          {scenarioImpact.demandChange > 20 
                            ? "Strong demand surge predicted. Consider increasing inventory and staffing levels."
                            : scenarioImpact.demandChange < -20
                            ? "Significant demand drop expected. Reduce inventory and consider promotional activities."
                            : "Moderate demand change. Current inventory levels should be sufficient."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Anomaly & Risk Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Anomaly Detection Timeline</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={(props: any) => {
                    const point = historicalData[props.index];
                    if (point?.isAnomaly) {
                      return <circle {...props} r={8} fill="#ef4444" stroke="#fff" strokeWidth={2} />;
                    }
                    return <circle {...props} r={3} fill="#3b82f6" />;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
              <p>Red dots indicate detected anomalies where demand deviated significantly from expected patterns.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Assessment</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Overall Risk</span>
                  <span className={`text-lg font-bold ${riskScore < 30 ? 'text-green-600' : riskScore < 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {riskScore.toFixed(0)}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${riskScore < 30 ? 'bg-green-500' : riskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${riskScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Volatility</span>
                  <span className="font-semibold text-yellow-600">{volatility}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Anomalies</span>
                  <span className="font-semibold text-red-600">{anomalyCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Confidence Level</span>
                  <span className="font-semibold text-green-600">85%</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-700">
                    {riskScore < 30 
                      ? "Low risk. Demand is stable and predictable."
                      : riskScore < 60
                      ? "Moderate risk. Monitor closely for changes."
                      : "High risk. Demand is volatile. Consider safety stock."}
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
