import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { type Charm } from '../types/charm'

/* eslint-disable react-refresh/only-export-components */

interface CharmContextValue {
  charms: Charm[]
  bonusPoints: number
  totalPoints: number
  newlyUnlockedCharm: Charm | null
  addCharm: (charm: Charm) => void
  removeCharm: (id: string) => void
  clearCharms: () => void
  addBonusPoints: (amount: number, reason: string) => void
  dismissUnlockModal: () => void
}

const CharmContext = createContext<CharmContextValue | null>(null)

interface CharmProviderProps {
  children: ReactNode
  initialCharms?: Charm[]
}

const STORAGE_KEY = 'birthday-os-charms'

const BONUS_POINTS_KEY = 'birthday-os-bonus-points'

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
  
  const [bonusPoints, setBonusPoints] = useState<number>(() => {
    const saved = localStorage.getItem(BONUS_POINTS_KEY)
    return saved ? parseInt(saved, 10) : 0
  })
  
  const [newlyUnlockedCharm, setNewlyUnlockedCharm] = useState<Charm | null>(null)

  const charmPoints = charms.reduce((sum, charm) => sum + charm.points, 0)
  const totalPoints = charmPoints + bonusPoints

  // Persist to localStorage whenever charms change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(charms))
  }, [charms])

  // Persist bonusPoints to localStorage
  useEffect(() => {
    localStorage.setItem(BONUS_POINTS_KEY, bonusPoints.toString())
  }, [bonusPoints])

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

  const addBonusPoints = useCallback((amount: number, reason: string) => {
    setBonusPoints(prev => prev + amount)
    // Log for debugging
    console.debug(`Bonus points awarded: +${amount} (${reason})`)
  }, [])

  const dismissUnlockModal = useCallback(() => {
    setNewlyUnlockedCharm(null)
  }, [])

  return (
    <CharmContext.Provider value={{ 
      charms, 
      bonusPoints,
      totalPoints, 
      newlyUnlockedCharm, 
      addCharm, 
      removeCharm, 
      clearCharms,
      addBonusPoints,
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
