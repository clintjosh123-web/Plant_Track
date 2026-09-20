import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Plant, GrowthRecord, GrowthPhoto, PlantReminder, PlantHealthStatus } from '../types';
import { 
  INITIAL_PLANTS, 
  INITIAL_GROWTH_RECORDS, 
  INITIAL_GROWTH_PHOTOS, 
  INITIAL_REMINDERS 
} from '../data/initialData';
import { useAuth } from './AuthContext';
import { db, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from '../lib/firebase';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface PlantContextType {
  plants: Plant[];
  growthRecords: GrowthRecord[];
  growthPhotos: GrowthPhoto[];
  reminders: PlantReminder[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPlantId: string | null;
  setSelectedPlantId: (id: string | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isGrowthModalOpen: boolean;
  setIsGrowthModalOpen: (open: boolean) => void;
  growthModalPlantId: string | null;
  setGrowthModalPlantId: (id: string | null) => void;
  isPhotoModalOpen: boolean;
  setIsPhotoModalOpen: (open: boolean) => void;
  photoModalPlantId: string | null;
  setPhotoModalPlantId: (id: string | null) => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  isCloudSyncing: boolean;
  cloudSyncStatus: 'synced' | 'local' | 'syncing';
  
  // Actions
  addPlant: (plant: Omit<Plant, 'id'>, initialHeight?: number, initialCondition?: string) => boolean;
  updatePlant: (id: string, updates: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  waterPlant: (id: string) => void;
  snoozeWaterReminder: (plantId: string) => void;
  resolveSunlight: (plantId: string, newLocation?: string) => void;
  snoozeSunlightReminder: (plantId: string) => void;
  addGrowthRecord: (record: Omit<GrowthRecord, 'id'>) => void;
  deleteGrowthRecord: (id: string) => void;
  addGrowthPhoto: (photo: Omit<GrowthPhoto, 'id'>) => void;
  deleteGrowthPhoto: (id: string) => void;
  toggleReminder: (id: string) => void;
  snoozeReminder: (id: string) => void;
  addReminder: (reminder: Omit<PlantReminder, 'id'>) => void;
  resetToDefaults: () => void;
  syncAllToFirestore: () => Promise<void>;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PLANTS: 'plant_track_plants_v1',
  RECORDS: 'plant_track_records_v1',
  PHOTOS: 'plant_track_photos_v1',
  REMINDERS: 'plant_track_reminders_v1',
};

export const PlantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, setIsSubscribeModalOpen, setIsAuthModalOpen, setAuthModalMode } = useAuth();

  const [plants, setPlants] = useState<Plant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLANTS);
    return saved ? JSON.parse(saved) : INITIAL_PLANTS;
  });

  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return saved ? JSON.parse(saved) : INITIAL_GROWTH_RECORDS;
  });

  const [growthPhotos, setGrowthPhotos] = useState<GrowthPhoto[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    return saved ? JSON.parse(saved) : INITIAL_GROWTH_PHOTOS;
  });

  const [reminders, setReminders] = useState<PlantReminder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isGrowthModalOpen, setIsGrowthModalOpen] = useState<boolean>(false);
  const [growthModalPlantId, setGrowthModalPlantId] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [photoModalPlantId, setPhotoModalPlantId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'local' | 'syncing'>('local');

  // Sync to Firestore helper
  const syncAllToFirestore = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setIsCloudSyncing(true);
      setCloudSyncStatus('syncing');

      // Sync plants
      for (const plant of plants) {
        const plantRef = doc(db, 'users', user.uid, 'plants', plant.id);
        await setDoc(plantRef, plant, { merge: true });
      }

      setCloudSyncStatus('synced');
    } catch (err) {
      console.warn('Firestore sync error:', err);
      setCloudSyncStatus('local');
    } finally {
      setIsCloudSyncing(false);
    }
  }, [user?.uid, plants]);

  // Load from Firestore when user signs in
  useEffect(() => {
    if (!user?.uid) {
      setCloudSyncStatus('local');
      return;
    }

    const loadUserGardenFromFirestore = async () => {
      try {
        setIsCloudSyncing(true);
        setCloudSyncStatus('syncing');
        const plantsCol = collection(db, 'users', user.uid, 'plants');
        const snapshot = await getDocs(plantsCol);

        if (!snapshot.empty) {
          const loadedPlants: Plant[] = [];
          snapshot.forEach((docSnap) => {
            loadedPlants.push(docSnap.data() as Plant);
          });
          setPlants(loadedPlants);
        } else if (plants.length > 0) {
          // Initialize first-time user's Firestore with current plants
          for (const plant of plants) {
            const plantRef = doc(db, 'users', user.uid, 'plants', plant.id);
            await setDoc(plantRef, plant);
          }
        }
        setCloudSyncStatus('synced');
      } catch (err) {
        console.warn('Could not fetch plants from Firestore:', err);
        setCloudSyncStatus('local');
      } finally {
        setIsCloudSyncing(false);
      }
    };

    loadUserGardenFromFirestore();
  }, [user?.uid]);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(growthRecords));
  }, [growthRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(growthPhotos));
  }, [growthPhotos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10B981', '#34D399', '#6EE7B7', '#059669', '#38BDF8'],
      });
    } catch {
      // safe fallback
    }
  };

  // Add Plant (with Login requirement and Pro Tier limit check)
  const addPlant = (
    plantData: Omit<Plant, 'id'>, 
    initialHeight?: number, 
    initialCondition: string = 'Healthy 🌱'
  ): boolean => {
    // Authentication required to add plants
    if (!user) {
      showToast('Please sign in or create an account first to add a plant to your sanctuary! 🌱', 'warning');
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return false;
    }

    const isPro = user?.subscriptionPlan === 'premium_monthly';
    
    // Free tier allows up to 3 plants
    if (!isPro && plants.length >= 3) {
      showToast('Free tier limit: 3 plants. Upgrade to Pro for ₱20/mo to add unlimited plants!', 'warning');
      setIsSubscribeModalOpen(true);
      return false;
    }

    const newId = `plant-${Date.now()}`;
    const newPlant: Plant = {
      ...plantData,
      id: newId,
    };

    setPlants((prev) => [newPlant, ...prev]);

    // Save to Firestore if user is authenticated
    if (user?.uid) {
      const plantRef = doc(db, 'users', user.uid, 'plants', newId);
      setDoc(plantRef, newPlant).catch((e) => console.warn('Plant save to Firestore error:', e));
    }

    // Add initial growth record if height provided
    if (initialHeight !== undefined && initialHeight > 0) {
      const newRecord: GrowthRecord = {
        id: `rec-${Date.now()}`,
        plantId: newId,
        date: plantData.datePlanted,
        heightCm: initialHeight,
        condition: initialCondition,
        notes: 'Initial planting log.',
      };
      setGrowthRecords((prev) => [newRecord, ...prev]);
    }

    // Auto-generate reminders
    const newReminders: PlantReminder[] = [
      {
        id: `rem-w-${Date.now()}`,
        plantId: newId,
        plantName: newPlant.name,
        type: 'water',
        title: `Water ${newPlant.name}`,
        description: `Scheduled every ${newPlant.waterScheduleDays} days. Check soil moisture.`,
        dueDate: new Date(Date.now() + newPlant.waterScheduleDays * 86400000).toISOString().split('T')[0],
        isCompleted: false,
      },
      {
        id: `rem-g-${Date.now()}`,
        plantId: newId,
        plantName: newPlant.name,
        type: 'growth_check',
        title: `Measure growth for ${newPlant.name}`,
        description: 'Track height and inspect leaf vigor.',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        isCompleted: false,
      },
      {
        id: `rem-p-${Date.now()}`,
        plantId: newId,
        plantName: newPlant.name,
        type: 'photo',
        title: `Snap Week 1 photo for ${newPlant.name}`,
        description: 'Take a clear progress photo.',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        isCompleted: false,
      }
    ];

    setReminders((prev) => [...newReminders, ...prev]);
    triggerConfetti();
    showToast(`🌱 "${newPlant.name}" added to your plant sanctuary!`, 'success');
    return true;
  };

  const updatePlant = (id: string, updates: Partial<Plant>) => {
    setPlants((prev) =>
      prev.map((plant) => (plant.id === id ? { ...plant, ...updates } : plant))
    );
    if (user?.uid) {
      const plantRef = doc(db, 'users', user.uid, 'plants', id);
      setDoc(plantRef, updates, { merge: true }).catch(() => {});
    }
    showToast('Plant details updated.', 'info');
  };

  const deletePlant = (id: string) => {
    const p = plants.find((x) => x.id === id);
    setPlants((prev) => prev.filter((plant) => plant.id !== id));
    setGrowthRecords((prev) => prev.filter((r) => r.plantId !== id));
    setGrowthPhotos((prev) => prev.filter((ph) => ph.plantId !== id));
    setReminders((prev) => prev.filter((rem) => rem.plantId !== id));
    if (selectedPlantId === id) setSelectedPlantId(null);
    if (user?.uid) {
      const plantRef = doc(db, 'users', user.uid, 'plants', id);
      deleteDoc(plantRef).catch(() => {});
    }
    showToast(`Removed "${p?.name || 'plant'}"`, 'info');
  };

  // Water Plant: User clicks "Watered"
  const waterPlant = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const targetPlant = plants.find((p) => p.id === id);
    if (!targetPlant) return;

    // Check if plant status was needs_attention or needs_care due to water
    // If it also had sunlight issues, keep needs_attention, else healthy
    const newStatus: PlantHealthStatus = 
      targetPlant.statusReason?.toLowerCase().includes('sunlight') 
        ? 'needs_attention' 
        : 'healthy';

    const newReason = newStatus === 'healthy' 
      ? 'Plant is getting enough care and hydration 🟢'
      : 'Hydrated, but still needs a brighter location for optimal light ☀️';

    setPlants((prev) =>
      prev.map((plant) =>
        plant.id === id
          ? {
              ...plant,
              lastWateredDate: todayStr,
              status: newStatus,
              statusReason: newReason,
            }
          : plant
      )
    );

    // Mark water reminders for this plant as completed
    setReminders((prev) =>
      prev.map((rem) =>
        rem.plantId === id && rem.type === 'water'
          ? { ...rem, isCompleted: true, completedAt: todayStr }
          : rem
      )
    );

    triggerConfetti();
    showToast(`💧 ${targetPlant.name} has been happily watered!`, 'success');
  };

  // Snooze Water Reminder ("Remind Me Later")
  const snoozeWaterReminder = (plantId: string) => {
    const targetPlant = plants.find((p) => p.id === plantId);
    showToast(`⏰ Water reminder for ${targetPlant?.name || 'plant'} snoozed for later today.`, 'info');
  };

  // Resolve Sunlight: Move to brighter spot
  const resolveSunlight = (plantId: string, newLocation: string = 'Bright Window') => {
    const targetPlant = plants.find((p) => p.id === plantId);
    if (!targetPlant) return;

    const newStatus: PlantHealthStatus = 
      targetPlant.statusReason?.toLowerCase().includes('water')
        ? 'needs_attention'
        : 'healthy';

    const newReason = newStatus === 'healthy'
      ? 'Receiving ample bright light and thriving 🟢'
      : 'Moved to light! Still needs watering today 🌱💧';

    setPlants((prev) =>
      prev.map((p) =>
        p.id === plantId
          ? {
              ...p,
              location: newLocation,
              sunlightLevel: 'Bright Indirect Light',
              lastSunlightCheckDate: new Date().toISOString().split('T')[0],
              status: newStatus,
              statusReason: newReason,
            }
          : p
      )
    );

    // Mark sunlight reminder as completed
    setReminders((prev) =>
      prev.map((rem) =>
        rem.plantId === plantId && rem.type === 'sunlight'
          ? { ...rem, isCompleted: true, completedAt: new Date().toISOString().split('T')[0] }
          : rem
      )
    );

    triggerConfetti();
    showToast(`☀️ ${targetPlant.name} moved to ${newLocation}! Receiving ample light.`, 'success');
  };

  const snoozeSunlightReminder = (plantId: string) => {
    const targetPlant = plants.find((p) => p.id === plantId);
    showToast(`⏰ Sunlight reminder for ${targetPlant?.name || 'plant'} snoozed.`, 'info');
  };

  // Growth Records
  const addGrowthRecord = (record: Omit<GrowthRecord, 'id'>) => {
    const newRecord: GrowthRecord = {
      ...record,
      id: `rec-${Date.now()}`,
    };
    setGrowthRecords((prev) => [newRecord, ...prev]);

    // If condition indicates healthy or attention, update plant status
    if (record.condition.includes('Needs Attention')) {
      updatePlant(record.plantId, { status: 'needs_attention', statusReason: 'Growth check noted attention needed.' });
    } else if (record.condition.includes('Needs Care')) {
      updatePlant(record.plantId, { status: 'needs_care', statusReason: 'Growth check noted immediate care required.' });
    }

    triggerConfetti();
    showToast(`📈 Growth logged: ${record.heightCm} cm (${record.condition})!`, 'success');
  };

  const deleteGrowthRecord = (id: string) => {
    setGrowthRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Growth record removed.', 'info');
  };

  // Growth Photos
  const addGrowthPhoto = (photo: Omit<GrowthPhoto, 'id'>) => {
    const newPhoto: GrowthPhoto = {
      ...photo,
      id: `photo-${Date.now()}`,
    };
    setGrowthPhotos((prev) => [...prev, newPhoto]);
    triggerConfetti();
    showToast(`📸 ${photo.weekLabel} photo logged for ${photo.caption || 'growth progress'}!`, 'success');
  };

  const deleteGrowthPhoto = (id: string) => {
    setGrowthPhotos((prev) => prev.filter((p) => p.id !== id));
    showToast('Photo removed.', 'info');
  };

  // Reminders
  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.isCompleted;
          if (nextState) {
            triggerConfetti();
            showToast(`✅ Completed: ${r.title}`, 'success');
          }
          return {
            ...r,
            isCompleted: nextState,
            completedAt: nextState ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return r;
      })
    );
  };

  const snoozeReminder = (id: string) => {
    const target = reminders.find((r) => r.id === id);
    showToast(`⏰ Reminder "${target?.title || ''}" snoozed.`, 'info');
  };

  const addReminder = (reminder: Omit<PlantReminder, 'id'>) => {
    const newReminder: PlantReminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
    };
    setReminders((prev) => [newReminder, ...prev]);
    showToast(`🔔 Reminder created: "${reminder.title}"`, 'success');
  };

  const resetToDefaults = () => {
    setPlants(INITIAL_PLANTS);
    setGrowthRecords(INITIAL_GROWTH_RECORDS);
    setGrowthPhotos(INITIAL_GROWTH_PHOTOS);
    setReminders(INITIAL_REMINDERS);
    localStorage.clear();
    showToast('Reset to default plant collection!', 'info');
  };

  return (
    <PlantContext.Provider
      value={{
        plants,
        growthRecords,
        growthPhotos,
        reminders,
        activeTab,
        setActiveTab,
        selectedPlantId,
        setSelectedPlantId,
        isAddModalOpen,
        setIsAddModalOpen,
        isGrowthModalOpen,
        setIsGrowthModalOpen,
        growthModalPlantId,
        setGrowthModalPlantId,
        isPhotoModalOpen,
        setIsPhotoModalOpen,
        photoModalPlantId,
        setPhotoModalPlantId,
        toasts,
        showToast,
        addPlant,
        updatePlant,
        deletePlant,
        waterPlant,
        snoozeWaterReminder,
        resolveSunlight,
        snoozeSunlightReminder,
        addGrowthRecord,
        deleteGrowthRecord,
        addGrowthPhoto,
        deleteGrowthPhoto,
        toggleReminder,
        snoozeReminder,
        addReminder,
        resetToDefaults,
        isCloudSyncing,
        cloudSyncStatus,
        syncAllToFirestore,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};

export const usePlantContext = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlantContext must be used within a PlantProvider');
  }
  return context;
};
