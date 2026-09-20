import React, { useState } from 'react';
import { 
  X, 
  Droplets, 
  Sun, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Camera, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Sparkles,
  Edit2
} from 'lucide-react';
import { usePlantContext } from '../context/PlantContext';
import { PlantHealthStatus } from '../types';

export const PlantDetailModal: React.FC = () => {
  const { 
    plants, 
    growthRecords, 
    growthPhotos, 
    reminders,
    selectedPlantId, 
    setSelectedPlantId, 
    waterPlant, 
    resolveSunlight,
    deletePlant,
    updatePlant,
    setIsGrowthModalOpen,
    setGrowthModalPlantId,
    setIsPhotoModalOpen,
    setPhotoModalPlantId
  } = usePlantContext();

  const [activeTab, setActiveTab] = useState<'overview' | 'growth' | 'photos' | 'reminders'>('overview');

  if (!selectedPlantId) return null;

  const plant = plants.find((p) => p.id === selectedPlantId);
  if (!plant) return null;

  const plantRecords = growthRecords.filter((r) => r.plantId === plant.id);
  const plantPhotos = growthPhotos.filter((p) => p.plantId === plant.id);
  const plantReminders = reminders.filter((r) => r.plantId === plant.id);

  const handleOpenGrowth = () => {
    setGrowthModalPlantId(plant.id);
    setIsGrowthModalOpen(true);
  };

  const handleOpenPhoto = () => {
    setPhotoModalPlantId(plant.id);
    setIsPhotoModalOpen(true);
  };

  const handleStatusChange = (status: PlantHealthStatus) => {
    let reason = 'Plant is getting enough care 🟢';
    if (status === 'needs_attention') reason = 'Check water or sunlight levels 🟡';
    if (status === 'needs_care') reason = 'Immediate attention is needed 🔴';
    updatePlant(plant.id, { status, statusReason: reason });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E2E8E0] relative flex flex-col"
      >
        {/* Cover Header */}
        <div className="relative h-56 sm:h-64 w-full bg-gray-100 shrink-0">
          <img
            src={plant.imageUrl}
            alt={plant.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          {/* Close button */}
          <button
            onClick={() => setSelectedPlantId(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Health Pill on Top Left */}
          <div className="absolute top-4 left-4">
            {plant.status === 'healthy' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7]/95 text-[#14532D] backdrop-blur-md border border-[#86EFAC] shadow-xs">
                <span>🟢 Healthy</span>
              </span>
            )}
            {plant.status === 'needs_attention' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF08A]/95 text-[#713F12] backdrop-blur-md border border-[#FACC15] shadow-xs">
                <span>🟡 Needs Attention</span>
              </span>
            )}
            {plant.status === 'needs_care' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEE2E2]/95 text-[#7F1D1D] backdrop-blur-md border border-[#F87171] shadow-xs">
                <span>🔴 Needs Care</span>
              </span>
            )}
          </div>

          {/* Title & Species on image bottom */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {plant.name}
              </h2>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/25 backdrop-blur-md">
                {plant.type}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/90 flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {plant.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Planted {plant.datePlanted}
              </span>
            </p>
          </div>
        </div>

        {/* Quick Action Strip */}
        <div className="px-6 py-3 bg-[#F8FAF7] border-b border-[#EDF2EC] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => waterPlant(plant.id)}
              className="px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <Droplets className="w-3.5 h-3.5 fill-current" />
              <span>Water Plant</span>
            </button>
            <button
              onClick={() => resolveSunlight(plant.id, 'Bright Window')}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <Sun className="w-3.5 h-3.5 fill-current" />
              <span>Move to Sun</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenGrowth}
              className="px-3 py-2 bg-white hover:bg-emerald-50 text-[#166534] border border-[#BBF7D0] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Log Growth</span>
            </button>
            <button
              onClick={handleOpenPhoto}
              className="px-3 py-2 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-purple-600" />
              <span>Add Photo</span>
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex border-b border-[#EDF2EC] px-6">
          {[
            { id: 'overview', label: 'Plant Overview' },
            { id: 'growth', label: `Growth History (${plantRecords.length})` },
            { id: 'photos', label: `Photo Timeline (${plantPhotos.length})` },
            { id: 'reminders', label: `Reminders (${plantReminders.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#16A34A] text-[#166534]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-5">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Status banner */}
              {plant.statusReason && (
                <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
                  plant.status === 'healthy' 
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{plant.status === 'healthy' ? '🟢' : '🟡'}</span>
                    <span>{plant.statusReason}</span>
                  </div>

                  {/* Quick health toggle */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStatusChange('healthy')}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        plant.status === 'healthy' ? 'bg-[#16A34A] text-white' : 'bg-white text-gray-700'
                      }`}
                    >
                      Healthy
                    </button>
                    <button
                      onClick={() => handleStatusChange('needs_attention')}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        plant.status === 'needs_attention' ? 'bg-amber-500 text-white' : 'bg-white text-gray-700'
                      }`}
                    >
                      Attention
                    </button>
                    <button
                      onClick={() => handleStatusChange('needs_care')}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        plant.status === 'needs_care' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
                      }`}
                    >
                      Needs Care
                    </button>
                  </div>
                </div>
              )}

              {/* Plant specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-[#F8FAF7] p-3.5 rounded-2xl border border-[#EDF2EC]">
                  <span className="text-[11px] font-semibold text-[#64748B] block">Watering Schedule</span>
                  <span className="font-bold text-sm text-[#1E2922] flex items-center gap-1.5 mt-1">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    {plant.waterScheduleLabel}
                  </span>
                </div>

                <div className="bg-[#F8FAF7] p-3.5 rounded-2xl border border-[#EDF2EC]">
                  <span className="text-[11px] font-semibold text-[#64748B] block">Sunlight Level</span>
                  <span className="font-bold text-sm text-[#1E2922] flex items-center gap-1.5 mt-1">
                    <Sun className="w-4 h-4 text-amber-500" />
                    {plant.sunlightLevel}
                  </span>
                </div>

                <div className="bg-[#F8FAF7] p-3.5 rounded-2xl border border-[#EDF2EC]">
                  <span className="text-[11px] font-semibold text-[#64748B] block">Current Location</span>
                  <span className="font-bold text-sm text-[#1E2922] flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    {plant.location}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {plant.notes && (
                <div className="p-4 bg-white rounded-2xl border border-[#E2E8E0] text-xs">
                  <span className="font-bold text-[#1E2922] block mb-1">Care Notes:</span>
                  <p className="text-[#52796F] leading-relaxed">{plant.notes}</p>
                </div>
              )}

              {/* Danger zone: delete */}
              <div className="pt-4 border-t border-[#EDF2EC] flex items-center justify-between">
                <span className="text-xs text-gray-400">Plant ID: {plant.id}</span>
                <button
                  onClick={() => deletePlant(plant.id)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Plant</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'growth' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#1E2922]">Recorded Growth Logs</h4>
                <button
                  onClick={handleOpenGrowth}
                  className="text-xs font-bold text-[#16A34A] hover:underline"
                >
                  + Add New Entry
                </button>
              </div>
              <div className="space-y-2">
                {plantRecords.map((r) => (
                  <div key={r.id} className="p-3 bg-[#F8FAF7] rounded-xl border border-[#EDF2EC] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#1E2922] block">{r.date}</span>
                      <span className="text-gray-500">{r.notes || 'Routine check'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-white font-bold text-[#166534] border border-[#BBF7D0] rounded-lg">
                        {r.heightCm} cm
                      </span>
                      <span className="font-semibold">{r.condition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#1E2922]">
                  Weekly Photo Progression (“Week 1 → Week 2 → Week 3 → Week 4”)
                </h4>
                <button
                  onClick={handleOpenPhoto}
                  className="text-xs font-bold text-purple-600 hover:underline"
                >
                  + Add Photo
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {plantPhotos.map((ph) => (
                  <div key={ph.id} className="rounded-xl overflow-hidden border border-purple-200 bg-white">
                    <img src={ph.imageUrl} alt={ph.weekLabel} className="h-32 w-full object-cover" />
                    <div className="p-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-purple-900">
                        <span>{ph.weekLabel}</span>
                        {ph.heightCm && <span>{ph.heightCm} cm</span>}
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">{ph.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reminders' && (
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-[#1E2922] mb-3">Associated Reminders</h4>
              {plantReminders.map((rem) => (
                <div key={rem.id} className="p-3 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#1E2922] block">{rem.title}</span>
                    <span className="text-gray-500">{rem.description}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rem.isCompleted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {rem.isCompleted ? 'Done' : `Due ${rem.dueDate}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
