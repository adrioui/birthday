import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { type Charm } from '../../types/charm';
import { trackEvent } from '../../lib/telemetry';
import { useCharms } from '../../context/CharmContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CharmCardProps {
  charm: Charm;
  isFlipped: boolean;
  onFlip: (id: string | null) => void;
  className?: string;
}

export function CharmCard({ charm, isFlipped, onFlip, className = '' }: CharmCardProps) {
  const prefersReduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasAwardedBonus = useRef(false);
  const previousFlipped = useRef(isFlipped);
  const { addBonusPoints } = useCharms();
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Skip animation on initial mount - only animate when isFlipped actually changes
    if (previousFlipped.current === isFlipped) return;
    previousFlipped.current = isFlipped;

    if (isAnimating.current) return;

    isAnimating.current = true;

    tweenRef.current?.kill();

    const duration = prefersReduced ? 0 : 0.6;

    const tween = gsap.to(cardRef.current, {
      rotateY: isFlipped ? 180 : 0,
      duration,
      ease: 'power2.inOut',
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    tweenRef.current = tween;

    if (isFlipped) {
      trackEvent('charm_viewed', { charmId: charm.id, charmName: charm.name });

      if (!hasAwardedBonus.current) {
        addBonusPoints(10, `charm-inspect-${charm.id}`);
        hasAwardedBonus.current = true;
      }
    }

    return () => {
      tweenRef.current?.kill();
    };
  }, [isFlipped, charm.id, charm.name, addBonusPoints, prefersReduced]);

  const handleClick = () => {
    if (isAnimating.current) return;
    onFlip(isFlipped ? null : charm.id);
  };

  const iconBgColor = charm.iconBgColor || 'bg-gradient-to-b from-gray-100 to-gray-300';
  const iconColor = charm.iconColor || 'text-gray-400';
  const isCustomBg = charm.iconBgColor?.startsWith('#');

  return (
    <button
      className={`relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-50 active:scale-95 charm-card-focus ${className}`}
      style={{ perspective: '1000px' }}
      onClick={handleClick}
      aria-pressed={isFlipped}
      aria-label={`${charm.name} charm card. ${isFlipped ? 'Showing power: ' + charm.power : 'Tap to reveal power'}`}
      type="button"
      data-testid={`charm-card-${charm.id}`}
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
            <div className="text-4xl mb-3">{charm.icon.length <= 2 ? charm.icon : '✨'}</div>
            <h3 className="font-display font-black uppercase text-base leading-none text-lime mb-3">
              {charm.name}
            </h3>
            <div className="bg-lime/20 border border-lime rounded px-3 py-2">
              <p className="font-pixel text-lg leading-tight text-lime uppercase tracking-wider">
                PWR: {charm.power}
              </p>
            </div>
            <p className="font-pixel text-xs text-lime/60 mt-3 uppercase">Tap to close</p>
          </div>
        </div>
      </div>
    </button>
  );
}
