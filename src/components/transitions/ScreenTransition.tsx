import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTransition } from '../../context/TransitionContext'
import { useNavigate } from '@tanstack/react-router'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const transitionConfig = {
  'phone-to-sms': {
    to: '/sms',
    color: '#131315',
    text: 'CONNECTING...',
  },
  'gift-to-camcorder': {
    to: '/camcorder',
    color: '#1a1a1a',
    text: 'LOADING CAMERA...',
  },
}

export function ScreenTransition() {
  const { isTransitioning, transitionType, phoneScreenRect, endTransition } = useTransition()
  const overlayRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    console.log('[ScreenTransition] useEffect triggered:', { isTransitioning, transitionType, phoneScreenRect: phoneScreenRect ? { left: phoneScreenRect.left, top: phoneScreenRect.top, width: phoneScreenRect.width, height: phoneScreenRect.height } : null })

    if (!isTransitioning || !transitionType || !phoneScreenRect || !overlayRef.current) {
      console.log('[ScreenTransition] exiting - conditions not met:', { isTransitioning, hasType: !!transitionType, hasRect: !!phoneScreenRect, hasRef: !!overlayRef.current })
      return
    }

    console.log('[ScreenTransition] starting animation for:', transitionType)
    const config = transitionConfig[transitionType]
    const overlay = overlayRef.current

    if (prefersReduced) {
      navigate({ to: config.to })
      setTimeout(() => {
        endTransition()
      }, 50)
      return
    }

    gsap.set(overlay, {
      position: 'fixed',
      left: phoneScreenRect.left,
      top: phoneScreenRect.top,
      width: phoneScreenRect.width,
      height: phoneScreenRect.height,
      backgroundColor: config.color,
      borderRadius: '0.5rem',
      zIndex: 100,
      opacity: 1,
      display: 'block',
    })

    const tl = gsap.timeline({
      onComplete: () => {
        console.log('[ScreenTransition] animation complete, navigating to:', config.to)
        navigate({ to: config.to })
        setTimeout(() => {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              console.log('[ScreenTransition] fade out complete, calling endTransition')
              endTransition()
            },
          })
        }, 100)
      }
    })

    tl.to(overlay, {
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
      duration: 0.6,
      ease: 'power2.inOut',
    })

    return () => {
      tl.kill()
    }
  }, [isTransitioning, transitionType, phoneScreenRect, navigate, endTransition, prefersReduced])

  if (!isTransitioning || !transitionType) {
    return null
  }

  const config = transitionConfig[transitionType]

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none"
      aria-hidden="true"
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="font-pixel text-lime text-xl">
          {config.text}
        </div>
      </div>
    </div>
  )
}
