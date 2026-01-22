import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useEasterEggs } from '../hooks/useEasterEggs';
import { Confetti } from './effects/Confetti';
import { ScreenShake } from './effects/ScreenShake';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function EasterEggOverlay() {
  const { showOverlay, currentEgg, dismissOverlay } = useEasterEggs();
  const prefersReduced = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showOverlay || !overlayRef.current || prefersReduced) return;

    const overlay = overlayRef.current;

    gsap.fromTo(
      overlay,
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
    );

    return () => {
      gsap.killTweensOf(overlay);
    };
  }, [showOverlay, prefersReduced]);

  if (!showOverlay || !currentEgg) return null;

  return (
    <>
      <ScreenShake trigger={showOverlay} intensity="medium" />
      <Confetti trigger={showOverlay} />

      <div
        ref={overlayRef}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
        onClick={dismissOverlay}
        role="dialog"
        aria-modal="true"
        aria-labelledby="easter-egg-title"
      >
        <div
          className="relative max-w-sm w-full rounded-2xl border-4 border-lime bg-deep-black p-6 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="alert"
          aria-live="polite"
        >
          <div className="mb-4 text-6xl animate-bounce">{currentEgg.icon}</div>

          <h2
            id="easter-egg-title"
            className="mb-2 text-2xl font-black text-lime"
            style={{ textShadow: '0 0 10px rgba(204,255,0,0.8)' }}
          >
            {currentEgg.title}
          </h2>

          <p className="mb-6 text-lg text-white/90">{currentEgg.message}</p>

          <button
            onClick={dismissOverlay}
            className="w-full rounded-sm bg-lime py-2 font-bold text-deep-black hover:bg-[#b8e600] active:scale-95 transition-all"
            aria-label="Close Easter egg"
          >
            Awesome!
          </button>

          <div className="mt-4 text-xs text-gray-400">Click anywhere to close</div>
        </div>
      </div>
    </>
  );
}
