import { useEffect, useCallback, useRef } from 'react';
import { useCakeSweeper, type GameStatus } from '../../hooks';
import { CakeSweeperTile } from './CakeSweeperTile';
import { Win95Window } from './Win95Window';
import { CounterDisplay } from './CounterDisplay';

interface CakeSweeperGridProps {
  gridSize?: number;
  candleCount?: number;
  remainingCandles?: number;
  time?: number;
  onStatusChange?: (status: GameStatus) => void;
  onFlagToggle?: (grid: ReturnType<typeof useCakeSweeper>['grid'], candleCount: number) => void;
  onTileReveal?: (isCandle: boolean) => void;
}

export function CakeSweeperGrid({
  gridSize = 8,
  candleCount = 10,
  remainingCandles,
  time,
  onStatusChange,
  onFlagToggle,
  onTileReveal,
}: CakeSweeperGridProps) {
  const { grid, status, revealTile, toggleFlag, restart } = useCakeSweeper(gridSize, candleCount);

  // Use refs to keep handlers stable and avoid re-renders of all tiles
  const gridRef = useRef(grid);
  const onFlagToggleRef = useRef(onFlagToggle);
  const onTileRevealRef = useRef(onTileReveal);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    onFlagToggleRef.current = onFlagToggle;
  }, [onFlagToggle]);

  useEffect(() => {
    onTileRevealRef.current = onTileReveal;
  }, [onTileReveal]);

  const handleToggleFlag = useCallback(
    (row: number, col: number) => {
      toggleFlag(row, col);
      if (onFlagToggleRef.current) {
        onFlagToggleRef.current(gridRef.current, candleCount);
      }
    },
    [toggleFlag, candleCount]
  );

  const handleReveal = useCallback(
    (row: number, col: number) => {
      const tile = gridRef.current[row][col];
      const wasHidden = tile.state === 'hidden';
      revealTile(row, col);
      if (wasHidden && onTileRevealRef.current) {
        onTileRevealRef.current(tile.isCandle);
      }
    },
    [revealTile]
  );

  const handleRestart = () => {
    restart();
    if (onStatusChange) {
      onStatusChange('playing');
    }
  };

  useEffect(() => {
    if (status !== 'playing' && onStatusChange) {
      onStatusChange(status);
    }
  }, [status, onStatusChange]);

  const getStatusText = (): string => {
    switch (status) {
      case 'won':
        return '🎉 HAPPY BIRTHDAY! 🎂';
      case 'lost':
        return '💥 OOPS! BLOWN OUT! 💥';
      default:
        return '🕯️ Cake Sweeper';
    }
  };

  return (
    <Win95Window title={getStatusText()}>
      <div data-testid="cake-sweeper" className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-between gap-8 mb-2">
          <CounterDisplay value={remainingCandles ?? candleCount} label="Candles" labelIcon="🕯️" />
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleRestart}
              data-testid="restart-button"
              className="w-12 h-12 flex items-center justify-center border-t-4 border-l-4 border-white/90 border-b-4 border-r-4 border-black/30 bg-[#C3C7CB] text-2xl"
              aria-label="New Game"
            >
              {status === 'won' ? '😎' : status === 'lost' ? '😵' : '😐'}
            </button>
          </div>
          <CounterDisplay value={time ?? 0} label="Time" labelIcon="⏱️" />
        </div>

        <div
          className="inline-grid gap-0 border-4 border-black/40 bg-black/20 p-1"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
          role="grid"
          aria-label={`Cake Sweeper game grid with ${gridSize} rows and ${gridSize} columns`}
        >
          {grid.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} role="gridcell">
                <CakeSweeperTile
                  tile={tile}
                  onReveal={handleReveal}
                  onToggleFlag={handleToggleFlag}
                />
              </div>
            ))
          )}
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 border-t-2 border-l-2 border-white/50 border-b-2 border-r-2 border-black/30 bg-[#C3C7CB]">
          <span className="font-pixel text-sm text-[#131315]">
            {status === 'playing'
              ? 'Left-click: Reveal | Right-click: Flag'
              : 'Click New Game to play again'}
          </span>
        </div>
      </div>
    </Win95Window>
  );
}
