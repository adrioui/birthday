import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { useAudio } from '../hooks/useAudio'
import { trackEvent } from '../lib/telemetry'
import { useTransition } from '../context/TransitionContext'

export function FlipPhone() {
  const phoneRef = useRef<HTMLDivElement>(null)
  const topHalfRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(true)
  const { playConnectionSound } = useAudio()
  const { startTransition } = useTransition()

  useEffect(() => {
    if (!topHalfRef.current || !phoneRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false)
      }
    })

    gsap.set(topHalfRef.current, {
      rotateX: -170,
      transformOrigin: 'bottom center',
      transformPerspective: 1000,
    })

    tl.to(topHalfRef.current, {
      rotateX: 0,
      duration: 0.8,
      delay: 0.5,
      ease: 'back.out(1.2)',
    })

    tl.to(phoneRef.current, {
      y: -10,
      duration: 0.15,
      ease: 'power2.out',
    })
    tl.to(phoneRef.current, {
      y: 0,
      duration: 0.2,
      ease: 'bounce.out',
    })

    return () => {
      tl.kill()
    }
  }, [])

  const handlePickUp = useCallback(async () => {
    if (isAnimating) return

    await playConnectionSound()
    trackEvent('flip_call_answered')

    if (screenRef.current) {
      const rect = screenRef.current.getBoundingClientRect()
      startTransition('phone-to-sms', rect)
    }
  }, [isAnimating, playConnectionSound, startTransition])

  return (
    <div 
      ref={phoneRef}
      className="relative z-20 h-[520px] w-64 transition-transform duration-500 hover:scale-[1.02]"
      style={{ perspective: '1000px' }}
    >
      {/* Phone Body */}
      <div className="relative flex h-full w-full flex-col drop-shadow-2xl">
        {/* Top Half (Screen Section) - This flips */}
        <div 
          ref={topHalfRef}
          className="relative flex h-[55%] flex-col items-center rounded-t-[3rem] rounded-b-lg border-[3px] border-gray-400 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-300 px-4 pb-4 pt-8"
          style={{ 
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Earpiece */}
          <div className="mb-4 h-1.5 w-16 rounded-full bg-gray-400 shadow-inner" />

          {/* The Screen */}
          <div
            ref={screenRef}
            className="relative flex w-full flex-1 flex-col overflow-hidden rounded-lg border-4 border-gray-300 bg-deep-black"
            style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)' }}
          >
            {/* Screen Glare */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-[150%] skew-x-12 bg-gradient-to-l from-white/10 to-transparent" />
            
            {/* Scanlines on screen */}
            <div 
              className="pointer-events-none absolute inset-0 z-0 opacity-20"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))',
                backgroundSize: '100% 4px',
              }}
            />

            {/* Screen Content */}
            <div className="relative z-0 flex h-full flex-col justify-between p-3 font-pixel">
              {/* Status Bar */}
              <div className="flex w-full justify-between text-xs tracking-widest text-lime/70">
                <span>NO SIGNAL</span>
                <span>BAT: 12%</span>
              </div>

              {/* Main Content */}
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="animate-pulse text-lg tracking-wider text-white">
                  Incoming Call...
                </div>
                <h2 
                  className="text-4xl font-bold leading-none text-lime"
                  style={{ textShadow: '0 0 5px rgba(204,255,0,0.8)' }}
                >
                  BIRTH-<br />DAY!
                </h2>
              </div>

              {/* Pick Up Button */}
              <div className="mt-2 flex w-full items-center justify-center gap-2">
                <button 
                  onClick={handlePickUp}
                  disabled={isAnimating}
                  className="flex w-full items-center justify-center gap-1 rounded-sm bg-lime py-1 text-lg font-bold text-deep-black transition-all hover:bg-[#b8e600] active:scale-95 disabled:opacity-50"
                  style={{ boxShadow: '0 2px 0 rgba(255,255,255,0.4)' }}
                  aria-label="Pick up call"
                >
                  <PhoneIcon className="h-4 w-4" />
                  PICK UP
                </button>
              </div>
            </div>
          </div>

          {/* Brand Logo */}
          <div className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            MOTOR-TECH
          </div>
        </div>

        {/* Hinge */}
        <div className="relative z-10 mx-4 my-[-4px] h-6 rounded-sm border-y border-gray-500 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 shadow-lg" />

        {/* Bottom Half (Keypad Section) - Stays static */}
        <div 
          className="flex h-[45%] flex-col items-center rounded-b-[3rem] rounded-t-lg border-[3px] border-gray-400 bg-gradient-to-b from-gray-300 to-gray-400 p-5 pt-8"
          style={{ boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)' }}
        >
          {/* D-Pad Area */}
          <div className="mb-4 flex w-full items-center justify-center gap-3 px-2">
            <div 
              className="h-10 flex-1 rounded-sm border border-gray-400 bg-gray-200"
              style={{ boxShadow: '0 2px 0 #999' }}
            />
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-400 bg-gradient-to-br from-gray-100 to-gray-300"
              style={{ boxShadow: '0 3px 0 #999' }}
            >
              <div 
                className="h-4 w-4 rounded-full bg-lime"
                style={{ boxShadow: '0 0 5px rgba(204,255,0,0.5)' }}
              />
            </div>
            <div 
              className="h-10 flex-1 rounded-sm border border-gray-400 bg-gray-200"
              style={{ boxShadow: '0 2px 0 #999' }}
            />
          </div>

          {/* Keypad Grid */}
          <div className="grid w-full grid-cols-3 gap-2 px-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className="h-8 rounded-full bg-gray-800/10"
                style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Phone Charm */}
      <div 
        className="absolute -bottom-8 -right-4 z-30 flex origin-top flex-col items-center"
        style={{ animation: 'swing 3s ease-in-out infinite' }}
      >
        <div className="h-12 w-1 bg-pink-400/50" />
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-pink-500 shadow-lg">
          <HeartIcon className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  )
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}
