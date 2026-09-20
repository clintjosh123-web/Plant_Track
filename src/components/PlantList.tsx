import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Droplets, 
  Sun, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Camera, 
  Trash2, 
  MoreVertical,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { usePlantContext } from '../context/PlantContext';
import { useAuth } from '../context/AuthContext';
import { Plant, PlantHealthStatus } from '../types';
import { CareSheetModal } from './CareSheetModal';

export const PlantList: React.FC = () => {
  const { 
    plants, 
    growthRecords, 
    growthPhotos, 
    waterPlant, 
    deletePlant, 
    setSelectedPlantId, 
    setIsAddModalOpen,
    setIsGrowthModalOpen,
    setGrowthModalPlantId,
    setIsPhotoModalOpen,
    setPhotoModalPlantId,
    showToast
  } = usePlantContext();

  const { user, setIsAuthModalOpen, setAuthModalMode } = useAuth();
  const [isCareSheetOpen, setIsCareSheetOpen] = useState<boolean>(false);

  const handleAddPlantClick = () => {
    if (!user) {
      showToast('Please log in or sign up first to add a plant to your garden! 🌱', 'info');
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    setIsAddModalOpen(true);
  };

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = 
      plant.name.toLowerCase().includes(search.toLowerCase()) ||
      plant.type.toLowerCase().includes(search.toLowerCase()) ||
      plant.location.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;
    if (filterStatus === 'healthy') return plant.status === 'healthy';
    if (filterStatus === 'needs_attention') return plant.status === 'needs_attention';
    if (filterStatus === 'needs_care') return plant.status === 'needs_care';
    if (filterStatus === 'needs_water') {
      return plant.statusReason?.toLowerCase().includes('water') || plant.status === 'needs_care';
    }
    if (filterStatus === 'needs_sun') {
      return plant.statusReason?.toLowerCase().includes('sunlight') || plant.sunlightLevel === 'Low Light';
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#166534] text-xs font-bold mb-2">
            <span>📋 Section 1: My Plants</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14381F] tracking-tight">
            My Plants Collection ({plants.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#52796F]">
            Manage watering cycles, light locations, and health status for all your plants.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsCareSheetOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-amber-50 text-[#14381F] rounded-xl text-xs sm:text-sm font-bold border border-amber-300 shadow-xs transition-all"
            title="Print garden care sheet & sitter instructions"
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Care Sheet</span>
            <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.2 rounded-md">
              PRO
            </span>
          </button>

          <button
            onClick={handleAddPlantClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Plant</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, species, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#16A34A] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Plants' },
            { id: 'needs_water', label: '💧 Needs Water' },
            { id: 'needs_sun', label: '☀️ Needs Sunlight' },
            { id: 'healthy', label: '🟢 Healthy' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                filterStatus === f.id
                  ? 'bg-[#1E2922] text-white shadow-xs'
                  : 'bg-white text-[#4A5D4E] border border-[#E2E8E0] hover:bg-[#F8FAF7]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Plants */}
      {filteredPlants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map((plant) => {
            const plantRecords = growthRecords.filter((r) => r.plantId === plant.id);
            const latestRecord = plantRecords[plantRecords.length - 1];
            const plantPhotos = growthPhotos.filter((p) => p.plantId === plant.id);

            return (
              <div
                key={plant.id}
                className="bg-white rounded-3xl border border-[#E2E8E0] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Header */}
                  <div 
                    onClick={() => setSelectedPlantId(plant.id)}
                    className="relative h-48 w-full overflow-hidden bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Health Status Pill on Top Right */}
                    <div className="absolute top-3 right-3">
                      {plant.status === 'healthy' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7]/95 text-[#14532D] backdrop-blur-md border border-[#86EFAC] shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                          <span>🟢 Healthy</span>
                        </span>
                      )}
                      {plant.status === 'needs_attention' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF08A]/95 text-[#713F12] backdrop-blur-md border border-[#FACC15] shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-[#EAB308] animate-ping" />
                          <span>🟡 Needs Attention</span>
                        </span>
                      )}
                      {plant.status === 'needs_care' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEE2E2]/95 text-[#7F1D1D] backdrop-blur-md border border-[#F87171] shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                          <span>🔴 Needs Care</span>
                        </span>
                      )}
                    </div>

                    {/* Plant Name & Height on Image Bottom */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black tracking-tight drop-shadow-sm">
                          {plant.name}
                        </h3>
                        {latestRecord && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/25 backdrop-blur-md">
                            {latestRecord.heightCm} cm
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/90 font-medium">
                        {plant.type} • {plant.location}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {plant.statusReason && plant.status !== 'healthy' && (
                      <div className="text-xs font-semibold p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-start gap-1.5">
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

                    <div className="flex items-center justify-between text-xs text-[#52796F] pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <TrendingUp className="w-3.5 h-3.5 text-[#16A34A]" />
                        {plantRecords.length} Growth Logs
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Camera className="w-3.5 h-3.5 text-purple-600" />
                        {plantPhotos.length} Weekly Photos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="p-4 pt-1 border-t border-[#F1F5F0] flex items-center gap-2">
                  <button
                    onClick={() => waterPlant(plant.id)}
                    className="flex-1 py-2 px-3 bg-[#EBF5FB] hover:bg-[#D6EAF8] text-[#1B4F72] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Droplets className="w-3.5 h-3.5 text-blue-600" />
                    <span>Water</span>
                  </button>

                  <button
                    onClick={() => {
                      setGrowthModalPlantId(plant.id);
                      setIsGrowthModalOpen(true);
                    }}
                    className="flex-1 py-2 px-3 bg-[#E8F8F5] hover:bg-[#D1F2EB] text-[#0E6251] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Log Growth</span>
                  </button>

                  <button
                    onClick={() => setSelectedPlantId(plant.id)}
                    className="p-2 text-[#64748B] hover:text-[#1E2922] hover:bg-gray-100 rounded-xl transition-colors"
                    title="View Full Profile"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E2E8E0] space-y-3">
          <p className="text-sm font-semibold text-gray-600">
            No plants match your search filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setFilterStatus('all');
            }}
            className="text-xs font-bold text-[#16A34A] underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Care Sheet Modal (Pro Feature) */}
      <CareSheetModal
        isOpen={isCareSheetOpen}
        onClose={() => setIsCareSheetOpen(false)}
      />
    </div>
  );
};
