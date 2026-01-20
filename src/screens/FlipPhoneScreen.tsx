import { FlipPhone } from '../components/FlipPhone'

export function FlipPhoneScreen() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-8">
      {/* Floating Chrome Letters */}
      <div className="pointer-events-none absolute left-6 top-[10%] z-20 animate-bounce select-none">
        <h1 className="chrome-text -rotate-12 transform text-8xl font-black italic">H</h1>
      </div>
      <div className="pointer-events-none absolute right-6 top-[12%] z-20 select-none" style={{ animation: 'bounce 3.2s infinite' }}>
        <h1 className="chrome-text rotate-6 transform text-8xl font-black italic">B</h1>
      </div>

      {/* Central Phone */}
      <FlipPhone />

      {/* Bottom CTA */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-periwinkle-dark to-transparent p-6 pb-10">
        <p className="text-center font-display text-xs font-bold uppercase tracking-widest text-deep-black/60">
          Flip to open - Swipe to reject
        </p>
      </div>
    </div>
  )
}
