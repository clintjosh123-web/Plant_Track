import React, { useState, useEffect } from 'react';
import { X, Camera, Calendar, Ruler, Sparkles, Check, Upload } from 'lucide-react';
import { usePlantContext } from '../context/PlantContext';
import { PRESET_IMAGES } from '../data/initialData';

export const AddPhotoModal: React.FC = () => {
  const { 
    plants, 
    growthPhotos, 
    isPhotoModalOpen, 
    setIsPhotoModalOpen, 
    photoModalPlantId, 
    addGrowthPhoto 
  } = usePlantContext();

  const [plantId, setPlantId] = useState<string>('');
  const [weekLabel, setWeekLabel] = useState<string>('Week 4');
  const [date, setDate] = useState<string>('Oct. 01, 2026');
  const [heightCm, setHeightCm] = useState<string>('12');
  const [imageUrl, setImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=700&q=80'
  );
  const [caption, setCaption] = useState<string>('Lush foliage and expanded canopy.');

  useEffect(() => {
    if (photoModalPlantId) {
      setPlantId(photoModalPlantId);
      const plantExistingPhotos = growthPhotos.filter((p) => p.plantId === photoModalPlantId);
      const nextWeekNum = plantExistingPhotos.length + 1;
      setWeekLabel(`Week ${nextWeekNum}`);
    } else if (plants.length > 0) {
      setPlantId(plants[0].id);
    }
  }, [photoModalPlantId, plants, growthPhotos]);

  if (!isPhotoModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantId || !imageUrl) return;

    addGrowthPhoto({
      plantId,
      weekLabel,
      date: date.trim() || 'Oct. 01, 2026',
      heightCm: parseFloat(heightCm) || undefined,
      imageUrl,
      caption: caption.trim(),
    });

    setIsPhotoModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-[#E2E8E0] space-y-5"
      >
        <div className="flex items-center justify-between border-b border-[#EDF2EC] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-purple-950">
                📸 Add Weekly Growth Photo
              </h3>
              <p className="text-xs text-purple-700">
                Capture progression: “Week 1 → Week 2 → Week 3 → Week 4”
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPhotoModalOpen(false)}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1">
                Week Label
              </label>
              <select
                value={weekLabel}
                onChange={(e) => setWeekLabel(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] font-bold text-sm bg-white"
              >
                <option value="Week 1">Week 1</option>
                <option value="Week 2">Week 2</option>
                <option value="Week 3">Week 3</option>
                <option value="Week 4">Week 4</option>
                <option value="Week 5">Week 5</option>
                <option value="Week 6">Week 6</option>
                <option value="Week 8">Week 8</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Ruler className="w-3 h-3 text-blue-500" />
                <span>Height (cm)</span>
              </label>
              <input
                type="number"
                step="0.5"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] font-semibold text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Date of Photo</span>
            </label>
            <input
              type="text"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] font-semibold text-sm"
            />
          </div>

          {/* Photo Selection / Upload */}
          <div>
            <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1.5">
              Choose Photo or Upload
            </label>
            
            {/* Preview */}
            <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2 bg-purple-50 border border-purple-200">
              <img
                src={imageUrl}
                alt="Selected preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                {weekLabel} Preview
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer flex-1 py-2 px-3 rounded-xl border border-dashed border-purple-300 hover:bg-purple-50 text-center text-xs font-bold text-purple-700 flex items-center justify-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1">
              Growth Note / Caption
            </label>
            <input
              type="text"
              placeholder="e.g. New pair of leaves, healthy root development"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-medium"
            />
          </div>

          <div className="pt-3 border-t border-[#EDF2EC] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 font-semibold"
            >
              Cancel
            </button>
            <button
              id="submit-growth-photo-btn"
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Save Weekly Photo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
