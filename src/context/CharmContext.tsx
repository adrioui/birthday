import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { type Charm } from '../types/charm'

/* eslint-disable react-refresh/only-export-components */

interface CharmContextValue {
  charms: Charm[]
  totalPoints: number
  newlyUnlockedCharm: Charm | null
  addCharm: (charm: Charm) => void
  removeCharm: (id: string) => void
  clearCharms: () => void
  dismissUnlockModal: () => void
}

const CharmContext = createContext<CharmContextValue | null>(null)

interface CharmProviderProps {
  children: ReactNode
  initialCharms?: Charm[]
}

const STORAGE_KEY = 'birthday-os-charms'

export function CharmProvider({ children, initialCharms = [] }: CharmProviderProps) {
  const [charms, setCharms] = useState<Charm[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved charms', e)
      }
    }
    return initialCharms
  })
  
  const [newlyUnlockedCharm, setNewlyUnlockedCharm] = useState<Charm | null>(null)

  const totalPoints = charms.reduce((sum, charm) => sum + charm.points, 0)

  // Persist to localStorage whenever charms change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(charms))
  }, [charms])

  const addCharm = useCallback((charm: Charm) => {
    setCharms(prev => {
      // Check if already unlocked
      if (prev.some(c => c.id === charm.id)) return prev
      
      // If not unlocked, set as newly unlocked to trigger modal
      setNewlyUnlockedCharm(charm)
      return [...prev, charm]
    })
  }, [])

  const removeCharm = useCallback((id: string) => {
    setCharms(prev => prev.filter(c => c.id !== id))
  }, [])

  const clearCharms = useCallback(() => {
    setCharms([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const dismissUnlockModal = useCallback(() => {
    setNewlyUnlockedCharm(null)
  }, [])

  return (
    <CharmContext.Provider value={{ 
      charms, 
      totalPoints, 
      newlyUnlockedCharm, 
      addCharm, 
      removeCharm, 
      clearCharms,
      dismissUnlockModal 
    }}>
      {children}
    </CharmContext.Provider>
  )
}

export function useCharms() {
  const context = useContext(CharmContext)
  if (!context) {
    throw new Error('useCharms must be used within CharmProvider')
  }
  return context
}
