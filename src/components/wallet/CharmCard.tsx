import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { type Charm } from '../../types/charm'
import { trackEvent } from '../../lib/telemetry'

interface CharmCardProps {
  charm: Charm
  isFlipped: boolean
  onFlip: (id: string | null) => void
  className?: string
}

export function CharmCard({ charm, isFlipped, onFlip, className = '' }: CharmCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isAnimating = useRef(false)

  useEffect(() => {
    if (!cardRef.current || isAnimating.current) return

    isAnimating.current = true

    gsap.to(cardRef.current, {
      rotateY: isFlipped ? 180 : 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        isAnimating.current = false
      },
    })

    if (isFlipped) {
      trackEvent('charm_viewed', { charmId: charm.id, charmName: charm.name })
    }
  }, [isFlipped, charm.id, charm.name])

  const handleClick = () => {
    if (isAnimating.current) return
    onFlip(isFlipped ? null : charm.id)
  }

  const iconBgColor = charm.iconBgColor || 'bg-gradient-to-b from-gray-100 to-gray-300'
  const iconColor = charm.iconColor || 'text-gray-400'
  const isCustomBg = charm.iconBgColor?.startsWith('#')

  return (
    <div
      className={`relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-50 active:scale-95 charm-card-focus ${className}`}
      style={{ perspective: '1000px' }}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
      aria-label={`${charm.name} charm card. ${isFlipped ? 'Showing power: ' + charm.power : 'Tap to reveal power'}`}
    >
      <div
        ref={cardRef}
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 w-full bg-white rounded-xl border-[3px] border-lime p-1.5 sticker-shadow-hard"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div 
            className={`rounded-lg h-28 flex items-center justify-center border border-black/10 overflow-hidden relative ${!isCustomBg ? iconBgColor : ''}`}
            style={isCustomBg ? { backgroundColor: charm.iconBgColor } : undefined}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <span 
              className={`material-symbols-outlined text-7xl chrome-text ${iconColor}`}
              style={charm.iconColor?.startsWith('#') ? { color: charm.iconColor } : undefined}
            >
              {charm.icon}
            </span>
          </div>
          <div className="mt-2 px-1">
            <h3 className="font-display font-black uppercase text-lg leading-none text-deep-black">
              {charm.name}
            </h3>
            <div className="mt-1 bg-deep-black p-1 rounded-sm">
              <p className="font-pixel text-[10px] leading-tight text-lime text-center uppercase tracking-wider">
                TAP TO REVEAL
              </p>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 w-full bg-deep-black rounded-xl border-[3px] border-lime p-1.5 sticker-shadow-hard"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(#CCFF00 1px, transparent 1px)',
                backgroundSize: '8px 8px',
              }}
            />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="text-4xl mb-3">
              {charm.icon.length <= 2 ? charm.icon : '✨'}
            </div>
            <h3 className="font-display font-black uppercase text-base leading-none text-lime mb-3">
              {charm.name}
            </h3>
            <div className="bg-lime/20 border border-lime rounded px-3 py-2">
              <p className="font-pixel text-lg leading-tight text-lime uppercase tracking-wider">
                PWR: {charm.power}
              </p>
            </div>
            <p className="font-pixel text-xs text-lime/60 mt-3 uppercase">
              Tap to close
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
