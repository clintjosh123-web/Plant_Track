import React from 'react';
import { usePlantContext } from '../context/PlantContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = usePlantContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border backdrop-blur-md transition-all animate-slideUp ${
            toast.type === 'success'
              ? 'bg-[#14532D]/95 text-white border-[#22C55E]'
              : toast.type === 'warning'
              ? 'bg-[#78350F]/95 text-white border-[#F59E0B]'
              : 'bg-[#0F172A]/95 text-white border-[#475569]'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#4ADE80] shrink-0" />}
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-[#FBBF24] shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#38BDF8] shrink-0" />}
          <span className="text-xs sm:text-sm font-semibold leading-tight">
            {toast.message}
          </span>
        </div>
      ))}
    </div>
  );
};
