import { useState, useCallback, useRef } from 'react'

export function useCharmFlip() {
  const [flippedCharmId, setFlippedCharmId] = useState<string | null>(null)
  const pendingFlipId = useRef<string | null>(null)
  const isAnimatingFlipBack = useRef(false)

  const handleFlip = useCallback((charmId: string | null) => {
    if (isAnimatingFlipBack.current) {
      pendingFlipId.current = charmId
      return
    }

    if (flippedCharmId && charmId && flippedCharmId !== charmId) {
      isAnimatingFlipBack.current = true
      setFlippedCharmId(null)
      setTimeout(() => {
        isAnimatingFlipBack.current = false
        setFlippedCharmId(pendingFlipId.current ?? charmId)
        pendingFlipId.current = null
      }, 600)
    } else {
      setFlippedCharmId(charmId)
    }
  }, [flippedCharmId])

  const closeFlipped = useCallback(() => {
    setFlippedCharmId(null)
  }, [])

  return {
    flippedCharmId,
    handleFlip,
    closeFlipped,
    isFlipped: (id: string) => flippedCharmId === id,
  }
}
