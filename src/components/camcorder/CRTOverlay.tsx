export function CRTOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Scanlines */}
      <div className="absolute inset-0 scanlines opacity-50 mix-blend-overlay" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
      
      {/* RGB Split / Chromatic Aberration Simulation (Subtle) */}
      <div className="absolute inset-0 mix-blend-screen opacity-10 bg-[linear-gradient(90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.1),rgba(0,0,255,0.1))]" style={{ backgroundSize: '3px 100%' }} />
    </div>
  )
}
