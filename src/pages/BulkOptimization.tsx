import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { topMovers } from '../data/mockData';
import { CheckSquare, Square, Filter, Zap, DollarSign, TrendingUp, Package, AlertTriangle, ArrowRight } from 'lucide-react';

export default function BulkOptimization() {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMargin, setFilterMargin] = useState('all');
  const [filterStock, setFilterStock] = useState('all');

  const categories = ['all', ...Array.from(new Set(topMovers.map(p => p.category).filter(Boolean)))];

  const filteredProducts = topMovers.filter(product => {
    if (filterCategory !== 'all' && product.category !== filterCategory) return false;
    if (filterMargin === 'low' && (product.margin || 0) >= 30) return false;
    if (filterMargin === 'high' && (product.margin || 0) < 30) return false;
    if (filterStock === 'low' && (product.stockLevel || 0) >= 20) return false;
    if (filterStock === 'high' && (product.stockLevel || 0) < 20) return false;
    return true;
  });

  const toggleProduct = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedProducts(filteredProducts.map(p => p.id));
  };

  const deselectAll = () => {
    setSelectedProducts([]);
  };

  const applyRecommendations = () => {
    alert(`Applied AI recommendations to ${selectedProducts.length} products!`);
  };

  const totalPotentialGain = filteredProducts
    .filter(p => selectedProducts.includes(p.id))
    .reduce((sum, p) => sum + p.profitGainLoss, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Bulk Optimization" />
      
      <div className="p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-2xl p-4">
                <Zap size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Bulk Price Optimization</h1>
                <p className="text-sm opacity-90">Apply AI recommendations to multiple products at once</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Selected Products</div>
              <div className="text-4xl font-bold">{selectedProducts.length}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h2 className="text-lg font-bold text-gray-800">Filters</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profit Margin</label>
              <select
                value={filterMargin}
                onChange={(e) => setFilterMargin(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Margins</option>
                <option value="low">Low (&lt;30%)</option>
                <option value="high">High (≥30%)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Level</label>
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="low">Low Stock (&lt;20)</option>
                <option value="high">High Stock (≥20)</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={selectAll}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium text-sm"
              >
                Select All
              </button>
              <button
                onClick={deselectAll}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {selectedProducts.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Total Potential Gain</span>
                <DollarSign size={24} />
              </div>
              <div className="text-3xl font-bold">${totalPotentialGain.toFixed(2)}</div>
              <div className="text-sm opacity-90 mt-1">From {selectedProducts.length} products</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Avg Gain Per Product</span>
                <TrendingUp size={24} />
              </div>
              <div className="text-3xl font-bold">
                ${(totalPotentialGain / selectedProducts.length).toFixed(2)}
              </div>
              <div className="text-sm opacity-90 mt-1">Estimated increase</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Products Selected</span>
                <Package size={24} />
              </div>
              <div className="text-3xl font-bold">{selectedProducts.length}</div>
              <div className="text-sm opacity-90 mt-1">Ready to optimize</div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <button onClick={selectedProducts.length === filteredProducts.length ? deselectAll : selectAll}>
                        {selectedProducts.length === filteredProducts.length ? 
                          <CheckSquare className="text-blue-600" size={20} /> : 
                          <Square className="text-gray-400" size={20} />
                        }
                      </button>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Current Price</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">AI Recommended</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Margin</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Stock</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Potential Gain</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const isSelected = selectedProducts.includes(product.id);
                  const isLowMargin = (product.margin || 0) < 20;
                  const isLowStock = (product.stockLevel || 0) < 10;
                  
                  return (
                    <tr
                      key={product.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <button onClick={() => toggleProduct(product.id)}>
                          {isSelected ? 
                            <CheckSquare className="text-blue-600" size={20} /> : 
                            <Square className="text-gray-400" size={20} />
                          }
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{product.name}</div>
                        <div className="text-xs text-gray-500">ID: {product.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {product.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-800">
                        ${product.currentPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-blue-600">
                        ${product.recommendedPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isLowMargin && <AlertTriangle size={14} className="text-orange-500" />}
                          <span className={isLowMargin ? 'text-orange-600 font-semibold' : 'text-gray-700'}>
                            {product.margin?.toFixed(1) || 'N/A'}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isLowStock && <AlertTriangle size={14} className="text-red-500" />}
                          <span className={isLowStock ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                            {product.stockLevel || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-bold ${product.profitGainLoss > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.profitGainLoss > 0 ? '+' : ''}${product.profitGainLoss.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Bar */}
        {selectedProducts.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-6 border-2 border-blue-500 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between gap-6">
              <div>
                <div className="text-sm text-gray-600">Ready to optimize</div>
                <div className="text-2xl font-bold text-gray-800">{selectedProducts.length} products selected</div>
                <div className="text-sm text-green-600 font-semibold">Potential gain: +${totalPotentialGain.toFixed(2)}</div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/price-optimization')}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                >
                  Review Individual
                </button>
                <button
                  onClick={applyRecommendations}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg"
                >
                  <Zap size={20} />
                  Apply Recommendations
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
