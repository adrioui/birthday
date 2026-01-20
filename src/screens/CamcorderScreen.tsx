import { useState, useRef, useCallback, useEffect } from 'react'
import { SnapButton, FlashOverlay, CaptureConfirmation } from '../components/camcorder'
import { CRTOverlay } from '../components/camcorder/CRTOverlay'
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
  const [batteryLevel, setBatteryLevel] = useState(100)
  
  const { playShutterSound } = useAudio()
  const { captureFrame, isCapturing } = useCapture()

  useEffect(() => {
    // Battery drain simulation
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(10, prev - 1))
    }, 60000)
    return () => clearInterval(interval)
  }, [])

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
    <div className="relative min-h-dvh bg-deep-black overflow-hidden">
      {/* Viewfinder Area */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-black">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover opacity-90" 
        />
        
        <CRTOverlay />

        {/* OSD Layer */}
        {cameraReady && (
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-20">
            {/* Top Bar */}
            <div className="flex justify-between items-start font-pixel text-xl tracking-widest text-white drop-shadow-md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]" />
                  <span className="text-red-500">REC</span>
                </div>
                <span className="text-sm opacity-80">SP 1:04:22</span>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                  <span className={batteryLevel < 20 ? 'text-red-500 animate-pulse' : 'text-lime'}>
                    BAT
                  </span>
                  <div className="w-8 h-4 border-2 border-white/80 p-0.5 flex">
                    <div 
                      className={`h-full ${batteryLevel < 20 ? 'bg-red-500' : 'bg-lime'}`} 
                      style={{ width: `${batteryLevel}%` }} 
                    />
                  </div>
                </div>
                <span className="text-sm opacity-80">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Center Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="w-12 h-12 border border-white/50" />
              <div className="absolute w-20 h-[1px] bg-white/50" />
              <div className="absolute w-[1px] h-20 bg-white/50" />
            </div>

            {/* Bottom Info */}
            <div className="flex justify-between items-end font-pixel text-sm text-white/80">
              <div>
                 [W] ---------|--------- [T]
              </div>
              <div>
                xF2.4
              </div>
            </div>
          </div>
        )}

        {!cameraReady && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-deep-black z-30">
            <div className="font-pixel text-white text-xl animate-pulse">INITIALIZING...</div>
          </div>
        )}
      </div>

      {/* Controls Area */}
      <div className="relative z-30 w-full flex-1 min-h-[160px] bg-gradient-to-t from-periwinkle-dark/90 via-periwinkle-dark/50 to-deep-black flex flex-col items-center justify-center gap-6 pb-8">
        
        {/* Decorative Tape Deck Lines */}
        <div className="w-full h-4 border-y border-white/10 mb-2 flex items-center justify-center gap-1 overflow-hidden opacity-30">
          {[...Array(20)].map((_, i) => (
             <div key={i} className="w-0.5 h-full bg-white/20 rotate-12" />
          ))}
        </div>

        <div className="flex items-center justify-center gap-10 w-full px-8">
          <button className="text-white/70 hover:text-white hover:scale-110 transition-all flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <span className="material-symbols-outlined text-2xl">collections</span>
            </div>
            <span className="font-pixel text-xs tracking-wider">GALLERY</span>
          </button>
          
          <SnapButton 
            onClick={handleSnap} 
            disabled={isCapturing || showFlash || !cameraReady}
          />
          
          <button className="text-white/70 hover:text-white hover:scale-110 transition-all flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <span className="material-symbols-outlined text-2xl">flip_camera_ios</span>
            </div>
            <span className="font-pixel text-xs tracking-wider">FLIP</span>
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
