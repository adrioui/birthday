import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '../../hooks';

interface GlitchOverlayProps {
  trigger: boolean;
  duration?: number;
  onComplete?: () => void;
  onSkip?: () => void;
}

export function GlitchOverlay({ trigger, duration = 0.5, onComplete, onSkip }: GlitchOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const prefersReduced = useReducedMotion();

  const handleSkip = () => {
    onSkip?.();
    onComplete?.();
  };

  useEffect(() => {
    if (!trigger) {
      hasAnimated.current = false;
      return;
    }

    if (prefersReduced) {
      onComplete?.();
      return;
    }

    if (hasAnimated.current || !overlayRef.current) return;

    hasAnimated.current = true;

    const overlay = overlayRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.();
      },
    });

    tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'steps(3)' });

    for (let i = 0; i < 5; i++) {
      tl.to(overlay, {
        clipPath: 'inset(20% 30% 10% 40%)',
        filter: 'hue-rotate(90deg) saturate(200%)',
        duration: 0.03,
        ease: 'none',
      });
      tl.to(overlay, {
        clipPath: 'inset(40% 10% 30% 20%)',
        filter: 'hue-rotate(-90deg) saturate(150%)',
        duration: 0.03,
        ease: 'none',
      });
    }

    tl.to(overlay, {
      clipPath: 'inset(0% 0% 0% 0%)',
      filter: 'none',
      opacity: 0,
      duration: 0.1,
      ease: 'steps(2)',
    });

    return () => {
      tl.kill();
    };
  }, [trigger, duration, onComplete, prefersReduced]);

  if (!trigger || prefersReduced) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[75] bg-[rgba(0,0,0,0.3)]"
      style={{ opacity: 0 }}
    >
      <button
        onClick={handleSkip}
        className="fixed bottom-8 right-8 z-[76] px-6 py-3 bg-lime text-deep-black font-pixel text-sm border-4 border-deep-black shadow-hard hover:bg-lime/90 active:border-t-2 active:border-l-2"
        aria-label="Skip glitch effect"
      >
        SKIP
      </button>
    </div>
  );
}
