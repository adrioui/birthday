import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAudio } from '../../hooks/useAudio';
import type { BurnProgress } from '../../types/track';

interface BurnProgressViewProps {
  progress: BurnProgress;
  onComplete: () => void;
  onProgressUpdate: (progress: BurnProgress) => void;
}

export function BurnProgressView({
  progress,
  onComplete,
  onProgressUpdate,
}: BurnProgressViewProps) {
  const navigate = useNavigate();
  const { playBurnSuccessSound } = useAudio();

  const handleContinue = () => {
    onComplete();
    navigate({ to: '/cake-sweeper' });
  };

  useEffect(() => {
    if (progress.stage === 'idle' || progress.stage === 'complete') {
      return;
    }

    const stages = ['reading', 'writing', 'finalizing', 'complete'];
    const currentIndex = stages.indexOf(progress.stage);

    if (currentIndex < stages.length - 1) {
      const timer = setTimeout(() => {
        const nextProgress = {
          stage: stages[currentIndex + 1] as BurnProgress['stage'],
          progress: Math.min(progress.progress + 33, 100),
          currentTrack: progress.currentTrack,
          totalTracks: progress.totalTracks,
        };
        onProgressUpdate(nextProgress);

        if (nextProgress.stage === 'complete') {
          playBurnSuccessSound();
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [progress, onComplete, onProgressUpdate, playBurnSuccessSound]);

  const getStageText = () => {
    switch (progress.stage) {
      case 'reading':
        return 'READING TRACKS...';
      case 'writing':
        return 'BURNING TO CD...';
      case 'finalizing':
        return 'FINALIZING...';
      case 'complete':
        return 'COMPLETE! 🎉';
      case 'error':
        return 'ERROR - BURN FAILED';
      default:
        return 'PREPARING...';
    }
  };

  const getProgressColor = () => {
    switch (progress.stage) {
      case 'complete':
        return 'bg-lime';
      case 'error':
        return 'bg-hot-pink';
      default:
        return 'bg-lime';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-8 text-center">
        <h2 className="chrome-text mb-4 text-4xl font-black italic">{getStageText()}</h2>
        <p className="text-deep-black/70 font-pixel text-xl">
          {progress.stage !== 'complete' && progress.stage !== 'error' && (
            <>
              Track {progress.currentTrack || 0} of {progress.totalTracks || 0}
            </>
          )}
        </p>
      </div>

      <div className="mb-8 w-full max-w-md">
        <div className="mb-2 flex justify-between text-sm font-bold text-deep-black">
          <span>PROGRESS</span>
          <span>{Math.round(progress.progress)}%</span>
        </div>
        <div className="h-6 w-full rounded-full border-4 border-deep-black bg-white">
          <div
            className={`h-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      </div>

      {progress.stage === 'complete' && (
        <button
          onClick={handleContinue}
          className="rounded-lg bg-lime px-8 py-4 text-xl font-black text-deep-black transition-all hover:bg-[#b8e600] active:scale-95 sticker-shadow-hard"
        >
          PLAY CAKE SWEEPER 🎂
        </button>
      )}

      {progress.stage !== 'complete' && progress.stage !== 'error' && (
        <div className="mt-8 animate-pulse">
          <div className="text-center font-mono text-6xl">💿</div>
        </div>
      )}
    </div>
  );
}
