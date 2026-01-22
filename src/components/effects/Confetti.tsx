import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface ConfettiProps {
  trigger: boolean
}

export function Confetti({ trigger }: ConfettiProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tweensRef = useRef<gsap.core.Tween[]>([])

  useEffect(() => {
    if (!trigger || !containerRef.current) return

    const container = containerRef.current
    const colors = ['#CCFF00', '#FF0099', '#CCCCFF', '#FFD700', '#FF6B6B']
    const confettiCount = 50
    const tweens: gsap.core.Tween[] = []

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'absolute w-3 h-3 rounded-sm'
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.left = `${Math.random() * 100}%`
      confetti.style.top = '-20px'
      container.appendChild(confetti)

      const tween = gsap.to(confetti, {
        y: window.innerHeight + 50,
        x: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 720,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 0.5,
        ease: 'power1.out',
        onComplete: () => confetti.remove(),
      })
      tweens.push(tween)
    }

    tweensRef.current = tweens

    return () => {
      tweens.forEach(tween => tween.kill())
      tweensRef.current = []
    }
  }, [trigger])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[60] overflow-hidden"
      aria-hidden="true"
    />
  )
}
