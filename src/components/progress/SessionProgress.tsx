import { useEffect, useRef } from 'react'
import { useProgress } from '../../context/useProgress'
import { gsap } from 'gsap'
import type { Milestone } from '../../types/progress'

export function SessionProgress() {
  const { milestones } = useProgress()
  const completedCount = milestones.filter((m: Milestone) => m.completed).length
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || completedCount === 0) return

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    )
  }, [completedCount])

  if (completedCount === 0) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white/95 border-[2px] border-deep-black rounded-lg shadow-[4px_4px_0px_#131315] px-3 py-2"
      role="progressbar"
      aria-label={`Session progress: ${completedCount} of ${milestones.length} milestones completed`}
    >
      <span className="text-xs font-bold uppercase tracking-wider text-deep-black/70">
        Progress
      </span>
      <div className="flex items-center gap-1.5">
        {milestones.map((milestone: Milestone) => (
          <div
            key={milestone.id}
            className={`w-2.5 h-2.5 rounded-sm transition-all ${
              milestone.completed
                ? 'bg-lime-400 shadow-[0_0_6px_rgba(204,255,0.6)]'
                : 'bg-gray-300'
            }`}
            title={milestone.name}
          />
        ))}
      </div>
    </div>
  )
}
