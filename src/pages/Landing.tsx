import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Target, Package, Sparkles, 
  ArrowRight, CheckCircle, AlertCircle, Zap, Users, PlayCircle, 
  ArrowUpRight, ArrowDownRight, Activity, FileText, Calendar, AlertTriangle, Clock,
  DollarSign, ShieldCheck, RefreshCw, ShoppingCart, ChevronRight
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [customPrice, setCustomPrice] = useState(343.08);
  const [customCost, setCustomCost] = useState(236.22);
  const [demandFactor, setDemandFactor] = useState(1.0);
  const [animatedRevenue, setAnimatedRevenue] = useState(12847);
  const [animatedMargin, setAnimatedMargin] = useState(28.4);
  const [animatedProducts, setAnimatedProducts] = useState(247);
  const [waitlistForm, setWaitlistForm] = useState({
    name: '',
    email: '',
    revenue: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Animate dashboard stats
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedRevenue(prev => prev + Math.floor(Math.random() * 50) - 20);
      setAnimatedMargin(prev => Math.min(35, Math.max(25, prev + (Math.random() - 0.5) * 0.5)));
      setAnimatedProducts(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Scroll to waitlist section
  const scrollToWaitlist = () => {
    console.log('scrollToWaitlist called');
    const waitlistSection = document.getElementById('waitlist');
    console.log('waitlistSection found:', waitlistSection);
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Interactive price calculator for hero - Advanced
  const basePrice = 325;
  const baseDemand = 1000;

  // Generate profit curve data
  const profitCurveData = [];
  for (let price = customCost * 1.1; price <= basePrice * 2.4; price += (basePrice * 2.4 - customCost * 1.1) / 40) {
    const demand = baseDemand + (basePrice - price) * 2.5 * demandFactor;
    const profit = (price - customCost) * Math.max(0, demand);
    const revenue = price * Math.max(0, demand);
    profitCurveData.push({
      price: parseFloat(price.toFixed(2)),
      profit: parseFloat(profit.toFixed(0)),
      revenue: parseFloat(revenue.toFixed(0)),
    });
  }

  // Find optimal price
  const optimalPoint = profitCurveData.reduce((max, point) => point.profit > max.profit ? point : max, profitCurveData[0]);

  // Calculate risk level
  const getRiskLevel = () => {
    const priceChange = ((customPrice - basePrice) / basePrice) * 100;
    if (Math.abs(priceChange) < 5) return { level: 'Low Risk', color: 'green', icon: '🟢' };
    if (Math.abs(priceChange) < 15) return { level: 'Moderate Risk', color: 'yellow', icon: '🟡' };
    return { level: 'High Risk', color: 'red', icon: '🔴' };
  };

  const risk = getRiskLevel();
  const priceChangePercent = ((customPrice - basePrice) / basePrice * 100).toFixed(1);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your backend/email service
    console.log('Waitlist submission:', waitlistForm);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      {/* Navigation Header */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-full border border-gray-200 px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left side: Logo and nav links */}
            <div className="flex items-center gap-10">
              <a href="/" className="flex items-center">
                <img src="/src/assets/logo.svg" alt="Clouvie" className="h-12" />
              </a>
              <div className="hidden md:flex items-center gap-8">
                <a 
                  href="#features" 
                  className="text-gray-700 hover:text-[#8B1538] font-medium transition-colors text-base"
                >
                  Features
                </a>
                <a 
                  href="#pricing" 
                  className="text-gray-700 hover:text-[#8B1538] font-medium transition-colors text-base"
                >
                  Pricing
                </a>
              </div>
            </div>

            {/* Right side: CTA buttons */}
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="hidden sm:block px-6 py-2.5 text-gray-700 hover:text-[#8B1538] font-medium transition-colors text-base"
              >
                View Demo
              </a>
              <button
                onClick={scrollToWaitlist}
                className="px-6 py-2.5 bg-gradient-to-r from-[#8B1538] to-[#A51A3F] text-white rounded-full font-semibold hover:shadow-md hover:scale-[1.02] transition-all text-base"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 pt-16">
        {/* Animated background patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative z-10">
          <div className="text-center mb-16">
            {/* Main Headline - Simpler, Bolder */}
            <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight mt-(-10) animate-slideUp">
              <span className="text-[#8B1538] relative inline-block">
                Your Chief Revenue Officer.
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 10 Q50 0, 100 10 T200 10" stroke="#8B1538" strokeWidth="4" fill="none" opacity="0.3"/>
                </svg>
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                On Autopilot.
              </span>
            </h2>

            {/* Sub-headline - One clear benefit */}
            <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fadeIn animation-delay-500">
              See exactly how each pricing decision affects your profit—before you make it.
            </p>

            {/* Key benefits pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-fadeIn animation-delay-1000">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-200">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">No complex setup</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-200">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">AI-powered insights</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-200">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Instant results</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-scaleIn animation-delay-1500">
              <a
                href="/dashboard"
                className="group px-10 py-5 bg-gradient-to-r from-[#8B1538] to-[#A51A3F] text-white rounded-xl font-semibold text-xl hover:shadow-2xl hover:scale-105 transition-all shadow-xl flex items-center gap-2"
              >
                Try the Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button
                onClick={scrollToWaitlist}
                className="px-10 py-5 bg-white text-[#8B1538] rounded-xl font-semibold text-xl hover:shadow-xl hover:scale-105 transition-all border-2 border-[#8B1538]"
              >
                Join Waitlist
              </button>
            </div>

            {/* Trust line with icons */}
            <div className="flex items-center justify-center gap-6 text-gray-500 animate-fadeIn animation-delay-2000">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span>Secure & encrypted</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Demo - Profit Curve & What-If Analysis */}
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              {/* Browser chrome */}
              <div className="bg-gray-800 rounded-t-2xl p-3 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 bg-gray-700 rounded px-4 py-1 text-sm text-gray-400 text-center">
                  app.clouvie.com/price-optimization
                </div>
              </div>
              
              {/* Main demo area with profit curve + what-if panel */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-b-2xl shadow-2xl border-x border-b border-gray-200">
                <div className="grid lg:grid-cols-3 gap-6 p-8">
                  {/* Profit Prediction Curve */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Profit Prediction Curve</h3>
                        <p className="text-xs text-gray-500">Visualize profit at different price points</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-gray-600">Profit</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-gray-600">Revenue</span>
                        </div>
                      </div>
                    </div>

                    {/* SVG Chart */}
                    <div className="relative h-64 bg-gradient-to-br from-gray-50 to-white rounded-lg p-4">
                      <svg viewBox="0 0 600 200" className="w-full h-full">
                        {/* Grid lines */}
                        {[0, 50, 100, 150, 200].map((y) => (
                          <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#E5E7EB" strokeWidth="1" />
                        ))}
                        
                        {/* Profit curve (green) */}
                        <polyline
                          points={profitCurveData.map((d, i) => 
                            `${(i / (profitCurveData.length - 1)) * 600},${200 - (d.profit / Math.max(...profitCurveData.map(p => p.profit)) * 150)}`
                          ).join(' ')}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                        />
                        
                        {/* Profit fill */}
                        <polygon
                          points={
                            `0,200 ` +
                            profitCurveData.map((d, i) => 
                              `${(i / (profitCurveData.length - 1)) * 600},${200 - (d.profit / Math.max(...profitCurveData.map(p => p.profit)) * 150)}`
                            ).join(' ') +
                            ` 600,200`
                          }
                          fill="#10b981"
                          opacity="0.1"
                        />
                        
                        {/* Revenue curve (blue) */}
                        <polyline
                          points={profitCurveData.map((d, i) => 
                            `${(i / (profitCurveData.length - 1)) * 600},${200 - (d.revenue / Math.max(...profitCurveData.map(p => p.revenue)) * 180)}`
                          ).join(' ')}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                        />

                        {/* Current price indicator */}
                        <circle 
                          cx={((customPrice - customCost * 1.1) / (basePrice * 2.4 - customCost * 1.1)) * 600} 
                          cy={200 - (profitCurveData.find(d => Math.abs(d.price - customPrice) < 5)?.profit || 0) / Math.max(...profitCurveData.map(p => p.profit)) * 150}
                          r="6" 
                          fill="#8B1538"
                          stroke="#fff"
                          strokeWidth="2"
                        />

                        {/* Price labels */}
                        <text x="10" y="195" fontSize="10" fill="#6B7280">${(customCost * 1.1).toFixed(0)}</text>
                        <text x="280" y="195" fontSize="10" fill="#6B7280">${(basePrice * 1.6).toFixed(0)}</text>
                        <text x="560" y="195" fontSize="10" fill="#6B7280">${(basePrice * 2.4).toFixed(0)}</text>
                      </svg>

                      {/* Hover tooltip simulation */}
                      <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-sm">
                        <div className="font-semibold text-gray-700 mb-1">${customPrice.toFixed(2)}</div>
                        <div className="text-green-600 text-xs">profit : ${(customPrice - customCost) * (baseDemand + (basePrice - customPrice) * 2.5 * demandFactor) > 0 ? ((customPrice - customCost) * (baseDemand + (basePrice - customPrice) * 2.5 * demandFactor)).toFixed(0) : '0'}</div>
                        <div className="text-blue-600 text-xs">revenue : ${(customPrice * Math.max(0, baseDemand + (basePrice - customPrice) * 2.5 * demandFactor)).toFixed(0)}</div>
                      </div>
                    </div>

                    {/* Optimal Price Point */}
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

                  {/* What-If Analysis Panel */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-6">
                      <Zap className="text-[#8B1538]" size={24} />
                      <h3 className="text-lg font-bold text-gray-800">What-If Analysis</h3>
                    </div>

                    <div className="space-y-6">
                      {/* Test Price Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Test Price</label>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500 text-sm">$</span>
                            <input
                              type="number"
                              value={customPrice.toFixed(2)}
                              onChange={(e) => setCustomPrice(parseFloat(e.target.value) || customCost * 1.1)}
                              step="1"
                              className="w-20 px-2 py-1 border border-[#8B1538] rounded-lg text-base font-bold text-[#8B1538] focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                            />
                          </div>
                        </div>
                        <input
                          type="range"
                          min={customCost * 1.1}
                          max={basePrice * 2.4}
                          step="1"
                          value={customPrice}
                          onChange={(e) => setCustomPrice(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gradient-to-r from-red-200 to-rose-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>${(customCost * 1.1).toFixed(0)}</span>
                          <span>${(basePrice * 2.4).toFixed(0)}</span>
                        </div>
                      </div>

                      {/* Product Cost Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Product Cost</label>
                          <span className="text-base font-bold text-orange-600">${customCost.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min={basePrice * 0.35}
                          max={basePrice * 0.85}
                          step="0.5"
                          value={customCost}
                          onChange={(e) => setCustomCost(parseFloat(e.target.value))}
                          className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            accentColor: '#ea580c'
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>${(basePrice * 0.35).toFixed(0)}</span>
                          <span>${(basePrice * 0.85).toFixed(0)}</span>
                        </div>
                      </div>

                      {/* Demand Elasticity Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Demand Elasticity</label>
                          <span className="text-base font-bold text-blue-600">{demandFactor.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.01"
                          value={demandFactor}
                          onChange={(e) => setDemandFactor(parseFloat(e.target.value))}
                          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            accentColor: '#3b82f6'
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Inelastic (0.5x)</span>
                          <span>Elastic (2x)</span>
                        </div>
                      </div>

                      {/* Risk Indicator */}
                      <div className={`p-4 rounded-lg border-2 ${
                        risk.color === 'green' ? 'bg-green-50 border-green-200' :
                        risk.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{risk.icon}</div>
                          <div className="flex-1">
                            <div className={`font-bold ${
                              risk.color === 'green' ? 'text-green-700' :
                              risk.color === 'yellow' ? 'text-yellow-700' :
                              'text-red-700'
                            }`}>
                              {risk.level}
                            </div>
                            <div className="text-xs text-gray-600">
                              {priceChangePercent}% price change
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clear Value Proposition - What It Actually Does */}
      <section className="py-20 bg-gradient-to-br from-[#8B1538] to-[#6B0F2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Here's Exactly What Clouvie Does For You
            </h2>
            <p className="text-xl text-rose-100 max-w-3xl mx-auto">
              Stop wondering "what if?" and start seeing clear answers before making any decision
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Use Case 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl p-8 border-2 border-red-200">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Price Any Product in Seconds
              </h3>
              <p className="text-gray-700 mb-4">
                Drag a slider. See exactly how much profit you'll make. No guessing, no spreadsheets, no math.
              </p>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <div className="text-sm text-gray-600 mb-2">Example:</div>
                <div className="font-semibold" style={{color: '#8B1538'}}>
                  "Should I charge $14.99 or $16.99?"
                </div>
                <div className="text-sm text-gray-700 mt-2">
                  → Instant answer: $16.99 makes you $850 more profit/month ✅
                </div>
              </div>
            </div>

            {/* Use Case 2 */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 border-2 border-red-200">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Know Next Month's Sales Today
              </h3>
              <p className="text-gray-700 mb-4">
                AI predicts your sales so you can order the right amount of stock and plan cash flow.
              </p>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <div className="text-sm text-gray-600 mb-2">Example:</div>
                <div className="font-semibold" style={{color: '#8B1538'}}>
                  "Will December be better than November?"
                </div>
                <div className="text-sm text-gray-700 mt-2">
                  → Prediction: 1,250 units (±150), 18% higher than November 📈
                </div>
              </div>
            </div>

            {/* Use Case 3 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Never Run Out of Stock Again
              </h3>
              <p className="text-gray-700 mb-4">
                Get alerts before you run out. Know exactly when and how much to reorder.
              </p>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="text-sm text-gray-600 mb-2">Example:</div>
                <div className="font-semibold text-green-600">
                  "When should I reorder Product X?"
                </div>
                <div className="text-sm text-gray-700 mt-2">
                  → Order 350 units by March 15 to avoid stockout 🎯
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Flow Section - Like Base44 */}
      <section className="py-32 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-[#8B1538] font-semibold mb-4">HOW IT WORKS</p>
            <h2 className="text-5xl font-bold text-gray-900">
              Three steps to better decisions
            </h2>
          </div>

          {/* Step 1 */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <div className="inline-block px-4 py-2 bg-red-100 text-[#8B1538] rounded-full font-semibold mb-6">
                Step 1
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Test any price instantly
              </h3>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Drag a slider or type a number. See immediate impact on demand, revenue, and profit. No formulas, no calculations—just clear answers.
              </p>
              <a href="/dashboard" className="text-[#8B1538] font-semibold text-lg hover:text-[#6B0F2A]">
                Try the price simulator →
              </a>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-xl p-2 backdrop-blur-sm">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Price Optimization Engine</h3>
                    <p className="text-xs opacity-80">AI-powered pricing intelligence</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                  <Sparkles className="text-yellow-300" size={16} />
                  <span className="text-xs font-semibold">Live</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 mb-4">
                {/* Strategy Presets */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-gray-800">Quick Strategy Presets</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="p-2 rounded-lg border-2 border-purple-500 bg-purple-50 text-center shadow-sm">
                      <div className="text-lg mb-1">🎯</div>
                      <div className="text-xs font-bold text-purple-700">Max Profit</div>
                    </div>
                    <div className="p-2 rounded-lg border border-gray-200 bg-white text-center hover:border-purple-300 transition-colors cursor-pointer">
                      <div className="text-lg mb-1">📈</div>
                      <div className="text-xs font-semibold text-gray-600">Revenue</div>
                    </div>
                    <div className="p-2 rounded-lg border border-gray-200 bg-white text-center hover:border-purple-300 transition-colors cursor-pointer">
                      <div className="text-lg mb-1">🏆</div>
                      <div className="text-xs font-semibold text-gray-600">Leader</div>
                    </div>
                    <div className="p-2 rounded-lg border border-gray-200 bg-white text-center hover:border-purple-300 transition-colors cursor-pointer">
                      <div className="text-lg mb-1">⚖️</div>
                      <div className="text-xs font-semibold text-gray-600">Balanced</div>
                    </div>
                    <div className="p-2 rounded-lg border border-gray-200 bg-white text-center hover:border-purple-300 transition-colors cursor-pointer">
                      <div className="text-lg mb-1">💎</div>
                      <div className="text-xs font-semibold text-gray-600">Premium</div>
                    </div>
                  </div>
                </div>

                {/* Product selector */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">C</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">Premium Coffee Blend</div>
                    <div className="text-xs text-gray-600">Current: <span className="font-semibold">$12.99</span> → AI Optimal: <span className="font-semibold text-purple-600">$14.49</span></div>
                  </div>
                </div>

                {/* Scenario Comparison Cards */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-lg">📊</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">Current</div>
                    <div className="text-lg font-bold text-gray-900">$4,623</div>
                    <div className="text-xs text-gray-500">monthly profit</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 text-center border-2 border-indigo-400 shadow-sm">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div className="text-xs text-gray-600 mb-1">AI Recommended</div>
                    <div className="text-lg font-bold text-indigo-600">$5,847</div>
                    <div className="text-xs text-green-600 font-semibold">+$1,224 (+26.5%)</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-lg">🎯</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">Your Test</div>
                    <div className="text-lg font-bold text-purple-600">$5,621</div>
                    <div className="text-xs text-green-600 font-semibold">+$998 (+21.6%)</div>
                  </div>
                </div>

                {/* Interactive Price Slider */}
                <div className="mb-4 p-4 bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Test Any Price</span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <span className="text-2xl font-bold text-purple-600">14.49</span>
                    </div>
                  </div>
                  <div className="relative mb-2">
                    <div className="h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full relative shadow-inner">
                      <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-lg border-2 border-white" style={{left: '62%'}}></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="font-medium">$8.00</span>
                    <span className="text-green-600 font-semibold">● Optimal Zone</span>
                    <span className="font-medium">$20.00</span>
                  </div>
                </div>

                {/* Profit Curve Visualization */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 mb-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700">Profit Prediction Curve</span>
                    <span className="text-xs text-gray-500">Real-time AI analysis</span>
                  </div>
                  <svg viewBox="0 0 240 70" className="w-full h-16">
                    {/* Grid lines */}
                    <line x1="0" y1="60" x2="240" y2="60" stroke="#E5E7EB" strokeWidth="1" />
                    <line x1="0" y1="40" x2="240" y2="40" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="0" y1="20" x2="240" y2="20" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="2,2" />
                    {/* Shaded area under curve */}
                    <path
                      d="M 0,60 L 0,55 Q 60,50 120,12 T 240,45 L 240,60 Z"
                      fill="url(#gradient1)"
                      opacity="0.3"
                    />
                    {/* Profit curve */}
                    <path
                      d="M 0,55 Q 60,50 120,12 T 240,45"
                      fill="none"
                      stroke="#8B1538"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Optimal point marker */}
                    <circle cx="120" cy="12" r="4" fill="#10b981" stroke="#fff" strokeWidth="2" />
                    {/* Current price marker */}
                    <circle cx="75" cy="48" r="3" fill="#6B7280" stroke="#fff" strokeWidth="1.5" />
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8B1538" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#8B1538" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-gray-600">Lower Price</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-green-600 font-bold">Optimal: $14.49</span>
                    </div>
                    <span className="text-gray-600">Higher Price</span>
                  </div>
                </div>

                {/* AI Confidence Meter */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-bold text-green-700">AI Confidence Level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{width: '92%'}}></div>
                    </div>
                    <span className="text-base font-bold text-green-700">92%</span>
                  </div>
                </div>
              </div>

              {/* Risk Assessment Badge */}
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 text-white">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">Risk Level:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🟢</span>
                  <span className="text-sm font-bold">Low Risk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
            <div className="order-2 md:order-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-xl p-2 backdrop-blur-sm">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Sales Forecasting</h3>
                    <p className="text-xs opacity-80">AI-Powered Demand Prediction</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                  <Sparkles className="text-yellow-300" size={16} />
                  <span className="text-xs font-semibold">94% Accuracy</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 mb-4">
                {/* Control Panel */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Product</label>
                    <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white font-medium">
                      <option>Premium Coffee Blend</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Period</label>
                    <div className="grid grid-cols-2 gap-1">
                      <button className="px-2 py-2 text-xs bg-indigo-600 text-white rounded-lg font-semibold shadow-sm">30d</button>
                      <button className="px-2 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">90d</button>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-3 text-white shadow-md">
                    <div className="flex items-center justify-between mb-1">
                      <Package className="w-5 h-5 opacity-80" />
                      <TrendingUp className="w-3.5 h-3.5 opacity-80" />
                    </div>
                    <div className="text-xl font-bold mb-0.5">1,158</div>
                    <div className="text-xs opacity-90 mb-1">Avg Daily Sales</div>
                    <div className="text-xs font-semibold text-blue-100">+8.2%</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-3 text-white shadow-md">
                    <div className="flex items-center justify-between mb-1">
                      <DollarSign className="w-5 h-5 opacity-80" />
                      <Sparkles className="w-3.5 h-3.5 opacity-80" />
                    </div>
                    <div className="text-xl font-bold mb-0.5">$43k</div>
                    <div className="text-xs opacity-90">Proj. Revenue</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-3 text-white shadow-md">
                    <div className="flex items-center justify-between mb-1">
                      <Target className="w-5 h-5 opacity-80" />
                      <TrendingUp className="w-3.5 h-3.5 opacity-80" />
                    </div>
                    <div className="text-xl font-bold mb-0.5">$15k</div>
                    <div className="text-xs opacity-90">Proj. Profit</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-3 text-white shadow-md">
                    <div className="flex items-center justify-between mb-1">
                      <Activity className="w-5 h-5 opacity-80" />
                      <ShieldCheck className="w-3.5 h-3.5 opacity-80" />
                    </div>
                    <div className="text-xl font-bold mb-0.5">94%</div>
                    <div className="text-xs opacity-90">AI Accuracy</div>
                  </div>
                </div>

                {/* Forecast Chart */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-bold text-gray-900">30-Day Sales Forecast</div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-blue-500 rounded"></span>
                        <span className="text-gray-600 font-medium">Historical</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-0.5 border-t-2 border-dashed border-purple-500"></span>
                        <span className="text-gray-600 font-medium">Forecast</span>
                      </span>
                    </div>
                  </div>
                  <svg viewBox="0 0 320 110" className="w-full">
                    {/* Grid lines */}
                    <line x1="10" y1="90" x2="310" y2="90" stroke="#E5E7EB" strokeWidth="1" />
                    <line x1="10" y1="65" x2="310" y2="65" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="10" y1="40" x2="310" y2="40" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="10" y1="15" x2="310" y2="15" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="160" y1="10" x2="160" y2="95" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="3,3" />
                    
                    {/* Confidence band */}
                    <path
                      d="M 160,65 L 185,60 L 210,56 L 235,52 L 260,48 L 285,44 L 310,40 L 310,58 L 285,63 L 260,68 L 235,73 L 210,78 L 185,82 L 160,85 Z"
                      fill="#A78BFA"
                      opacity="0.2"
                    />
                    
                    {/* Historical data (solid line) */}
                    <path
                      d="M 10,75 L 35,72 L 60,78 L 85,68 L 110,70 L 135,66 L 160,65"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    
                    {/* Forecast line (dashed) */}
                    <path
                      d="M 160,65 L 185,60 L 210,56 L 235,52 L 260,48 L 285,44 L 310,40"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="2.5"
                      strokeDasharray="5,4"
                      strokeLinecap="round"
                    />
                    
                    {/* Current point marker */}
                    <circle cx="160" cy="65" r="4" fill="#3B82F6" stroke="#fff" strokeWidth="2" />
                    {/* Forecast endpoint */}
                    <circle cx="310" cy="40" r="4" fill="#8B5CF6" stroke="#fff" strokeWidth="2" />
                    
                    {/* Y-axis labels */}
                    <text x="2" y="93" fontSize="9" fill="#6B7280">800</text>
                    <text x="2" y="68" fontSize="9" fill="#6B7280">1000</text>
                    <text x="2" y="43" fontSize="9" fill="#6B7280">1200</text>
                    <text x="2" y="18" fontSize="9" fill="#6B7280">1400</text>
                  </svg>
                  <div className="flex items-center justify-center text-xs mt-2 text-gray-500">
                    <span className="font-medium">Timeline: Past 15 days → Next 15 days</span>
                  </div>
                </div>

                {/* Forecast Results */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1 font-medium">Next Week</div>
                    <div className="text-lg font-bold text-gray-900">312</div>
                    <div className="text-xs text-gray-500">units</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-300 shadow-sm">
                    <div className="text-xs text-gray-600 mb-1 font-medium">Next Month</div>
                    <div className="text-lg font-bold text-purple-600">1,247</div>
                    <div className="text-xs text-gray-600 font-semibold">±89 units</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1 font-medium">Next Quarter</div>
                    <div className="text-lg font-bold text-gray-900">3,815</div>
                    <div className="text-xs text-gray-500">units</div>
                  </div>
                </div>

                {/* What-If Scenarios */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-300">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-gray-900">What-If Scenario Analysis</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    <div className="bg-white rounded-lg p-2 text-center border border-gray-200 shadow-sm hover:border-red-300 transition-colors cursor-pointer">
                      <div className="text-xs font-bold text-red-600">-15%</div>
                      <div className="text-xs text-gray-600 mt-0.5">Deep Discount</div>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center border border-gray-200 shadow-sm hover:border-orange-300 transition-colors cursor-pointer">
                      <div className="text-xs font-bold text-orange-600">-10%</div>
                      <div className="text-xs text-gray-600 mt-0.5">Moderate</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-2 text-center border-2 border-blue-400 shadow-sm">
                      <div className="text-xs font-bold text-blue-700">0%</div>
                      <div className="text-xs text-gray-800 mt-0.5 font-semibold">Base</div>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center border border-gray-200 shadow-sm hover:border-purple-300 transition-colors cursor-pointer">
                      <div className="text-xs font-bold text-purple-600">+5%</div>
                      <div className="text-xs text-gray-600 mt-0.5">Increase</div>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center border border-gray-200 shadow-sm hover:border-pink-300 transition-colors cursor-pointer">
                      <div className="text-xs font-bold text-pink-600">+12%</div>
                      <div className="text-xs text-gray-600 mt-0.5">Premium</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast Method Badge */}
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 text-white">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm font-semibold">Forecast Method:</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-bold">AI Multi-Factor Model</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block px-4 py-2 bg-rose-100 text-rose-700 rounded-full font-semibold mb-6">
                Step 2
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Know what's coming
              </h3>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                AI predicts next month's sales with 94% accuracy. Plan inventory, staff, and cash flow with confidence.
              </p>
              <a href="/dashboard" className="text-rose-700 font-semibold text-lg hover:text-rose-800">
                See forecasts →
              </a>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full font-semibold mb-6">
                Step 3
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Never run out of stock
              </h3>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Get alerts before you run out. Know exactly when and how much to reorder. Stop tying up cash in slow-moving inventory.
              </p>
              <a href="/dashboard" className="text-green-600 font-semibold text-lg hover:text-green-700">
                Check inventory →
              </a>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-xl p-2 backdrop-blur-sm">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Inventory Intelligence Hub</h3>
                    <p className="text-xs opacity-80">AI-powered inventory optimization</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                  <Zap className="text-yellow-300" size={16} />
                  <span className="text-xs font-semibold">Smart Alerts</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 mb-4">
                {/* Control Panel */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Product</label>
                    <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white font-medium">
                      <option>Premium Coffee Blend</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Period</label>
                    <div className="grid grid-cols-2 gap-1">
                      <button className="px-2 py-2 text-xs bg-emerald-600 text-white rounded-lg font-semibold shadow-sm">30d</button>
                      <button className="px-2 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">90d</button>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white text-center shadow-md">
                    <div className="flex items-center justify-center mb-1">
                      <Package className="w-5 h-5 opacity-80" />
                    </div>
                    <div className="text-xl font-bold mb-0.5">127</div>
                    <div className="text-xs opacity-90">Current Stock</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-3 text-white text-center shadow-md">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-5 h-5 opacity-80" />
                    </div>
                    <div className="text-xl font-bold mb-0.5">12</div>
                    <div className="text-xs opacity-90">Days Left</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white text-center shadow-md">
                    <div className="flex items-center justify-center mb-1">
                      <RefreshCw className="w-5 h-5 opacity-80" />
                    </div>
                    <div className="text-xl font-bold mb-0.5">8.2x</div>
                    <div className="text-xs opacity-90">Turnover</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-3 text-white text-center shadow-md">
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign className="w-5 h-5 opacity-80" />
                    </div>
                    <div className="text-xl font-bold mb-0.5">$3.2k</div>
                    <div className="text-xs opacity-90">Carrying Cost</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-3 text-white text-center shadow-md">
                    <div className="flex items-center justify-center mb-1">
                      <Activity className="w-5 h-5 opacity-80" />
                    </div>
                    <div className="text-xl font-bold mb-0.5">82</div>
                    <div className="text-xs opacity-90">Health Score</div>
                  </div>
                </div>

                {/* Stock Alerts */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-gray-700" />
                      <span className="text-sm font-bold text-gray-900">Active Stock Alerts</span>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">2 Critical</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-3 shadow-sm">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs font-bold text-gray-900 mb-0.5">Iced Latte 720 - Critical Stockout Risk</div>
                          <div className="text-xs text-gray-700">Order immediately • Only 3 days of stock remaining</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-3 shadow-sm">
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs font-bold text-gray-900 mb-0.5">Espresso Double Shot - Reorder Soon</div>
                          <div className="text-xs text-gray-700">Approaching reorder point • 7 days remaining</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Level Monitoring Chart */}
                <div className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-lg p-4 mb-4 border border-emerald-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-900">Stock Level Monitoring</span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-blue-500"></span>
                        <span className="text-gray-600 font-medium">Current</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-500"></span>
                        <span className="text-gray-600 font-medium">Reorder</span>
                      </span>
                    </div>
                  </div>
                  <svg viewBox="0 0 280 90" className="w-full">
                    {/* Grid lines */}
                    <line x1="10" y1="75" x2="270" y2="75" stroke="#E5E7EB" strokeWidth="1" />
                    <line x1="10" y1="55" x2="270" y2="55" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="10" y1="35" x2="270" y2="35" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="10" y1="15" x2="270" y2="15" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="2,2" />
                    
                    {/* Reorder point line */}
                    <line x1="10" y1="50" x2="270" y2="50" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4,3" />
                    
                    {/* Safety stock zone */}
                    <rect x="10" y="50" width="260" height="25" fill="#FEF3C7" opacity="0.3" />
                    
                    {/* Stock level area */}
                    <path
                      d="M 10,30 L 40,28 L 70,32 L 100,38 L 130,50 L 160,58 L 190,52 L 220,48 L 250,45 L 270,43 L 270,75 L 10,75 Z"
                      fill="#3B82F6"
                      opacity="0.25"
                    />
                    {/* Stock level line */}
                    <path
                      d="M 10,30 L 40,28 L 70,32 L 100,38 L 130,50 L 160,58 L 190,52 L 220,48 L 250,45 L 270,43"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    
                    {/* Critical point markers */}
                    <circle cx="160" cy="58" r="3" fill="#DC2626" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="270" cy="43" r="3" fill="#3B82F6" stroke="#fff" strokeWidth="1.5" />
                    
                    {/* Labels */}
                    <text x="12" y="47" fontSize="9" fill="#F59E0B" fontWeight="700">Reorder Point</text>
                    <text x="12" y="72" fontSize="9" fill="#6B7280" fontWeight="600">Safety Stock</text>
                    
                    {/* Y-axis labels */}
                    <text x="2" y="78" fontSize="8" fill="#6B7280">0</text>
                    <text x="2" y="58" fontSize="8" fill="#6B7280">200</text>
                    <text x="2" y="38" fontSize="8" fill="#6B7280">400</text>
                    <text x="2" y="18" fontSize="8" fill="#6B7280">600</text>
                  </svg>
                  <div className="text-xs text-center mt-2 text-gray-500">
                    <span className="font-medium">30-Day Stock Level Trend</span>
                  </div>
                </div>

                {/* Reorder Recommendations */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-300 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-gray-900">AI Reorder Recommendations</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-emerald-200">
                      <div className="flex-1">
                        <div className="text-xs font-bold text-gray-900 mb-0.5">Iced Latte 720</div>
                        <div className="text-xs text-gray-600">Stock: 85 units • Reorder Point: 200</div>
                      </div>
                      <div className="text-right ml-3">
                        <div className="text-sm font-bold text-emerald-600">500 units</div>
                        <div className="text-xs text-gray-600">$1,250</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-emerald-200">
                      <div className="flex-1">
                        <div className="text-xs font-bold text-gray-900 mb-0.5">Cappuccino Mix</div>
                        <div className="text-xs text-gray-600">Stock: 180 units • Reorder Point: 150</div>
                      </div>
                      <div className="text-right ml-3">
                        <div className="text-sm font-bold text-emerald-600">400 units</div>
                        <div className="text-xs text-gray-600">$800</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optimization Status Badge */}
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 text-white">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-semibold">Stock Health:</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-300" style={{width: '82%'}}></div>
                  </div>
                  <span className="text-sm font-bold">82/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clear Value Proposition - What It Actually Does */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Rehearse Decisions,
              <br />
              <span className="text-[#8B1538]">
                Not Just Report Results
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Price Tester */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 bg-[#8B1538] rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Test Any Price—Instantly
              </h3>

              {/* Realistic demo mockup */}
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-4 mb-4 border-2 border-purple-200 shadow-sm">
                <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">Current Price:</span>
                    <span className="text-base font-bold text-gray-700">$12.99</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-600">New Price:</span>
                    <span className="text-xl font-bold text-[#8B1538]">$14.49</span>
                  </div>
                  
                  {/* Price slider */}
                  <div className="h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full relative mb-3">
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#8B1538] rounded-full shadow-lg border-2 border-white" style={{left: '65%'}}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200">
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="text-base">💰</span> Profit:
                    </span>
                    <span className="text-sm font-bold text-green-600">+$1,235/month</span>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200">
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="text-base">📊</span> Sales:
                    </span>
                    <span className="text-sm font-bold text-gray-700">-44 units</span>
                  </div>
                  <div className="flex items-center justify-between bg-green-50 rounded-lg p-2 border-2 border-green-300">
                    <span className="text-xs text-gray-700 font-semibold flex items-center gap-1">
                      <span className="text-base">✅</span> Worth it?
                    </span>
                    <span className="text-sm font-bold text-green-600">YES</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Drag the slider. See what happens. No math, no guessing—just clear answers.
              </p>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full px-4 py-2 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                style={{backgroundColor: '#8B1538'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B0F2A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8B1538'}
              >
                Try it in full demo
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature 2: Demand Predictor */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{background: '#8B1538'}}>
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Know What's Coming Next Month
              </h3>

              {/* Realistic forecast chart */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border-2 border-indigo-200 shadow-sm">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700">30-Day Forecast</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-0.5 bg-blue-500"></span>
                        <span className="text-gray-600">Past</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-0.5 border-t-2 border-dashed border-[#8B1538]"></span>
                        <span className="text-gray-600">Future</span>
                      </span>
                    </div>
                  </div>
                  <svg className="w-full h-20" viewBox="0 0 240 70">
                    {/* Grid */}
                    <line x1="0" y1="60" x2="240" y2="60" stroke="#E5E7EB" strokeWidth="0.5" />
                    <line x1="0" y1="40" x2="240" y2="40" stroke="#E5E7EB" strokeWidth="0.5" />
                    <line x1="0" y1="20" x2="240" y2="20" stroke="#E5E7EB" strokeWidth="0.5" />
                    <line x1="120" y1="0" x2="120" y2="65" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="2,2" />
                    
                    {/* Past (blue line) */}
                    <path
                      d="M 0,55 L 30,52 L 60,56 L 90,48 L 120,45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    
                    {/* Confidence area */}
                    <path
                      d="M 120,45 L 150,42 L 180,40 L 210,38 L 240,35 L 240,48 L 210,50 L 180,52 L 150,54 L 120,55 Z"
                      fill="#8B1538"
                      opacity="0.15"
                    />
                    
                    {/* Future (maroon dashed) */}
                    <path
                      d="M 120,45 L 150,42 L 180,40 L 210,38 L 240,35"
                      fill="none"
                      stroke="#8B1538"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      strokeLinecap="round"
                    />
                    
                    {/* Markers */}
                    <circle cx="120" cy="45" r="3" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="240" cy="35" r="3" fill="#8B1538" stroke="#fff" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="mt-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 font-semibold">Next Month Prediction:</div>
                    <div className="text-lg font-bold" style={{color: '#8B1538'}}>1,250 units <span className="text-sm text-gray-600">(±150)</span></div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Our AI looks at your past sales and tells you what to expect. Plan inventory, staff, and promotions with confidence.
              </p>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full px-4 py-2 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                style={{backgroundColor: '#8B1538'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B0F2A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8B1538'}
              >
                See the full forecast
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature 3: Stock Optimizer */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <Package className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Never Run Out, Never Over-Order
              </h3>

              {/* Realistic inventory mockup */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 mb-4 border-2 border-emerald-200 shadow-sm">
                <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                  <div className="flex items-center justify-center h-24 mb-3">
                    <div className="relative w-40 h-20">
                      {/* Gauge arc background */}
                      <svg className="w-full h-full" viewBox="0 0 100 50">
                        {/* Background arc */}
                        <path d="M 10,45 A 40,40 0 0,1 90,45" fill="none" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                        {/* Colored segments */}
                        <path d="M 10,45 A 40,40 0 0,1 30,20" fill="none" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
                        <path d="M 30,20 A 40,40 0 0,1 50,10" fill="none" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
                        <path d="M 50,10 A 40,40 0 0,1 70,20" fill="none" stroke="#FCD34D" strokeWidth="8" strokeLinecap="round" />
                        <path d="M 70,20 A 40,40 0 0,1 90,45" fill="none" stroke="#10B981" strokeWidth="8" strokeLinecap="round" />
                        {/* Needle */}
                        <line x1="50" y1="45" x2="62" y2="25" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="50" cy="45" r="3" fill="#1F2937" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold">
                      <CheckCircle className="w-4 h-4" />
                      Perfect Amount
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-lg p-3 shadow-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-orange-900 mb-1">Reorder Alert</div>
                      <div className="text-xs text-orange-700 font-semibold">Order 350 units by March 15</div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                We tell you exactly when to reorder and how much. Stop tying up cash in slow-moving stock.
              </p>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                Check your inventory
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table - Why Clouvie vs Others */}
      <section className="py-20 bg-gradient-to-b from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Clouvie vs. Your Current Way?
            </h2>
            <p className="text-xl text-gray-600">
              See the difference in seconds, not hours
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/3">Task</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-red-600">Without Clouvie</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-green-600 bg-green-50">With Clouvie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">Price 100 Products</td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    <div className="mb-1">8 Hours in Excel</div>
                    <div className="text-sm text-red-600">Guessing Margin</div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900 bg-green-50">
                    <div className="mb-1 font-bold">30 Sec</div>
                    <div className="text-sm text-green-600">AI-Optimized</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">Sales Forecast</td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    <div className="mb-1">Manual Calculations</div>
                    <div className="text-sm text-red-600">Often wrong by 15-25%</div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900 bg-green-50">
                    <div className="mb-1 font-bold">Instant Prediction</div>
                    <div className="text-sm text-green-600">98% accuracy</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">Inventory Planning</td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    <div className="mb-1">Check each SKU manually</div>
                    <div className="text-sm text-red-600">Miss reorder dates</div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900 bg-green-50">
                    <div className="mb-1 font-bold">Auto alerts</div>
                    <div className="text-sm text-green-600">Never run out</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">Competitor Tracking</td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    <div className="mb-1">Visit Websites manually</div>
                    <div className="text-sm text-red-600">Data is outdated</div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900 bg-green-50">
                    <div className="mb-1 font-bold">Real time dashboard</div>
                    <div className="text-sm text-green-600">Always current</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">Cost</td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    <div className="mb-1">500-5000$ /month</div>
                    <div className="text-sm text-red-600">Consultants/Tools</div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900 bg-green-50">
                    <div className="mb-1 font-bold" style={{color: '#8B1538'}}>49$ /month</div>
                    <div className="text-sm text-green-600">All in one</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center mt-12">
            <p className="text-2xl font-bold text-gray-900 mb-4">
              Save 10+ hours per week. Make better decisions in seconds.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
              style={{background: '#8B1538'}}
              onMouseEnter={(e) => e.currentTarget.style.background = '#6B0F2A'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#8B1538'}
            >
              See It In Action →
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-gradient-to-br from-[#8B1538] via-[#7A1230] to-[#6B0F2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Beautiful. Powerful. Simple.
            </h2>
            <p className="text-xl text-white/90">
              See your entire business at a glance
            </p>
          </div>

          {/* Browser mockup */}
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Browser chrome */}
              <div className="bg-gray-800 rounded-t-2xl p-3 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 bg-gray-700 rounded px-4 py-1 text-sm text-gray-400 text-center">
                  clouvie.app/dashboard
                </div>
              </div>

              {/* Dashboard content */}
              <div className="bg-white rounded-b-2xl p-8 shadow-2xl">
                {/* Stats Cards - 4 cards matching actual dashboard */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {/* Opportunities Found */}
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-5 shadow-lg border border-indigo-200">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white mb-3">
                      <Target className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">47</div>
                    <div className="text-xs text-gray-600">Opportunities Found</div>
                  </div>

                  {/* Potential Profit Uplift */}
                  <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-5 shadow-lg border border-emerald-200">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 text-white mb-3">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">$44,594</div>
                    <div className="text-xs text-gray-600">Potential Profit Uplift</div>
                  </div>

                  {/* Products Optimized */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 shadow-lg border border-amber-200">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white mb-3">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">48</div>
                    <div className="text-xs text-gray-600">Products Optimized</div>
                  </div>

                  {/* Average Elasticity */}
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-5 shadow-lg border border-red-200">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-red-400 to-pink-500 text-white mb-3">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">-1.200</div>
                    <div className="text-xs text-gray-600">Average Elasticity</div>
                  </div>
                </div>

                {/* AI Daily Brief */}
                <div className="mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl overflow-hidden">
                  <div className="p-5 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold">AI Daily Brief</h3>
                        <p className="text-xs text-white/80">Priority insights</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                      12 insights
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg p-4 text-center">
                    <TrendingUp className="w-5 h-5 mb-1 mx-auto" />
                    <div className="text-xs font-semibold">Apply Top 5</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg p-4 text-center">
                    <FileText className="w-5 h-5 mb-1 mx-auto" />
                    <div className="text-xs font-semibold">Generate Report</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-lg p-4 text-center">
                    <Users className="w-5 h-5 mb-1 mx-auto" />
                    <div className="text-xs font-semibold">Bulk Optimize</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg p-4 text-center">
                    <Calendar className="w-5 h-5 mb-1 mx-auto" />
                    <div className="text-xs font-semibold">Schedule Review</div>
                  </div>
                </div>

                {/* Week Comparison & Top Movers */}
                <div className="grid grid-cols-2 gap-4">
                  {/* This Week vs Last Week */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">This Week vs Last Week</h3>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Revenue</span>
                          <div className="flex items-center gap-1 text-green-600">
                            <ArrowUpRight className="w-3 h-3" />
                            <span className="text-xs font-semibold">+8.5%</span>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900">$45,320</span>
                          <span className="text-xs text-gray-500">vs $41,780</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Profit Margin</span>
                          <div className="flex items-center gap-1 text-green-600">
                            <ArrowUpRight className="w-3 h-3" />
                            <span className="text-xs font-semibold">+2.3%</span>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900">32.8%</span>
                          <span className="text-xs text-gray-500">vs 30.5%</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Products Sold</span>
                          <div className="flex items-center gap-1 text-red-600">
                            <ArrowDownRight className="w-3 h-3" />
                            <span className="text-xs font-semibold">-3.2%</span>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900">1,247</span>
                          <span className="text-xs text-gray-500">vs 1,288</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Movers Table Preview */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Movers</h3>
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="text-left py-2 px-3 font-semibold text-gray-700">Product</th>
                            <th className="text-right py-2 px-3 font-semibold text-gray-700">Impact</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr className="hover:bg-gray-50">
                            <td className="py-2 px-3">
                              <div className="font-medium text-gray-900">Iced Latte 720</div>
                              <div className="text-gray-500">ID: SKU-720</div>
                            </td>
                            <td className="text-right py-2 px-3">
                              <span className="font-semibold text-green-600">+$423.80</span>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-2 px-3">
                              <div className="font-medium text-gray-900">Caramel Frappe</div>
                              <div className="text-gray-500">ID: SKU-340</div>
                            </td>
                            <td className="text-right py-2 px-3">
                              <span className="font-semibold text-green-600">+$387.20</span>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-2 px-3">
                              <div className="font-medium text-gray-900">Vanilla Latte</div>
                              <div className="text-gray-500">ID: SKU-156</div>
                            </td>
                            <td className="text-right py-2 px-3">
                              <span className="font-semibold text-green-600">+$342.60</span>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-2 px-3">
                              <div className="font-medium text-gray-900">Espresso Shot</div>
                              <div className="text-gray-500">ID: SKU-089</div>
                            </td>
                            <td className="text-right py-2 px-3">
                              <span className="font-semibold text-green-600">+$298.40</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-white text-[#8B1538] rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl inline-flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Try Live Demo
            </button>
            <p className="mt-4 text-white/80">No signup required • Takes 2 minutes</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business size
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Get started with basics</p>
              
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-xl text-gray-600">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 min-h-[280px]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Up to 10 products</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Basic price testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">7-day forecast</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Community support</span>
                </li>
              </ul>

              <button
                onClick={scrollToWaitlist}
                className="w-full px-6 py-3 bg-[#8B1538] text-white rounded-lg font-semibold hover:bg-[#6B0F2A] transition-colors"
              >
                Join Waitlist
              </button>
            </div>

            {/* Starter Tier */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">For small businesses</p>
              
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">$49</span>
                  <span className="text-xl text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">$1.63 per day</p>
              </div>

              <ul className="space-y-3 mb-8 min-h-[280px]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Up to 100 products</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Full price optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">30-day forecasting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Demand insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Basic inventory alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Email support</span>
                </li>
              </ul>

              <button
                onClick={scrollToWaitlist}
                className="w-full px-6 py-3 bg-[#8B1538] text-white rounded-lg font-semibold hover:bg-[#6B0F2A] transition-colors"
              >
                Join Waitlist
              </button>
            </div>

            {/* Growth Tier - Most Popular */}
            <div className="bg-white rounded-2xl shadow-2xl border-4 p-8 relative transform scale-105" style={{borderColor: '#8B1538'}}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#8B1538] text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                ⚡ MOST POPULAR
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth</h3>
              <p className="text-gray-600 mb-6">For growing businesses</p>
              
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold" style={{color: '#8B1538'}}>$129</span>
                  <span className="text-xl text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">$4.30 per day</p>
              </div>

              <ul className="space-y-3 mb-8 min-h-[280px]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: '#8B1538'}} />
                  <span className="text-sm">Up to 1,000 products</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: '#8B1538'}} />
                  <span className="text-sm">Advanced price optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: '#8B1538'}} />
                  <span className="text-sm">90-day forecasting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: '#8B1538'}} />
                  <span className="text-sm">Demand & inventory intelligence</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: '#8B1538'}} />
                  <span className="text-sm">Smart reorder alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: '#8B1538'}} />
                  <span className="text-sm">API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: '#8B1538'}} />
                  <span className="text-sm">Priority support</span>
                </li>
              </ul>

              <button
                onClick={scrollToWaitlist}
                className="w-full px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
                style={{background: '#8B1538'}}
              >
                Join Waitlist
              </button>
            </div>

            {/* Scale Tier */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Scale</h3>
              <p className="text-gray-600 mb-6">For large organizations</p>
              
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">$249</span>
                  <span className="text-xl text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">$8.30 per day</p>
              </div>

              <ul className="space-y-3 mb-8 min-h-[280px]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited products</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Custom AI models</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Multi-location support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Advanced integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Custom training</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">24/7 phone support</span>
                </li>
              </ul>

              <button
                onClick={scrollToWaitlist}
                className="w-full px-6 py-3 bg-[#8B1538] text-white rounded-lg font-semibold hover:bg-[#6B0F2A] transition-colors"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-20" style={{background: 'linear-gradient(to bottom right, #8B1538, #A51A3F, #B91646)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Stop Guessing?
            </h2>
            <p className="text-2xl mb-4" style={{color: 'rgba(255, 255, 255, 0.9)'}}>
              Join 1,247+ businesses on the waitlist
            </p>
            <p className="text-lg" style={{color: 'rgba(255, 255, 255, 0.9)'}}>
              🚀 Launching soon
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleWaitlistSubmit} className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={waitlistForm.name}
                    onChange={(e) => setWaitlistForm({ ...waitlistForm, name: e.target.value })}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none transition-all"
                    style={{'--focus-border-color': '#8B1538'} as any}
                    onFocus={(e) => {e.target.style.borderColor = '#8B1538'; e.target.style.boxShadow = '0 0 0 4px rgba(139, 21, 56, 0.1)';}}
                    onBlur={(e) => {e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none';}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={waitlistForm.email}
                    onChange={(e) => setWaitlistForm({ ...waitlistForm, email: e.target.value })}
                    placeholder="john@yourbusiness.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none transition-all"
                    onFocus={(e) => {e.target.style.borderColor = '#8B1538'; e.target.style.boxShadow = '0 0 0 4px rgba(139, 21, 56, 0.1)';}}
                    onBlur={(e) => {e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none';}}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Revenue (Optional)
                </label>
                <select
                  value={waitlistForm.revenue}
                  onChange={(e) => setWaitlistForm({ ...waitlistForm, revenue: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none transition-all"
                  onFocus={(e) => {e.currentTarget.style.borderColor = '#8B1538'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139, 21, 56, 0.1)';}}
                  onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}}
                >
                  <option value="">Select range...</option>
                  <option value="under-50k">Under $50K</option>
                  <option value="50k-100k">$50K - $100K</option>
                  <option value="100k-500k">$100K - $500K</option>
                  <option value="500k-1m">$500K - $1M</option>
                  <option value="1m-5m">$1M - $5M</option>
                  <option value="5m-plus">$5M+</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                style={{background: '#8B1538'}}
                onMouseEnter={(e) => e.currentTarget.style.background = '#6B0F2A'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#8B1538'}
              >
                <Users className="w-5 h-5" />
                Secure My Spot on Waitlist
              </button>

              <p className="text-sm text-gray-600 mt-4 text-center">
                🔒 We respect your privacy. No spam, ever.
              </p>
            </form>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                You're On The List! 🎉
              </h3>
              <p className="text-xl text-gray-600 mb-6">
                Check your email for confirmation and next steps.
              </p>
              <p className="text-gray-600">
                Want to see the full demo now?
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 px-8 py-3 text-white rounded-xl font-semibold transition-all"
                style={{background: '#8B1538'}}
                onMouseEnter={(e) => e.currentTarget.style.background = '#6B0F2A'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#8B1538'}
              >
                Try Full Demo
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: '#8B1538'}}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Clouvie</span>
              </div>
              <p className="text-gray-400">
                Your Chief Revenue Officer on Automation
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors cursor-pointer">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Clouvie. All rights reserved.</p>
            <p className="text-sm mt-2">Made with ❤️ for small businesses</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
