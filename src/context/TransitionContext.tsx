import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface TransitionState {
  isTransitioning: boolean
  transitionType: 'phone-to-sms' | 'gift-to-camcorder' | null
  phoneScreenRect: DOMRect | null
}

interface TransitionContextValue extends TransitionState {
  startTransition: (type: 'phone-to-sms' | 'gift-to-camcorder', rect: DOMRect) => void
  endTransition: () => void
}

const TransitionContext = createContext<TransitionContextValue | null>(null)

export function TransitionProvider({ children }: { children: ReactNode }) {
  /* eslint-disable react-refresh/only-export-components */
  const [state, setState] = useState<TransitionState>({
    isTransitioning: false,
    transitionType: null,
    phoneScreenRect: null,
  })

  const startTransition = useCallback((type: 'phone-to-sms' | 'gift-to-camcorder', rect: DOMRect) => {
    console.log('[TransitionContext] startTransition called with:', { type, rect })
    setState({ isTransitioning: true, transitionType: type, phoneScreenRect: rect })
  }, [])

  const endTransition = useCallback(() => {
    setState({ isTransitioning: false, transitionType: null, phoneScreenRect: null })
  }, [])

  return (
    <TransitionContext.Provider value={{ ...state, startTransition, endTransition }}>
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider')
  }
  return context
}
