import { useState, useCallback } from 'react'

export function useCharmFlip() {
  const [flippedCharmId, setFlippedCharmId] = useState<string | null>(null)

  const handleFlip = useCallback((charmId: string | null) => {
    setFlippedCharmId(charmId)
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
