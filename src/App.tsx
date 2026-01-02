import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Files from './pages/Files';
import PriceOptimization from './pages/PriceOptimization';
import BulkOptimization from './pages/BulkOptimization';
import ProductDetail from './pages/ProductDetail';
import SalesForecasting from './pages/SalesForecasting';
import DemandForecasting from './pages/DemandForecasting';
import InventoryIntelligence from './pages/InventoryIntelligence';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Subscription from './pages/Subscription';
import ComingSoon from './pages/ComingSoon';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page without sidebar */}
        <Route path="/" element={<Landing />} />
        
        {/* App routes with sidebar */}
        <Route path="/dashboard" element={
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <Dashboard />
            </div>
          </div>
        } />
        <Route path="/files" element={
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <Files />
            </div>
          </div>
        } />
        <Route path="/price-optimization" element={
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <PriceOptimization />
            </div>
          </div>
        } />
        <Route path="/bulk-optimization" element={
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <BulkOptimization />
            </div>
          </div>
        } />
        <Route path="/product/:id" element={
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <ProductDetail />
            </div>
          </div>
        } />
        <Route path="/sales-forecasting" element={
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <SalesForecasting />
            </div>
          </div>
        } />
        <Route path="/demand-forecasting" element={
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <DemandForecasting />
            </div>
          </div>
        } />
        <Route path="/inventory-intelligence" element={
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <InventoryIntelligence />
            </div>
          </div>
        } />
        <Route path="/subscription" element={
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <Subscription />
            </div>
          </div>
        } />
        <Route path="/settings" element={
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <Settings />
            </div>
          </div>
        } />
        <Route path="/support" element={
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <Support />
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
