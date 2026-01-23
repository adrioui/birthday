import { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCharms } from '../context/CharmContext';
import { useAudio } from '../hooks/useAudio';

export function MemorySnapshotScreen() {
  const navigate = useNavigate();
  const { charms } = useCharms();
  const { playShutterSound } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const lastCapture = localStorage.getItem('last-captured-photo');

  useEffect(() => {
    if (!lastCapture) {
      setError('No photo captured');
      setIsLoading(false);
      return;
    }

    const loadAndGenerate = async () => {
      setIsGenerating(true);
      setError(null);

      try {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) throw new Error('Could not get canvas context');

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          try {
            canvas.width = 800;
            canvas.height = 1000;

            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const photoHeight = 400;
            const photoY = 50;

            ctx.drawImage(img, 50, photoY, 700, photoHeight);

            ctx.strokeStyle = '#CCFF00';
            ctx.lineWidth = 4;
            ctx.strokeRect(40, photoY - 10, 720, photoHeight + 20);

            const messageY = photoY + photoHeight + 60;
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 24px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('HAPPY BIRTHDAY!', canvas.width / 2, messageY);

            ctx.fillStyle = '#CCFF00';
            ctx.font = '16px Arial, sans-serif';
            ctx.fillText('Your Memory Snapshot', canvas.width / 2, messageY + 30);

            const charmsY = messageY + 70;
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 18px Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Charms Collected:', 60, charmsY);

            const charmSize = 40;
            const charmSpacing = 55;
            charms.forEach((charm, index) => {
              const x = 60 + (index % 6) * charmSpacing;
              const y = charmsY + 30 + Math.floor(index / 6) * charmSpacing;

              if (y + charmSize < canvas.height - 20) {
                ctx.fillStyle = '#333333';
                ctx.beginPath();
                ctx.arc(x + charmSize / 2, y + charmSize / 2, charmSize / 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#CCFF00';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = '#FFFFFF';
                ctx.font = '12px Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(getCharmEmoji(charm.icon), x + charmSize / 2, y + charmSize / 2 + 4);
              }
            });

            setIsLoading(false);
            setIsGenerating(false);
          } catch {
            console.error('Canvas draw error');
            setError('Failed to generate snapshot');
            setIsLoading(false);
            setIsGenerating(false);
          }
        };

        img.onerror = () => {
          setError('Failed to load photo');
          setIsLoading(false);
          setIsGenerating(false);
        };

        img.src = lastCapture;
      } catch {
        setError('Failed to generate snapshot');
        setIsLoading(false);
        setIsGenerating(false);
      }
    };

    loadAndGenerate();
  }, [lastCapture, charms]);

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;

    playShutterSound();

    const link = document.createElement('a');
    link.download = `birthday-memory-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, [playShutterSound]);

  const handleGoBack = useCallback(() => {
    navigate({ to: '/camcorder' });
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh flex-col bg-deep-black items-center justify-center">
        <div className="text-bg-plate-dark inline-block px-6 py-3 rounded-xl">
          <div className="font-pixel text-xl text-lime animate-pulse">GENERATING SNAPSHOT...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col bg-deep-black items-center justify-center p-4">
        <div className="text-bg-plate-dark px-6 py-4 rounded-xl mb-4">
          <div className="font-pixel text-xl text-pink">ERROR</div>
          <div className="font-pixel text-sm text-white/80 mt-2">{error}</div>
        </div>
        <button
          onClick={handleGoBack}
          className="modal-btn-focus flex items-center justify-center gap-2 rounded-sm bg-lime py-2 px-6 text-lg font-bold text-deep-black transition-all hover:bg-[#b8e600] active:scale-95"
        >
          GO BACK
        </button>
        <button
          onClick={handleGoBack}
          className="modal-btn-focus mt-4 text-white/60 hover:text-white transition-colors font-pixel text-sm"
        >
          GO BACK
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-deep-black overflow-hidden">
      <div className="relative z-50 flex items-center justify-between px-6 py-8">
        <button
          onClick={handleGoBack}
          className="modal-btn-focus flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-white hover:bg-white/40 transition-colors"
          aria-label="Go back"
        >
          <ArrowBackIcon className="w-5 h-5" />
        </button>
        <div className="text-bg-plate-dark px-4 py-1 rounded-full border border-white/20">
          <span className="text-white text-xs font-bold uppercase tracking-widest">
            MEMORY SNAPSHOT
          </span>
        </div>
        <div className="w-10" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-2">
        <div className="relative w-full aspect-[4/5] bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden border-[6px] border-[#2a2a2a]">
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        </div>
      </main>

      <div className="relative z-50 w-full px-6 pb-12 pt-8 bg-gradient-to-t from-periwinkle-dark/90 via-periwinkle-dark/50 to-transparent flex flex-col items-center justify-center gap-4">
        {isGenerating ? (
          <div className="text-bg-plate-dark inline-block px-6 py-3 rounded-xl">
            <div className="font-pixel text-xl text-lime animate-pulse">GENERATING SNAPSHOT...</div>
          </div>
        ) : (
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="modal-btn-focus flex items-center justify-center gap-2 rounded-sm bg-lime py-3 px-8 text-lg font-bold text-deep-black transition-all hover:bg-[#b8e600] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_0_#000]"
          >
            <DownloadIcon className="w-5 h-5" />
            DOWNLOAD SNAPSHOT
          </button>
        )}
      </div>
    </div>
  );
}

function getCharmEmoji(iconName: string): string {
  const emojiMap: Record<string, string> = {
    star: '⭐',
    favorite: '❤️',
    pets: '🐾',
    headphones: '🎧',
  };
  return emojiMap[iconName] || '✨';
}

function ArrowBackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </svg>
  );
}
