import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Droplets, 
  Sun, 
  Leaf, 
  Sparkles, 
  Shield, 
  Activity, 
  Lightbulb,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { PLANT_CARE_TIPS } from '../data/initialData';
import { usePlantContext } from '../context/PlantContext';

export const CareTips: React.FC = () => {
  const { plants, showToast } = usePlantContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'water' | 'sunlight' | 'growth'>('all');

  const filteredTips = PLANT_CARE_TIPS.filter((tip) => {
    const matchesSearch = 
      tip.plantType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.tip.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Section 8: Plant Care Tips</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14381F] tracking-tight">
            🌿 Essential Plant Care Tips
          </h1>
          <p className="text-xs sm:text-sm text-[#52796F]">
            Botanical guidance for light exposure, hydration cycles, soil moisture, and pruning.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search plant care (e.g. Mint, Monstera)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#16A34A] transition-all"
          />
        </div>
      </div>

      {/* Featured Highlight: Mint Care Tip from user prompt */}
      <div className="bg-gradient-to-br from-[#E8F8F0] via-white to-[#DCFCE7] rounded-3xl p-6 sm:p-7 border-2 border-[#86EFAC] shadow-xs relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A] text-white text-xs font-extrabold shadow-xs">
            <span>🌱 Featured Tip from Example</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#14532D] tracking-tight">
            Mint Care Tip
          </h2>
          <p className="text-sm sm:text-base text-[#166534] font-medium leading-relaxed">
            “Mint grows well with regular watering and enough sunlight. Keep the soil slightly moist but avoid overwatering.”
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-white/90 p-3.5 rounded-xl border border-[#BBF7D0] flex items-start gap-3">
              <Droplets className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#14532D] block">Watering Routine</span>
                <p className="text-xs text-[#166534] mt-0.5">
                  Check top 1 cm of soil every 2 days. Water gently when slightly dry to the touch.
                </p>
              </div>
            </div>

            <div className="bg-white/90 p-3.5 rounded-xl border border-[#BBF7D0] flex items-start gap-3">
              <Sun className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#14532D] block">Sunlight Need</span>
                <p className="text-xs text-[#166534] mt-0.5">
                  Loves kitchen window sills or balconies with 4–6 hours of gentle morning sun.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Plant Specific Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTips.map((tip) => (
          <div
            key={tip.id}
            className="bg-white rounded-3xl p-5 border border-[#E2E8E0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
                  {tip.plantType}
                </span>
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>

              <h3 className="font-extrabold text-base text-[#1E2922]">
                {tip.title}
              </h3>

              <p className="text-xs text-[#475569] leading-relaxed font-medium">
                {tip.tip}
              </p>

              <div className="space-y-2 pt-2 border-t border-[#F1F5F9] text-xs">
                <div className="flex items-start gap-2 text-[#334155]">
                  <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Water:</strong> {tip.waterAdvice}</span>
                </div>
                <div className="flex items-start gap-2 text-[#334155]">
                  <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Light:</strong> {tip.sunlightAdvice}</span>
                </div>
              </div>
            </div>

            {tip.funFact && (
              <div className="p-3 bg-[#F8FAF7] rounded-2xl border border-[#EDF2EC] text-[11px] text-[#52796F]">
                <strong className="text-[#1E2922] block mb-0.5">💡 Grower's Secret:</strong>
                {tip.funFact}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
