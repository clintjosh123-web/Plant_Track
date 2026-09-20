import React, { useState, useRef } from 'react';
import { 
  X, 
  Printer, 
  Leaf, 
  Droplets, 
  Sun, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  User, 
  Home, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { usePlantContext } from '../context/PlantContext';
import { useAuth } from '../context/AuthContext';

interface CareSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareSheetModal: React.FC<CareSheetModalProps> = ({ isOpen, onClose }) => {
  const { plants } = usePlantContext();
  const { isPro, setIsSubscribeModalOpen } = useAuth();

  const [sitterName, setSitterName] = useState('Friendly Plant Sitter');
  const [emergencyPhone, setEmergencyPhone] = useState('+63 917 123 4567');
  const [houseNotes, setHouseNotes] = useState(
    'Please water the balcony plants in the morning. Keep curtains half-open for afternoon indirect sun.'
  );

  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-3xl p-5 sm:p-7 shadow-2xl border border-[#E2E8E0] relative flex flex-col space-y-6 my-auto max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-extrabold border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Pro Feature • ₱20/month</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#14381F] tracking-tight">
                Garden Care & Plant Sitter Sheet
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPro && (
              <button
                type="button"
                onClick={handlePrint}
                className="py-2 px-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pro Gating Notice if not Pro */}
        {!isPro && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Plant Track Pro Exclusive Feature</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Generate high-resolution printable care cards and vacation instructions for your plant sitters for only <strong>₱20/month</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsSubscribeModalOpen(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 transition-transform active:scale-95"
            >
              Upgrade for ₱20/mo
            </button>
          </div>
        )}

        {/* Printable Content Area */}
        <div ref={printAreaRef} className="space-y-5 bg-white p-2 sm:p-4 rounded-2xl border border-gray-100 print:border-none print:p-0">
          {/* Printable Header */}
          <div className="text-center pb-4 border-b border-gray-200">
            <div className="flex items-center justify-center gap-2 text-[#16A34A] font-black text-xl">
              <Leaf className="w-6 h-6" />
              <span>Plant Track • Official Garden Care Guide</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Care Instructions & Watering Schedule for My Plant Sanctuary
            </p>
          </div>

          {/* Sitter & Emergency Contact Notes (Editable for Pro) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F8FAF7] p-3.5 rounded-2xl border border-[#EDF2EC] text-xs">
            <div className="space-y-1">
              <span className="font-bold text-[#14381F] flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Designated Plant Sitter:</span>
              </span>
              <input
                type="text"
                value={sitterName}
                onChange={(e) => setSitterName(e.target.value)}
                className="w-full bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 font-semibold text-gray-800 text-xs"
                placeholder="Name of sitter"
              />
            </div>

            <div className="space-y-1">
              <span className="font-bold text-[#14381F] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Emergency Contact Number:</span>
              </span>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 font-semibold text-gray-800 text-xs"
                placeholder="Phone number"
              />
            </div>

            <div className="sm:col-span-2 space-y-1 pt-1">
              <span className="font-bold text-[#14381F] flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>General House & Environment Notes:</span>
              </span>
              <textarea
                rows={2}
                value={houseNotes}
                onChange={(e) => setHouseNotes(e.target.value)}
                className="w-full bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-xs resize-none"
              />
            </div>
          </div>

          {/* Plant Schedule Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#14381F] flex items-center gap-1.5">
              <span>Plant Roster ({plants.length} Plants)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plants.map((plant, idx) => (
                <div 
                  key={plant.id} 
                  className="p-3.5 rounded-2xl border border-gray-200 bg-white shadow-2xs space-y-2.5 print:break-inside-avoid"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={plant.imageUrl} 
                        alt={plant.name} 
                        className="w-11 h-11 rounded-xl object-cover border border-gray-200 shrink-0" 
                      />
                      <div>
                        <h4 className="font-extrabold text-sm text-[#14381F]">
                          {plant.name}
                        </h4>
                        <div className="text-[11px] text-gray-500 font-medium">
                          {plant.type} • {plant.location}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#F8FAF7] p-2 rounded-xl border border-[#EDF2EC]">
                    <div>
                      <span className="text-gray-400 block font-medium">Watering</span>
                      <span className="font-bold text-[#14381F] flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-500" />
                        {plant.waterScheduleLabel}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block font-medium">Sunlight</span>
                      <span className="font-bold text-[#14381F] flex items-center gap-1 truncate" title={plant.sunlightLevel}>
                        <Sun className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate">{plant.sunlightLevel}</span>
                      </span>
                    </div>
                  </div>

                  {plant.notes && (
                    <div className="text-[11px] text-gray-600 italic bg-gray-50 p-2 rounded-lg">
                      "{plant.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Plant Sitter Checklist */}
          <div className="p-3 rounded-xl border border-dashed border-gray-300 text-xs text-gray-600 space-y-1 print:block">
            <span className="font-bold text-gray-700 block">Sitter Quick Checklist:</span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <div>☐ Touch top 1 inch of soil before watering</div>
              <div>☐ Empty excess water from drip saucers</div>
              <div>☐ Keep foliage away from direct AC blast</div>
              <div>☐ Contact owner if leaves drop or wilt</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 print:hidden">
          <span className="text-[11px] text-gray-500">
            Plant Track Pro • Philippine Edition • ₱20/month
          </span>

          <div className="flex items-center gap-2">
            {isPro ? (
              <button
                type="button"
                onClick={handlePrint}
                className="py-2 px-4 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Care Guide</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsSubscribeModalOpen(true);
                }}
                className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Unlock Printing (₱20/mo)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
