import { useState } from 'react';
import Header from '../components/Header';
import { productAnalysisData } from '../data/mockData';
import { FileText, ExternalLink, Search } from 'lucide-react';

export default function Files() {
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const columns = Object.keys(productAnalysisData[0] || {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard" />
      
      <div className="p-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-2xl p-4">
                <FileText size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Product Analysis</h1>
                <p className="text-sm opacity-90">Comprehensive overview of your product data</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-sm font-semibold">📦 10 Products</span>
            </div>
          </div>
        </div>

        {/* Table Controls */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select 
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Search:</span>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg pl-3 pr-10 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search..."
                />
                <Search className="absolute right-3 top-2 text-gray-400" size={16} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {columns.slice(0, 8).map((column) => (
                    <th key={column} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-500">📊</span>
                        {column.replace(/_/g, ' ')}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productAnalysisData.slice(0, entriesPerPage).map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    {columns.slice(0, 8).map((column) => (
                      <td key={column} className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {column === 'BILL_NUMBER' ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <FileText className="text-indigo-600" size={16} />
                            </div>
                            <span className="font-medium">{row[column]}</span>
                            <ExternalLink className="text-gray-400 cursor-pointer hover:text-indigo-600" size={14} />
                          </div>
                        ) : (
                          String(row[column])
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Info */}
          <div className="mt-4 text-sm text-gray-600">
            Showing 1 to {Math.min(entriesPerPage, productAnalysisData.length)} of {productAnalysisData.length} entries
          </div>
        </div>

        {/* File Information Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-teal-400 to-emerald-500 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">ℹ️</span>
              </div>
              <h3 className="text-xl font-bold">File Details</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs opacity-80">📄 File Name</p>
                <p className="font-semibold">Jan_Mar_25_Item_Wise_Data_ip2io4nj.csv</p>
              </div>
              <div>
                <p className="text-xs opacity-80">📊 Total Rows</p>
                <p className="font-bold text-2xl">17177</p>
              </div>
              <div>
                <p className="text-xs opacity-80">📋 Columns</p>
                <p className="font-bold text-2xl">57</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">🔖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Column Headers</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {columns.map((col, idx) => (
                <span 
                  key={idx}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    idx % 4 === 0 ? 'bg-teal-100 text-teal-700' :
                    idx % 4 === 1 ? 'bg-purple-100 text-purple-700' :
                    idx % 4 === 2 ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}
                >
                  {col.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
