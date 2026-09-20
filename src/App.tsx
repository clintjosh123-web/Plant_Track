import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlantProvider, usePlantContext } from './context/PlantContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { PlantList } from './components/PlantList';
import { SmartReminders } from './components/SmartReminders';
import { GrowthTracker } from './components/GrowthTracker';
import { CareTips } from './components/CareTips';
import { HealthStatusGuide } from './components/HealthStatusGuide';
import { AddPlantModal } from './components/AddPlantModal';
import { LogGrowthModal } from './components/LogGrowthModal';
import { AddPhotoModal } from './components/AddPhotoModal';
import { PlantDetailModal } from './components/PlantDetailModal';
import { AuthModal } from './components/AuthModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ToastContainer } from './components/ToastContainer';
import { Logo } from './components/Logo';
import { Heart, Droplets, Sun, Sparkles, Database } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, plants } = usePlantContext();
  const { user, setIsSubscribeModalOpen } = useAuth();
  const isPro = user?.subscriptionPlan === 'premium_monthly';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-[#1E2922]">
      {/* Top Navigation */}
      <Navbar />

      {/* Philippine Pro Membership Upgrade Banner for Free Users */}
      {!isPro && (
        <div className="bg-gradient-to-r from-[#14381F] via-[#166534] to-[#14532D] text-white py-2.5 px-4 sm:px-6 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-black font-black text-[11px]">
                ★
              </span>
              <span>
                <strong>Plant Track Pro Philippines:</strong> Unlimited plant monitoring, AI Plant Doctor & Firebase cloud backup for only <strong>₱20/month</strong>.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-200">
                <span>GCash</span> • <span>PayMaya</span> • <span>PH Cards</span>
              </span>
              <button
                type="button"
                onClick={() => setIsSubscribeModalOpen(true)}
                className="px-3.5 py-1 bg-amber-400 hover:bg-amber-300 text-[#14381F] rounded-lg text-xs font-black shadow-xs transition-transform active:scale-95"
              >
                Upgrade for ₱20/mo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'plants' && <PlantList />}
        {activeTab === 'reminders' && <SmartReminders />}
        {activeTab === 'growth' && <GrowthTracker />}
        {activeTab === 'tips' && <CareTips />}
        {activeTab === 'health' && <HealthStatusGuide />}
      </main>

      {/* Modals & Overlays */}
      <AddPlantModal />
      <LogGrowthModal />
      <AddPhotoModal />
      <PlantDetailModal />
      <AuthModal />
      <SubscriptionModal />
      <ReceiptModal />
      <ToastContainer />

      {/* Footer with App Tagline */}
      <footer className="mt-12 border-t border-[#E2E8E0] bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <div>
              <span className="font-extrabold text-sm text-[#14381F]">
                Plant Track
              </span>
              <p className="text-xs text-[#52796F] font-medium">
                “Plant Track — Grow Better, One Reminder at a Time. 🌱”
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#52796F]">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="hover:text-[#16A34A] transition-colors"
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('plants')} 
              className="hover:text-[#16A34A] transition-colors"
            >
              My Plants ({plants.length})
            </button>
            <button 
              onClick={() => setActiveTab('reminders')} 
              className="hover:text-[#16A34A] transition-colors"
            >
              Reminders
            </button>
            <button 
              onClick={() => setActiveTab('growth')} 
              className="hover:text-[#16A34A] transition-colors"
            >
              Growth Tracker
            </button>
            <button 
              onClick={() => setActiveTab('tips')} 
              className="hover:text-[#16A34A] transition-colors"
            >
              Care Tips
            </button>
            <button 
              onClick={() => setActiveTab('health')} 
              className="hover:text-[#16A34A] transition-colors"
            >
              Health Guide
            </button>
          </div>

          <div className="text-xs text-[#94A3B8]">
            Plant growth monitoring & care reminders
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PlantProvider>
        <MainContent />
      </PlantProvider>
    </AuthProvider>
  );
}
