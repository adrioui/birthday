import { FlipPhone } from '../components/FlipPhone';
import { useEasterEggTrigger } from '../hooks/useEasterEggTrigger';

export function FlipPhoneScreen() {
  const bLetterTrigger = useEasterEggTrigger('chrome-b', { trigger: 'doubleTap' });

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-8">
      {/* Floating Chrome Letters */}
      <div className="pointer-events-none absolute left-6 top-[10%] z-20 animate-bounce select-none">
        <div className="text-bg-plate inline-block px-4 py-2 rounded-xl -rotate-12">
          <h1 className="chrome-text transform text-8xl font-black italic">H</h1>
        </div>
      </div>
      <div
        {...bLetterTrigger}
        className="pointer-events-auto absolute right-6 top-[12%] z-20 select-none"
        style={{ animation: 'bounce 3.2s infinite' }}
      >
        <div className="text-bg-plate inline-block px-4 py-2 rounded-xl rotate-6">
          <h1 className="chrome-text transform text-8xl font-black italic">B</h1>
        </div>
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
  );
}
