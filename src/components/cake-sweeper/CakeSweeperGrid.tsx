import { useCakeSweeper } from '../../hooks/useCakeSweeper'
import { CakeSweeperTile } from './CakeSweeperTile'
import { Win95Window } from './Win95Window'

interface CakeSweeperGridProps {
  gridSize?: number
  candleCount?: number
}

export function CakeSweeperGrid({ gridSize = 8, candleCount = 10 }: CakeSweeperGridProps) {
  const { grid, status, revealTile, toggleFlag, restart } = useCakeSweeper(gridSize, candleCount)

  const getStatusText = (): string => {
    switch (status) {
      case 'won':
        return '🎉 HAPPY BIRTHDAY! 🎂'
      case 'lost':
        return '💥 OOPS! BLOWN OUT! 💥'
      default:
        return '🕯️ Cake Sweeper'
    }
  }

  return (
    <Win95Window title={getStatusText()}>
      <div className="flex flex-col items-center gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 border-t-2 border-l-2 border-white/50 border-b-2 border-r-2 border-black/30 bg-[#C3C7CB]">
          <span className="font-pixel text-sm text-[#131315]">
            {status === 'playing' ? 'Left-click: Reveal | Right-click: Flag' : 'Click New Game to play again'}
          </span>
        </div>

        <div
          className="inline-grid gap-0 border-4 border-black/40 bg-black/20 p-1"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
          }}
          role="grid"
          aria-label={`Cake Sweeper game grid with ${gridSize} rows and ${gridSize} columns`}
        >
          {grid.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} role="gridcell">
                <CakeSweeperTile
                  tile={tile}
                  onReveal={revealTile}
                  onToggleFlag={toggleFlag}
                />
              </div>
            ))
          )}
        </div>

        <button
          onClick={restart}
          className="px-6 py-2 bg-[#C3C7CB] border-t-2 border-l-2 border-white/50 border-b-2 border-r-2 border-black/30 font-display font-bold text-[#131315] text-sm hover:bg-[#d4d8dc] active:border-t-2 active:border-l-2 active:border-b-2 active:border-r-2 transition-colors"
        >
          New Game
        </button>
      </div>
    </Win95Window>
  )
}
