import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Database,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    loginAsDemoUser
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    if (isLogin) {
      const res = await signInWithEmail(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Login failed. Please check your credentials.');
      }
    } else {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        setSubmitting(false);
        return;
      }
      const res = await signUpWithEmail(email, password, name);
      if (!res.success) {
        setErrorMsg(res.error || 'Account creation failed. Please try again.');
      }
    }
    setSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setSubmitting(true);
    const res = await signInWithGoogle();
    if (!res.success) {
      setErrorMsg(res.error || 'Google login could not be completed.');
    }
    setSubmitting(false);
  };

  const handleFacebookLogin = async () => {
    setErrorMsg(null);
    setSubmitting(true);
    const res = await signInWithFacebook();
    if (!res.success) {
      setErrorMsg(res.error || 'Facebook login requires OAuth configuration in Firebase Console.');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl border border-[#E2E8E0] relative flex flex-col space-y-5"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#166534] text-xs font-bold border border-[#BBF7D0]">
            <Database className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Firebase Database & Auth</span>
          </div>

          <h2 className="text-2xl font-black text-[#14381F] tracking-tight">
            {isLogin ? 'Welcome Back to Plant Track' : 'Create Your Plant Track Account'}
          </h2>
          <p className="text-xs text-[#52796F]">
            {isLogin 
              ? 'Sign in to access your synchronized plants and reminders.'
              : 'Join fellow plant growers and sync your garden to Firebase Cloud.'}
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{errorMsg}</span>
              {errorMsg.includes('popup') || errorMsg.includes('cancelled') || errorMsg.includes('Facebook') ? (
                <div className="mt-1.5 pt-1.5 border-t border-red-200 text-[11px] text-red-800">
                  <span>💡 Tip: In preview mode, you can also use the <strong>1-Click Instant Login</strong> buttons below!</span>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Social Login Buttons: Gmail (Google) & Facebook */}
        <div className="space-y-2.5">
          {/* Google / Gmail */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-800 border border-[#CBD5E1] rounded-2xl text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-3 active:scale-98"
          >
            {/* Official Google SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Gmail (Google)</span>
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-3 active:scale-98"
          >
            {/* Official Facebook SVG */}
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Continue with Facebook</span>
          </button>
        </div>

        {/* 1-Click Instant Preview Sign-In (Convenience for iframe / sandbox users) */}
        <div className="p-3 rounded-2xl bg-[#F8FAF7] border border-[#EDF2EC] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#52796F]">
            <span>One-Click Instant Preview Login:</span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Bypasses iframe popup blocks</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => loginAsDemoUser('google')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-[#14532D] border border-[#BBF7D0] rounded-xl text-[11px] font-bold transition-colors truncate"
            >
              Sign in as Google User
            </button>
            <button
              type="button"
              onClick={() => loginAsDemoUser('facebook')}
              className="py-1.5 px-2 bg-white hover:bg-blue-50 text-[#1E3A8A] border border-blue-200 rounded-xl text-[11px] font-bold transition-colors truncate"
            >
              Sign in as FB User
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex-1 h-px bg-gray-200" />
          <span>or continue with email</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                placeholder="Justin Acosta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-[#16A34A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-[#16A34A]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-[#16A34A] hover:bg-[#15803D] active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer toggle */}
        <div className="text-center text-xs text-[#52796F] pt-2 border-t border-[#EDF2EC]">
          {isLogin ? (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setAuthModalMode('signup');
                }}
                className="font-bold text-[#16A34A] hover:underline"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setAuthModalMode('login');
                }}
                className="font-bold text-[#16A34A] hover:underline"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
