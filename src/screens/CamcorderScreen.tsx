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
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 background-size-[100%_2px,3px_100%] pointer-events-none" />
            
            <div className="absolute top-4 left-4 bg-deep-black/70 px-3 py-1 rounded-sm font-pixel text-[#FF0099] text-lg animate-pulse border border-[#FF0099]/30">
              ● REC
            </div>
            <div className="absolute top-4 right-4 font-pixel text-[#CCFF00] text-sm bg-deep-black/70 px-2 py-1 rounded-sm border border-[#CCFF00]/30 shadow-[0_0_10px_rgba(204,255,0,0.2)]">
              {new Date().toLocaleTimeString()}
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="w-16 h-16 border-2 border-white/50 rounded-lg" />
              <div className="absolute w-1 h-1 bg-white/50 rounded-full" />
              <div className="absolute w-12 h-0.5 bg-white/30" />
              <div className="absolute w-0.5 h-12 bg-white/30" />
            </div>
          </div>
        )}

        {!cameraReady && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-deep-black">
            <div className="font-pixel text-[#CCFF00] animate-pulse">Initializing camera...</div>
          </div>
        )}
      </div>

      <div className="relative z-50 w-full p-6 pb-12 bg-[#C3C7CB] border-t-4 border-white/20 flex flex-col items-center justify-center gap-6 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
        {/* Chrome Bar aesthetics */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
        
        <div className="flex items-center justify-center gap-8 w-full">
          <button className="group relative w-14 h-14 rounded-full bg-gradient-to-b from-[#E0E0E0] to-[#BDBDBD] border-2 border-white/40 shadow-[0_4px_0_#9e9e9e] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center">
             <span className="material-symbols-outlined text-2xl text-deep-black group-hover:scale-110 transition-transform">collections</span>
          </button>
          
          <SnapButton 
            onClick={handleSnap} 
            disabled={isCapturing || showFlash || !cameraReady}
          />
          
          <button className="group relative w-14 h-14 rounded-full bg-gradient-to-b from-[#E0E0E0] to-[#BDBDBD] border-2 border-white/40 shadow-[0_4px_0_#9e9e9e] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-deep-black group-hover:rotate-180 transition-transform duration-500">cached</span>
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
