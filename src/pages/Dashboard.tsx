import { Upload, CheckCircle, AlertCircle, Lightbulb, Search, Zap, FileText, Users, Calendar, ShoppingCart, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, AlertTriangle, Clock, Plus, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { topMovers } from '../data/mockData';
import StatsCard from '../components/StatsCard';
import { useState, useEffect } from 'react';
import type { StatCardData } from '../types';
import { StatCardSkeleton, TableSkeleton, CardSkeleton } from '../components/Skeletons';

interface ManualInputRow {
  id: string;
  [key: string]: string;
}

interface Column {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
}

const presetColumns: Column[] = [
  { id: 'productName', name: 'Product Name', type: 'text' },
  { id: 'sku', name: 'SKU', type: 'text' },
  { id: 'currentPrice', name: 'Current Price ($)', type: 'number' },
  { id: 'category', name: 'Category', type: 'select', options: ['Food', 'Beverage', 'Combo', 'Electronics', 'Clothing', 'Other'] },
  { id: 'salesVolume', name: 'Sales Volume', type: 'number' },
  { id: 'cost', name: 'Cost ($)', type: 'number' },
  { id: 'competitorPrice', name: 'Competitor Price ($)', type: 'number' },
  { id: 'stockLevel', name: 'Stock Level', type: 'number' },
  { id: 'margin', name: 'Margin (%)', type: 'number' },
  { id: 'lastSold', name: 'Last Sold Date', type: 'text' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIBrief, setShowAIBrief] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeColumns, setActiveColumns] = useState<Column[]>([
    { id: 'productName', name: 'Product Name', type: 'text' },
    { id: 'sku', name: 'SKU', type: 'text' },
    { id: 'currentPrice', name: 'Current Price ($)', type: 'number' },
    { id: 'category', name: 'Category', type: 'select', options: ['Food', 'Beverage', 'Combo', 'Electronics', 'Clothing', 'Other'] },
    { id: 'salesVolume', name: 'Sales Volume', type: 'number' },
  ]);
  const [manualRows, setManualRows] = useState<ManualInputRow[]>([
    { id: '1' }
  ]);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [customColumnName, setCustomColumnName] = useState('');
  const [customColumnType, setCustomColumnType] = useState<'text' | 'number'>('text');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const addRow = () => {
    setManualRows([...manualRows, { id: Date.now().toString() }]);
  };

  const deleteRow = (id: string) => {
    if (manualRows.length > 1) {
      setManualRows(manualRows.filter(row => row.id !== id));
    }
  };

  const updateRow = (id: string, field: string, value: string) => {
    setManualRows(manualRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const addColumn = (column: Column) => {
    if (!activeColumns.find(col => col.id === column.id)) {
      setActiveColumns([...activeColumns, column]);
    }
  };

  const addCustomColumn = () => {
    if (customColumnName.trim()) {
      const newColumn: Column = {
        id: `custom_${Date.now()}`,
        name: customColumnName,
        type: customColumnType
      };
      setActiveColumns([...activeColumns, newColumn]);
      setCustomColumnName('');
      setCustomColumnType('text');
    }
  };

  const removeColumn = (columnId: string) => {
    if (activeColumns.length > 1) {
      setActiveColumns(activeColumns.filter(col => col.id !== columnId));
      // Clean up row data for removed column
      setManualRows(manualRows.map(row => {
        const { [columnId]: removed, ...rest } = row;
        return rest as ManualInputRow;
      }));
    }
  };

  const saveManualData = () => {
    const validRows = manualRows.filter(row => 
      Object.keys(row).length > 1 // More than just the id
    );
    console.log('Saving manual data:', validRows);
    alert(`${validRows.length} products saved successfully!`);
  };

  // Calculate action items
  const lowMarginProducts = topMovers.filter(p => (p.margin ?? 0) < 25).length;
  const lowStockProducts = topMovers.filter(p => (p.stockLevel ?? 0) < 20).length;
  const highPotentialProducts = topMovers.filter(p => p.profitGainLoss > 100).length;

  // Stats data
  const statsData: StatCardData[] = [
    {
      icon: 'target',
      value: '47',
      label: 'Opportunities Found',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: 'trending-up',
      value: '$44594.47',
      label: 'Potential Profit Uplift',
      color: 'from-emerald-400 to-cyan-500'
    },
    {
      icon: 'file-text',
      value: '48',
      label: 'Products Optimized',
      color: 'from-amber-400 to-orange-500'
    },
    {
      icon: 'activity',
      value: '-1.200',
      label: 'Average Elasticity',
      color: 'from-red-400 to-pink-500'
    }
  ];

  // Recent activities
  const recentActivities = [
    { icon: TrendingUp, color: 'text-green-500', text: 'Price optimized for Iced Latte 720', time: '2 mins ago' },
    { icon: AlertTriangle, color: 'text-yellow-500', text: 'Low stock alert: Iced Latte 720', time: '15 mins ago' },
    { icon: ShoppingCart, color: 'text-blue-500', text: 'Bulk optimization completed for 12 products', time: '1 hour ago' },
    { icon: FileText, color: 'text-purple-500', text: 'Weekly report generated', time: '2 hours ago' },
    { icon: DollarSign, color: 'text-emerald-500', text: 'Revenue increased by 8.5% this week', time: '3 hours ago' }
  ];

  // Filter top movers by search
  const filteredTopMovers = topMovers.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.includes(searchQuery)
  );

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hello, Asif</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          statsData.map((stat, index) => (
            <StatsCard key={index} data={stat} />
          ))
        )}
      </div>

      {/* AI Daily Brief */}
      <div className="mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowAIBrief(!showAIBrief)}
          className="w-full p-6 text-white flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold mb-1">AI Daily Brief</h2>
              <p className="text-sm text-white/80">{showAIBrief ? 'Click to collapse' : 'Click to view priority insights'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              {highPotentialProducts + lowMarginProducts + lowStockProducts} insights
            </span>
            {showAIBrief ? (
              <ChevronUp className="w-6 h-6" />
            ) : (
              <ChevronDown className="w-6 h-6" />
            )}
          </div>
        </button>
        
        {showAIBrief && (
          <div className="px-6 pb-6 border-t border-white/10 pt-6">
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-white/90 mt-1">•</span>
                <p className="text-white/90">
                  <span className="font-semibold text-white">{highPotentialProducts} products</span> have high profit potential ($100+) - prioritize these for immediate optimization
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-white/90 mt-1">•</span>
                <p className="text-white/90">
                  <span className="font-semibold text-white">{lowMarginProducts} products</span> with margins below 25% need attention to improve profitability
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-white/90 mt-1">•</span>
                <p className="text-white/90">
                  <span className="font-semibold text-white">{lowStockProducts} products</span> are running low on stock - consider dynamic pricing to manage inventory
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <button 
          onClick={() => navigate('/price-optimization')}
          className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-4 hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
        >
          <TrendingUp className="w-6 h-6 mb-2" />
          <div className="font-semibold">Apply Top 5</div>
          <div className="text-sm text-white/80">Quick optimize</div>
        </button>
        <button 
          onClick={() => navigate('/sales-forecasting')}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-4 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
        >
          <FileText className="w-6 h-6 mb-2" />
          <div className="font-semibold">Generate Report</div>
          <div className="text-sm text-white/80">Weekly summary</div>
        </button>
        <button 
          onClick={() => navigate('/bulk-optimization')}
          className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl p-4 hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Users className="w-6 h-6 mb-2" />
          <div className="font-semibold">Bulk Optimize</div>
          <div className="text-sm text-white/80">Multi-product</div>
        </button>
        <button 
          onClick={() => navigate('/demand-forecasting')}
          className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl p-4 hover:from-orange-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Calendar className="w-6 h-6 mb-2" />
          <div className="font-semibold">Schedule Review</div>
          <div className="text-sm text-white/80">Weekly analysis</div>
        </button>
      </div>

      {/* This Week vs Last Week + Recent Activity */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Week Comparison Cards */}
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Week vs Last Week</h3>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-semibold">+8.5%</span>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">$45,320</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">vs $41,780</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</span>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-semibold">+2.3%</span>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">32.8%</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">vs 30.5%</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Products Sold</span>
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <ArrowDownRight className="w-4 h-4" />
                <span className="text-sm font-semibold">-3.2%</span>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">1,247</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">vs 1,288</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700 ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">{activity.text}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
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

      {/* Top Movers Section with Search */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Movers</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          {isLoading ? (
            <TableSkeleton rows={7} columns={6} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Product</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Current Price</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Recommended</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Profit Impact</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Demand Change</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredTopMovers.slice(0, 7).map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {product.id}</div>
                      </td>
                      <td className="text-right py-4 px-6 font-semibold text-gray-900 dark:text-white">
                        ${product.currentPrice.toFixed(2)}
                      </td>
                      <td className="text-right py-4 px-6">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          ${product.recommendedPrice.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-right py-4 px-6">
                        <span className={`font-semibold ${product.profitGainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {product.profitGainLoss >= 0 ? '+' : ''}${product.profitGainLoss.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-right py-4 px-6">
                        <div className="flex items-center justify-end gap-1">
                          {product.demandChange >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                          <span className={`font-medium ${product.demandChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {product.demandChange >= 0 ? '+' : ''}{product.demandChange.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-6">
                        <button
                          onClick={() => navigate(`/price-optimization?productId=${product.id}`)}
                          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Optimize
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Manual Input Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl p-8 mb-6 relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Manual Data Entry</h2>
                <p className="text-white/90">Don't have a CSV? Add your product data manually below</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowColumnPicker(!showColumnPicker)}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Manage Columns
              </button>
              <button
                onClick={saveManualData}
                className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg"
              >
                <Save className="w-5 h-5" />
                Save Data
              </button>
            </div>
          </div>
        </div>

        {/* Column Picker Panel */}
        {showColumnPicker && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Manage Columns</h3>
            
            {/* Active Columns */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Active Columns ({activeColumns.length})</h4>
              <div className="flex flex-wrap gap-2">
                {activeColumns.map((column) => (
                  <div key={column.id} className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium">
                    <span>{column.name}</span>
                    {activeColumns.length > 1 && (
                      <button
                        onClick={() => removeColumn(column.id)}
                        className="hover:bg-indigo-200 rounded p-0.5 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Preset Columns */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Add Preset Columns</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {presetColumns.filter(preset => !activeColumns.find(col => col.id === preset.id)).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => addColumn(preset)}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors text-left"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Column */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Add Custom Column</h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={customColumnName}
                  onChange={(e) => setCustomColumnName(e.target.value)}
                  placeholder="Column name (e.g., Brand, Supplier)"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <select
                  value={customColumnType}
                  onChange={(e) => setCustomColumnType(e.target.value as 'text' | 'number')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                </select>
                <button
                  onClick={addCustomColumn}
                  disabled={!customColumnName.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  {activeColumns.map((column) => (
                    <th key={column.id} className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {column.name}
                    </th>
                  ))}
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {manualRows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    {activeColumns.map((column) => (
                      <td key={column.id} className="py-3 px-4">
                        {column.type === 'select' && column.options ? (
                          <select
                            value={row[column.id] || ''}
                            onChange={(e) => updateRow(row.id, column.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                          >
                            <option value="">Select {column.name.toLowerCase()}</option>
                            {column.options.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={column.type}
                            value={row[column.id] || ''}
                            onChange={(e) => updateRow(row.id, column.id, e.target.value)}
                            placeholder={`Enter ${column.name.toLowerCase()}`}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                          />
                        )}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteRow(row.id)}
                        disabled={manualRows.length === 1}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
            <button
              onClick={addRow}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Row
            </button>
          </div>
        </div>
      </div>

      {/* CSV Upload Section */}
      <div className="bg-gradient-to-r from-red-400 via-orange-400 to-orange-500 rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">CSV File Upload</h2>
              <p className="text-white/90">Upload your product data to analyze pricing optimization opportunities</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <span className="text-white font-semibold">Max 10MB</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-red-300 dark:border-red-700 p-12 text-center hover:border-red-400 dark:hover:border-red-600 transition-colors">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Drag & Drop your CSV file here</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">or click to browse files</p>
              <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-colors inline-flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Choose File
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Supported formats: .csv, .xlsx (max 10MB)
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-colors inline-flex items-center justify-center gap-2">
              <Upload className="w-5 h-5" />
              Upload & Analyze
            </button>
            <button className="px-6 py-3 border-2 border-red-500 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors inline-flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Template
            </button>
          </div>
        </div>

        {/* Upload Tips */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload Tips</h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Include product name, SKU, current price</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Add historical sales data if available</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Ensure data is clean and formatted</p>
                </div>
              </div>

              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Maximum file size: 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
