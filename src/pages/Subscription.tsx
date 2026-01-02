import { useState } from 'react';
import Header from '../components/Header';
import { 
  CreditCard, Check, X, Zap, TrendingUp, Package, Users,
  ChevronRight, AlertCircle, Download, Receipt, Calendar,
  Shield, Star, Crown, Sparkles, ArrowUpRight, FileText,
  DollarSign, Clock, CheckCircle, Award, Lock, ChevronDown
} from 'lucide-react';

export default function Subscription() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Current subscription data
  const currentPlan = {
    name: 'Pro',
    price: 149,
    billingCycle: 'monthly',
    nextBillingDate: '2026-02-03',
    productsUsed: 427,
    productsLimit: 500,
    status: 'active'
  };

  const plans = [
    {
      name: 'Free',
      tagline: 'Get started with basics',
      monthlyPrice: 0,
      annualPrice: 0,
      badge: null,
      color: 'gray',
      popular: false,
      features: [
        { text: 'Up to 10 products', included: true },
        { text: 'Basic price testing', included: true },
        { text: '7-day forecast', included: true },
        { text: 'Community support', included: true },
        { text: 'CSV export', included: true },
        { text: 'Advanced forecasting', included: false },
        { text: 'Inventory alerts', included: false },
        { text: 'API access', included: false },
        { text: 'Priority support', included: false },
      ]
    },
    {
      name: 'Starter',
      tagline: 'For small businesses',
      monthlyPrice: 49,
      annualPrice: 470, // ~20% discount
      badge: null,
      color: 'blue',
      popular: false,
      features: [
        { text: 'Up to 100 products', included: true },
        { text: 'Full price optimization', included: true },
        { text: '30-day forecasting', included: true },
        { text: 'Demand insights', included: true },
        { text: 'Basic inventory alerts', included: true },
        { text: 'Email support', included: true },
        { text: 'CSV & Excel export', included: true },
        { text: 'API access', included: false },
        { text: 'Custom integrations', included: false },
      ]
    },
    {
      name: 'Pro',
      tagline: 'For growing businesses',
      monthlyPrice: 149,
      annualPrice: 1430, // ~20% discount
      badge: 'Most Popular',
      color: 'red',
      popular: true,
      features: [
        { text: 'Up to 500 products', included: true },
        { text: 'Advanced AI optimization', included: true },
        { text: '90-day forecasting', included: true },
        { text: 'Real-time demand tracking', included: true },
        { text: 'Smart inventory management', included: true },
        { text: 'Priority email & chat support', included: true },
        { text: 'API access', included: true },
        { text: 'Bulk operations', included: true },
        { text: 'Custom reports', included: true },
      ]
    },
    {
      name: 'Scale',
      tagline: 'For large organizations',
      monthlyPrice: 249,
      annualPrice: 2390, // ~20% discount
      badge: 'Enterprise',
      color: 'purple',
      popular: false,
      features: [
        { text: 'Unlimited products', included: true },
        { text: 'Custom AI models', included: true },
        { text: 'Unlimited forecasting', included: true },
        { text: 'Multi-location support', included: true },
        { text: 'Advanced integrations', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom training', included: true },
        { text: '24/7 phone support', included: true },
        { text: 'White-label options', included: true },
      ]
    }
  ];

  const billingHistory = [
    { date: '2026-01-03', amount: 149, status: 'paid', invoice: 'INV-2026-001' },
    { date: '2025-12-03', amount: 149, status: 'paid', invoice: 'INV-2025-012' },
    { date: '2025-11-03', amount: 149, status: 'paid', invoice: 'INV-2025-011' },
    { date: '2025-10-03', amount: 149, status: 'paid', invoice: 'INV-2025-010' },
  ];

  const paymentMethod = {
    type: 'Visa',
    last4: '4242',
    expiry: '12/2027'
  };

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
  };

  const getPriceDisplay = (plan: typeof plans[0]) => {
    const price = getPrice(plan);
    if (billingCycle === 'annual') {
      return {
        main: Math.floor(price / 12),
        period: '/month',
        subtext: `Billed $${price}/year`
      };
    }
    return {
      main: price,
      period: '/month',
      subtext: 'Billed monthly'
    };
  };

  const isCurrentPlan = (planName: string) => {
    return planName === currentPlan.name;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Subscription & Billing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your plan, payment method, and billing history
          </p>
        </div>

        {/* Current Plan Card */}
        <div className="bg-gradient-to-br from-[#8B1538] to-[#6B0F2A] rounded-xl shadow-xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-bold">{currentPlan.name} Plan</h2>
                  <span className="px-3 py-1 bg-green-500 rounded-full text-xs font-bold">
                    ACTIVE
                  </span>
                </div>
                <p className="text-white/90 mb-4">
                  ${currentPlan.price}/{currentPlan.billingCycle}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Next billing: {new Date(currentPlan.nextBillingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>{currentPlan.productsUsed} of {currentPlan.productsLimit} products used</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button className="bg-white text-[#8B1538] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <ArrowUpRight className="w-5 h-5" />
                Upgrade Plan
              </button>
              <button 
                onClick={() => setShowCancelModal(true)}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                Manage Plan
              </button>
            </div>
          </div>

          {/* Usage Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold">Product Usage</span>
              <span>{Math.round((currentPlan.productsUsed / currentPlan.productsLimit) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${(currentPlan.productsUsed / currentPlan.productsLimit) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`font-semibold ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className={`relative w-16 h-8 rounded-full transition-colors ${
              billingCycle === 'annual' ? 'bg-[#8B1538]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                billingCycle === 'annual' ? 'translate-x-8' : ''
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${billingCycle === 'annual' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Annual
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-bold">
              Save 20%
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => {
            const priceDisplay = getPriceDisplay(plan);
            const isCurrent = isCurrentPlan(plan.name);
            
            return (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all hover:shadow-xl ${
                  plan.popular 
                    ? 'border-[#8B1538] ring-4 ring-[#8B1538]/20 scale-105' 
                    : 'border-gray-200 dark:border-gray-700'
                } ${isCurrent ? 'opacity-75' : ''}`}
              >
                <div className="p-6">
                  {/* Plan Header */}
                  <div className="mb-6">
                    {plan.badge && (
                      <div className="inline-block px-3 py-1 bg-[#8B1538] text-white rounded-full text-xs font-bold mb-3">
                        {plan.badge}
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">
                        ${priceDisplay.main}
                      </span>
                      <span className="text-xl text-gray-600 dark:text-gray-400">
                        {priceDisplay.period}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {priceDisplay.subtext}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${
                          feature.included 
                            ? 'text-gray-700 dark:text-gray-300' 
                            : 'text-gray-400 dark:text-gray-600'
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                        plan.popular
                          ? 'bg-[#8B1538] hover:bg-[#6B0F2A] text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                      }`}
                    >
                      {plan.monthlyPrice === 0 ? 'Downgrade' : 'Upgrade to ' + plan.name}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Payment & Billing */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-[#8B1538]" />
                Payment Method
              </h2>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      •••• •••• •••• {paymentMethod.last4}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Expires {paymentMethod.expiry}
                    </p>
                  </div>
                </div>
                <button className="text-[#8B1538] font-semibold hover:underline">
                  Update
                </button>
              </div>

              <button className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />
                Add New Payment Method
              </button>
            </div>

            {/* Billing History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Receipt className="w-6 h-6 text-[#8B1538]" />
                  Billing History
                </h2>
                <button className="text-[#8B1538] font-semibold hover:underline text-sm flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {billingHistory.map((bill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${bill.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(bill.date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase">
                        Paid
                      </span>
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Info & Actions */}
          <div className="space-y-6">
            {/* Benefits Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <Star className="w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold mb-2">Pro Plan Benefits</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Advanced AI optimization
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  90-day forecasting
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  API access included
                </li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Update billing info
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    View all invoices
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Manage team members
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Usage analytics
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">Secure & Protected</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your payment information is encrypted with bank-level security. We never store your full card details.
              </p>
            </div>

            {/* Need Help */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Have questions about billing or want to discuss a custom plan?
              </p>
              <button className="w-full bg-[#8B1538] hover:bg-[#6B0F2A] text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Billing FAQs
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades apply at the end of your billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We accept all major credit cards (Visa, Mastercard, Amex) and offer annual invoicing for enterprise customers.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Is there a money-back guarantee?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Yes! We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment in full.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                How do annual subscriptions work?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Annual plans are billed once per year and include a 20% discount. You'll be notified 30 days before renewal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal (simplified) */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Manage Your Plan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              What would you like to do with your subscription?
            </p>
            <div className="space-y-3">
              <button className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors text-left">
                Pause subscription
              </button>
              <button className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors text-left">
                Downgrade plan
              </button>
              <button className="w-full px-6 py-3 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg font-semibold transition-colors text-left">
                Cancel subscription
              </button>
            </div>
            <button
              onClick={() => setShowCancelModal(false)}
              className="w-full mt-4 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Nevermind
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
