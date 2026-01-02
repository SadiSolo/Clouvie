import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  FileUp, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Package,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  Home,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  
  const menuItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/files', icon: FileUp, label: 'Your Uploaded Files' },
    { path: '/price-optimization', icon: DollarSign, label: 'Price Optimization' },
    { path: '/sales-forecasting', icon: TrendingUp, label: 'Sales Forecasting' },
    { path: '/demand-forecasting', icon: Activity, label: 'Demand Forecasting' },
    { path: '/inventory-intelligence', icon: Package, label: 'Inventory Intelligence' },
    { path: '/subscription', icon: CreditCard, label: 'Subscription' },
    { path: '/settings', icon: Settings, label: 'Setting' },
    { path: '/support', icon: HelpCircle, label: 'Support' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-screen flex flex-col border-r border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <img src="/src/assets/logo.svg" alt="Clouvie" className="h-32 w-full" />
      </div>

      {/* Back to Homepage Button */}
      <div className="px-4 mb-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all border-2 border-gray-200 dark:border-gray-700"
        >
          <Home size={20} />
          <span className="text-sm font-medium">Back to Homepage</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#8B1538] text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Join Waitlist CTA */}
      <div className="px-4">
        <div className="bg-gradient-to-br from-[#8B1538] to-[#6B0F2A] rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold text-sm">Like what you see?</span>
          </div>
          <p className="text-xs text-white/80 mb-3">
            Join the waitlist to get early access when we launch!
          </p>
          <button
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const waitlistElement = document.getElementById('waitlist');
                if (waitlistElement) {
                  waitlistElement.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            className="w-full bg-white text-[#8B1538] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-all"
          >
            Join Waitlist
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 pb-3">
        <button className="flex items-center gap-3 px-4 py-2.5 w-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
