import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Calendar, Ruler, Sparkles } from 'lucide-react';
import { usePlantContext } from '../context/PlantContext';

export const LogGrowthModal: React.FC = () => {
  const { 
    plants, 
    growthRecords,
    isGrowthModalOpen, 
    setIsGrowthModalOpen, 
    growthModalPlantId, 
    addGrowthRecord 
  } = usePlantContext();

  const [plantId, setPlantId] = useState<string>('');
  const [date, setDate] = useState<string>('Sept. 20, 2026');
  const [heightCm, setHeightCm] = useState<string>('9');
  const [condition, setCondition] = useState<string>('Growing well 🌿');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (growthModalPlantId) {
      setPlantId(growthModalPlantId);
      const records = growthRecords.filter((r) => r.plantId === growthModalPlantId);
      const lastRec = records[records.length - 1];
      if (lastRec) {
        setHeightCm((lastRec.heightCm + 1.5).toString());
      }
    } else if (plants.length > 0) {
      setPlantId(plants[0].id);
    }
  }, [growthModalPlantId, plants, growthRecords]);

  if (!isGrowthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(heightCm);
    if (isNaN(h) || !plantId) return;

    addGrowthRecord({
      plantId,
      date: date.trim() || 'Sept. 20, 2026',
      heightCm: h,
      condition,
      notes: notes.trim(),
    });

    setIsGrowthModalOpen(false);
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-[#E2E8E0] space-y-5"
      >
        <div className="flex items-center justify-between border-b border-[#EDF2EC] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#14381F]">
                📈 Log Growth Entry
              </h3>
              <p className="text-xs text-[#52796F]">
                Record date, height, and plant condition
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGrowthModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1">
              Select Plant
            </label>
            <select
              value={plantId}
              onChange={(e) => setPlantId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] font-semibold text-sm bg-white"
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Date</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sept. 20, 2026"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] font-semibold text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-blue-500" />
              <span>Plant Height (cm)</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              required
              placeholder="e.g. 9"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] font-bold text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1">
              Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] font-semibold text-sm bg-white"
            >
              <option value="Healthy 🌱">Healthy 🌱</option>
              <option value="Healthy 🌿">Healthy 🌿</option>
              <option value="Growing well 🌿">Growing well 🌿</option>
              <option value="Rapid Growth 🚀">Rapid Growth 🚀</option>
              <option value="Flowering 🌸">Flowering 🌸</option>
              <option value="Needs Attention 🟡">Needs Attention 🟡</option>
              <option value="Needs Care 🔴">Needs Care 🔴</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1">
              Observation Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Vibrant green tips, stem strengthening nicely."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm"
            />
          </div>

          <div className="pt-3 border-t border-[#EDF2EC] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsGrowthModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 font-semibold"
            >
              Cancel
            </button>
            <button
              id="submit-growth-record-btn"
              type="submit"
              className="px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Record Growth</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
