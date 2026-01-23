import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CaptureConfirmationProps {
  imageUrl: string;
  onDismiss: () => void;
  autoDismissMs?: number;
}

export function CaptureConfirmation({
  imageUrl,
  onDismiss,
  autoDismissMs = 2000,
}: CaptureConfirmationProps) {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);
  const openTweenRef = useRef<gsap.core.Tween | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);

  const handleDismiss = useCallback(() => {
    if (!containerRef.current) {
      onDismiss();
      return;
    }

    closeTweenRef.current?.kill();

    const duration = prefersReduced ? 0 : 0.3;

    const tween = gsap.to(containerRef.current, {
      y: 100,
      opacity: 0,
      scale: 0.8,
      duration,
      ease: 'power2.in',
      onComplete: onDismiss,
    });

    closeTweenRef.current = tween;
  }, [onDismiss, prefersReduced]);

  useEffect(() => {
    if (!containerRef.current) return;

    openTweenRef.current?.kill();

    const duration = prefersReduced ? 0 : 0.4;

    const tween = gsap.fromTo(
      containerRef.current,
      { y: 100, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration, ease: 'back.out(1.7)' }
    );

    openTweenRef.current = tween;

    timerRef.current = window.setTimeout(() => {
      handleDismiss();
    }, autoDismissMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      openTweenRef.current?.kill();
      closeTweenRef.current?.kill();
    };
  }, [autoDismissMs, handleDismiss, prefersReduced]);

  return (
    <button
      ref={containerRef}
      className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[90] cursor-pointer"
      onClick={handleDismiss}
      aria-live="polite"
      type="button"
    >
      <div className="flex items-center gap-3 bg-deep-black/90 backdrop-blur-sm border-2 border-[#CCFF00] rounded-none shadow-hard-lime-sm p-3 ring-2 ring-black/50">
        <div className="w-16 h-16 rounded-none border-2 border-white/20 flex-shrink-0 bg-black">
          <img
            src={imageUrl}
            alt="Captured photo"
            className="w-full h-full object-cover pixelated"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[#CCFF00] text-2xl drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">✓</span>
            <span className="font-pixel text-2xl text-white tracking-wider drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">
              SAVED!
            </span>
          </div>
          <span className="font-pixel text-[10px] text-white/80 uppercase tracking-widest mt-1">
            Tap to dismiss
          </span>
        </div>
      </div>
    </button>
  );
}
