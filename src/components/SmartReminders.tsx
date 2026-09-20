import React, { useState } from 'react';
import { 
  Bell, 
  Droplets, 
  Sun, 
  Sprout, 
  Sparkles, 
  Scissors, 
  Camera, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Plus, 
  Filter,
  Check,
  RotateCcw,
  X
} from 'lucide-react';
import { usePlantContext } from '../context/PlantContext';
import { ReminderType, PlantReminder } from '../types';

export const SmartReminders: React.FC = () => {
  const { 
    plants, 
    reminders, 
    toggleReminder, 
    snoozeReminder, 
    waterPlant, 
    resolveSunlight,
    addReminder 
  } = usePlantContext();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form state for adding custom reminder
  const [plantId, setPlantId] = useState<string>(plants[0]?.id || '');
  const [type, setType] = useState<ReminderType>('water');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const reminderTypes = [
    { id: 'all', label: 'All Reminders', icon: Bell },
    { id: 'water', label: '💧 Watering', icon: Droplets, color: 'text-blue-500' },
    { id: 'sunlight', label: '☀️ Sunlight', icon: Sun, color: 'text-amber-500' },
    { id: 'growth_check', label: '🌱 Growth checking', icon: Sprout, color: 'text-emerald-500' },
    { id: 'repot', label: '🪴 Repotting', icon: Sparkles, color: 'text-orange-500' },
    { id: 'fertilize', label: '🌿 Fertilizing', icon: Sprout, color: 'text-green-600' },
    { id: 'prune', label: '✂️ Pruning', icon: Scissors, color: 'text-rose-500' },
    { id: 'photo', label: '📸 Growth Photo', icon: Camera, color: 'text-purple-500' },
  ];

  // Filter reminders
  const filteredReminders = reminders.filter((rem) => {
    const matchesType = selectedType === 'all' || rem.type === selectedType;
    const matchesCompletion = showCompleted ? true : !rem.isCompleted;
    return matchesType && matchesCompletion;
  });

  const pendingCount = reminders.filter((r) => !r.isCompleted).length;
  const completedCount = reminders.filter((r) => r.isCompleted).length;

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPlant = plants.find((p) => p.id === plantId) || plants[0];
    if (!title.trim() || !targetPlant) return;

    addReminder({
      plantId: targetPlant.id,
      plantName: targetPlant.name,
      type,
      title: title.trim(),
      description: description.trim() || 'Custom plant care reminder',
      dueDate,
      isCompleted: false,
    });

    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const getReminderIcon = (remType: ReminderType) => {
    switch (remType) {
      case 'water': return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'sunlight': return <Sun className="w-5 h-5 text-amber-500" />;
      case 'growth_check': return <Sprout className="w-5 h-5 text-emerald-500" />;
      case 'repot': return <Sparkles className="w-5 h-5 text-orange-500" />;
      case 'fertilize': return <Sprout className="w-5 h-5 text-green-600" />;
      case 'prune': return <Scissors className="w-5 h-5 text-rose-500" />;
      case 'photo': return <Camera className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold mb-2">
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>Section 6: Smart Reminders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14381F] tracking-tight">
            🔔 Smart Plant Reminders
          </h1>
          <p className="text-xs sm:text-sm text-[#52796F]">
            Automatic schedules for watering, light adjustments, repotting, pruning, and photo logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              showCompleted
                ? 'bg-[#16A34A] text-white border-[#16A34A]'
                : 'bg-white text-[#4A5D4E] border-[#CBD5E1] hover:bg-[#F8FAF7]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{showCompleted ? 'Showing All' : 'Hide Completed'}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        </div>
      </div>

      {/* Category Pills: All 7 requested types */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {reminderTypes.map((item) => {
          const isSelected = selectedType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedType(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#1E2922] text-white shadow-xs'
                  : 'bg-white text-[#4A5D4E] border border-[#E2E8E0] hover:bg-[#F8FAF7]'
              }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length > 0 ? (
          filteredReminders.map((rem) => {
            const isDueToday = rem.dueDate === new Date().toISOString().split('T')[0];
            const targetPlant = plants.find((p) => p.id === rem.plantId);

            return (
              <div
                key={rem.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  rem.isCompleted
                    ? 'bg-[#F8FAF7] border-[#EDF2EC] opacity-60'
                    : isDueToday
                    ? 'bg-white border-amber-300 shadow-xs ring-1 ring-amber-200'
                    : 'bg-white border-[#E2E8E0] shadow-xs hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    rem.isCompleted ? 'bg-gray-100' : 'bg-[#F8FAF7] border border-[#EDF2EC]'
                  }`}>
                    {getReminderIcon(rem.type)}
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#166534]">
                        {targetPlant?.name || rem.plantName}
                      </span>
                      {isDueToday && !rem.isCompleted && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                          Due Today ⏰
                        </span>
                      )}
                      {rem.isCompleted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                          Completed ✅
                        </span>
                      )}
                    </div>
                    <h3 className={`font-bold text-sm sm:text-base text-[#1E2922] ${rem.isCompleted ? 'line-through text-gray-500' : ''}`}>
                      {rem.title}
                    </h3>
                    <p className="text-xs text-[#52796F] leading-relaxed">
                      {rem.description}
                    </p>
                    <div className="text-[11px] text-[#94A3B8] flex items-center gap-2 pt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>Scheduled for {rem.dueDate}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Context actions for water / sun */}
                  {rem.type === 'water' && !rem.isCompleted && (
                    <button
                      onClick={() => waterPlant(rem.plantId)}
                      className="px-3 py-1.5 bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#1D4ED8] text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Droplets className="w-3.5 h-3.5 fill-current" />
                      <span>Watered</span>
                    </button>
                  )}

                  {rem.type === 'sunlight' && !rem.isCompleted && (
                    <button
                      onClick={() => resolveSunlight(rem.plantId)}
                      className="px-3 py-1.5 bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#B45309] text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Sun className="w-3.5 h-3.5 fill-current" />
                      <span>Moved to Sun</span>
                    </button>
                  )}

                  {!rem.isCompleted && (
                    <button
                      onClick={() => snoozeReminder(rem.id)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Snooze
                    </button>
                  )}

                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
                      rem.isCompleted
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-[#16A34A] hover:bg-[#15803D] text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{rem.isCompleted ? 'Mark Active' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E2E8E0] space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#14381F]">
              No reminders in this category!
            </h3>
            <p className="text-xs text-[#52796F] max-w-sm mx-auto">
              All plant care actions are up to date. You can add a new custom reminder anytime.
            </p>
          </div>
        )}
      </div>

      {/* Add Custom Reminder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-[#E2E8E0] space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#EDF2EC] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-[#1E2922]">
                  Add Smart Plant Reminder
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1">
                  Select Plant
                </label>
                <select
                  value={plantId}
                  onChange={(e) => setPlantId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] font-semibold text-sm bg-white"
                >
                  {plants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1">
                  Reminder Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ReminderType)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] font-semibold text-sm bg-white"
                >
                  <option value="water">💧 Watering</option>
                  <option value="sunlight">☀️ Sunlight adjustment</option>
                  <option value="growth_check">🌱 Growth checking & measuring</option>
                  <option value="repot">🪴 Repotting</option>
                  <option value="fertilize">🌿 Fertilizing</option>
                  <option value="prune">✂️ Pruning & Trimming</option>
                  <option value="photo">📸 Taking weekly growth photo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Check soil moisture & water"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Top 2 cm dry, bottom soak with lukewarm water."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] font-semibold text-sm"
                />
              </div>

              <div className="pt-3 border-t border-[#EDF2EC] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-bold rounded-xl shadow-xs"
                >
                  Create Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
