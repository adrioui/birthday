import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { Confetti } from '../effects/Confetti'
import { useAudio } from '../../hooks/useAudio'
import { useTransition } from '../../context/TransitionContext'
import { useCharms } from '../../context/CharmContext'

interface GiftCardModalProps {
  onClose: () => void
}

export function GiftCardModal({ onClose }: GiftCardModalProps) {
  const { playGiftRevealSound } = useAudio()
  const { startTransition } = useTransition()
  const { addBonusPoints } = useCharms()
  const backdropRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const wrappedRef = useRef<HTMLDivElement>(null)
  const revealedRef = useRef<HTMLDivElement>(null)
  const captureButtonRef = useRef<HTMLButtonElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const openTlRef = useRef<gsap.core.Timeline | null>(null)
  const revealTlRef = useRef<gsap.core.Timeline | null>(null)
  const closeTlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (!backdropRef.current || !cardRef.current) return

    const tl = gsap.timeline()
    tl.to(backdropRef.current,
      { opacity: 1, duration: 0.3 }
    )

    tl.fromTo(cardRef.current,
      { scale: 0.5, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
    )

    openTlRef.current = tl

    return () => {
      openTlRef.current?.kill()
      revealTlRef.current?.kill()
      closeTlRef.current?.kill()
    }
  }, [])

  const handleReveal = () => {
    if (isRevealed || !wrappedRef.current || !revealedRef.current) return

    setIsRevealed(true)
    playGiftRevealSound()
    addBonusPoints(50, 'gift-card-reveal')

    revealTlRef.current?.kill()

    const tl = gsap.timeline()

    tl.to(wrappedRef.current, {
      rotation: -5,
      duration: 0.1,
    })
    tl.to(wrappedRef.current, {
      rotation: 5,
      duration: 0.1,
    })
    tl.to(wrappedRef.current, {
      rotation: -5,
      duration: 0.1,
    })
    tl.to(wrappedRef.current, {
      rotation: 0,
      scale: 1.2,
      duration: 0.2,
    })

    tl.to(wrappedRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    })
    tl.fromTo(revealedRef.current,
      { scale: 0, opacity: 0, rotation: -10 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.7)' },
      '-=0.1'
    )

    revealTlRef.current = tl
  }

  const handleClose = () => {
    if (!backdropRef.current || !cardRef.current) {
      onClose()
      return
    }

    closeTlRef.current?.kill()

    const tl = gsap.timeline()
    tl.to(cardRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 30,
      duration: 0.3,
      ease: 'power2.in',
    })
    tl.to(backdropRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: onClose,
    })

    closeTlRef.current = tl
  }

  const handleCaptureClick = () => {
    if (captureButtonRef.current) {
      const rect = captureButtonRef.current.getBoundingClientRect()
      startTransition('gift-to-camcorder', rect)
    }
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-sm bg-white rounded-2xl border-4 border-deep-black shadow-[8px_8px_0px_#131315] p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corner ribbons */}
        <div className="absolute -top-2 -left-2 w-16 h-16 bg-hot-pink transform -rotate-45 translate-x-[-50%] translate-y-[-50%]" />
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-lime transform rotate-45 translate-x-[50%] translate-y-[-50%]" />

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-pixel text-3xl text-deep-black mb-2">
            GIFT CARD
          </h2>
          <p className="font-display text-sm text-gray-500">
            {isRevealed ? 'Happy Birthday!' : 'Tap to unwrap your gift'}
          </p>
        </div>

        {/* Gift Area */}
        <div
          className="relative h-48 flex items-center justify-center cursor-pointer"
          onClick={handleReveal}
        >
          {/* Wrapped Gift */}
          <div
            ref={wrappedRef}
            className={`absolute transition-all ${isRevealed ? 'pointer-events-none' : ''}`}
          >
            <div className="relative">
              {/* Gift Box */}
              <div className="w-32 h-28 bg-gradient-to-br from-hot-pink to-pink-600 rounded-lg border-4 border-deep-black shadow-lg relative">
                {/* Ribbon vertical */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-full bg-lime border-x-2 border-deep-black" />
                {/* Ribbon horizontal */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-4 bg-lime border-y-2 border-deep-black" />
              </div>
              {/* Bow */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="w-8 h-6 bg-lime rounded-full border-2 border-deep-black -rotate-45 absolute -left-4" />
                  <div className="w-8 h-6 bg-lime rounded-full border-2 border-deep-black rotate-45 absolute -right-4" />
                  <div className="w-4 h-4 bg-lime rounded-full border-2 border-deep-black relative z-10" />
                </div>
              </div>
              {/* Sparkles */}
              <div className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</div>
              <div className="absolute -bottom-1 -left-2 text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
            </div>
          </div>

          {/* Revealed Content */}
          <div
            ref={revealedRef}
            className={`absolute text-center ${isRevealed ? '' : 'opacity-0 pointer-events-none'}`}
          >
            <div className="text-6xl mb-4">🎂</div>
            <div className="font-pixel text-2xl text-deep-black mb-2">
              HAPPY BIRTHDAY!
            </div>
            <div className="font-display text-lg text-hot-pink font-bold">
              You're the best!
            </div>
            <div className="mt-4 px-4 py-2 bg-lime border-2 border-deep-black rounded font-pixel text-lg">
              Enjoy your special day!
            </div>
            <button
              ref={captureButtonRef}
              onClick={handleCaptureClick}
              className="mt-4 w-full px-4 py-3 bg-hot-pink border-2 border-deep-black rounded-lg font-display font-bold text-white uppercase tracking-wider shadow-[4px_4px_0px_#131315] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#131315] active:translate-y-0 active:shadow-[2px_2px_0px_#131315] transition-all flex items-center justify-center gap-2"
            >
              <CameraIcon className="w-5 h-5" />
              Capture the Moment!
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full border-2 border-deep-black text-deep-black hover:bg-gray-300 transition-colors font-bold"
          aria-label="Close gift card"
        >
          ×
        </button>

        {/* Bottom decoration */}
        <div className="mt-6 text-center">
          <span className="font-pixel text-xs text-gray-400 uppercase tracking-widest">
            From: Bestie &lt;3
          </span>
        </div>
      </div>

      {isRevealed && <Confetti trigger={isRevealed} />}
    </div>
  )
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 15.2c1.77 0 3.2-1.43 3.2-3.2S13.77 8.8 12 8.8 8.8 10.23 8.8 12s1.43 3.2 3.2 3.2zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    </svg>
  )
}
