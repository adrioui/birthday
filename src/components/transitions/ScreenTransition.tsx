import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTransition } from '../../context/TransitionContext'
import { useNavigate } from '@tanstack/react-router'

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

  useEffect(() => {
    if (!isTransitioning || !transitionType || !phoneScreenRect || !overlayRef.current) {
      return
    }

    const config = transitionConfig[transitionType]
    const overlay = overlayRef.current

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
    })

    const tl = gsap.timeline({
      onComplete: () => {
        navigate({ to: config.to })
        setTimeout(() => {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.3,
            onComplete: endTransition,
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
  }, [isTransitioning, transitionType, phoneScreenRect, navigate, endTransition])

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
        <div className="font-pixel text-lime text-xl animate-pulse">
          {config.text}
        </div>
      </div>
    </div>
  )
}
