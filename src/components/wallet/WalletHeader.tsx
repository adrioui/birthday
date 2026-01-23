interface WalletHeaderProps {
  totalPoints: number;
  isLoading?: boolean;
}

export function WalletHeader({ totalPoints, isLoading = false }: WalletHeaderProps) {
  const displayPoints = isLoading ? '--' : totalPoints;
  const subtext = totalPoints === 0 && !isLoading ? '— Start collecting' : '';

  return (
    <div className="relative z-50 flex flex-col items-center px-4 py-4 sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between w-full mb-2">
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

      <div className="flex flex-col items-center mt-2">
        <div className="flex items-baseline gap-1">
          <span className="font-pixel text-2xl text-deep-black">{displayPoints}</span>
          <span className="font-display text-xs font-bold text-lime bg-deep-black px-1 rounded-sm">
            PTS
          </span>
        </div>
        {subtext && (
          <span className="text-[10px] font-pixel text-deep-black/60 mt-1 uppercase">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
