import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface FlashOverlayProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function FlashOverlay({ trigger, onComplete }: FlashOverlayProps) {
  const flashRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!trigger) {
      hasAnimated.current = false;
      return;
    }

    if (prefersReduced) {
      onComplete?.();
      return;
    }

    if (hasAnimated.current || !flashRef.current) return;

    hasAnimated.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.();
      },
    });

    tl.fromTo(flashRef.current, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'power2.out' });
    tl.to(flashRef.current, { opacity: 1, duration: 0.05 });
    tl.to(flashRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' });

    return () => {
      tl.kill();
    };
  }, [trigger, onComplete, prefersReduced]);

  if (!trigger) return null;

  return (
    <div
      ref={flashRef}
      className="fixed inset-0 z-[100] bg-white pointer-events-none"
      style={{ opacity: 0 }}
      aria-hidden="true"
    />
  );
}
