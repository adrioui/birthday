export function NoiseOverlay() {
  return (
    <div 
      className="pointer-events-none fixed inset-0 z-40 opacity-20 mix-blend-overlay"
      style={{
        backgroundImage: `radial-gradient(#131315 1px, transparent 1px)`,
        backgroundSize: '16px 16px',
      }}
      aria-hidden="true"
    />
  )
}
