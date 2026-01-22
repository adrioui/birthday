import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Confetti } from '../effects/Confetti'

interface RedeemSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RedeemSuccessModal({ isOpen, onClose }: RedeemSuccessModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const sparkle1Ref = useRef<HTMLDivElement>(null)
  const sparkle2Ref = useRef<HTMLDivElement>(null)
  const sparkle3Ref = useRef<HTMLDivElement>(null)
  const sparkle4Ref = useRef<HTMLDivElement>(null)
  const closeTlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (!isOpen) return

    if (!backdropRef.current || !containerRef.current || !titleRef.current || !messageRef.current || !buttonRef.current) return

    const tl = gsap.timeline()

    tl.to(backdropRef.current, { opacity: 1, duration: 0.3 })

    tl.fromTo(containerRef.current,
      { scale: 0.5, opacity: 0, rotation: -15 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' },
      '-=0.2'
    )

    tl.fromTo(titleRef.current,
      { y: -30, opacity: 0, scale: 0.5 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
      '-=0.3'
    )

    tl.fromTo(messageRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    )

    const sparkles = [sparkle1Ref, sparkle2Ref, sparkle3Ref, sparkle4Ref]
    sparkles.forEach((sparkleRef, index) => {
      const sparkle = sparkleRef.current
      if (sparkle) {
        tl.fromTo(sparkle,
          { scale: 0, opacity: 0, rotation: Math.random() * 360 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.3, ease: 'back.out(2)' },
          `-=${0.1 + index * 0.05}`
        )
      }
    })

    tl.fromTo(buttonRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    )

    return () => {
      tl.kill()
      closeTlRef.current?.kill()
    }
  }, [isOpen])

  const handleClose = () => {
    if (!backdropRef.current || !containerRef.current) {
      onClose()
      return
    }

    closeTlRef.current?.kill()

    const tl = gsap.timeline()
    tl.to(containerRef.current, {
      scale: 1.2,
      opacity: 0,
      rotation: 10,
      duration: 0.4,
      ease: 'power2.in'
    })

    tl.to(backdropRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: onClose
    })

    closeTlRef.current = tl
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 opacity-0"
      onClick={handleBackdropClick}
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-sm bg-gradient-to-br from-periwinkle-light to-periwinkle rounded-2xl border-4 border-deep-black shadow-[8px_8px_0px_#FF0099] p-6 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-lime transform rotate-45 translate-x-[50%] translate-y-[-50%]" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-hot-pink transform -rotate-45 translate-x-[-50%] translate-y-[50%]" />

        <div className="text-center mb-8 relative">
          <div className="relative inline-block mb-4">
            <h2
              ref={titleRef}
              className="chrome-text text-5xl font-black italic transform -rotate-2"
            >
              GIFT UNLOCKED!
            </h2>
            <div
              ref={sparkle1Ref}
              className="absolute -top-6 -right-8 text-4xl"
            >
              ✨
            </div>
            <div
              ref={sparkle2Ref}
              className="absolute -bottom-2 -left-8 text-3xl"
            >
              ✦
            </div>
            <div
              ref={sparkle3Ref}
              className="absolute top-1/2 -right-12 text-2xl"
            >
              ⭐
            </div>
            <div
              ref={sparkle4Ref}
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl"
            >
              ✧
            </div>
          </div>

          <div
            ref={messageRef}
            className="relative"
          >
            <div className="text-6xl mb-4 animate-bounce">🎁</div>
            <p className="font-display text-lg text-deep-black font-bold mb-2">
              Your gift is ready!
            </p>
            <p className="font-pixel text-sm text-deep-black/70">
              Check your SMS for the gift card code
            </p>
          </div>
        </div>

        <button
          ref={buttonRef}
          onClick={handleClose}
          className="w-full px-6 py-4 bg-lime border-b-4 border-r-4 border-deep-black rounded-lg font-display font-bold text-deep-black text-xl uppercase tracking-wider hover:-translate-y-1 hover:border-b-[6px] hover:border-r-[6px] active:translate-y-0 active:border-b-4 active:border-r-4 transition-all shadow-[4px_4px_0px_#131315]"
        >
          Awesome!
        </button>

        <div className="mt-4 text-center">
          <span className="font-pixel text-xs text-deep-black/40 uppercase tracking-widest">
            Happy Birthday!
          </span>
        </div>
      </div>

      <Confetti trigger={isOpen} />
    </div>
  )
}
