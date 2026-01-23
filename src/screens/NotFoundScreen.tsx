import { Link } from '@tanstack/react-router';
import { CardBackground } from '../components/CardBackground';
import { Sticker } from '../components/effects/Sticker';

export function NotFoundScreen() {
  return (
    <CardBackground variant="phone" className="min-h-screen">
      {/* Dark blue gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black z-0" />
      <div
        className="absolute inset-0 opacity-20 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/textures/paper-grain.png')",
          backgroundSize: '200px 200px',
        }}
      />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines z-10 pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Glitchy 404 Header */}
        <div className="text-center mb-8">
          <h1 className="text-[180px] md:text-[240px] font-black leading-none chrome-text transform -rotate-3 mb-4">
            404
          </h1>
          <div className="bg-lime border-4 border-deep-black px-6 py-2 inline-block transform rotate-2 shadow-hard-lime">
            <span className="text-deep-black text-xl md:text-2xl font-display font-black uppercase tracking-wider">
              Page Not Found!
            </span>
          </div>
        </div>

        {/* Y2K Sticker decorations */}
        <Sticker position={{ top: '10%', left: '-40px' }} rotation={-15}>
          <div className="w-24 h-24 bg-hot-pink rounded-full border-4 border-white sticker-shadow-hard flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-5xl text-white">error</span>
          </div>
        </Sticker>

        <Sticker position={{ top: '15%', right: '-30px' }} rotation={12}>
          <div className="w-28 h-20 bg-system-grey border-4 border-deep-black rounded-lg sticker-shadow-hard flex items-center justify-center">
            <span className="text-deep-black text-xs font-pixel font-bold">SYSTEM ERROR</span>
          </div>
        </Sticker>

        <Sticker position={{ bottom: '30%', left: '-20px' }} rotation={-8}>
          <div className="w-20 h-20 bg-periwinkle border-4 border-deep-black sticker-shadow-hard flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-deep-black">help</span>
          </div>
        </Sticker>

        {/* Fun Y2K copy */}
        <div className="max-w-md text-center mb-12 mt-8">
          <p className="text-white text-lg md:text-xl font-display font-medium mb-4 text-bg-plate-dark px-4 py-3 rounded-lg">
            Whoa! Like, this page totally doesn't exist or got deleted by the millennium bug!
          </p>
          <p className="text-periwinkle text-sm font-pixel">
            &gt;&gt; 404_ERROR: PAGE_NOT_FOUND &lt;&lt;
            <br />
            &gt;&gt; CHECK_URL_AND_TRY_AGAIN &lt;&lt;
          </p>
        </div>

        {/* Home Button */}
        <Link
          to="/"
          className="group relative overflow-hidden rounded-xl bg-lime border-4 border-deep-black shadow-hard-lime h-16 px-8 flex items-center justify-center transition-all hover:-translate-y-1 active:translate-y-1 active:shadow-none"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-deep-black rounded-full p-1 text-lime">
              <span className="material-symbols-outlined">home</span>
            </div>
            <span className="text-deep-black text-xl font-display font-black uppercase tracking-wider">
              Back to Main Menu
            </span>
          </div>
        </Link>

        {/* Blinking cursor */}
        <div className="mt-8 flex items-center gap-2 text-green-400 font-pixel text-lg">
          <span>C:\BIRTHDAYSOS&gt;</span>
          <span className="animate-blink">_</span>
        </div>
      </main>
    </CardBackground>
  );
}
