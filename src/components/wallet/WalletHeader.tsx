export function WalletHeader() {
  return (
    <div className="relative z-50 flex items-center justify-between px-4 py-4 sm:px-6 sm:pt-6">
      <button
        className="flex size-10 items-center justify-center rounded-full bg-white/40 backdrop-blur-sm border-2 border-white/60 text-deep-black hover:bg-white/60 transition-colors shadow-sm"
        aria-label="Go back"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <div className="flex flex-col items-center">
        <div className="px-4 py-1 rounded-full bg-deep-black/10 backdrop-blur-md border border-white/20 mb-1">
          <span className="text-deep-black text-[10px] font-black uppercase tracking-widest">
            Charm Wallet
          </span>
        </div>
        <h1 className="font-display font-black text-xl tracking-tight text-deep-black italic">
          WALLET
        </h1>
      </div>

      <button
        className="flex size-10 items-center justify-center rounded-full bg-lime backdrop-blur-sm border-2 border-deep-black text-deep-black hover:bg-lime/80 transition-colors sticker-shadow-hard"
        aria-label="Wallet"
      >
        <span className="material-symbols-outlined">wallet</span>
      </button>
    </div>
  );
}
