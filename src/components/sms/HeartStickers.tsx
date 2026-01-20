export function HeartStickers() {
  return (
    <>
      {/* Top-left iridescent heart */}
      <div className="absolute top-[10%] left-[20%] z-20 transform rotate-[-15deg] animate-pulse">
        <svg className="drop-shadow-lg w-20 h-20" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="iridescent1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff9a9e" />
              <stop offset="50%" stopColor="#fecfef" />
              <stop offset="100%" stopColor="#a18cd1" />
            </linearGradient>
          </defs>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#iridescent1)"
            stroke="white"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Bottom-right teal heart */}
      <div className="absolute bottom-[25%] right-[-10px] z-20 transform rotate-[25deg]">
        <svg className="drop-shadow-xl w-24 h-24" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="iridescent2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#84fab0" />
              <stop offset="100%" stopColor="#8fd3f4" />
            </linearGradient>
          </defs>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#iridescent2)"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </>
  )
}
