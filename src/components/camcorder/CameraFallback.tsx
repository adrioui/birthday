interface CameraFallbackProps {
  reason: 'denied' | 'error' | 'unsupported'
  errorMessage?: string
}

export function CameraFallback({ reason, errorMessage }: CameraFallbackProps) {
  const messages = {
    denied: 'Camera permission denied',
    error: errorMessage || 'Camera error occurred',
    unsupported: 'Camera not supported',
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-deep-black">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
      
      <div className="relative z-10 text-center p-8">
        <div className="text-6xl mb-4">📹</div>
        <div className="font-pixel text-xl text-red-500 mb-2">
          NO SIGNAL
        </div>
        <div className="font-pixel text-sm text-white/60">
          {messages[reason]}
        </div>
        <div className="mt-4 font-pixel text-xs text-lime/80 animate-pulse">
          [STANDBY MODE]
        </div>
      </div>
    </div>
  )
}
