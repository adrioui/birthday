import { useCallback, useRef, useState } from 'react'

interface CaptureResult {
  dataUrl: string
  timestamp: number
}

export function useCapture() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [lastCapture, setLastCapture] = useState<CaptureResult | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const captureFrame = useCallback((videoElement: HTMLVideoElement | null): CaptureResult | null => {
    if (!videoElement || isCapturing) return null
    
    setIsCapturing(true)

    try {
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas')
      }
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        console.warn('Could not get canvas context')
        setIsCapturing(false)
        return null
      }

      canvas.width = videoElement.videoWidth || 640
      canvas.height = videoElement.videoHeight || 480

      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
      const result: CaptureResult = {
        dataUrl,
        timestamp: Date.now()
      }

      setLastCapture(result)
      setIsCapturing(false)
      return result
    } catch (error) {
      console.warn('Frame capture failed:', error)
      setIsCapturing(false)
      return null
    }
  }, [isCapturing])

  const clearCapture = useCallback(() => {
    setLastCapture(null)
  }, [])

  return {
    captureFrame,
    clearCapture,
    isCapturing,
    lastCapture
  }
}
