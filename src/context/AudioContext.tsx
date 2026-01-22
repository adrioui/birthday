import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react'

/* eslint-disable react-refresh/only-export-components */

interface AudioState {
  isMuted: boolean
  toggleMute: () => void
}

const AudioContext = createContext<AudioState | null>(null)

const STORAGE_KEY = 'birthday-os-audio-muted'

interface AudioProviderProps {
  children: ReactNode
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      const item = localStorage.getItem(STORAGE_KEY)
      return item ? JSON.parse(item) : false
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isMuted))
    } catch (e) {
      console.error('Failed to persist audio state:', e)
    }
  }, [isMuted])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  const value = useMemo(() => ({ isMuted, toggleMute }), [isMuted, toggleMute])

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudioState() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudioState must be used within AudioProvider')
  }
  return context
}
