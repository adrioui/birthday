import { useEffect, useState, useCallback } from 'react';
import { useProgress, useCharms } from '../context';
import { Confetti } from '../components/effects/Confetti';
import { useNavigate } from '@tanstack/react-router';

type ScreenState = 'loading' | 'celebration' | 'resetting' | 'error';

export function CelebrationScreen() {
  const { milestones, resetProgress } = useProgress();
  const { resetAll } = useCharms();
  const navigate = useNavigate();
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreenState('celebration');
      setShowConfetti(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const completedMilestones = milestones.filter((m) => m.completed);
  const totalCount = milestones.length;
  const completedCount = completedMilestones.length;

  const handleRestart = useCallback(() => {
    setScreenState('resetting');
    try {
      resetProgress();
      resetAll();
      navigate({ to: '/' });
    } catch (e) {
      console.error('Reset failed:', e);
      setScreenState('error');
    }
  }, [resetProgress, resetAll, navigate]);

  if (screenState === 'loading') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center">
        <div className="animate-pulse text-2xl font-display font-bold text-deep-black">
          Loading celebration...
        </div>
      </div>
    );
  }

  if (screenState === 'resetting') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center">
        <div className="animate-pulse text-2xl font-display font-bold text-deep-black">
          RESETTING SYSTEM…
        </div>
      </div>
    );
  }

  if (screenState === 'error') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-display font-bold text-deep-black mb-4">Oops!</h1>
        <p className="text-lg text-deep-black/70 mb-8 text-center">
          Reset failed. Please refresh the page manually.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-8 relative overflow-hidden">
      <Confetti trigger={showConfetti} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-6 text-6xl animate-bounce">🎉</div>
          <h1 className="chrome-text text-5xl sm:text-6xl font-display font-black italic leading-tight mb-4">
            HAPPY
            <br />
            BIRTHDAY!
          </h1>
          <p className="text-xl font-pixel text-deep-black/80">Thank you for celebrating!</p>
        </div>

        <div className="bg-white/95 border-[3px] border-deep-black rounded-xl shadow-hard-lg p-6 mb-8">
          <h2 className="text-lg font-display font-bold text-deep-black mb-4 uppercase tracking-wider">
            Journey Complete
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-pixel text-deep-black">
              <span>Progress</span>
              <span className="font-bold text-lime">
                {completedCount} / {totalCount}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-lime transition-all duration-500"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
            <div className="mt-4 space-y-2">
              {completedMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-2">
                  <span className="text-lime text-lg">✓</span>
                  <span className="font-display font-medium text-deep-black">{milestone.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleRestart}
            className="bg-lime hover:bg-[#b8e600] active:scale-95 px-8 py-4 rounded-xl font-display font-bold text-deep-black transition-all shadow-hard text-lg"
          >
            Start Again
          </button>
          <p className="mt-4 text-xs font-pixel text-deep-black/60 uppercase tracking-wider">
            Gentle restart option available
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-periwinkle-dark/50 to-transparent pointer-events-none" />
    </div>
  );
}
