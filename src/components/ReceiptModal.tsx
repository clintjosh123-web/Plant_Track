import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Receipt, 
  Calendar, 
  CreditCard, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ReceiptModal: React.FC = () => {
  const { 
    isReceiptModalOpen, 
    setIsReceiptModalOpen, 
    user, 
    cancelSubscription 
  } = useAuth();

  if (!isReceiptModalOpen || !user || !user.subscription) return null;

  const sub = user.subscription;
  const isGcash = sub.paymentMethod === 'gcash';
  const isPaymaya = sub.paymentMethod === 'paymaya';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-[#E2E8E0] relative flex flex-col space-y-5 my-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsReceiptModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-3xl bg-[#DCFCE7] text-[#16A34A] border-2 border-[#86EFAC] mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E8F5E9] text-[#166534] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Subscription Active</span>
          </div>

          <h3 className="text-2xl font-black text-[#14381F] tracking-tight">
            Plant Track Pro (Monthly)
          </h3>
          <p className="text-xs text-[#52796F]">
            Official Electronic Receipt & Confirmation
          </p>
        </div>

        {/* Philippine Receipt Card */}
        <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E8F0] space-y-3 font-mono text-xs">
          <div className="flex justify-between border-b border-dashed border-gray-300 pb-2">
            <span className="text-gray-500 font-sans font-bold">Transaction Ref:</span>
            <span className="font-bold text-gray-800">{sub.transactionReference}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 font-sans">Subscriber:</span>
            <span className="font-sans font-bold text-gray-800">{user.displayName || user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 font-sans">Payment Method:</span>
            <span className="font-sans font-bold text-gray-800 flex items-center gap-1">
              {isGcash ? 'GCash E-Money' : isPaymaya ? 'PayMaya / Maya' : `${sub.paymentDetails.cardBrand || 'PH'} Card`}
            </span>
          </div>

          {sub.paymentDetails.phoneNumber && (
            <div className="flex justify-between">
              <span className="text-gray-500 font-sans">Mobile Account:</span>
              <span className="font-bold text-gray-800">{sub.paymentDetails.phoneNumber}</span>
            </div>
          )}

          {sub.paymentDetails.cardLast4 && (
            <div className="flex justify-between">
              <span className="text-gray-500 font-sans">Card Ending:</span>
              <span className="font-bold text-gray-800">•••• {sub.paymentDetails.cardLast4}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-500 font-sans">Billing Cycle:</span>
            <span className="font-sans font-medium text-gray-700">Monthly Auto-Renew</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 font-sans">Next Renewal:</span>
            <span className="font-bold text-[#16A34A]">{sub.nextBillingDate}</span>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-2 flex justify-between text-sm">
            <span className="font-sans font-bold text-gray-800">Total Amount Paid:</span>
            <span className="font-black text-[#14381F]">₱20.00 PHP</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => setIsReceiptModalOpen(false)}
            className="w-full py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
          >
            Continue to My Garden 🌱
          </button>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <button
              type="button"
              onClick={handlePrint}
              className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Print / Save Receipt</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                if (window.confirm('Are you sure you want to cancel your ₱20/month Plant Track Pro subscription? You will retain access until the end of your billing cycle.')) {
                  await cancelSubscription();
                  setIsReceiptModalOpen(false);
                }
              }}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
