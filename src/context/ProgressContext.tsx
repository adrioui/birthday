import { useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import type { SessionProgressState, MilestoneId } from '../types';
import { getItem, setItem, STORAGE_KEYS } from '../lib';
import { DEFAULT_MILESTONES } from '../lib/progressConstants';
import { ProgressContext } from './ProgressContext.base';

export { ProgressContext } from './ProgressContext.base';

interface ProgressProviderProps {
  children: ReactNode;
}

function validateProgress(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const state = data as SessionProgressState;
  return (
    Array.isArray(state.milestones) &&
    state.milestones.every((m) => {
      if (!m || typeof m !== 'object') return false;
      const milestone = m;
      return (
        typeof milestone.id === 'string' &&
        typeof milestone.name === 'string' &&
        typeof milestone.completed === 'boolean'
      );
    })
  );
}

export function ProgressProvider({ children }: ProgressProviderProps) {
  const [milestones, setMilestones] = useState(() => {
    const hasStoredData =
      typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEYS.SESSION_PROGRESS) !== null;
    if (!hasStoredData) {
      return DEFAULT_MILESTONES;
    }
    const stored = getItem<SessionProgressState>(STORAGE_KEYS.SESSION_PROGRESS, {
      milestones: DEFAULT_MILESTONES,
    });
    if (validateProgress(stored)) {
      return stored.milestones;
    }
    return DEFAULT_MILESTONES;
  });

  useEffect(() => {
    setItem(STORAGE_KEYS.SESSION_PROGRESS, { milestones });
  }, [milestones]);

  const completeMilestone = useCallback((id: MilestoneId) => {
    setMilestones((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, completed: true } : m));
      return updated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setMilestones(DEFAULT_MILESTONES.map((m) => ({ ...m, completed: false })));
  }, []);

  const value = useMemo(
    () => ({ milestones, completeMilestone, resetProgress }),
    [milestones, completeMilestone, resetProgress]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
