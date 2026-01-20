import { useState, useRef, useCallback, useEffect } from 'react'
import { SnapButton, FlashOverlay, CaptureConfirmation } from '../components/camcorder'
import { useAudio } from '../hooks/useAudio'
import { useCapture } from '../hooks/useCapture'
import { trackEvent } from '../lib/telemetry'

export function CamcorderScreen() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [showFlash, setShowFlash] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  
  const { playShutterSound } = useAudio()
  const { captureFrame, isCapturing } = useCapture()

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        })
        
        streamRef.current = stream
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            setCameraReady(true)
          }
        }
      } catch (error) {
        console.error('Camera setup failed:', error)
        setCameraError('Camera access denied or unavailable')
      }
    }

    setupCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  const handleSnap = useCallback(() => {
    if (isCapturing || showFlash) return

    setShowFlash(true)
    playShutterSound()

    const result = captureFrame(videoRef.current)
    
    if (result) {
      setCapturedImageUrl(result.dataUrl)
      trackEvent('snap_taken')
    }
  }, [isCapturing, showFlash, playShutterSound, captureFrame])

  const handleFlashComplete = useCallback(() => {
    setShowFlash(false)
    if (capturedImageUrl) {
      setShowConfirmation(true)
    }
  }, [capturedImageUrl])

  const handleConfirmationDismiss = useCallback(() => {
    setShowConfirmation(false)
    setCapturedImageUrl(null)
  }, [])

  if (cameraError) {
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center bg-deep-black">
        <div className="font-pixel text-lg text-lime text-center px-6">
          Camera error
          <br />
          <span className="text-white/60 text-sm">{cameraError}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-dvh bg-deep-black">
      <div className="relative w-full aspect-[4/5]">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover" 
        />
        
        {cameraReady && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 bg-deep-black/70 px-3 py-1 rounded font-pixel text-red-500 text-lg animate-pulse">
              ● REC
            </div>
            <div className="absolute top-4 right-4 font-pixel text-white text-sm bg-deep-black/70 px-2 py-1 rounded">
              {new Date().toLocaleTimeString()}
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-50">
              <div className="w-16 h-16 border-2 border-white rounded-lg" />
              <div className="absolute w-1 h-1 bg-white rounded-full" />
              <div className="absolute w-8 h-0.5 bg-white/50" />
              <div className="absolute w-0.5 h-8 bg-white/50" />
            </div>
          </div>
        )}

        {!cameraReady && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-deep-black">
            <div className="font-pixel text-white">Initializing camera...</div>
          </div>
        )}
      </div>

      <div className="relative z-50 w-full p-6 pb-12 bg-gradient-to-t from-periwinkle-dark/90 via-periwinkle-dark/50 to-transparent flex flex-col items-center justify-center gap-6">
        <div className="flex items-center justify-center gap-8 w-full">
          <button className="text-deep-black opacity-60 hover:opacity-100 transition-all">
            <span className="material-symbols-outlined text-4xl">collections</span>
          </button>
          
          <SnapButton 
            onClick={handleSnap} 
            disabled={isCapturing || showFlash || !cameraReady}
          />
          
          <button className="text-deep-black opacity-60 hover:opacity-100 transition-all">
            <span className="material-symbols-outlined text-4xl">cached</span>
          </button>
        </div>
      </div>

      <FlashOverlay 
        trigger={showFlash} 
        onComplete={handleFlashComplete} 
      />

      {showConfirmation && capturedImageUrl && (
        <CaptureConfirmation
          imageUrl={capturedImageUrl}
          onDismiss={handleConfirmationDismiss}
        />
      )}
    </div>
  )
}
