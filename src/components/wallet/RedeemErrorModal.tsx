import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface RedeemErrorModalProps {
  isOpen: boolean;
  onRetry: () => void;
  onCancel: () => void;
}

export function RedeemErrorModal({ isOpen, onRetry, onCancel }: RedeemErrorModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const retryButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const closeTlRef = useRef<gsap.core.Timeline | null>(null);
  const restoreFocus = useFocusTrap(isOpen, containerRef);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    if (
      !backdropRef.current ||
      !containerRef.current ||
      !titleRef.current ||
      !messageRef.current ||
      !retryButtonRef.current ||
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
      messageRef.current,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: prefersReduced ? 0 : 0.4, ease: 'back.out(1.7)' },
      '-=0.1'
    );

    tl.fromTo(
      [retryButtonRef.current, cancelButtonRef.current],
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

  const handleRetry = () => {
    restoreFocus();
    onRetry();
  };

  const handleCancel = () => {
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
        <div className="absolute -top-3 -right-3 w-20 h-20 bg-hot-pink transform rotate-45 translate-x-[50%] translate-y-[-50%]" />
        <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-lime transform -rotate-45 translate-x-[-50%] translate-y-[50%]" />

        <div className="text-center mb-6 relative">
          <h2
            ref={titleRef}
            className="chrome-text text-3xl font-black italic transform -rotate-1 mb-2"
          >
            ERROR!
          </h2>
        </div>

        <div
          ref={messageRef}
          className="flex flex-col items-center justify-center p-6 mb-6 bg-gradient-to-br from-periwinkle-light to-periwinkle rounded-xl border-2 border-deep-black"
        >
          <p className="font-pixel text-sm text-deep-black mb-1 uppercase tracking-wider">
            Failed to redeem
          </p>
          <p className="font-display text-sm text-gray-600">
            Something went wrong. Please try again.
          </p>
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
            ref={retryButtonRef}
            onClick={handleRetry}
            className="modal-btn-focus flex-1 px-4 py-3 bg-lime border-b-4 border-r-4 border-deep-black rounded-lg font-display font-bold text-deep-black uppercase tracking-wider hover:-translate-y-1 hover:border-b-[5px] hover:border-r-[5px] active:translate-y-0 active:border-b-4 active:border-r-4 transition-all shadow-hard-pink-sm"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
