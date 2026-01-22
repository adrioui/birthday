import { useContext } from 'react';
import { ProgressContext } from './ProgressContext.base';

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
