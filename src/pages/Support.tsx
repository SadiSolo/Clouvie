import { useState } from 'react';
import Header from '../components/Header';
import { 
  Search, Book, Video, FileText, MessageCircle, Headphones,
  ChevronRight, CheckCircle, AlertCircle, Zap, TrendingUp,
  DollarSign, Package, Settings, Download, ExternalLink,
  HelpCircle, Lightbulb, PlayCircle, BookOpen, FileQuestion,
  Mail, Phone, Clock, Shield, Rocket, Target
} from 'lucide-react';

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Topics', icon: Book },
    { id: 'getting-started', label: 'Getting Started', icon: Rocket },
    { id: 'pricing', label: 'Price Optimization', icon: DollarSign },
    { id: 'forecasting', label: 'Forecasting', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'account', label: 'Account & Settings', icon: Settings },
  ];

  const quickLinks = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics and set up your account',
      icon: Rocket,
      color: 'from-blue-500 to-blue-600',
      link: '#'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      icon: PlayCircle,
      color: 'from-purple-500 to-purple-600',
      link: '#'
    },
    {
      title: 'Documentation',
      description: 'Comprehensive technical docs',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      link: '#'
    },
    {
      title: 'API Reference',
      description: 'Integrate with our powerful API',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      link: '#'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: MessageCircle,
      color: 'from-pink-500 to-pink-600',
      link: '#'
    },
    {
      title: 'Submit a Ticket',
      description: 'Get help from our support team',
      icon: Mail,
      color: 'from-red-500 to-red-600',
      link: '#'
    },
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I upload my product data?',
      answer: 'Go to the "Your Uploaded Files" section and click the upload button. You can upload CSV, Excel, or JSON files. Our system will automatically detect the format and map your columns. Make sure your file includes product names, prices, and sales history.'
    },
    {
      category: 'getting-started',
      question: 'What data format should I use?',
      answer: 'We support CSV, XLSX, and JSON formats. Your data should include columns for Product ID, Name, Price, Cost, Sales Volume, and Date. Download our sample template from the Files page for reference.'
    },
    {
      category: 'pricing',
      question: 'How does the AI calculate optimal prices?',
      answer: 'Our AI uses machine learning algorithms that analyze historical sales data, competitor pricing, demand elasticity, seasonality, and market trends. It considers multiple factors including your profit margins, inventory levels, and business goals to recommend prices that maximize revenue.'
    },
    {
      category: 'pricing',
      question: 'Can I set price boundaries?',
      answer: 'Yes! You can set minimum and maximum price limits for each product or category. Go to Price Optimization settings and configure your price floors and ceilings. The AI will always respect these boundaries.'
    },
    {
      category: 'pricing',
      question: 'How often should I update prices?',
      answer: 'It depends on your industry. For fast-moving consumer goods, weekly updates work well. For seasonal products, consider daily or real-time adjustments. The dashboard will suggest optimal timing based on your market dynamics.'
    },
    {
      category: 'forecasting',
      question: 'How accurate are the sales forecasts?',
      answer: 'Our AI achieves 90-95% accuracy on average, depending on data quality and market stability. The model improves over time as it learns from your actual sales. You can view accuracy metrics in the Forecasting dashboard.'
    },
    {
      category: 'forecasting',
      question: 'What if my sales patterns are seasonal?',
      answer: 'Our AI automatically detects seasonal patterns and incorporates them into forecasts. It analyzes year-over-year trends, holidays, and special events. You can also manually flag seasonal events in the settings.'
    },
    {
      category: 'forecasting',
      question: 'Can I forecast for new products?',
      answer: 'Yes! For new products without sales history, we use category-based forecasting and market benchmarks. Once you have at least 30 days of sales data, the AI switches to product-specific forecasting.'
    },
    {
      category: 'inventory',
      question: 'How do reorder alerts work?',
      answer: 'The system monitors your inventory levels in real-time and compares them against forecasted demand. When stock falls below the calculated reorder point, you receive an alert with recommended order quantities and timing.'
    },
    {
      category: 'inventory',
      question: 'What is the "Days of Stock" metric?',
      answer: 'Days of Stock shows how many days your current inventory will last based on forecasted sales velocity. It helps you avoid stockouts and optimize cash flow by preventing over-ordering.'
    },
    {
      category: 'inventory',
      question: 'Can I integrate with my warehouse system?',
      answer: 'Yes! We offer integrations with popular warehouse management systems and ERPs. Contact our support team to set up a custom integration via our API.'
    },
    {
      category: 'account',
      question: 'How do I change my subscription plan?',
      answer: 'Go to Settings > Subscription and select "Change Plan". You can upgrade or downgrade anytime. Upgrades take effect immediately, while downgrades apply at the end of your current billing cycle.'
    },
    {
      category: 'account',
      question: 'Can I export my data?',
      answer: 'Absolutely! Go to Settings > Data & Privacy and click "Export Data". You can download all your data in CSV or JSON format. We believe in data portability and transparency.'
    },
    {
      category: 'account',
      question: 'Is my data secure?',
      answer: 'Yes! We use bank-level encryption (AES-256) for data at rest and TLS 1.3 for data in transit. Our infrastructure is SOC 2 certified and GDPR compliant. We never share your data with third parties.'
    },
  ];

  const tutorials = [
    {
      title: 'Setting Up Your First Product',
      duration: '5 min',
      difficulty: 'Beginner',
      icon: Rocket,
      thumbnail: '🎯'
    },
    {
      title: 'Understanding Price Optimization',
      duration: '8 min',
      difficulty: 'Beginner',
      icon: DollarSign,
      thumbnail: '💰'
    },
    {
      title: 'Reading Sales Forecasts',
      duration: '6 min',
      difficulty: 'Beginner',
      icon: TrendingUp,
      thumbnail: '📈'
    },
    {
      title: 'Inventory Management Best Practices',
      duration: '10 min',
      difficulty: 'Intermediate',
      icon: Package,
      thumbnail: '📦'
    },
    {
      title: 'Advanced Price Strategies',
      duration: '12 min',
      difficulty: 'Advanced',
      icon: Target,
      thumbnail: '🎯'
    },
    {
      title: 'Bulk Optimization Workflows',
      duration: '7 min',
      difficulty: 'Intermediate',
      icon: Zap,
      thumbnail: '⚡'
    },
  ];

  const commonIssues = [
    {
      issue: 'Upload fails or data not recognized',
      solution: 'Ensure your CSV/Excel file has headers in the first row and follows our template format. Check that dates are in YYYY-MM-DD format and numbers don\'t contain special characters.',
      icon: AlertCircle,
      color: 'text-red-600'
    },
    {
      issue: 'Forecasts seem inaccurate',
      solution: 'Forecasting requires at least 90 days of historical data for best results. Check that all sales data is complete and there are no missing dates. Accuracy improves over time.',
      icon: TrendingUp,
      color: 'text-orange-600'
    },
    {
      issue: 'Price recommendations too high/low',
      solution: 'Review your profit margin settings and price boundaries. Go to Settings > Business Configuration and adjust your minimum margin requirements and price limits.',
      icon: DollarSign,
      color: 'text-blue-600'
    },
    {
      issue: 'Dashboard loading slowly',
      solution: 'Clear your browser cache and ensure you have a stable internet connection. If issues persist, try reducing the date range or number of products displayed.',
      icon: Zap,
      color: 'text-purple-600'
    },
  ];

  const resources = [
    {
      title: 'Price Optimization Formulas',
      description: 'Technical documentation on our pricing algorithms',
      icon: FileText,
      link: '/docs/price-optimization-formulas.md'
    },
    {
      title: 'Sales Forecasting Methods',
      description: 'Learn about our AI forecasting techniques',
      icon: FileText,
      link: '/docs/sales-forecasting-formulas.md'
    },
    {
      title: 'API Documentation',
      description: 'Integrate Clouvie with your systems',
      icon: Book,
      link: '#'
    },
    {
      title: 'Best Practices Guide',
      description: 'Tips for maximizing your revenue',
      icon: Lightbulb,
      link: '#'
    },
  ];

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#8B1538] to-[#6B0F2A] rounded-full mb-6">
            <Headphones className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Search our knowledge base or browse by category
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, tutorials, or FAQs..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-lg"
                onFocus={(e) => {
                  e.target.style.borderColor = '#8B1538';
                  e.target.style.boxShadow = '0 0 0 4px rgba(139, 21, 56, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href={link.link}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group hover:-translate-y-1"
            >
              <div className={`bg-gradient-to-br ${link.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <link.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {link.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {link.description}
              </p>
              <div className="flex items-center gap-2 text-[#8B1538] font-semibold text-sm">
                Learn more
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>

        {/* Contact Support Banner */}
        <div className="bg-gradient-to-r from-[#8B1538] to-[#6B0F2A] rounded-xl shadow-lg p-8 mb-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Need Personalized Help?</h2>
              <p className="text-white/90">Our support team is available 24/7 to assist you</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:support@clouvie.com"
                className="flex items-center gap-2 bg-white text-[#8B1538] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </a>
              <a
                href="tel:+15551234567"
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Us
              </a>
            </div>
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Video className="w-8 h-8 text-[#8B1538]" />
              Video Tutorials
            </h2>
            <a href="#" className="text-[#8B1538] font-semibold hover:underline flex items-center gap-1">
              View All
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 h-40 flex items-center justify-center text-6xl relative">
                  {tutorial.thumbnail}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all">
                      <PlayCircle className="w-8 h-8 text-[#8B1538] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {tutorial.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {tutorial.duration}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      tutorial.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      tutorial.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {tutorial.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-[#8B1538]" />
            Frequently Asked Questions
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#8B1538] text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="font-bold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                      expandedFaq === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Common Issues */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-[#8B1538]" />
            Common Issues & Solutions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {commonIssues.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className={`${item.color} bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex-shrink-0`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {item.issue}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#8B1538]" />
            Documentation & Resources
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 group hover:-translate-y-1"
              >
                <resource.icon className="w-8 h-8 text-[#8B1538] mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {resource.description}
                </p>
                <div className="flex items-center gap-2 text-[#8B1538] font-semibold text-sm">
                  Read more
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
          <Shield className="w-12 h-12 text-[#8B1538] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Still need help?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you succeed.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="#"
              className="bg-[#8B1538] hover:bg-[#6B0F2A] text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Start Live Chat
            </a>
            <a
              href="#"
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <FileQuestion className="w-5 h-5" />
              Submit a Ticket
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
