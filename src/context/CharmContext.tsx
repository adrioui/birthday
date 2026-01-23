import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { type Charm } from '../types';
import {
  getValidatedCharms,
  setItem,
  removeItem,
  getSessionItem,
  setSessionItem,
  removeSessionItem,
} from '../lib/storage';
import { registerStateGetter } from '../agent/registry';
import { STORAGE_KEYS } from '../lib/storageKeys';

/* eslint-disable react-refresh/only-export-components */

interface CharmContextValue {
  charms: Charm[];
  bonusPoints: number;
  totalPoints: number;
  newlyUnlockedCharm: Charm | null;
  isRedeemed: boolean;
  addCharm: (charm: Charm) => void;
  removeCharm: (id: string) => void;
  clearCharms: () => void;
  resetAll: () => void;
  addBonusPoints: (amount: number, reason: string) => void;
  dismissUnlockModal: () => void;
  setRedeemed: (redeemed: boolean) => void;
}

const CharmContext = createContext<CharmContextValue | null>(null);

interface CharmProviderProps {
  children: ReactNode;
  initialCharms?: Charm[];
}

export function CharmProvider({ children, initialCharms = [] }: CharmProviderProps) {
  const [charms, setCharms] = useState<Charm[]>(() => {
    try {
      return getValidatedCharms<Charm[]>(STORAGE_KEYS.CHARMS, initialCharms);
    } catch (error) {
      console.error('Failed to load charms:', error);
      return [];
    }
  });

  const [bonusPoints, setBonusPoints] = useState<number>(() => {
    try {
      return getSessionItem<number>(STORAGE_KEYS.BONUS_POINTS, 0);
    } catch (error) {
      console.error('Failed to load bonus points:', error);
      return 0;
    }
  });

  const [newlyUnlockedCharm, setNewlyUnlockedCharm] = useState<Charm | null>(null);

  const [isRedeemed, setIsRedeemed] = useState<boolean>(() => {
    try {
      return getSessionItem<boolean>(STORAGE_KEYS.REDEEMED, false);
    } catch (error) {
      console.error('Failed to load redeemed state:', error);
      return false;
    }
  });

  const [awardedReasons, setAwardedReasons] = useState<Set<string>>(() => {
    try {
      const stored = getSessionItem<string[]>(STORAGE_KEYS.AWARDED_BONUSES, []);
      return new Set(stored);
    } catch (error) {
      console.error('Failed to load awarded reasons:', error);
      return new Set();
    }
  });

  // Initialize with current charm IDs to prevent false-positive "new charm" detection on mount
  const [initialCharmIds] = useState(() => new Set(charms.map((c) => c.id)));
  const previousCharmIds = useRef<Set<string>>(initialCharmIds);

  const charmPoints = charms.reduce((sum, charm) => sum + charm.points, 0);
  const totalPoints = charmPoints + bonusPoints;

  // Persist to localStorage whenever charms change
  useEffect(() => {
    setItem(STORAGE_KEYS.CHARMS, charms);
  }, [charms]);

  // Persist bonusPoints to sessionStorage
  useEffect(() => {
    setSessionItem(STORAGE_KEYS.BONUS_POINTS, bonusPoints);
  }, [bonusPoints]);

  // Persist isRedeemed to sessionStorage
  useEffect(() => {
    setSessionItem(STORAGE_KEYS.REDEEMED, isRedeemed);
  }, [isRedeemed]);

  // Set newly unlocked charm when a new charm is added
  useEffect(() => {
    const currentCharmIds = new Set(charms.map((c) => c.id));
    const newCharm = charms.find((c) => !previousCharmIds.current.has(c.id));

    if (newCharm) {
      setNewlyUnlockedCharm(newCharm);
    }

    previousCharmIds.current = currentCharmIds;
  }, [charms]);

  const addCharm = useCallback((charm: Charm) => {
    setCharms((prev) => {
      if (prev.some((c) => c.id === charm.id)) return prev;
      return [...prev, charm];
    });
  }, []);

  const removeCharm = useCallback((id: string) => {
    setCharms((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearCharms = useCallback(() => {
    setCharms([]);
    removeItem(STORAGE_KEYS.CHARMS);
  }, []);

  const resetAll = useCallback(() => {
    try {
      setCharms([]);
      setBonusPoints(0);
      setIsRedeemed(false);
      setAwardedReasons(new Set());
      removeItem(STORAGE_KEYS.CHARMS);
      removeSessionItem(STORAGE_KEYS.BONUS_POINTS);
      removeSessionItem(STORAGE_KEYS.REDEEMED);
      removeSessionItem(STORAGE_KEYS.AWARDED_BONUSES);
      console.log('Points counter reset due to storage failure');
    } catch (error) {
      console.error('Failed to reset:', error);
    }
  }, []);

  const addBonusPoints = useCallback((amount: number, reason: string) => {
    try {
      setAwardedReasons((prev) => {
        if (prev.has(reason)) {
          console.debug(`Bonus points already awarded for: ${reason}`);
          return prev;
        }
        const updated = new Set(prev);
        updated.add(reason);
        setBonusPoints((p) => p + amount);
        console.debug(`Bonus points awarded: +${amount} (${reason})`);
        return updated;
      });
    } catch (error) {
      console.error('Failed to add bonus points:', error);
    }
  }, []);

  useEffect(() => {
    setSessionItem(STORAGE_KEYS.AWARDED_BONUSES, Array.from(awardedReasons));
  }, [awardedReasons]);

  const dismissUnlockModal = useCallback(() => {
    setNewlyUnlockedCharm(null);
  }, []);

  const setRedeemed = useCallback((redeemed: boolean) => {
    setIsRedeemed(redeemed);
  }, []);

  const value = useMemo(
    () => ({
      charms,
      bonusPoints,
      totalPoints,
      newlyUnlockedCharm,
      isRedeemed,
      addCharm,
      removeCharm,
      clearCharms,
      resetAll,
      addBonusPoints,
      dismissUnlockModal,
      setRedeemed,
    }),
    [
      charms,
      bonusPoints,
      totalPoints,
      newlyUnlockedCharm,
      isRedeemed,
      addCharm,
      removeCharm,
      clearCharms,
      resetAll,
      addBonusPoints,
      dismissUnlockModal,
      setRedeemed,
    ]
  );

  registerStateGetter(() => ({
    route: window.location.pathname,
    charms: charms.map((c) => ({ id: c.id, name: c.name, points: c.points })),
    totalPoints,
    isRedeemed,
  }));

  return <CharmContext.Provider value={value}>{children}</CharmContext.Provider>;
}

export function useCharms() {
  const context = useContext(CharmContext);
  if (!context) {
    throw new Error('useCharms must be used within CharmProvider');
  }
  return context;
}
