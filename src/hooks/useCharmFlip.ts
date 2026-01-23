import { useState, useCallback, useRef, useEffect } from 'react'

export function useCharmFlip() {
  const [flippedCharmId, setFlippedCharmId] = useState<string | null>(null)
  const pendingFlipId = useRef<string | null>(null)
  const isAnimatingFlipBack = useRef(false)
  const flipBackTimeout = useRef<number | null>(null)

  const handleFlip = useCallback((charmId: string | null) => {
    if (isAnimatingFlipBack.current) {
      pendingFlipId.current = charmId
      return
    }

    if (flippedCharmId && charmId && flippedCharmId !== charmId) {
      if (flipBackTimeout.current) {
        clearTimeout(flipBackTimeout.current)
      }
      isAnimatingFlipBack.current = true
      setFlippedCharmId(null)
      flipBackTimeout.current = window.setTimeout(() => {
        isAnimatingFlipBack.current = false
        setFlippedCharmId(pendingFlipId.current ?? charmId)
        pendingFlipId.current = null
        flipBackTimeout.current = null
      }, 600)
    } else {
      setFlippedCharmId(charmId)
    }
  }, [flippedCharmId])

  useEffect(() => {
    return () => {
      if (flipBackTimeout.current) {
        clearTimeout(flipBackTimeout.current)
      }
    }
  }, [])

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
