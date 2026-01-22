import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

interface SystemRebootProps {
  trigger: boolean
  onComplete?: () => void
}

export function SystemReboot({ trigger, onComplete }: SystemRebootProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!trigger) {
      hasAnimated.current = false
      return
    }
    
    if (hasAnimated.current || !overlayRef.current || !textRef.current) return
    
    hasAnimated.current = true

    const overlay = overlayRef.current
    const text = textRef.current
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.()
      }
    })

    tl.fromTo(
      overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.1, ease: 'power1.in' }
    )

    tl.fromTo(
      text,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(1.7)' }
    )

    tl.to(text, {
      text: 'SYSTEM REBOOT...',
      duration: 0.1,
      ease: 'none',
    })

    tl.to(text, {
      opacity: 0.5,
      duration: 0.5,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 1,
    })

    tl.to(overlay, {
      backgroundColor: '#000',
      duration: 0.2,
      ease: 'power2.in',
    })

    tl.to(text, {
      opacity: 1,
      color: '#CCFF00',
      duration: 0.1,
    })

    tl.to(text, {
      text: 'REBOOT COMPLETE',
      duration: 0.05,
    })

    tl.to(overlay, {
      opacity: 0,
      duration: 0.5,
      ease: 'power1.out',
      delay: 0.3,
    })

    return () => {
      tl.kill()
    }
  }, [trigger, onComplete])

  if (!trigger) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none bg-[#C3C7CB]"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      <div
        ref={textRef}
        className="font-mono text-2xl font-bold text-[#33FF33]"
        style={{ opacity: 0 }}
      >
        SYSTEM SHUTDOWN...
      </div>
    </div>
  )
}
