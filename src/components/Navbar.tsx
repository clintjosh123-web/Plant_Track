import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Leaf, 
  Bell, 
  TrendingUp, 
  BookOpen, 
  HeartPulse, 
  Plus, 
  RotateCcw,
  Sparkles,
  User as UserIcon,
  LogOut,
  Receipt,
  Database,
  ShieldCheck,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { usePlantContext } from '../context/PlantContext';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { 
    plants, 
    reminders, 
    activeTab, 
    setActiveTab, 
    setIsAddModalOpen, 
    resetToDefaults,
    cloudSyncStatus,
    isCloudSyncing,
    showToast
  } = usePlantContext();

  const { 
    user, 
    setIsAuthModalOpen, 
    setAuthModalMode, 
    setIsSubscribeModalOpen,
    setIsReceiptModalOpen,
    logout 
  } = useAuth();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleAddPlantClick = () => {
    if (!user) {
      showToast('Please log in or sign up first to add a plant to your garden! 🌱', 'info');
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    setIsAddModalOpen(true);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingRemindersCount = reminders.filter((r) => !r.isCompleted).length;
  const isPro = user?.subscriptionPlan === 'premium_monthly';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'plants', label: 'My Plants', icon: Leaf, badge: plants.length },
    { id: 'reminders', label: 'Reminders', icon: Bell, badge: pendingRemindersCount, badgeColor: 'bg-amber-500' },
    { id: 'growth', label: 'Growth Tracker', icon: TrendingUp },
    { id: 'tips', label: 'Care Tips', icon: BookOpen },
    { id: 'health', label: 'Health Guide', icon: HeartPulse },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8E0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Tagline */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <Logo size="md" showText={true} />
            <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold bg-[#DCFCE7] text-[#166534] rounded-full border border-[#BBF7D0]">
              v1.0
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F1F5F0] p-1.5 rounded-xl border border-[#E2E8E0]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 relative ${
                    isActive
                      ? 'bg-white text-[#166534] shadow-xs font-bold'
                      : 'text-[#4A5D4E] hover:text-[#1E2922] hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#16A34A]' : 'text-[#6C8370]'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span 
                      className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                        item.badgeColor 
                          ? `${item.badgeColor} text-white` 
                          : 'bg-[#DCFCE7] text-[#166534]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: Subscription Pill + Auth / Profile + Add Plant */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Pro Membership / Upgrade Badge */}
            {isPro ? (
              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors shadow-2xs"
                title="View Plant Track Pro subscription details & receipt"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Pro Member</span>
              </button>
            ) : (
              <button
                onClick={() => setIsSubscribeModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 text-white text-xs font-extrabold hover:opacity-95 shadow-xs transition-all active:scale-95"
                title="Upgrade to Plant Track Pro for ₱20/month"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>₱20/mo Pro</span>
              </button>
            )}

            {/* Auth Button or User Profile Dropdown */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-gray-50 transition-colors"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-[#16A34A]" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#E8F5E9] text-[#16A34A] flex items-center justify-center font-bold text-xs">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="hidden md:block text-left text-xs leading-tight">
                    <span className="font-bold text-[#14381F] block truncate max-w-[100px]">
                      {user.displayName || 'Plant Lover'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {isPro ? '🌟 Pro (₱20)' : '🌱 Free Plan'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E2E8E0] p-2 z-50 animate-fadeIn">
                    <div className="p-2.5 border-b border-gray-100">
                      <p className="font-bold text-xs text-[#14381F] truncate">
                        {user.displayName || 'Plant Grower'}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {user.email || 'Synchronized User'}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPro ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isPro ? '🌟 Pro ₱20/month' : '🌱 Free Tier (3 Plants)'}
                        </span>

                        <span className="text-[10px] text-[#166534] flex items-center gap-1 font-semibold">
                          <Database className="w-3 h-3 text-[#16A34A]" />
                          <span>Firebase</span>
                        </span>
                      </div>
                    </div>

                    <div className="py-1 space-y-0.5 text-xs font-semibold text-gray-700">
                      {isPro ? (
                        <button
                          onClick={() => {
                            setIsReceiptModalOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-[#F8FAF7] rounded-xl flex items-center gap-2"
                        >
                          <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                          <span>View ₱20 Official Receipt</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setIsSubscribeModalOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-amber-50 text-amber-900 rounded-xl flex items-center gap-2 font-bold"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Upgrade to Pro (₱20/mo)</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-xl flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-[#14381F] hover:bg-[#F1F5F0] border border-[#CBD5E1] transition-colors flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Log In</span>
                </button>
              </div>
            )}

            {/* Add Plant Button */}
            <button
              id="add-plant-header-btn"
              onClick={handleAddPlantClick}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#16A34A] hover:bg-[#15803D] active:scale-98 text-white rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all duration-150 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden xs:inline">Add Plant</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-[#EDF2EC] -mx-4 px-4 gap-1 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#16A34A] text-white'
                    : 'text-[#4A5D4E] hover:bg-[#EDF2EC]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-1 rounded-full font-bold ${isActive ? 'bg-white text-[#16A34A]' : 'bg-[#DCFCE7] text-[#166534]'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
