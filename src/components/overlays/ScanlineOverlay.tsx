export function ScanlineOverlay() {
  return (
    <div
      data-testid="scanline-overlay"
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.3) 2px,
          rgba(0, 0, 0, 0.3) 4px
        )`,
        backgroundSize: '100% 4px',
      }}
      aria-hidden="true"
    />
  );
}
