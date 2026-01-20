import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { type Charm, PLACEHOLDER_CHARMS } from '../types/charm'

/* eslint-disable react-refresh/only-export-components */

interface CharmContextValue {
  charms: Charm[]
  totalPoints: number
  addCharm: (charm: Charm) => void
  removeCharm: (id: string) => void
  clearCharms: () => void
}

const CharmContext = createContext<CharmContextValue | null>(null)

interface CharmProviderProps {
  children: ReactNode
  initialCharms?: Charm[]
}

export function CharmProvider({ children, initialCharms = PLACEHOLDER_CHARMS }: CharmProviderProps) {
  const [charms, setCharms] = useState<Charm[]>(initialCharms)

  const totalPoints = charms.reduce((sum, charm) => sum + charm.points, 0)

  const addCharm = useCallback((charm: Charm) => {
    setCharms(prev => {
      if (prev.some(c => c.id === charm.id)) return prev
      return [...prev, charm]
    })
  }, [])

  const removeCharm = useCallback((id: string) => {
    setCharms(prev => prev.filter(c => c.id !== id))
  }, [])

  const clearCharms = useCallback(() => {
    setCharms([])
  }, [])

  return (
    <CharmContext.Provider value={{ charms, totalPoints, addCharm, removeCharm, clearCharms }}>
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
