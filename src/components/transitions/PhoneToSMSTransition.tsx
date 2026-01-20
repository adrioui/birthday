import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTransition } from '../../context/TransitionContext'
import { useNavigate } from '@tanstack/react-router'

export function PhoneToSMSTransition() {
  const { isTransitioning, transitionType, phoneScreenRect, endTransition } = useTransition()
  const overlayRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isTransitioning || transitionType !== 'phone-to-sms' || !phoneScreenRect || !overlayRef.current) {
      return
    }

    const overlay = overlayRef.current

    gsap.set(overlay, {
      position: 'fixed',
      left: phoneScreenRect.left,
      top: phoneScreenRect.top,
      width: phoneScreenRect.width,
      height: phoneScreenRect.height,
      backgroundColor: '#131315',
      borderRadius: '0.5rem',
      zIndex: 100,
      opacity: 1,
    })

    const tl = gsap.timeline({
      onComplete: () => {
        navigate({ to: '/sms' })
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

  if (!isTransitioning || transitionType !== 'phone-to-sms') {
    return null
  }

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none"
      aria-hidden="true"
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="font-pixel text-lime text-xl animate-pulse">
          CONNECTING...
        </div>
      </div>
    </div>
  )
}
