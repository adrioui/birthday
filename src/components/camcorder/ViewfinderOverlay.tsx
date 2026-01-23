interface ViewfinderOverlayProps {
  isRecording?: boolean;
}

export function ViewfinderOverlay({ isRecording = true }: ViewfinderOverlayProps) {
  const now = new Date();
  const dateStr = now
    .toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    .toUpperCase()
    .replace(',', '');
  const timeStr = now
    .toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .toUpperCase();

  return (
    <div
      data-testid="viewfinder"
      className="absolute inset-0 z-20 pointer-events-none font-pixel text-lg select-none"
    >
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 bg-black/50 px-2 py-0.5 rounded backdrop-blur-md border border-white/10">
            {isRecording && (
              <div
                className="w-3 h-3 bg-red-600 rounded-full animate-blink"
                style={{ boxShadow: '0 0 8px red' }}
              />
            )}
            <span className="text-red-500 font-bold drop-shadow-md">REC</span>
          </div>
          <div className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
            <span className="text-white text-sm drop-shadow-md">SP [00:00:00]</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="bg-black/40 p-1 rounded backdrop-blur-sm border border-white/10">
            <BatteryIcon className="w-4 h-4 text-lime" />
          </div>
          <div className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
            <span className="text-xs uppercase text-white/90">Tape rem: 60m</span>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 opacity-40">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-white"
          style={{ boxShadow: '0 0 2px black' }}
        />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white"
          style={{ boxShadow: '0 0 2px black' }}
        />
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white" />
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="flex flex-col text-sm space-y-0.5">
          <div className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
            <span className="text-white/90">F2.4</span>
          </div>
          <div className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
            <span className="text-white/90">ISO 800</span>
          </div>
          <div className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
            <span className="text-white/90">AWB</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
            <span className="text-2xl text-yellow-400 font-bold drop-shadow-md">{dateStr}</span>
          </div>
          <div className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
            <span className="text-xl text-yellow-400/90 drop-shadow-md">{timeStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BatteryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
    </svg>
  );
}
