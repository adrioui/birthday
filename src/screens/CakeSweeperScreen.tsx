import { useState, useEffect, useCallback } from 'react';
import { useProgress } from '../context/useProgress';
import { ScreenShake } from '../components/effects/ScreenShake';
import { GlitchOverlay } from '../components/effects/GlitchOverlay';
import { SystemReboot } from '../components/effects/SystemReboot';
import { useCakeSweeper, type GameStatus } from '../hooks/useCakeSweeper';
import { CardBackground } from '../components/CardBackground';
import { CakeSweeperGrid } from '../components/cake-sweeper/CakeSweeperGrid';

export function CakeSweeperScreen() {
  const [previousStatus, setPreviousStatus] = useState<GameStatus>('playing');
  const [triggerShake, setTriggerShake] = useState(false);
  const [triggerGlitch, setTriggerGlitch] = useState(false);
  const [triggerReboot, setTriggerReboot] = useState(false);
  const { completeMilestone } = useProgress();
  const [milestoneCompleted, setMilestoneCompleted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [remainingCandles, setRemainingCandles] = useState(10);

  useEffect(() => {
    return () => {
      setPreviousStatus('playing');
      setMilestoneCompleted(false);
      setGameStarted(false);
      setTime(0);
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
        />
        <SystemReboot trigger={triggerReboot} onComplete={() => setTriggerReboot(false)} />
      </div>
    </CardBackground>
  );
}
