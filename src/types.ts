export type PlantHealthStatus = 'healthy' | 'needs_attention' | 'needs_care';

export type SunlightLevel = 
  | 'Low Light' 
  | 'Partial Shade' 
  | 'Bright Indirect Light' 
  | 'Direct Full Sun';

export type ReminderType = 
  | 'water' 
  | 'sunlight' 
  | 'growth_check' 
  | 'repot' 
  | 'fertilize' 
  | 'prune' 
  | 'photo';

export interface GrowthRecord {
  id: string;
  plantId: string;
  date: string; // e.g., 'Sept. 10, 2026' or '2026-09-10'
  heightCm: number;
  condition: string; // 'Healthy 🌱', 'Growing well 🌿', 'Flowering 🌸'
  notes?: string;
}

export interface GrowthPhoto {
  id: string;
  plantId: string;
  weekLabel: string; // 'Week 1', 'Week 2', 'Week 3', 'Week 4'
  date: string;
  imageUrl: string;
  caption?: string;
  heightCm?: number;
}

export interface PlantReminder {
  id: string;
  plantId: string;
  plantName: string;
  type: ReminderType;
  title: string;
  description: string;
  dueDate: string; // '2026-09-18'
  isCompleted: boolean;
  completedAt?: string;
  snoozedUntil?: string;
}

export interface PlantCareTip {
  id: string;
  plantType: string;
  title: string;
  tip: string;
  waterAdvice: string;
  sunlightAdvice: string;
  funFact?: string;
  iconName?: string;
}

export interface Plant {
  id: string;
  name: string; // e.g. "Minty"
  type: string; // e.g. "Mint"
  datePlanted: string; // e.g. "September 10, 2026"
  location: string; // e.g. "Window"
  sunlightLevel: SunlightLevel;
  waterScheduleDays: number; // e.g. 2 for "Every 2 days"
  waterScheduleLabel: string; // "Every 2 days"
  lastWateredDate: string; // ISO date string or formatted
  lastSunlightCheckDate?: string;
  status: PlantHealthStatus;
  statusReason?: string;
  imageUrl: string;
  notes?: string;
  potSize?: string;
}

export type PaymentMethodType = 'gcash' | 'paymaya' | 'card';

export interface SubscriptionDetails {
  planId: 'monthly_20' | 'monthly_99';
  planName: string; // e.g. "Plant Track Pro (Monthly)"
  pricePhp: number; // 20
  currency: 'PHP';
  billingCycle: 'monthly';
  status: 'active' | 'inactive' | 'cancelled';
  paymentMethod: PaymentMethodType;
  paymentDetails: {
    phoneNumber?: string; // for GCash / PayMaya e.g. 0917-XXX-XXXX
    cardLast4?: string; // for Card e.g. 4242
    cardBrand?: string; // Visa / Mastercard / BancNet
    accountName?: string;
  };
  startDate: string;
  nextBillingDate: string;
  transactionReference: string; // e.g. TXN-PHP-998242
  autoRenew: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: 'google' | 'facebook' | 'password' | 'guest';
  isAnonymous?: boolean;
  subscriptionPlan: 'free' | 'premium_monthly';
  subscription?: SubscriptionDetails | null;
  createdAt: string;
  lastLoginAt: string;
}
