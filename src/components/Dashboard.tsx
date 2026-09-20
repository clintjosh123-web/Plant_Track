import React, { useState } from 'react';
import { 
  Plus, 
  Leaf, 
  Droplets, 
  Sun, 
  CheckCircle2, 
  Bell, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle,
  Clock,
  ChevronRight,
  Camera,
  Activity
} from 'lucide-react';
import { usePlantContext } from '../context/PlantContext';
import { useAuth } from '../context/AuthContext';
import { Plant } from '../types';
import { Logo } from './Logo';

export const Dashboard: React.FC = () => {
  const { 
    plants, 
    growthRecords,
    growthPhotos,
    setActiveTab, 
    setIsAddModalOpen, 
    setSelectedPlantId,
    waterPlant,
    snoozeWaterReminder,
    resolveSunlight,
    snoozeSunlightReminder,
    setIsGrowthModalOpen,
    setGrowthModalPlantId,
    cloudSyncStatus
  } = usePlantContext();

  const { user, setIsSubscribeModalOpen, setIsReceiptModalOpen, setIsAuthModalOpen } = useAuth();
  const isPro = user?.subscriptionPlan === 'premium_monthly';

  // Dynamic or simulated friendly time greeting
  const [greetingTime] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! 🌱';
    if (hour < 18) return 'Good afternoon! 🌿';
    return 'Good evening! 🌙';
  });

  // Calculate statistics according to user specification
  const totalPlants = plants.length;
  
  // Plants needing water
  const plantsNeedingWater = plants.filter((p) => 
    p.statusReason?.toLowerCase().includes('water') || 
    (p.status === 'needs_attention' && p.statusReason?.toLowerCase().includes('dry')) ||
    p.status === 'needs_care'
  );

  // Plants needing sunlight
  const plantsNeedingSun = plants.filter((p) => 
    p.statusReason?.toLowerCase().includes('sunlight') || 
    p.sunlightLevel === 'Low Light' && p.status !== 'healthy'
  );

  // Plants doing well (Healthy)
  const plantsDoingWell = plants.filter((p) => p.status === 'healthy');

  // Specific target plants for alerts
  const waterAlertPlant = plantsNeedingWater[0] || null;
  const sunAlertPlant = plantsNeedingSun[0] || null;

  const handleOpenPlantDetail = (plantId: string) => {
    setSelectedPlantId(plantId);
  };

  const handleQuickLogGrowth = (plantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGrowthModalPlantId(plantId);
    setIsGrowthModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Greeting Section */}
      <div className="bg-gradient-to-br from-[#EBF7EE] via-[#F4FAF5] to-[#E2F0D9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D4] shadow-xs relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
          <Leaf className="w-64 h-64 text-[#16A34A]" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#CDE5D0] text-xs font-bold text-[#166534]">
                <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Plant Track Dashboard</span>
              </div>

              {isPro ? (
                <button
                  onClick={() => setIsReceiptModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-xs font-bold text-amber-900 hover:bg-amber-200 transition-colors"
                >
                  <span>🌟 Pro Member (₱20/mo)</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsSubscribeModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-amber-300 text-xs font-extrabold text-[#166534] hover:bg-white transition-colors"
                >
                  <span className="text-amber-500">★</span>
                  <span>Free Tier (3 Plants) • Upgrade ₱20/mo</span>
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#14381F] tracking-tight mb-2">
              {user?.displayName ? `“Good morning, ${user.displayName.split(' ')[0]}! 🌱 Let’s check your plants.”` : `“Good morning! 🌱 Let’s check your plants.”`}
            </h1>
            <p className="text-[#3F6248] text-sm sm:text-base leading-relaxed">
              Keep your green companions thriving with scheduled watering, sunlight tracking, and weekly growth logs.
            </p>
          </div>

          <div className="hidden sm:flex shrink-0 items-center justify-center p-3 bg-white/80 backdrop-blur-xs rounded-3xl border border-[#CDE5D0] shadow-xs">
            <Logo size="lg" showText={false} />
          </div>
        </div>

        {/* Stat Badges Grid: Exactly matches Section 1 of prompt */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {/* 🌿 My Plants: 3 */}
          <div 
            onClick={() => setActiveTab('plants')}
            className="bg-white/90 hover:bg-white p-4 rounded-2xl border border-[#D8E6DA] shadow-xs cursor-pointer transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#4A6B53] uppercase tracking-wider">Total</span>
              <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#16A34A] flex items-center justify-center group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#193B22]">
              {totalPlants}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#2D5A36] mt-0.5 flex items-center gap-1">
              <span>🌿 My Plants:</span>
              <span className="font-bold">{totalPlants}</span>
            </div>
          </div>

          {/* 💧 Plants needing water: 1 */}
          <div 
            onClick={() => setActiveTab('reminders')}
            className="bg-white/90 hover:bg-white p-4 rounded-2xl border border-[#BFDBFE] shadow-xs cursor-pointer transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#1E40AF] uppercase tracking-wider">Hydration</span>
              <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1E3A8A]">
              {plantsNeedingWater.length}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#1D4ED8] mt-0.5 flex items-center gap-1">
              <span>💧 Needing water:</span>
              <span className="font-bold">{plantsNeedingWater.length}</span>
            </div>
          </div>

          {/* ☀️ Plants needing sunlight: 1 */}
          <div 
            onClick={() => setActiveTab('reminders')}
            className="bg-white/90 hover:bg-white p-4 rounded-2xl border border-[#FED7AA] shadow-xs cursor-pointer transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#C2410C] uppercase tracking-wider">Lighting</span>
              <div className="w-8 h-8 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center group-hover:bg-[#EA580C] group-hover:text-white transition-colors">
                <Sun className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#9A3412]">
              {plantsNeedingSun.length}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#C2410C] mt-0.5 flex items-center gap-1">
              <span>☀️ Needing sun:</span>
              <span className="font-bold">{plantsNeedingSun.length}</span>
            </div>
          </div>

          {/* ✅ Plants doing well: 1 */}
          <div 
            onClick={() => setActiveTab('health')}
            className="bg-white/90 hover:bg-white p-4 rounded-2xl border border-[#BBF7D0] shadow-xs cursor-pointer transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#166534] uppercase tracking-wider">Health</span>
              <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#14532D]">
              {plantsDoingWell.length}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#15803D] mt-0.5 flex items-center gap-1">
              <span>✅ Doing well:</span>
              <span className="font-bold">{plantsDoingWell.length}</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons (Section 1 of Prompt) */}
        <div className="mt-6 pt-6 border-t border-[#D5E8D4]/80 flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs font-bold text-[#4A6B53] uppercase tracking-wider mr-1">
            Quick Actions:
          </span>
          
          <button
            id="quick-btn-add-plant"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>➕ Add Plant</span>
          </button>

          <button
            id="quick-btn-my-plants"
            onClick={() => setActiveTab('plants')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#F3FAF4] text-[#193B22] border border-[#CDE5D0] rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
          >
            <Leaf className="w-4 h-4 text-[#16A34A]" />
            <span>📋 My Plants</span>
          </button>

          <button
            id="quick-btn-reminders"
            onClick={() => setActiveTab('reminders')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#F3FAF4] text-[#193B22] border border-[#CDE5D0] rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
          >
            <Bell className="w-4 h-4 text-[#EA580C]" />
            <span>🔔 Reminders</span>
          </button>

          <button
            id="quick-btn-growth-tracker"
            onClick={() => setActiveTab('growth')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#F3FAF4] text-[#193B22] border border-[#CDE5D0] rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
          >
            <TrendingUp className="w-4 h-4 text-[#2563EB]" />
            <span>📊 Growth Tracker</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Notifications: Water Reminder & Sunlight Reminder (Sections 3 & 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Section 3: Water Reminder */}
        {waterAlertPlant ? (
          <div className="bg-gradient-to-br from-[#EFF6FF] via-white to-[#DBEAFE] rounded-3xl p-5 sm:p-6 border-2 border-[#93C5FD] shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DBEAFE] text-[#1D4ED8] text-xs font-extrabold mb-1">
                  <span>🔔 Water Reminder</span>
                  <span>•</span>
                  <span>{waterAlertPlant.name}</span>
                </div>
                <h3 className="text-lg font-bold text-[#1E3A8A] flex items-center gap-1.5">
                  Your plant needs water! 🌱💧
                </h3>
                <p className="text-xs sm:text-sm text-[#3B82F6] font-medium mt-1 leading-relaxed">
                  The soil may be too dry. Don't forget to water your plant today.
                </p>
                <div className="text-xs text-[#64748B] mt-2 flex items-center gap-3">
                  <span>Schedule: {waterAlertPlant.waterScheduleLabel}</span>
                  <span>•</span>
                  <span>Location: {waterAlertPlant.location}</span>
                </div>
              </div>
            </div>

            {/* Buttons: “Watered” | “Remind Me Later” */}
            <div className="mt-5 pt-4 border-t border-[#BFDBFE] flex items-center gap-3">
              <button
                id="btn-watered-action"
                onClick={() => waterPlant(waterAlertPlant.id)}
                className="flex-1 py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Droplets className="w-4 h-4 fill-current" />
                <span>Watered</span>
              </button>
              <button
                id="btn-snooze-water-action"
                onClick={() => snoozeWaterReminder(waterAlertPlant.id)}
                className="py-2.5 px-4 bg-white hover:bg-[#F1F5F9] text-[#475569] font-semibold text-sm rounded-xl border border-[#CBD5E1] transition-all"
              >
                Remind Me Later
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#F0FDF4] rounded-3xl p-6 border border-[#BBF7D0] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#14532D] text-base">All plants are hydrated! 💧</h3>
              <p className="text-xs text-[#166534] mt-0.5">
                No plants currently need emergency watering. Keep monitoring moisture levels!
              </p>
            </div>
          </div>
        )}

        {/* Section 4: Sunlight Reminder */}
        {sunAlertPlant ? (
          <div className="bg-gradient-to-br from-[#FFFBEB] via-white to-[#FEF3C7] rounded-3xl p-5 sm:p-6 border-2 border-[#FCD34D] shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-xs font-extrabold mb-1">
                  <span>☀️ Sunlight Reminder</span>
                  <span>•</span>
                  <span>{sunAlertPlant.name}</span>
                </div>
                <h3 className="text-lg font-bold text-[#92400E] flex items-center gap-1.5">
                  Your plant needs more sunlight!
                </h3>
                <p className="text-xs sm:text-sm text-[#B45309] font-medium mt-1 leading-relaxed">
                  Move your plant to a brighter location so it can receive enough light.
                </p>
                <div className="text-xs text-[#78350F] mt-2 flex items-center gap-3">
                  <span>Current spot: {sunAlertPlant.location}</span>
                  <span>•</span>
                  <span>Level: {sunAlertPlant.sunlightLevel}</span>
                </div>
              </div>
            </div>

            {/* Buttons: Moved to Brighter Spot | Remind Later */}
            <div className="mt-5 pt-4 border-t border-[#FDE68A] flex items-center gap-3">
              <button
                id="btn-moved-sunlight-action"
                onClick={() => resolveSunlight(sunAlertPlant.id, 'Sunny Window Sill')}
                className="flex-1 py-2.5 px-4 bg-[#D97706] hover:bg-[#B45309] active:scale-95 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Sun className="w-4 h-4 fill-current" />
                <span>Moved to Brighter Spot</span>
              </button>
              <button
                id="btn-snooze-sunlight-action"
                onClick={() => snoozeSunlightReminder(sunAlertPlant.id)}
                className="py-2.5 px-4 bg-white hover:bg-[#F1F5F9] text-[#475569] font-semibold text-sm rounded-xl border border-[#CBD5E1] transition-all"
              >
                Remind Later
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#FEFCE8] rounded-3xl p-6 border border-[#FEF08A] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF08A] text-[#A16207] flex items-center justify-center shrink-0">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#713F12] text-base">Sunlight exposure optimal! ☀️</h3>
              <p className="text-xs text-[#854D0E] mt-0.5">
                All plants are in appropriate light zones. Rotate pots occasionally for even growth.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Plant Collection Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#14381F] tracking-tight">
              My Plant Sanctuary
            </h2>
            <p className="text-xs sm:text-sm text-[#52796F]">
              Click on any plant card to view detailed growth history, photos, and care notes.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('plants')}
            className="text-xs sm:text-sm font-bold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1 transition-colors"
          >
            <span>View All ({plants.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plants.map((plant) => {
            const plantRecords = growthRecords.filter((r) => r.plantId === plant.id);
            const latestRecord = plantRecords[plantRecords.length - 1];
            const plantPhotos = growthPhotos.filter((p) => p.plantId === plant.id);

            return (
              <div
                key={plant.id}
                id={`plant-card-${plant.id}`}
                onClick={() => handleOpenPlantDetail(plant.id)}
                className="bg-white rounded-3xl border border-[#E2E8E0] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Plant Header Image */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#EAEFEA]">
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    
                    {/* Status Pill on Image: Section 9 */}
                    <div className="absolute top-3 right-3">
                      {plant.status === 'healthy' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7]/90 text-[#14532D] backdrop-blur-md border border-[#86EFAC] shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                          <span>🟢 Healthy</span>
                        </span>
                      )}
                      {plant.status === 'needs_attention' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF08A]/90 text-[#713F12] backdrop-blur-md border border-[#FACC15] shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-[#EAB308] animate-pulse" />
                          <span>🟡 Needs Attention</span>
                        </span>
                      )}
                      {plant.status === 'needs_care' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEE2E2]/90 text-[#7F1D1D] backdrop-blur-md border border-[#F87171] shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                          <span>🔴 Needs Care</span>
                        </span>
                      )}
                    </div>

                    {/* Plant Name & Type on Image Bottom */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-lg font-black tracking-tight drop-shadow-sm flex items-center justify-between">
                        <span>{plant.name}</span>
                        {latestRecord && (
                          <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md">
                            {latestRecord.heightCm} cm
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-white/90 font-medium flex items-center gap-2">
                        <span>{plant.type}</span>
                        <span>•</span>
                        <span>{plant.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body Details */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Status Note banner if attention needed */}
                    {plant.statusReason && plant.status !== 'healthy' && (
                      <div className="text-xs font-semibold p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{plant.statusReason}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-[#F8FAF7] p-2.5 rounded-xl border border-[#EDF2EC]">
                        <span className="text-[#64748B] block font-medium">Watering</span>
                        <span className="font-bold text-[#1E2922] flex items-center gap-1 mt-0.5">
                          <Droplets className="w-3 h-3 text-blue-500" />
                          {plant.waterScheduleLabel}
                        </span>
                      </div>
                      <div className="bg-[#F8FAF7] p-2.5 rounded-xl border border-[#EDF2EC]">
                        <span className="text-[#64748B] block font-medium">Sunlight</span>
                        <span className="font-bold text-[#1E2922] flex items-center gap-1 mt-0.5 truncate" title={plant.sunlightLevel}>
                          <Sun className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{plant.sunlightLevel}</span>
                        </span>
                      </div>
                    </div>

                    {/* Weekly Photos & Growth milestone */}
                    <div className="flex items-center justify-between text-xs text-[#52796F] pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <TrendingUp className="w-3.5 h-3.5 text-[#16A34A]" />
                        {plantRecords.length} Growth logs
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Camera className="w-3.5 h-3.5 text-purple-500" />
                        {plantPhotos.length} Weekly photos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Quick Action Bar */}
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-[#F1F5F0] flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      waterPlant(plant.id);
                    }}
                    className="flex-1 py-2 px-3 bg-[#EBF5FB] hover:bg-[#D6EAF8] text-[#1B4F72] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Droplets className="w-3.5 h-3.5 text-blue-600" />
                    <span>Water</span>
                  </button>
                  <button
                    onClick={(e) => handleQuickLogGrowth(plant.id, e)}
                    className="flex-1 py-2 px-3 bg-[#E8F8F5] hover:bg-[#D1F2EB] text-[#0E6251] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Log Growth</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Plant Care Tip Spotlight (Section 8 example from prompt: Mint Care Tip) */}
      <div className="bg-gradient-to-r from-[#F0FDF4] to-[#ECFDF5] rounded-3xl p-6 border border-[#BBF7D0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center shrink-0 border border-[#86EFAC]">
            <Sparkles className="w-6 h-6 text-[#16A34A]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] text-xs font-extrabold mb-1">
              🌱 Mint Care Tip
            </div>
            <h4 className="text-base font-bold text-[#14532D]">
              Mint grows well with regular watering and enough sunlight.
            </h4>
            <p className="text-xs sm:text-sm text-[#166534] mt-0.5">
              Keep the soil slightly moist but avoid overwatering. Pinch tips regularly for bushier foliage.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('tips')}
          className="shrink-0 px-4 py-2.5 bg-white hover:bg-[#DCFCE7] text-[#166534] font-bold text-xs sm:text-sm rounded-xl border border-[#86EFAC] shadow-xs transition-colors flex items-center gap-1.5"
        >
          <span>More Care Tips</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
