import React, { useState, useRef } from 'react';
import { 
  X, 
  Leaf, 
  Droplets, 
  Sun, 
  MapPin, 
  Calendar, 
  Ruler, 
  Check, 
  Sparkles,
  Camera,
  Upload,
  Image as ImageIcon,
  FolderOpen,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Lock,
  LogIn,
  UserPlus
} from 'lucide-react';
import { usePlantContext } from '../context/PlantContext';
import { useAuth } from '../context/AuthContext';
import { SunlightLevel, PlantHealthStatus } from '../types';
import { PRESET_PLANT_TYPES, PRESET_LOCATIONS, PRESET_IMAGES } from '../data/initialData';

export const AddPlantModal: React.FC = () => {
  const { isAddModalOpen, setIsAddModalOpen, addPlant } = usePlantContext();
  const { user, setIsAuthModalOpen, setAuthModalMode } = useAuth();

  const [name, setName] = useState('');
  const [type, setType] = useState('Mint');
  const [datePlanted, setDatePlanted] = useState('September 10, 2026');
  const [location, setLocation] = useState('Window');
  const [sunlightLevel, setSunlightLevel] = useState<SunlightLevel>('Bright Indirect Light');
  const [waterScheduleDays, setWaterScheduleDays] = useState<number>(2);
  const [initialHeight, setInitialHeight] = useState<string>('5');
  const [initialCondition, setInitialCondition] = useState<string>('Healthy 🌱');
  const [imageUrl, setImageUrl] = useState<string>(PRESET_IMAGES[0].url);
  const [notes, setNotes] = useState<string>('');

  // Custom photo upload state
  const [photoMode, setPhotoMode] = useState<'upload' | 'preset'>('upload');
  const [customPhotoDataUrl, setCustomPhotoDataUrl] = useState<string | null>(null);
  const [customPhotoName, setCustomPhotoName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isAddModalOpen) return null;

  // Requirement: Make it when they try to add a plant they need to log in/sign in first
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
        <div 
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-[#E2E8E0] relative text-center space-y-5 my-auto"
        >
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-[#DCFCE7] text-[#16A34A] border-2 border-[#86EFAC] mx-auto flex items-center justify-center shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#166534] text-xs font-bold border border-[#BBF7D0]">
              <Leaf className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Plant Track Authentication</span>
            </div>
            <h2 className="text-2xl font-black text-[#14381F] tracking-tight">
              Please Sign In First
            </h2>
            <p className="text-xs sm:text-sm text-[#52796F] leading-relaxed">
              To add new plants, synchronize your care schedules, and back up your garden to Firebase Cloud, please log in or create your account.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="w-full py-3 px-4 bg-[#16A34A] hover:bg-[#15803D] active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In to Add Plant</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setAuthModalMode('signup');
                setIsAuthModalOpen(true);
              }}
              className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl text-xs font-bold border border-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-gray-500" />
              <span>New Grower? Create Free Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let scheduleLabel = `Every ${waterScheduleDays} days`;
    if (waterScheduleDays === 1) scheduleLabel = 'Every day';
    else if (waterScheduleDays === 7) scheduleLabel = 'Weekly (Every 7 days)';
    else if (waterScheduleDays === 14) scheduleLabel = 'Bi-weekly (Every 14 days)';

    const heightNum = parseFloat(initialHeight) || 5;

    const success = addPlant(
      {
        name: name.trim(),
        type: type.trim(),
        datePlanted: datePlanted.trim(),
        location: location.trim(),
        sunlightLevel,
        waterScheduleDays,
        waterScheduleLabel: scheduleLabel,
        lastWateredDate: new Date().toISOString().split('T')[0],
        lastSunlightCheckDate: new Date().toISOString().split('T')[0],
        status: 'healthy',
        statusReason: 'Newly planted and getting attentive care 🟢',
        imageUrl: imageUrl || PRESET_IMAGES[0].url,
        notes: notes.trim(),
      },
      heightNum,
      initialCondition
    );

    if (success) {
      // Reset & close
      setName('');
      setNotes('');
      handleClearCustomPhoto();
      setIsAddModalOpen(false);
    }
  };

  const handleApplyPreset = (presetName: string, presetType: string, presetLoc: string, days: number, light: SunlightLevel, img: string) => {
    setName(presetName);
    setType(presetType);
    setLocation(presetLoc);
    setWaterScheduleDays(days);
    setSunlightLevel(light);
    setImageUrl(img);
    setPhotoMode('preset');
  };

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setCustomPhotoDataUrl(reader.result);
        setCustomPhotoName(file.name);
        setPhotoMode('upload');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleClearCustomPhoto = () => {
    setCustomPhotoDataUrl(null);
    setCustomPhotoName('');
    setImageUrl(PRESET_IMAGES[0].url);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E2E8E0] relative flex flex-col"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#EDF2EC] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#14381F] tracking-tight">
                🌿 Add Your Plant
              </h2>
              <p className="text-xs text-[#52796F]">
                Track watering, sunlight schedule, and growth milestones
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Example Fill Pills */}
        <div className="px-6 pt-4 pb-2 bg-[#F8FAF7] border-b border-[#EDF2EC]">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">
            Quick Fill Examples:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset('Minty', 'Mint', 'Window', 2, 'Bright Indirect Light', PRESET_IMAGES[0].url)}
              className="text-xs font-semibold px-3 py-1 bg-white border border-[#CBD5E1] hover:border-[#16A34A] hover:text-[#16A34A] rounded-lg transition-colors flex items-center gap-1.5"
            >
              🌱 Minty (Window / 2 days)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('Sunny Monstera', 'Monstera', 'Living Room', 7, 'Bright Indirect Light', PRESET_IMAGES[1].url)}
              className="text-xs font-semibold px-3 py-1 bg-white border border-[#CBD5E1] hover:border-[#16A34A] hover:text-[#16A34A] rounded-lg transition-colors flex items-center gap-1.5"
            >
              🌿 Monstera (Living Room / 7 days)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('Zoe', 'Snake Plant', 'Bedroom Shelf', 14, 'Partial Shade', PRESET_IMAGES[2].url)}
              className="text-xs font-semibold px-3 py-1 bg-white border border-[#CBD5E1] hover:border-[#16A34A] hover:text-[#16A34A] rounded-lg transition-colors flex items-center gap-1.5"
            >
              🪴 Snake Plant (Bedroom / 14 days)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Section 2: Plant Name & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1.5">
                Plant Name *
              </label>
              <input
                id="input-plant-name"
                type="text"
                required
                placeholder="e.g. Minty"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none text-sm font-semibold transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1.5">
                Plant Type *
              </label>
              <input
                id="input-plant-type"
                type="text"
                required
                placeholder="e.g. Mint, Monstera, Basil..."
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none text-sm font-semibold transition-all"
              />
            </div>
          </div>

          {/* Plant Type Quick Chips */}
          <div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PLANT_TYPES.slice(0, 8).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                    type.toLowerCase() === t.toLowerCase()
                      ? 'bg-[#16A34A] text-white'
                      : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Date Planted & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Date Planted</span>
              </label>
              <input
                id="input-date-planted"
                type="text"
                placeholder="e.g. September 10, 2026"
                value={datePlanted}
                onChange={(e) => setDatePlanted(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none text-sm font-semibold transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Location</span>
              </label>
              <input
                id="input-location"
                type="text"
                placeholder="e.g. Window, Balcony, Desk"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none text-sm font-semibold transition-all"
              />
            </div>
          </div>

          {/* Sunlight & Water Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Amount of Sunlight</span>
              </label>
              <select
                id="select-sunlight"
                value={sunlightLevel}
                onChange={(e) => setSunlightLevel(e.target.value as SunlightLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none text-sm font-semibold bg-white"
              >
                <option value="Bright Indirect Light">Bright Indirect Light (Recommended)</option>
                <option value="Direct Full Sun">Direct Full Sun</option>
                <option value="Partial Shade">Partial Shade</option>
                <option value="Low Light">Low Light</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Watering Schedule</span>
              </label>
              <select
                id="select-water-schedule"
                value={waterScheduleDays}
                onChange={(e) => setWaterScheduleDays(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none text-sm font-semibold bg-white"
              >
                <option value="1">Every day (1 day)</option>
                <option value="2">Every 2 days (e.g. Mint)</option>
                <option value="3">Every 3 days</option>
                <option value="5">Every 5 days</option>
                <option value="7">Every 7 days (Weekly, e.g. Monstera)</option>
                <option value="10">Every 10 days</option>
                <option value="14">Every 14 days (e.g. Snake Plant)</option>
              </select>
            </div>
          </div>

          {/* Initial Height & Initial Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F8FAF7] border border-[#EDF2EC]">
            <div>
              <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Initial Height (cm)</span>
              </label>
              <input
                id="input-initial-height"
                type="number"
                step="0.5"
                min="0"
                value={initialHeight}
                onChange={(e) => setInitialHeight(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#16A34A] outline-none text-sm font-semibold bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1.5">
                Initial Condition
              </label>
              <select
                id="select-initial-condition"
                value={initialCondition}
                onChange={(e) => setInitialCondition(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#16A34A] outline-none text-sm font-semibold bg-white"
              >
                <option value="Healthy 🌱">Healthy 🌱</option>
                <option value="Growing well 🌿">Growing well 🌿</option>
                <option value="Fresh Cutting 🍃">Fresh Cutting 🍃</option>
                <option value="Flowering 🌸">Flowering 🌸</option>
              </select>
            </div>
          </div>

          {/* Choose Plant Image: Custom Photo vs Botanical Presets */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-purple-600" />
                <span>Plant Photo</span>
              </label>

              {/* Source Mode Toggle */}
              <div className="flex items-center p-0.5 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPhotoMode('upload')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                    photoMode === 'upload'
                      ? 'bg-white text-[#16A34A] shadow-xs'
                      : 'text-[#64748B] hover:text-[#1E2922]'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Custom Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode('preset')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                    photoMode === 'preset'
                      ? 'bg-white text-[#16A34A] shadow-xs'
                      : 'text-[#64748B] hover:text-[#1E2922]'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Botanical Presets</span>
                </button>
              </div>
            </div>

            {/* Upload from Gallery / Phone Files */}
            {photoMode === 'upload' && (
              <div className="space-y-3">
                {customPhotoDataUrl ? (
                  /* Uploaded Photo Preview Card */
                  <div className="p-3 bg-[#F0FDF4] rounded-2xl border-2 border-[#86EFAC] flex items-center gap-3.5">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#BBF7D0] shadow-xs bg-white">
                      <img
                        src={customPhotoDataUrl}
                        alt="Custom plant photo preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 bg-[#16A34A] text-white p-0.5 rounded-full">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                        <span>Custom Photo Ready</span>
                      </div>
                      <p className="text-xs font-semibold text-[#1E2922] truncate">
                        {customPhotoName || 'Plant Photo'}
                      </p>
                      <p className="text-[11px] text-[#52796F]">
                        Will be displayed on your plant card & timeline
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[11px] font-bold text-[#166534] hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Choose Another</span>
                        </button>
                        <span className="text-gray-300">•</span>
                        <button
                          type="button"
                          onClick={handleClearCustomPhoto}
                          className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Drag and Drop / Photo Picker Zone */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
                      isDragging
                        ? 'border-[#16A34A] bg-[#F0FDF4] scale-[0.99]'
                        : 'border-[#CBD5E1] hover:border-[#16A34A] bg-[#F8FAF7]'
                    }`}
                  >
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-white text-[#16A34A] border border-[#CBD5E1] mx-auto flex items-center justify-center shadow-xs">
                        <ImageIcon className="w-6 h-6 text-[#16A34A]" />
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#1E2922]">
                          Upload From Photo Gallery or Phone Files
                        </h4>
                        <p className="text-[11px] text-[#64748B] mt-0.5">
                          Drag and drop your photo here, or select from your device
                        </p>
                      </div>

                      {/* Action Buttons for Mobile & Desktop */}
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2 bg-[#16A34A] hover:bg-[#15803D] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Browse Gallery / Files</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="px-3 py-2 bg-white hover:bg-gray-100 text-[#1E2922] border border-[#CBD5E1] active:scale-95 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5 text-purple-600" />
                          <span>Take Photo</span>
                        </button>
                      </div>

                      <p className="text-[10px] text-gray-400">
                        Supports JPG, PNG, WEBP, HEIC from camera roll
                      </p>
                    </div>
                  </div>
                )}

                {/* Hidden File and Camera Inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            )}

            {/* Preset Botanical Photos */}
            {photoMode === 'preset' && (
              <div>
                <p className="text-[11px] text-[#64748B] mb-2 font-medium">
                  Select one of our curated high-resolution botanical plant portraits:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setImageUrl(img.url)}
                      className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        imageUrl === img.url
                          ? 'border-[#16A34A] ring-2 ring-[#86EFAC] scale-98'
                          : 'border-transparent hover:opacity-80'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {imageUrl === img.url && (
                        <div className="absolute top-1 right-1 bg-[#16A34A] text-white p-0.5 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate font-medium">
                        {img.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1.5">
              Care Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Loves morning sun, keep saucer drained, mist weekly..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#16A34A] outline-none text-sm transition-all"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#EDF2EC] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 text-sm font-semibold text-[#64748B] hover:bg-[#F1F5F9] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-add-plant-btn"
              type="submit"
              className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803D] active:scale-95 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Leaf className="w-4 h-4" />
              <span>Save & Start Tracking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
