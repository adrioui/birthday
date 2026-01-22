import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface ScreenShakeProps {
  trigger: boolean
  intensity?: 'light' | 'medium' | 'heavy'
  onComplete?: () => void
}

export function ScreenShake({ trigger, intensity = 'medium', onComplete }: ScreenShakeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (!trigger) {
      hasAnimated.current = false
      return
    }

    if (prefersReduced) {
      onComplete?.()
      return
    }

    if (hasAnimated.current || !containerRef.current) return

    hasAnimated.current = true

    const intensityConfig = {
      light: { x: 3, y: 3, duration: 0.2, shakes: 3 },
      medium: { x: 6, y: 6, duration: 0.3, shakes: 5 },
      heavy: { x: 10, y: 10, duration: 0.4, shakes: 7 },
    }

    const config = intensityConfig[intensity]
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.()
      }
    })

    for (let i = 0; i < config.shakes; i++) {
      tl.to(containerRef.current, {
        x: (Math.random() - 0.5) * config.x * 2,
        y: (Math.random() - 0.5) * config.y * 2,
        duration: config.duration / config.shakes,
        ease: 'power1.inOut',
      })
    }

    tl.to(containerRef.current, {
      x: 0,
      y: 0,
      duration: 0.05,
      ease: 'power1.out',
    })

    return () => {
      tl.kill()
    }
  }, [trigger, intensity, onComplete, prefersReduced])

  if (!trigger || prefersReduced) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[70]"
      aria-hidden="true"
    />
  )
}
