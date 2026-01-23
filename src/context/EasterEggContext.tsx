import { createContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { EASTER_EGGS, type EasterEgg } from '../data/easterEggs';
import type { EasterEggId } from '../data/easterEggs';
import { STORAGE_KEYS } from '../lib/storageKeys';

interface EasterEggState {
  discoveredEggs: Set<EasterEggId>;
  showOverlay: boolean;
  currentEgg: EasterEgg | null;
  triggerEgg: (id: EasterEggId) => void;
  dismissOverlay: () => void;
  isDiscovered: (id: EasterEggId) => boolean;
}

const EasterEggContext = createContext<EasterEggState | null>(null);

export { EasterEggContext };

interface EasterEggProviderProps {
  children: ReactNode;
}

export function EasterEggProvider({ children }: EasterEggProviderProps) {
  const [discoveredEggs, setDiscoveredEggs] = useState<Set<EasterEggId>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const item = localStorage.getItem(STORAGE_KEYS.EASTER_EGGS);
      if (!item) return new Set();
      return new Set(JSON.parse(item));
    } catch {
      return new Set();
    }
  });

  const [showOverlay, setShowOverlay] = useState(false);
  const [currentEgg, setCurrentEgg] = useState<EasterEgg | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.EASTER_EGGS, JSON.stringify([...discoveredEggs]));
    } catch (error) {
      console.error('Failed to persist Easter egg discoveries:', error);
    }
  }, [discoveredEggs]);

  const triggerEgg = useCallback((id: EasterEggId) => {
    const egg = EASTER_EGGS[id];
    setCurrentEgg(egg);
    setShowOverlay(true);
    setDiscoveredEggs((prev) => new Set([...prev, id]));
  }, []);

  const dismissOverlay = useCallback(() => {
    setShowOverlay(false);
  }, []);

  const isDiscovered = useCallback(
    (id: EasterEggId) => {
      return discoveredEggs.has(id);
    },
    [discoveredEggs]
  );

  const value = useMemo(
    () => ({
      discoveredEggs,
      showOverlay,
      currentEgg,
      triggerEgg,
      dismissOverlay,
      isDiscovered,
    }),
    [discoveredEggs, showOverlay, currentEgg, triggerEgg, dismissOverlay, isDiscovered]
  );

  return <EasterEggContext.Provider value={value}>{children}</EasterEggContext.Provider>;
}

export type { EasterEggId } from '../data/easterEggs';
