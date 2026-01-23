import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from '@tanstack/react-router';
import { type Charm } from '../../types/charm';
import { CharmCard } from './CharmCard';
import { useCharmFlip } from '../../hooks/useCharmFlip';
import { Confetti } from '../effects/Confetti';
import { useAudio } from '../../hooks/useAudio';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CharmUnlockModalProps {
  charm: Charm;
  onDismiss: () => void;
}

export function CharmUnlockModal({ charm, onDismiss }: CharmUnlockModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { handleFlip, isFlipped } = useCharmFlip();
  const { playGiftRevealSound } = useAudio();
  const navigate = useNavigate();
  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTlRef = useRef<gsap.core.Timeline | null>(null);
  const restoreFocus = useFocusTrap(true, containerRef);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!backdropRef.current || !containerRef.current) return;

    playGiftRevealSound();

    const duration = prefersReduced ? 0 : 0.3;

    const tl = gsap.timeline();

    tl.to(backdropRef.current, { opacity: 1, duration });

    tl.fromTo(
      containerRef.current,
      { scale: 0.5, opacity: 0, rotation: -10 },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: prefersReduced ? 0 : 0.6,
        ease: 'back.out(1.5)',
      }
    );

    openTlRef.current = tl;

    return () => {
      openTlRef.current?.kill();
      closeTlRef.current?.kill();
    };
  }, [playGiftRevealSound, prefersReduced]);

  const handleClose = () => {
    restoreFocus();
    if (!backdropRef.current || !containerRef.current) {
      onDismiss();
      navigate({ to: '/wallet' });
      return;
    }

    closeTlRef.current?.kill();

    const duration = prefersReduced ? 0 : 0.3;

    const tl = gsap.timeline();
    tl.to(containerRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration,
      ease: 'power2.in',
    });

    tl.to(backdropRef.current, {
      opacity: 0,
      duration,
      onComplete: () => {
        onDismiss();
        navigate({ to: '/wallet' });
      },
    });

    closeTlRef.current = tl;
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 opacity-0"
      onClick={handleClose}
    >
      <div
        ref={containerRef}
        className="relative flex flex-col items-center max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-8 relative">
          <h2 className="chrome-text text-4xl font-black italic transform -rotate-2">NEW CHARM!</h2>
          <div className="absolute -top-4 -right-8 text-4xl animate-bounce">✨</div>
          <div className="absolute -bottom-2 -left-8 text-3xl animate-pulse">✦</div>
        </div>

        <div className="w-64 h-80 mb-8 transform rotate-3 transition-transform hover:scale-105">
          <CharmCard
            charm={charm}
            isFlipped={isFlipped(charm.id)}
            onFlip={handleFlip}
            className="w-full h-full shadow-[0_0_30px_rgba(204,255,0,0.3)]"
          />
        </div>

        <button
          onClick={handleClose}
          className="modal-btn-focus px-8 py-3 bg-lime border-b-4 border-r-4 border-deep-black rounded-lg font-display font-bold text-xl uppercase tracking-wider hover:-translate-y-1 hover:border-b-[6px] hover:border-r-[6px] active:translate-y-0 active:border-b-4 active:border-r-4 transition-all"
        >
          Awesome!
        </button>
      </div>

      <Confetti trigger={true} />
    </div>
  );
}
