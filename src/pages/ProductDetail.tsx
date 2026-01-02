import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Lightbulb, TrendingUp, DollarSign, Award, BarChart3 } from 'lucide-react';

export default function ProductDetail() {
  const navigate = useNavigate();
  const [customPrice, setCustomPrice] = useState(320);
  const [activeTab, setActiveTab] = useState('profit');

  // Generate profit curve data
  const profitData = Array.from({ length: 30 }, (_, i) => {
    const price = 280 + i * 10;
    const demand = 60 - (price - 280) * 0.08;
    const profit = demand * (price - 275.59) * 0.15;
    return { price, profit };
  });

  // Generate demand curve data
  const demandData = Array.from({ length: 30 }, (_, i) => {
    const price = 280 + i * 10;
    const demand = 1 - (price - 280) * 0.002;
    return { price, demand };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard" />
      
      <div className="p-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/price-optimization')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Product Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Chicken Pepperoni & Cheese Bagel</h1>

        {/* Product Analysis Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 rounded-2xl p-4">
              <BarChart3 className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Product Analysis</h2>
              <p className="text-sm opacity-90">Comprehensive overview and model information</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Model Information */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📊</span> Model Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-90">R²:</span>
                  <span className="font-semibold">0.067</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Adj. R²:</span>
                  <span className="font-semibold">0.043</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">F-statistic:</span>
                  <span className="font-semibold">2.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Observations:</span>
                  <span className="font-semibold">122</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Model Type:</span>
                  <span className="font-semibold">OLS</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Method:</span>
                  <span className="font-semibold">Least Squares</span>
                </div>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📈</span> Analysis Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-90">Elasticity:</span>
                  <span className="font-semibold">-0.9181</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Current Price:</span>
                  <span className="font-semibold text-lg">$393.70</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Product Cost:</span>
                  <span className="font-semibold">$275.59</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Analysis Date:</span>
                  <span className="font-semibold">22 Jun, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Recommended Price:</span>
                  <span className="font-semibold text-lg text-teal-300">$343.08</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Profit Uplift:</span>
                  <span className="font-semibold text-green-300">$6.21</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optimization Actions */}
        <div className="bg-green-500 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <Lightbulb size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Price Optimization</h3>
              <p className="text-sm opacity-90">AI-powered recommendations for maximum profitability</p>
            </div>
          </div>
        </div>

        {/* Price Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-gray-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Product Cost</p>
                <p className="text-2xl font-bold text-gray-800">$275.59</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-gray-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Price</p>
                <p className="text-2xl font-bold text-gray-800">$393.70</p>
              </div>
            </div>
          </div>

          <div className="bg-teal-500 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs opacity-90">Recommended Price</p>
                <p className="text-2xl font-bold">$343.08</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Predicted Profit Uplift */}
          <div className="bg-green-100 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-green-700">Expected Profit Uplift</p>
                <p className="text-3xl font-bold text-green-700">$6.21 <span className="text-lg">(7.2%)</span></p>
              </div>
            </div>
          </div>

          {/* Demand Change */}
          <div className="bg-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-blue-700">Demand Change</p>
                <p className="text-3xl font-bold text-blue-700">0.19 units <span className="text-lg">(44.4%)</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* What-if Analysis */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 rounded-xl p-3">
              <span className="text-2xl">🔮</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">What-If Analysis</h3>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold">Set Custom Price: ${customPrice.toFixed(2)}</label>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">394</span>
            </div>
            <input
              type="range"
              min="280"
              max="500"
              value={customPrice}
              onChange={(e) => setCustomPrice(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-xs opacity-75">
              <span>$280</span>
              <span>$500</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-sm opacity-90">Predicted Demand</p>
              <p className="text-3xl font-bold">4 <span className="text-sm">(Units/Day)</span></p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-sm opacity-90">Predicted Profit</p>
              <p className="text-3xl font-bold">$-556.44 <span className="text-sm">(Total)</span></p>
            </div>
          </div>
        </div>

        {/* Analytical Charts */}
        <div className="bg-blue-400 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-xl p-3">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Analytical Charts</h3>
                <p className="text-sm opacity-90">Visualize profit and demand curves</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('profit')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'profit' ? 'bg-white text-blue-600' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                Profit Curve
              </button>
              <button 
                onClick={() => setActiveTab('demand')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'demand' ? 'bg-white text-blue-600' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                Demand Curve
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <ResponsiveContainer width="100%" height={400}>
              {activeTab === 'profit' ? (
                <LineChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="price" 
                    label={{ value: 'Price ($)', position: 'insideBottom', offset: -5 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    label={{ value: 'Profit', angle: -90, position: 'insideLeft' }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fill="url(#colorProfit)"
                    fillOpacity={0.2}
                  />
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </LineChart>
              ) : (
                <LineChart data={demandData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="price" 
                    label={{ value: 'Price ($)', position: 'insideBottom', offset: -5 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    label={{ value: 'Demand (Units/Day)', angle: -90, position: 'insideLeft' }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="demand" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fill="url(#colorDemand)"
                    fillOpacity={0.2}
                  />
                  <defs>
                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Key Metrics: Price Elasticity</h3>
          <p className="text-sm opacity-90 mb-6">Core analytical insights</p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">↔️</span>
                <p className="text-sm opacity-90">Price Elasticity</p>
              </div>
              <p className="text-4xl font-bold text-green-300">-0.9181</p>
              <p className="text-xs mt-2 opacity-75">(Elastic) Price change has a strong effect on demand</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="text-white" size={24} />
                <p className="text-sm opacity-90">Product Cost</p>
              </div>
              <p className="text-4xl font-bold">$275.59</p>
              <p className="text-xs mt-2 opacity-75">The baseline cost for producing one unit</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="text-white" size={24} />
                <p className="text-sm opacity-90">Model Quality</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="px-3 py-1 bg-blue-500 rounded-full text-sm font-bold">R²: 0.067</span>
                <span className="px-3 py-1 bg-purple-500 rounded-full text-sm font-bold">Low</span>
              </div>
              <p className="text-xs mt-2 opacity-75">Based on 92 observations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
