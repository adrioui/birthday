import { useContext } from 'react';
import { EasterEggContext } from '../context/EasterEggContext';

export function useEasterEggs() {
  const context = useContext(EasterEggContext);
  if (!context) {
    throw new Error('useEasterEggs must be used within EasterEggProvider');
  }
  return context;
}
