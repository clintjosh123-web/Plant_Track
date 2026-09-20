import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  facebookProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  User
} from '../lib/firebase';
import { UserProfile, SubscriptionDetails, PaymentMethodType } from '../types';
import confetti from 'canvas-confetti';

interface AuthContextType {
  user: UserProfile | null;
  isPro: boolean;
  loading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isSubscribeModalOpen: boolean;
  setIsSubscribeModalOpen: (open: boolean) => void;
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  
  // Auth methods
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithFacebook: () => Promise<{ success: boolean; error?: string }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoUser: (provider: 'google' | 'facebook') => void;
  logout: () => Promise<void>;
  
  // Subscription methods
  subscribeMonthly: (
    method: PaymentMethodType, 
    details: { phoneNumber?: string; cardLast4?: string; cardBrand?: string; accountName?: string }
  ) => Promise<{ success: boolean; error?: string }>;
  cancelSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'plant_track_user_profile_v1';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState<boolean>(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Sync user profile with Firestore and localStorage
  const syncUserProfile = async (firebaseUser: User, providerType: 'google' | 'facebook' | 'password' | 'guest') => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      const now = new Date().toISOString();
      let profileData: UserProfile;

      if (userDoc.exists()) {
        const existingData = userDoc.data() as UserProfile;
        profileData = {
          ...existingData,
          displayName: firebaseUser.displayName || existingData.displayName || 'Plant Lover',
          email: firebaseUser.email || existingData.email,
          photoURL: firebaseUser.photoURL || existingData.photoURL,
          lastLoginAt: now,
        };
        await updateDoc(userRef, {
          displayName: profileData.displayName,
          email: profileData.email,
          photoURL: profileData.photoURL,
          lastLoginAt: now,
        });
      } else {
        // Initial setup for new user
        profileData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Plant Lover',
          photoURL: firebaseUser.photoURL || null,
          provider: providerType,
          subscriptionPlan: 'free',
          subscription: null,
          createdAt: now,
          lastLoginAt: now,
        };
        await setDoc(userRef, {
          ...profileData,
          serverCreated: serverTimestamp(),
        });
      }

      setUser(profileData);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profileData));
    } catch (err) {
      console.warn('Firestore user sync fallback to local state:', err);
      const fallbackProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'Plant Lover',
        photoURL: firebaseUser.photoURL || null,
        provider: providerType,
        subscriptionPlan: user?.subscriptionPlan || 'free',
        subscription: user?.subscription || null,
        createdAt: user?.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      setUser(fallbackProfile);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(fallbackProfile));
    }
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const providerId = firebaseUser.providerData[0]?.providerId || 'password';
        const provider = providerId.includes('google')
          ? 'google'
          : providerId.includes('facebook')
          ? 'facebook'
          : 'password';
        await syncUserProfile(firebaseUser, provider);
      } else if (!user || user.provider !== 'guest') {
        // Only clear if not in an explicit simulated guest session
        // (preserves offline/local testing if needed)
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Save to localStorage whenever user state updates
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  }, [user]);

  // Google Sign-In
  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await syncUserProfile(result.user, 'google');
      setIsAuthModalOpen(false);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      } catch {}
      return { success: true };
    } catch (err: any) {
      console.error('Google sign in error:', err);
      // If blocked by iframe or browser popup restrictions, offer fallback
      return { 
        success: false, 
        error: err.message || 'Google sign in was cancelled or blocked by browser popup settings.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Facebook Sign-In
  const signInWithFacebook = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, facebookProvider);
      await syncUserProfile(result.user, 'facebook');
      setIsAuthModalOpen(false);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      } catch {}
      return { success: true };
    } catch (err: any) {
      console.error('Facebook sign in error:', err);
      return { 
        success: false, 
        error: err.message || 'Facebook sign in was cancelled or requires Facebook App Client configuration.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign-In
  const signInWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, pass);
      await syncUserProfile(result.user, 'password');
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Invalid email or password.' };
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign-Up
  const signUpWithEmail = async (email: string, pass: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (result.user && name) {
        await updateProfile(result.user, { displayName: name });
      }
      await syncUserProfile(result.user, 'password');
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo / Simulated Login (Ideal for iframe testing without popups)
  const loginAsDemoUser = (provider: 'google' | 'facebook') => {
    const isGoogle = provider === 'google';
    const demoProfile: UserProfile = {
      uid: isGoogle ? 'google-demo-user-101' : 'facebook-demo-user-202',
      email: isGoogle ? 'acostajustin392@gmail.com' : 'justin.acosta.ph@facebook.com',
      displayName: isGoogle ? 'Justin Acosta' : 'Justin Acosta (FB)',
      photoURL: isGoogle 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      provider: provider,
      subscriptionPlan: user?.subscriptionPlan || 'free',
      subscription: user?.subscription || null,
      createdAt: user?.createdAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    setUser(demoProfile);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoProfile));
    setIsAuthModalOpen(false);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch {}
  };

  // Logout
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {}
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  // Subscribe Monthly (₱20 Philippine Pesos)
  const subscribeMonthly = async (
    method: PaymentMethodType,
    details: { phoneNumber?: string; cardLast4?: string; cardBrand?: string; accountName?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      setIsAuthModalOpen(true);
      return { success: false, error: 'Please log in first to activate your subscription.' };
    }

    try {
      setLoading(true);
      const now = new Date();
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const refCode = `PH-${method.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const newSub: SubscriptionDetails = {
        planId: 'monthly_20',
        planName: 'Plant Track Pro (₱20/mo)',
        pricePhp: 20,
        currency: 'PHP',
        billingCycle: 'monthly',
        status: 'active',
        paymentMethod: method,
        paymentDetails: details,
        startDate: now.toISOString().split('T')[0],
        nextBillingDate: nextMonth.toISOString().split('T')[0],
        transactionReference: refCode,
        autoRenew: true,
      };

      const updatedUser: UserProfile = {
        ...user,
        subscriptionPlan: 'premium_monthly',
        subscription: newSub,
      };

      // Sync to Firestore
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          subscriptionPlan: 'premium_monthly',
          subscription: newSub,
          lastPaymentDate: now.toISOString(),
        });

        // Record in subscriptions collection for auditing
        const subRecordRef = doc(db, 'subscriptions', refCode);
        await setDoc(subRecordRef, {
          userId: user.uid,
          userEmail: user.email,
          plan: 'monthly_20',
          amount: 20,
          currency: 'PHP',
          paymentMethod: method,
          details,
          reference: refCode,
          createdAt: serverTimestamp(),
          status: 'paid',
        });
      } catch (err) {
        console.warn('Firestore subscription sync warning (saved locally):', err);
      }

      setUser(updatedUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updatedUser));
      setIsSubscribeModalOpen(false);
      setIsReceiptModalOpen(true);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22C55E', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6']
        });
      } catch {}

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Payment processing failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // Cancel Subscription
  const cancelSubscription = async () => {
    if (!user || !user.subscription) return;
    const updatedSub: SubscriptionDetails = {
      ...user.subscription,
      status: 'cancelled',
      autoRenew: false,
    };
    const updatedUser: UserProfile = {
      ...user,
      subscriptionPlan: 'free',
      subscription: updatedSub,
    };

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        subscriptionPlan: 'free',
        'subscription.status': 'cancelled',
        'subscription.autoRenew': false,
      });
    } catch {}

    setUser(updatedUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isPro: user?.subscriptionPlan === 'premium_monthly',
        loading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSubscribeModalOpen,
        setIsSubscribeModalOpen,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        authModalMode,
        setAuthModalMode,
        signInWithGoogle,
        signInWithFacebook,
        signInWithEmail,
        signUpWithEmail,
        loginAsDemoUser,
        logout,
        subscribeMonthly,
        cancelSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
