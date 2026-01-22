import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { type Charm } from '../types/charm'
import { getItem, setItem, removeItem } from '../lib/storage'

/* eslint-disable react-refresh/only-export-components */

interface CharmContextValue {
  charms: Charm[]
  bonusPoints: number
  totalPoints: number
  newlyUnlockedCharm: Charm | null
  isRedeemed: boolean
  addCharm: (charm: Charm) => void
  removeCharm: (id: string) => void
  clearCharms: () => void
  addBonusPoints: (amount: number, reason: string) => void
  dismissUnlockModal: () => void
  setRedeemed: (redeemed: boolean) => void
}

const CharmContext = createContext<CharmContextValue | null>(null)

interface CharmProviderProps {
  children: ReactNode
  initialCharms?: Charm[]
}

const STORAGE_KEY = 'birthday-os-charms'

const BONUS_POINTS_KEY = 'birthday-os-bonus-points'
const REDEEMED_KEY = 'birthday-redeemed'
const AWARDED_REASONS_KEY = 'birthday-os-awarded-bonuses'

export function CharmProvider({ children, initialCharms = [] }: CharmProviderProps) {
  const [charms, setCharms] = useState<Charm[]>(() => {
    return getItem<Charm[]>(STORAGE_KEY, initialCharms)
  })
  
  const [bonusPoints, setBonusPoints] = useState<number>(() => {
    return getItem<number>(BONUS_POINTS_KEY, 0)
  })
  
  const [newlyUnlockedCharm, setNewlyUnlockedCharm] = useState<Charm | null>(null)
  
  const [isRedeemed, setIsRedeemed] = useState<boolean>(() => {
    return getItem<boolean>(REDEEMED_KEY, false)
  })
  
  const [awardedReasons, setAwardedReasons] = useState<Set<string>>(() => {
    const stored = getItem<string[]>(AWARDED_REASONS_KEY, [])
    return new Set(stored)
  })

  const charmPoints = charms.reduce((sum, charm) => sum + charm.points, 0)
  const totalPoints = charmPoints + bonusPoints

  // Persist to localStorage whenever charms change
  useEffect(() => {
    setItem(STORAGE_KEY, charms)
  }, [charms])

  // Persist bonusPoints to localStorage
  useEffect(() => {
    setItem(BONUS_POINTS_KEY, bonusPoints)
  }, [bonusPoints])

  // Persist isRedeemed to localStorage
  useEffect(() => {
    setItem(REDEEMED_KEY, isRedeemed)
  }, [isRedeemed])

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
    removeItem(STORAGE_KEY)
  }, [])

  const addBonusPoints = useCallback((amount: number, reason: string) => {
    setAwardedReasons(prev => {
      if (prev.has(reason)) {
        console.debug(`Bonus points already awarded for: ${reason}`)
        return prev
      }
      const updated = new Set(prev)
      updated.add(reason)
      setBonusPoints(p => p + amount)
      console.debug(`Bonus points awarded: +${amount} (${reason})`)
      return updated
    })
  }, [])

  useEffect(() => {
    setItem(AWARDED_REASONS_KEY, Array.from(awardedReasons))
  }, [awardedReasons])

  const dismissUnlockModal = useCallback(() => {
    setNewlyUnlockedCharm(null)
  }, [])

  const setRedeemed = useCallback((redeemed: boolean) => {
    setIsRedeemed(redeemed)
  }, [])

  return (
    <CharmContext.Provider value={{ 
      charms, 
      bonusPoints,
      totalPoints, 
      newlyUnlockedCharm,
      isRedeemed,
      addCharm, 
      removeCharm, 
      clearCharms,
      addBonusPoints,
      dismissUnlockModal,
      setRedeemed
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
