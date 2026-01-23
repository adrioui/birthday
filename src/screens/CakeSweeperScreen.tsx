import { useState, useEffect, useCallback } from 'react';
import { useProgress } from '../context/useProgress';
import { ScreenShake } from '../components/effects/ScreenShake';
import { GlitchOverlay } from '../components/effects/GlitchOverlay';
import { SystemReboot } from '../components/effects/SystemReboot';
import { Confetti } from '../components/effects/Confetti';
import { useCakeSweeper, type GameStatus } from '../hooks/useCakeSweeper';
import { CardBackground } from '../components/CardBackground';
import { CakeSweeperGrid } from '../components/cake-sweeper/CakeSweeperGrid';

export function CakeSweeperScreen() {
  const [previousStatus, setPreviousStatus] = useState<GameStatus>('playing');
  const [triggerShake, setTriggerShake] = useState(false);
  const [triggerGlitch, setTriggerGlitch] = useState(false);
  const [triggerReboot, setTriggerReboot] = useState(false);

  const handleSkipGlitch = () => {
    setTriggerGlitch(false);
  };
  const { completeMilestone } = useProgress();
  const [milestoneCompleted, setMilestoneCompleted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [remainingCandles, setRemainingCandles] = useState(10);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  useEffect(() => {
    let loadingInterval: number | undefined;
    if (loading) {
      loadingInterval = window.setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(loadingInterval);
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 200);

      const loadTimeout = window.setTimeout(() => {
        setLoading(false);
        if (loadingInterval) clearInterval(loadingInterval);
      }, 2500);

      return () => {
        if (loadingInterval) clearInterval(loadingInterval);
        clearTimeout(loadTimeout);
      };
    }
  }, [loading]);

  useEffect(() => {
    return () => {
      setPreviousStatus('playing');
      setMilestoneCompleted(false);
      setGameStarted(false);
      setTime(0);
      setLoading(true);
      setLoadingProgress(0);
    };
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (gameStarted && previousStatus === 'playing') {
      interval = window.setInterval(() => {
        setTime((prev) => Math.min(prev + 1, 999));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, previousStatus]);

  const calculateRemainingCandles = useCallback(
    (grid: ReturnType<typeof useCakeSweeper>['grid'], candleCount: number): number => {
      let flaggedCount = 0;
      for (const row of grid) {
        for (const tile of row) {
          if (tile.state === 'flagged') flaggedCount++;
        }
      }
      return candleCount - flaggedCount;
    },
    []
  );

  const handleStatusChange = useCallback(
    (newStatus: GameStatus) => {
      if (previousStatus === 'playing' && newStatus === 'lost') {
        setTriggerShake(true);
        setTriggerGlitch(true);
      }
      if (previousStatus === 'playing' && newStatus === 'won') {
        setTriggerReboot(true);
      }
      if ((newStatus === 'won' || newStatus === 'lost') && !milestoneCompleted) {
        completeMilestone('game-played');
        setMilestoneCompleted(true);
      }
      setPreviousStatus(newStatus);
    },
    [previousStatus, milestoneCompleted, completeMilestone]
  );

  const handleFirstClick = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
    }
  }, [gameStarted]);

  const handleFlagToggle = useCallback(
    (grid: ReturnType<typeof useCakeSweeper>['grid'], candleCount: number) => {
      setRemainingCandles(calculateRemainingCandles(grid, candleCount));
    },
    [calculateRemainingCandles]
  );

  const handleTileReveal = useCallback(
    (isCandle: boolean) => {
      if (!isCandle && previousStatus === 'playing') {
        setTriggerConfetti(true);
        setTimeout(() => setTriggerConfetti(false), 100);
      }
    },
    [previousStatus]
  );

  if (loading) {
    return (
      <CardBackground variant="cake">
        <div className="flex min-h-dvh flex-col items-center justify-center bg-periwinkle-dark p-6">
          <div className="w-full max-w-md">
            <div className="bg-system-grey border-4 border-white shadow-hard mb-6">
              <div className="bg-deep-black px-3 py-1 flex items-center justify-between">
                <span className="font-pixel text-lime text-xs">CAKE_SWEEPER.EXE</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-system-grey rounded-sm"></div>
                  <div className="w-3 h-3 bg-system-grey rounded-sm"></div>
                  <div className="w-3 h-3 bg-system-grey rounded-sm"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="font-pixel text-deep-black text-lg mb-6 text-center">
                  LOADING CAKE_SWEEPER.EXE
                </div>
                <div className="bg-white border-2 border-deep-black p-2 mb-4">
                  <div className="bg-deep-black h-6 relative overflow-hidden">
                    <div
                      className="bg-lime h-full transition-all duration-200 ease-out"
                      style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-pixel text-deep-black text-sm">
                    {loadingProgress < 100 ? (
                      <>
                        <span className="animate-blink">_</span> Loading files...
                      </>
                    ) : (
                      'Ready!'
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-deep-black rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-deep-black rounded-full animate-pulse"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-deep-black rounded-full animate-pulse"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBackground>
    );
  }

  return (
    <CardBackground variant="cake">
      <div className="flex min-h-dvh flex-col bg-periwinkle-dark">
        <div className="flex-1 px-6 py-8">
          <div className="relative mb-8 flex items-center justify-center">
            <div className="text-bg-plate inline-block px-6 py-3 rounded-xl">
              <h1 className="chrome-text text-6xl font-black italic transform -rotate-3">
                CAKE SWEEPER
              </h1>
            </div>
            <span className="absolute -top-2 -right-4 text-4xl animate-bounce">🎂</span>
          </div>

          <div onClick={handleFirstClick}>
            <CakeSweeperGrid
              gridSize={8}
              candleCount={10}
              remainingCandles={remainingCandles}
              time={time}
              onStatusChange={handleStatusChange}
              onFlagToggle={handleFlagToggle}
              onTileReveal={handleTileReveal}
            />
          </div>
        </div>

        <ScreenShake
          trigger={triggerShake}
          intensity="heavy"
          onComplete={() => setTriggerShake(false)}
        />
        <GlitchOverlay
          trigger={triggerGlitch}
          duration={0.6}
          onComplete={() => setTriggerGlitch(false)}
          onSkip={handleSkipGlitch}
        />
        <SystemReboot trigger={triggerReboot} onComplete={() => setTriggerReboot(false)} />
        <Confetti trigger={triggerConfetti} />
      </div>
    </CardBackground>
  );
}
