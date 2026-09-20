import React, { useState } from 'react';
import { 
  X, 
  Check, 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Building2,
  CheckCircle2,
  Receipt,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PaymentMethodType } from '../types';

export const SubscriptionModal: React.FC = () => {
  const { 
    isSubscribeModalOpen, 
    setIsSubscribeModalOpen, 
    user, 
    setIsAuthModalOpen,
    subscribeMonthly 
  } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('gcash');
  
  // GCash & PayMaya state - strictly blank by default
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  // Card state - strictly blank by default
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardBank, setCardBank] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isSubscribeModalOpen) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!user) {
      setIsSubscribeModalOpen(false);
      setIsAuthModalOpen(true);
      return;
    }

    setIsProcessing(true);

    let details: { phoneNumber?: string; cardLast4?: string; cardBrand?: string; accountName?: string } = {};

    if (paymentMethod === 'gcash' || paymentMethod === 'paymaya') {
      const cleanPhone = phoneNumber.replace(/[\s\-]+/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        setErrorMsg('Please enter a valid Philippine mobile number (e.g. 0917XXXXXXX).');
        setIsProcessing(false);
        return;
      }
      if (!accountName.trim()) {
        setErrorMsg(`Please enter the account holder name registered on ${paymentMethod === 'gcash' ? 'GCash' : 'PayMaya'}.`);
        setIsProcessing(false);
        return;
      }
      details = {
        phoneNumber: cleanPhone,
        accountName: accountName.trim(),
      };
    } else {
      const cleanCard = cardNumber.replace(/[\s\-]+/g, '');
      if (cleanCard.length < 16) {
        setErrorMsg('Please enter a valid 16-digit debit or credit card number.');
        setIsProcessing(false);
        return;
      }
      if (!cardName.trim()) {
        setErrorMsg('Please enter the cardholder name as printed on the card.');
        setIsProcessing(false);
        return;
      }
      if (!cardExpiry.trim() || !cardExpiry.includes('/')) {
        setErrorMsg('Please enter card expiry in MM/YY format.');
        setIsProcessing(false);
        return;
      }
      if (cardCvv.trim().length < 3) {
        setErrorMsg('Please enter a 3 or 4 digit CVV/CVC.');
        setIsProcessing(false);
        return;
      }
      details = {
        cardLast4: cleanCard.slice(-4),
        cardBrand: cleanCard.startsWith('4') ? 'Visa' : cleanCard.startsWith('5') ? 'Mastercard' : 'BancNet',
        accountName: cardName.trim(),
      };
    }

    // Simulate payment gateway handoff (PayMongo / GCash API / Maya Checkout)
    setTimeout(async () => {
      const res = await subscribeMonthly(paymentMethod, details);
      setIsProcessing(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Payment could not be completed.');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-xl p-5 sm:p-7 shadow-2xl border border-[#E2E8E0] relative flex flex-col space-y-5 my-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsSubscribeModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Plan Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Plant Track Pro Membership</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#14381F] tracking-tight">
            Upgrade to Plant Track Pro
          </h2>
          <p className="text-xs sm:text-sm text-[#52796F]">
            Unlock unlimited plant care records, smart notifications, and cloud database sync.
          </p>

          {/* Pricing Highlight */}
          <div className="inline-flex items-baseline gap-1 py-1.5 px-4 rounded-2xl bg-[#E8F5E9] border border-[#CDE5D0] text-[#14381F] my-1">
            <span className="text-3xl font-extrabold text-[#16A34A]">₱20</span>
            <span className="text-xs font-bold text-[#14381F]">/ month</span>
            <span className="text-[10px] text-gray-500 ml-1.5">(Philippine Pesos • VAT incl.)</span>
          </div>
        </div>

        {/* Features Checklist - Expanded for Subscription */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1E2922] bg-[#F8FAF7] p-3.5 rounded-2xl border border-[#EDF2EC]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span><strong>Unlimited</strong> plants & indoor garden spaces</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span><strong>🩺 AI Plant Doctor</strong> & smart leaf symptom diagnoser</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span><strong>📄 Printable Care Sheet</strong> & plant sitter guide</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span><strong>📸 Weekly photo</strong> timelapse comparison studio</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span><strong>🔔 Advanced reminders</strong> (fertilizer, repot, misting)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span><strong>☁️ Firebase Cloud Sync</strong> across all devices</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span><strong>🌟 Pro Member Badge</strong> & ad-free experience</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span><strong>Cancel anytime</strong> with 1-click in app</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Payment Method Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider">
            Select Philippine Payment Method
          </label>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* GCash */}
            <button
              type="button"
              onClick={() => setPaymentMethod('gcash')}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center space-y-1.5 relative ${
                paymentMethod === 'gcash'
                  ? 'border-[#005CEE] bg-[#F0F5FF] text-[#005CEE] shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#005CEE] text-white flex items-center justify-center font-black text-xs shadow-2xs">
                G
              </div>
              <span className="text-xs font-extrabold">GCash</span>
              <span className="text-[10px] text-gray-500 font-medium">E-Money</span>
              {paymentMethod === 'gcash' && (
                <div className="absolute top-1 right-1 bg-[#005CEE] text-white p-0.5 rounded-full">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>

            {/* PayMaya / Maya */}
            <button
              type="button"
              onClick={() => setPaymentMethod('paymaya')}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center space-y-1.5 relative ${
                paymentMethod === 'paymaya'
                  ? 'border-[#00D632] bg-[#F0FDF4] text-[#14532D] shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#002244] text-[#00D632] flex items-center justify-center font-black text-xs shadow-2xs">
                M
              </div>
              <span className="text-xs font-extrabold">PayMaya</span>
              <span className="text-[10px] text-gray-500 font-medium">Maya Wallet</span>
              {paymentMethod === 'paymaya' && (
                <div className="absolute top-1 right-1 bg-[#00D632] text-white p-0.5 rounded-full">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>

            {/* PH Debit / Credit Card */}
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center space-y-1.5 relative ${
                paymentMethod === 'card'
                  ? 'border-[#16A34A] bg-[#F0FDF4] text-[#14532D] shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-2xs">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold">PH Card</span>
              <span className="text-[10px] text-gray-500 font-medium">Debit / Credit</span>
              {paymentMethod === 'card' && (
                <div className="absolute top-1 right-1 bg-[#16A34A] text-white p-0.5 rounded-full">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubscribe} className="space-y-3.5">
          {/* GCash Flow */}
          {paymentMethod === 'gcash' && (
            <div className="p-4 rounded-2xl bg-[#F0F5FF] border border-[#BFDBFE] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#005CEE] text-white text-[11px] font-black flex items-center justify-center">
                    G
                  </div>
                  <span className="text-xs font-bold text-[#005CEE]">GCash E-Money Checkout</span>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-blue-700 font-bold border border-blue-200">
                  Instant Verification
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  GCash Registered Mobile Number (Philippines)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">+63</span>
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="09XXXXXXXXX"
                    className="w-full pl-12 pr-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs sm:text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#005CEE]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Account Name on GCash
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Full name registered on GCash"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs sm:text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#005CEE]"
                />
              </div>

              <p className="text-[11px] text-gray-500 leading-tight">
                📱 You will receive a prompt to authorize ₱20.00 payment to the Plant Track merchant account.
              </p>
            </div>
          )}

          {/* PayMaya / Maya Flow */}
          {paymentMethod === 'paymaya' && (
            <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#002244] text-[#00D632] text-[11px] font-black flex items-center justify-center">
                    M
                  </div>
                  <span className="text-xs font-bold text-[#15803D]">Maya / PayMaya Wallet</span>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-emerald-700 font-bold border border-emerald-200">
                  Maya Checkout
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Maya Registered Mobile Number (Philippines)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">+63</span>
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="09XXXXXXXXX"
                    className="w-full pl-12 pr-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs sm:text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#00D632]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Account Name on Maya
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Full name registered on Maya"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs sm:text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#00D632]"
                />
              </div>

              <p className="text-[11px] text-gray-500 leading-tight">
                💚 Connect directly to your Maya wallet balance or Maya Credit for ₱20.00/mo.
              </p>
            </div>
          )}

          {/* Card Flow */}
          {paymentMethod === 'card' && (
            <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">
                  Philippine Debit or Credit Card
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">
                  Visa • Mastercard • BancNet
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Cardholder Full Name
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz"
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-mono outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1">
                    <span className="text-[10px] font-bold text-gray-400">PH Card</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-mono outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="CVV"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-mono outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                </div>
              </div>

              <p className="text-[10px] text-gray-400 flex items-center gap-1 pt-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>Protected by 256-bit bank grade encryption & 3D Secure</span>
              </p>
            </div>
          )}

          {/* Total & Submit Button */}
          <div className="pt-2 border-t border-[#EDF2EC] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-gray-500 block">Total Due Today</span>
              <div className="text-xl font-black text-[#14381F]">
                ₱20.00 <span className="text-xs font-semibold text-gray-500">PHP</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 py-3 bg-[#16A34A] hover:bg-[#15803D] active:scale-95 text-white font-bold text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing ₱20 Payment...</span>
                </>
              ) : (
                <>
                  <span>Authorize & Pay ₱20/mo</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Where Does The Money Go Explanatory Box */}
        <div className="bg-[#F8FAF7] p-3.5 rounded-2xl border border-[#EDF2EC] space-y-1.5 text-[11px] text-[#475569]">
          <div className="flex items-center gap-1.5 font-bold text-[#14381F]">
            <HelpCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span>Where is the money headed?</span>
          </div>
          <p className="leading-relaxed">
            In a live production environment, your ₱20.00 payment is processed by Bangko Sentral ng Pilipinas (BSP) regulated Philippine payment gateways (PayMongo, Maya Checkout, or GCash for Business) and routed directly to the <strong>Plant Track Merchant Business Account</strong> to maintain cloud servers and database storage. In this live prototype preview, payment executes in <strong>secure demo mode</strong> with real-time Firebase synchronization and zero real money charged.
          </p>
        </div>

        {/* Footnote */}
        <div className="text-center text-[10px] text-[#64748B] pt-0.5">
          🔒 Payments processed under Bangko Sentral ng Pilipinas (BSP) regulated standards. Automatic monthly renewal at ₱20; cancel any time.
        </div>
      </div>
    </div>
  );
};
