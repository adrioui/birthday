import { useState, useEffect, useRef, useCallback } from 'react'

export type CameraState = 'idle' | 'requesting' | 'active' | 'denied' | 'error'

interface UseCameraOptions {
  facingMode?: 'user' | 'environment'
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>
  state: CameraState
  error: string | null
  startCamera: () => Promise<void>
  stopCamera: () => void
}

export function useCamera(options: UseCameraOptions = {}): UseCameraReturn {
  const { facingMode = 'user' } = options
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [state, setState] = useState<CameraState>('idle')
  const [error, setError] = useState<string | null>(null)
  const stateRef = useRef<CameraState>(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setState('idle')
  }, [])

  const startCamera = useCallback(async () => {
    if (stateRef.current === 'active' || stateRef.current === 'requesting') return

    setState('requesting')
    setError(null)

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera not supported in this browser')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setState('active')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      
      if (errorMessage.includes('Permission denied') || 
          errorMessage.includes('NotAllowedError')) {
        setState('denied')
        setError('Camera permission denied')
      } else {
        setState('error')
        setError(errorMessage)
      }
    }
  }, [facingMode])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return {
    videoRef,
    state,
    error,
    startCamera,
    stopCamera,
  }
}
