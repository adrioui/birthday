import { useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'

interface CaptureConfirmationProps {
  imageUrl: string
  onDismiss: () => void
  autoDismissMs?: number
}

export function CaptureConfirmation({ 
  imageUrl, 
  onDismiss,
  autoDismissMs = 2000 
}: CaptureConfirmationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | null>(null)

  const handleDismiss = useCallback(() => {
    if (!containerRef.current) {
      onDismiss()
      return
    }

    gsap.to(containerRef.current, {
      y: 100,
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onDismiss
    })
  }, [onDismiss])

  useEffect(() => {
    if (!containerRef.current) return

    gsap.fromTo(
      containerRef.current,
      { y: 100, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
    )

    timerRef.current = window.setTimeout(() => {
      handleDismiss()
    }, autoDismissMs)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [autoDismissMs, handleDismiss])

  return (
    <div
      ref={containerRef}
      className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[90] cursor-pointer"
      onClick={handleDismiss}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 bg-deep-black border-2 border-lime rounded-xl p-3 shadow-[4px_4px_0_#CCFF00]">
        <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/20 flex-shrink-0">
          <img 
            src={imageUrl} 
            alt="Captured photo" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lime text-2xl">✓</span>
            <span className="font-pixel text-2xl text-white tracking-wider">SAVED!</span>
          </div>
          <span className="font-display text-xs text-white/60 uppercase tracking-wider">
            Tap to dismiss
          </span>
        </div>
      </div>
    </div>
  )
}
