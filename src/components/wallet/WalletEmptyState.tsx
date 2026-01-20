export function WalletEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12">
      <div className="relative mb-6">
        <div className="size-24 rounded-full bg-white/50 border-2 border-dashed border-deep-black/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-deep-black/30">
            wallet
          </span>
        </div>
        <span className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</span>
      </div>

      <h3 className="font-display font-bold text-xl text-deep-black mb-2">
        No charms yet
      </h3>
      <p className="font-pixel text-lg text-deep-black/60 text-center max-w-[200px]">
        Capture moments to collect charms!
      </p>
    </div>
  )
}
