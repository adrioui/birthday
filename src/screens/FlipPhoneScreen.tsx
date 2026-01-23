import { FlipPhone } from '../components/FlipPhone';
import { CardBackground } from '../components/CardBackground';
import { Sticker } from '../components/effects/Sticker';
import { useEasterEggTrigger } from '../hooks/useEasterEggTrigger';

export function FlipPhoneScreen() {
  const bLetterTrigger = useEasterEggTrigger('chrome-b', { trigger: 'doubleTap' });

  return (
    <CardBackground variant="wallet" className="min-h-screen">
      {/* Periwinkle Background Gradient with Paper Texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-periwinkle-light via-periwinkle to-periwinkle-dark z-0" />
      <div
        className="absolute inset-0 opacity-30 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/textures/paper-grain.png')",
          backgroundSize: '200px 200px',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/10 z-0 pointer-events-none" />

      {/* Top Navigation */}
      <div className="relative z-50 flex items-center justify-between p-4 pt-6">
        <button
          className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-deep-black hover:bg-white/40 transition-colors"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="px-4 py-1 rounded-full bg-deep-black/10 backdrop-blur-md border border-white/20">
          <span className="text-deep-black text-xs font-bold uppercase tracking-widest">
            Card 1/6
          </span>
        </div>
        <button
          className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-deep-black hover:bg-white/40 transition-colors"
          aria-label="More options"
        >
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      {/* Main Composition Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 py-4">
        {/* 3D Chrome Floating Letters */}
        <div className="pointer-events-none absolute left-6 top-[10%] z-20 animate-bounce select-none">
          <h1 className="chrome-text text-8xl font-black italic transform -rotate-12">H</h1>
        </div>
        <div
          {...bLetterTrigger}
          className="pointer-events-auto absolute right-6 top-[12%] z-20 select-none"
          style={{ animation: 'bounce 3.2s infinite' }}
        >
          <h1 className="chrome-text text-8xl font-black italic transform rotate-6">B</h1>
        </div>

        {/* Sticker: Camcorder */}
        <Sticker position={{ bottom: '20%', left: '-20px' }} rotation={-12}>
          <div className="relative w-32 h-24 bg-deep-black rounded-xl border-2 border-white sticker-shadow flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-6xl text-white/80">videocam</span>
            <div className="absolute top-1 right-1 size-2 bg-red-500 rounded-full animate-pulse" />
            <span className="absolute bottom-1 left-2 text-[10px] text-white font-mono">
              REC [00:14]
            </span>
          </div>
        </Sticker>

        {/* Sticker: Headphones */}
        <Sticker position={{ top: '25%', right: '-30px' }} rotation={12}>
          <div className="relative w-36 h-36 opacity-90 drop-shadow-xl">
            <span className="material-symbols-outlined text-9xl text-deep-black mix-blend-darken">
              headphones
            </span>
          </div>
        </Sticker>

        {/* Sticker: Star Badge */}
        <Sticker position={{ top: '55%', right: '0' }} rotation={15}>
          <div className="flex items-center justify-center size-20 bg-lime rounded-full border-2 border-deep-black sticker-shadow-hard animate-pulse">
            <span className="text-deep-black font-black text-xl rotate-[-15deg] font-display">
              Y2K!
            </span>
          </div>
        </Sticker>

        {/* Central Flip Phone */}
        <FlipPhone />
      </main>

      {/* Bottom Action Area */}
      <div className="relative z-50 w-full p-6 pb-10 bg-gradient-to-t from-periwinkle-dark to-transparent">
        <button
          className="group relative w-full overflow-hidden rounded-xl bg-lime border-2 border-deep-black sticker-shadow-hard h-16 flex items-center justify-center transition-all hover:-translate-y-1 active:translate-y-1 active:shadow-none"
          style={{ boxShadow: '8px 8px 0 rgba(0,0,0,0.8)' }}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-deep-black rounded-full p-1 text-lime">
              <span className="material-symbols-outlined">call</span>
            </div>
            <span className="text-deep-black text-xl font-bold font-display uppercase tracking-wider">
              Pick Up Call
            </span>
          </div>
        </button>
        <p className="text-center text-deep-black/60 text-xs font-bold mt-3 font-display uppercase tracking-widest">
          Flip to open • Swipe to reject
        </p>
      </div>
    </CardBackground>
  );
}
