import type { Track } from '../../types/track'

interface RotatingCDProps {
  selectedTracks: Track[]
  isBurning: boolean
}

export function RotatingCD({ selectedTracks, isBurning }: RotatingCDProps) {
  const hasTracks = selectedTracks.length > 0
  const rotationSpeed = isBurning ? '2s' : '8s'

  return (
    <div className="relative flex h-48 w-48 items-center justify-center">
      <div
        className={`relative h-full w-full rounded-full ${
          hasTracks ? 'animate-spin' : ''
        }`}
        style={{
          animationDuration: rotationSpeed,
          background: hasTracks
            ? `conic-gradient(
                from 0deg,
                #ff0099 0deg,
                #ccff00 60deg,
                #ccccff 120deg,
                #ff0099 180deg,
                #ccff00 240deg,
                #ccccff 300deg,
                #ff0099 360deg
              )`
            : 'linear-gradient(135deg, #c3c7cb 0%, #a0a4a8 100%)',
          boxShadow: hasTracks
            ? '0 0 30px rgba(255, 0, 153, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.2)'
            : '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`h-16 w-16 rounded-full ${
              hasTracks
                ? 'bg-gradient-to-br from-gray-800 to-black'
                : 'bg-gradient-to-br from-gray-600 to-gray-800'
            }`}
            style={{
              boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="flex h-full w-full items-center justify-center">
              <div
                className={`h-3 w-3 rounded-full ${
                  hasTracks ? 'bg-white' : 'bg-gray-400'
                }`}
              />
            </div>
          </div>
        </div>

        {hasTracks && (
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="h-[90%] w-[1px] bg-white" />
            <div className="absolute h-[1px] w-[90%] bg-white" />
          </div>
        )}
      </div>

      {!hasTracks && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">💿</span>
        </div>
      )}

      {isBurning && (
        <div className="absolute inset-0 animate-pulse rounded-full border-2 border-lime shadow-[0_0_20px_rgba(204,255,0,0.5)]" />
      )}
    </div>
  )
}
