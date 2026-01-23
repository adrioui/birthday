import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Confetti } from '../effects/Confetti';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface RedeemConfirmModalProps {
  isOpen: boolean;
  totalPoints: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RedeemConfirmModal({
  isOpen,
  totalPoints,
  onConfirm,
  onCancel,
}: RedeemConfirmModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pointsRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const closeTlRef = useRef<gsap.core.Timeline | null>(null);
  const restoreFocus = useFocusTrap(isOpen, containerRef);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    if (
      !backdropRef.current ||
      !containerRef.current ||
      !titleRef.current ||
      !pointsRef.current ||
      !confirmButtonRef.current ||
      !cancelButtonRef.current
    )
      return;

    const duration = prefersReduced ? 0 : 0.3;

    const tl = gsap.timeline();

    tl.to(backdropRef.current, { opacity: 1, duration });

    tl.fromTo(
      containerRef.current,
      { scale: 0.8, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: prefersReduced ? 0 : 0.4, ease: 'back.out(1.5)' },
      '-=0.2'
    );

    tl.fromTo(
      titleRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: prefersReduced ? 0 : 0.3, ease: 'power2.out' },
      '-=0.2'
    );

    tl.fromTo(
      pointsRef.current,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: prefersReduced ? 0 : 0.4, ease: 'back.out(1.7)' },
      '-=0.1'
    );

    tl.fromTo(
      [confirmButtonRef.current, cancelButtonRef.current],
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: prefersReduced ? 0 : 0.3,
        stagger: prefersReduced ? 0 : 0.1,
        ease: 'power2.out',
      },
      '-=0.2'
    );

    return () => {
      tl.kill();
      closeTlRef.current?.kill();
    };
  }, [isOpen, prefersReduced]);

  const handleConfirm = () => {
    setShowConfetti(true);
    setTimeout(() => {
      restoreFocus();
      onConfirm();
    }, 500);
  };

  const handleCancel = () => {
    setShowConfetti(false);
    restoreFocus();

    if (!backdropRef.current || !containerRef.current) {
      onCancel();
      return;
    }

    closeTlRef.current?.kill();

    const duration = prefersReduced ? 0 : 0.3;

    const tl = gsap.timeline();
    tl.to(containerRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 30,
      duration,
      ease: 'power2.in',
    });

    tl.to(backdropRef.current, {
      opacity: 0,
      duration,
      onComplete: onCancel,
    });

    closeTlRef.current = tl;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 opacity-0"
      onClick={handleBackdropClick}
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-sm bg-white rounded-2xl border-4 border-deep-black shadow-hard-xl p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-3 -right-3 w-20 h-20 bg-lime transform rotate-45 translate-x-[50%] translate-y-[-50%]" />
        <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-hot-pink transform -rotate-45 translate-x-[-50%] translate-y-[50%]" />

        <div className="text-center mb-6 relative">
          <h2
            ref={titleRef}
            className="chrome-text text-3xl font-black italic transform -rotate-1 mb-2"
          >
            REDEEM NOW?
          </h2>
          <p className="font-display text-sm text-gray-500 font-medium">
            Exchange your points for a gift
          </p>
        </div>

        <div
          ref={pointsRef}
          className="flex flex-col items-center justify-center p-6 mb-6 bg-gradient-to-br from-periwinkle-light to-periwinkle rounded-xl border-2 border-deep-black"
        >
          <p className="font-pixel text-sm text-deep-black/70 mb-1 uppercase tracking-wider">
            You have
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-pixel text-5xl text-deep-black">{totalPoints}</span>
            <span className="font-display text-sm font-bold text-lime bg-deep-black px-2 py-1 rounded-sm">
              PTS
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            ref={cancelButtonRef}
            onClick={handleCancel}
            className="modal-btn-focus flex-1 px-4 py-3 bg-system-grey border-b-4 border-r-4 border-deep-black rounded-lg font-display font-bold text-deep-black uppercase tracking-wider hover:-translate-y-1 hover:border-b-[5px] hover:border-r-[5px] active:translate-y-0 active:border-b-4 active:border-r-4 transition-all"
          >
            Cancel
          </button>
          <button
            ref={confirmButtonRef}
            onClick={handleConfirm}
            className="modal-btn-focus flex-1 px-4 py-3 bg-lime border-b-4 border-r-4 border-deep-black rounded-lg font-display font-bold text-deep-black uppercase tracking-wider hover:-translate-y-1 hover:border-b-[5px] hover:border-r-[5px] active:translate-y-0 active:border-b-4 active:border-r-4 transition-all shadow-hard-pink-sm"
          >
            Confirm
          </button>
        </div>

        <div className="mt-4 text-center">
          <span className="font-pixel text-xs text-gray-400 uppercase tracking-widest">
            This action cannot be undone
          </span>
        </div>
      </div>

      {showConfetti && <Confetti trigger={true} />}
    </div>
  );
}
