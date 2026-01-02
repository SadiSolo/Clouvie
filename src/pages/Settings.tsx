import { useState } from 'react';
import Header from '../components/Header';
import { 
  User, Mail, Building, Phone, Globe, Bell, Palette, DollarSign, Calendar, 
  Clock, Shield, Database, Download, Trash2, Save, RefreshCw, 
  AlertCircle, Check, Settings as SettingsIcon, Moon, Sun, Target,
  Package, Lock, Eye, EyeOff, ChevronRight, Users
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'display' | 'business' | 'alerts' | 'security' | 'data'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Settings State
  const [profile, setProfile] = useState({
    fullName: 'Asif Rahman',
    email: 'asif@clouvie.com',
    phone: '+1 (555) 123-4567',
    company: 'Clouvie Inc.',
    role: 'Business Manager',
    timezone: 'America/New_York'
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    stockoutAlerts: true,
    priceChangeAlerts: true,
    lowMarginAlerts: true,
    weeklyReports: true,
    monthlyReports: false,
    criticalOnly: false
  });

  // Display Settings State
  const [display, setDisplay] = useState({
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    language: 'en',
    compactView: false,
    showAnimations: true
  });

  // Business Configuration State
  const [business, setBusiness] = useState({
    defaultMargin: 25,
    taxRate: 8.5,
    operatingHours: '9:00 AM - 6:00 PM',
    fiscalYearStart: 'January',
    inventoryMethod: 'FIFO',
    roundingPrecision: 2
  });

  // Alert Thresholds State
  const [thresholds, setThresholds] = useState({
    lowStockThreshold: 100,
    highStockThreshold: 1000,
    minMarginAlert: 15,
    maxPriceChangeAlert: 10,
    demandSpikeThreshold: 50
  });

  // Security Settings State
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: 30
  });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'display' as const, label: 'Display', icon: Palette },
    { id: 'business' as const, label: 'Business', icon: Building },
    { id: 'alerts' as const, label: 'Alert Thresholds', icon: AlertCircle },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'data' as const, label: 'Data Management', icon: Database }
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' }
  ];
  const inventoryMethods = ['FIFO', 'LIFO', 'Average Cost'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Settings" />

      <div className="p-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <SettingsIcon size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Settings & Preferences</h1>
                <p className="text-sm opacity-90">Customize your Clouvie experience</p>
              </div>
            </div>
            {saveSuccess && (
              <div className="flex items-center gap-2 bg-green-500 rounded-lg px-4 py-2">
                <Check size={20} />
                <span className="text-sm font-semibold">Settings Saved!</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm sticky top-8">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                      <ChevronRight size={16} className="ml-auto" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
              
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>
                  <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        AR
                      </div>
                      <div>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium mb-2">
                          Change Photo
                        </button>
                        <p className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG or GIF. Max size 2MB</p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <User className="inline w-4 h-4 mr-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Mail className="inline w-4 h-4 mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Phone className="inline w-4 h-4 mr-2" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Building className="inline w-4 h-4 mr-2" />
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={profile.company}
                          onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Users className="inline w-4 h-4 mr-2" />
                          Role
                        </label>
                        <input
                          type="text"
                          value={profile.role}
                          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Globe className="inline w-4 h-4 mr-2" />
                          Timezone
                        </label>
                        <select
                          value={profile.timezone}
                          onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="Europe/London">London (GMT)</option>
                          <option value="Asia/Tokyo">Tokyo (JST)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                      <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-3" />
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">Stay Informed</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Choose how and when you want to receive notifications about your business metrics and alerts.
                      </p>
                    </div>

                    {/* Notification Toggles */}
                    <div className="space-y-4">
                      {[
                        { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive important alerts via email' },
                        { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications for real-time updates' },
                        { key: 'stockoutAlerts', label: 'Stockout Warnings', description: 'Get notified when products are low on stock' },
                        { key: 'priceChangeAlerts', label: 'Price Change Alerts', description: 'Notifications when prices are adjusted' },
                        { key: 'lowMarginAlerts', label: 'Low Margin Alerts', description: 'Alert when product margins fall below threshold' },
                        { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly performance summary' },
                        { key: 'monthlyReports', label: 'Monthly Reports', description: 'Comprehensive monthly analytics report' },
                        { key: 'criticalOnly', label: 'Critical Only Mode', description: 'Only receive high-priority notifications' }
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{label}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
                          </div>
                          <button
                            onClick={() => setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[key as keyof typeof notifications] ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Display Settings */}
              {activeTab === 'display' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Display & Appearance</h2>
                  <div className="space-y-6">
                    {/* Theme Toggle */}
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Theme Mode</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleTheme}
                          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all"
                        >
                          {theme === 'dark' ? (
                            <>
                              <Moon className="w-5 h-5 text-indigo-600" />
                              <span className="font-semibold text-gray-900 dark:text-white">Dark Mode</span>
                            </>
                          ) : (
                            <>
                              <Sun className="w-5 h-5 text-amber-500" />
                              <span className="font-semibold text-gray-900">Light Mode</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Display Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <DollarSign className="inline w-4 h-4 mr-2" />
                          Currency
                        </label>
                        <select
                          value={display.currency}
                          onChange={(e) => setDisplay({ ...display, currency: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {currencies.map(curr => (
                            <option key={curr} value={curr}>{curr}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Calendar className="inline w-4 h-4 mr-2" />
                          Date Format
                        </label>
                        <select
                          value={display.dateFormat}
                          onChange={(e) => setDisplay({ ...display, dateFormat: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {dateFormats.map(format => (
                            <option key={format} value={format}>{format}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Clock className="inline w-4 h-4 mr-2" />
                          Time Format
                        </label>
                        <select
                          value={display.timeFormat}
                          onChange={(e) => setDisplay({ ...display, timeFormat: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="12h">12-hour (AM/PM)</option>
                          <option value="24h">24-hour</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Globe className="inline w-4 h-4 mr-2" />
                          Language
                        </label>
                        <select
                          value={display.language}
                          onChange={(e) => setDisplay({ ...display, language: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {languages.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* UI Preferences */}
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Interface Preferences</h3>
                      {[
                        { key: 'compactView', label: 'Compact View', description: 'Reduce spacing and padding for more information density' },
                        { key: 'showAnimations', label: 'Show Animations', description: 'Enable smooth transitions and animations' }
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{label}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
                          </div>
                          <button
                            onClick={() => setDisplay({ ...display, [key]: !display[key as keyof typeof display] })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              display[key as keyof typeof display] ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                display[key as keyof typeof display] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Business Configuration */}
              {activeTab === 'business' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Business Configuration</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Target className="inline w-4 h-4 mr-2" />
                          Default Margin (%)
                        </label>
                        <input
                          type="number"
                          value={business.defaultMargin}
                          onChange={(e) => setBusiness({ ...business, defaultMargin: parseFloat(e.target.value) })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <DollarSign className="inline w-4 h-4 mr-2" />
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={business.taxRate}
                          onChange={(e) => setBusiness({ ...business, taxRate: parseFloat(e.target.value) })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Clock className="inline w-4 h-4 mr-2" />
                          Operating Hours
                        </label>
                        <input
                          type="text"
                          value={business.operatingHours}
                          onChange={(e) => setBusiness({ ...business, operatingHours: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Calendar className="inline w-4 h-4 mr-2" />
                          Fiscal Year Start
                        </label>
                        <select
                          value={business.fiscalYearStart}
                          onChange={(e) => setBusiness({ ...business, fiscalYearStart: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {months.map(month => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Package className="inline w-4 h-4 mr-2" />
                          Inventory Method
                        </label>
                        <select
                          value={business.inventoryMethod}
                          onChange={(e) => setBusiness({ ...business, inventoryMethod: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {inventoryMethods.map(method => (
                            <option key={method} value={method}>{method}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <DollarSign className="inline w-4 h-4 mr-2" />
                          Rounding Precision
                        </label>
                        <select
                          value={business.roundingPrecision}
                          onChange={(e) => setBusiness({ ...business, roundingPrecision: parseInt(e.target.value) })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="0">Nearest dollar ($1)</option>
                          <option value="1">One decimal ($1.0)</option>
                          <option value="2">Two decimals ($1.00)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Alert Thresholds */}
              {activeTab === 'alerts' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Alert Thresholds</h2>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                      <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-3" />
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">Custom Alert Triggers</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Set custom thresholds for automatic alerts and notifications based on your business needs.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Low Stock Threshold (units)
                          </label>
                          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{thresholds.lowStockThreshold}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="500"
                          value={thresholds.lowStockThreshold}
                          onChange={(e) => setThresholds({ ...thresholds, lowStockThreshold: parseInt(e.target.value) })}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Alert when stock falls below this level</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            High Stock Threshold (units)
                          </label>
                          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{thresholds.highStockThreshold}</span>
                        </div>
                        <input
                          type="range"
                          min="500"
                          max="2000"
                          value={thresholds.highStockThreshold}
                          onChange={(e) => setThresholds({ ...thresholds, highStockThreshold: parseInt(e.target.value) })}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Alert when stock exceeds this level (overstock)</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Minimum Margin Alert (%)
                          </label>
                          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{thresholds.minMarginAlert}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={thresholds.minMarginAlert}
                          onChange={(e) => setThresholds({ ...thresholds, minMarginAlert: parseInt(e.target.value) })}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Alert when margin falls below this percentage</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Max Price Change Alert (%)
                          </label>
                          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{thresholds.maxPriceChangeAlert}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={thresholds.maxPriceChangeAlert}
                          onChange={(e) => setThresholds({ ...thresholds, maxPriceChangeAlert: parseInt(e.target.value) })}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Alert when price changes exceed this percentage</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Demand Spike Threshold (%)
                          </label>
                          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{thresholds.demandSpikeThreshold}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={thresholds.demandSpikeThreshold}
                          onChange={(e) => setThresholds({ ...thresholds, demandSpikeThreshold: parseInt(e.target.value) })}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Alert when demand increases by this percentage</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security & Privacy</h2>
                  <div className="space-y-6">
                    {/* Password Change */}
                    <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-800">
                      <Lock className="w-6 h-6 text-red-600 dark:text-red-400 mb-3" />
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={security.currentPassword}
                              onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                              className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={security.newPassword}
                            onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={security.confirmPassword}
                            onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>

                        <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium">
                          Update Password
                        </button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                        </div>
                        <button
                          onClick={() => setSecurity({ ...security, twoFactorEnabled: !security.twoFactorEnabled })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            security.twoFactorEnabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      {security.twoFactorEnabled && (
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                            ✓ Two-factor authentication is enabled. You'll need to enter a code from your authenticator app when logging in.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Session Timeout */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <select
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                        <option value="0">Never</option>
                      </select>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Automatically log out after this period of inactivity</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Management */}
              {activeTab === 'data' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Data Management</h2>
                  <div className="space-y-6">
                    {/* Export Data */}
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <Database className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-3" />
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">Export Your Data</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Download all your data in various formats for backup or migration purposes.
                      </p>
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium">
                          <Download size={16} />
                          Export as CSV
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium">
                          <Download size={16} />
                          Export as JSON
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium">
                          <Download size={16} />
                          Export as Excel
                        </button>
                      </div>
                    </div>

                    {/* Cache Management */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">Cache Management</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Clear cached data to free up space and resolve potential issues.
                      </p>
                      <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium">
                        <RefreshCw size={16} />
                        Clear Cache
                      </button>
                    </div>

                    {/* Danger Zone */}
                    <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border-2 border-red-300 dark:border-red-700">
                      <h3 className="font-bold text-red-900 dark:text-red-300 mb-2 flex items-center gap-2">
                        <AlertCircle size={20} />
                        Danger Zone
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                        These actions are permanent and cannot be undone. Proceed with caution.
                      </p>
                      <div className="space-y-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium">
                          <Trash2 size={16} />
                          Delete All Historical Data
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-all font-medium">
                          <Trash2 size={16} />
                          Delete Account
                        </button>
                      </div>
                    </div>

                    {/* Usage Statistics */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Storage Usage</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Data Storage</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">245 MB / 1 GB</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '24.5%' }}></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">1,234</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Products</div>
                          </div>
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">45</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Reports</div>
                          </div>
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">890</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Optimizations</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <button className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-medium">
                  <RefreshCw size={16} />
                  Reset to Defaults
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
