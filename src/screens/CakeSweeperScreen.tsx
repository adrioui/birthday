import { useState, useEffect } from 'react'
import { ScreenShake } from '../components/effects/ScreenShake'
import { GlitchOverlay } from '../components/effects/GlitchOverlay'
import { SystemReboot } from '../components/effects/SystemReboot'
import { useCakeSweeper, type GameStatus } from '../hooks/useCakeSweeper'

export function CakeSweeperScreen() {
  const [previousStatus, setPreviousStatus] = useState<GameStatus>('playing')
  const [triggerShake, setTriggerShake] = useState(false)
  const [triggerGlitch, setTriggerGlitch] = useState(false)
  const [triggerReboot, setTriggerReboot] = useState(false)

  useEffect(() => {
    return () => {
      setPreviousStatus('playing')
    }
  }, [])

  const handleStatusChange = (newStatus: GameStatus) => {
    if (previousStatus === 'playing' && newStatus === 'lost') {
      setTriggerShake(true)
      setTriggerGlitch(true)
    }
    if (previousStatus === 'playing' && newStatus === 'won') {
      setTriggerReboot(true)
    }
    setPreviousStatus(newStatus)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-periwinkle-dark">
      <div className="flex-1 px-6 py-8">
        <div className="relative mb-8 flex items-center justify-center">
          <h1 className="chrome-text text-6xl font-black italic transform -rotate-3">
            CAKE SWEEPER
          </h1>
          <span className="absolute -top-2 -right-4 text-4xl animate-bounce">🎂</span>
        </div>

        <CakeSweeperGridWrapper onStatusChange={handleStatusChange} />
      </div>

      <ScreenShake trigger={triggerShake} intensity="heavy" onComplete={() => setTriggerShake(false)} />
      <GlitchOverlay trigger={triggerGlitch} duration={0.6} onComplete={() => setTriggerGlitch(false)} />
      <SystemReboot trigger={triggerReboot} onComplete={() => setTriggerReboot(false)} />
    </div>
  )
}

interface CakeSweeperGridWrapperProps {
  onStatusChange: (status: GameStatus) => void
}

function CakeSweeperGridWrapper({ onStatusChange }: CakeSweeperGridWrapperProps) {
  const { grid, status, revealTile, toggleFlag, restart } = useCakeSweeper(8, 10)

  useEffect(() => {
    if (status !== 'playing') {
      onStatusChange(status)
    }
  }, [status, onStatusChange])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 border-t-2 border-l-2 border-white/50 border-b-2 border-r-2 border-black/30 bg-[#C3C7CB]">
        <span className="font-pixel text-sm text-[#131315]">
          {status === 'playing' ? 'Left-click: Reveal | Right-click: Flag' : 'Click New Game to play again'}
        </span>
      </div>

      <div
        className="inline-grid gap-0 border-4 border-black/40 bg-black/20 p-1"
        style={{
          gridTemplateColumns: `repeat(8, minmax(0, 1fr))`
        }}
        role="grid"
        aria-label="Cake Sweeper game grid with 8 rows and 8 columns"
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
  )
}

interface CakeSweeperTileProps {
  tile: import('../hooks/useCakeSweeper').Tile
  onReveal: (row: number, col: number) => void
  onToggleFlag: (row: number, col: number) => void
}

function CakeSweeperTile({ tile, onReveal, onToggleFlag }: CakeSweeperTileProps) {
  const handleClick = () => {
    if (tile.state !== 'revealed') {
      onReveal(tile.row, tile.col)
    }
  }

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (tile.state !== 'revealed') {
      onToggleFlag(tile.row, tile.col)
    }
  }

  const getNumberColor = (num: number): string => {
    const colors = [
      'text-[#33FF33]',
      'text-[#0000FF]',
      'text-[#FF0099]',
      'text-[#33FF33]',
      'text-[#FF0099]',
      'text-[#CCFF00]',
      'text-[#CCCCFF]',
      'text-[#FF0099]',
    ]
    return colors[num - 1] || 'text-[#FF0099]'
  }

  if (tile.state === 'revealed') {
    if (tile.isCandle) {
      return (
        <div className="w-8 h-8 flex items-center justify-center border border-black/20 bg-[#FF6B6B]/20">
          <span className="text-lg" role="img" aria-label="candle">🕯️</span>
        </div>
      )
    }
    if (tile.adjacentCandles > 0) {
      return (
        <div className={`w-8 h-8 flex items-center justify-center border border-black/20 bg-white ${getNumberColor(tile.adjacentCandles)} font-bold text-sm`}>
          {tile.adjacentCandles}
        </div>
      )
    }
    return (
      <div className="w-8 h-8 flex items-center justify-center border border-black/20 bg-white" />
    )
  }

  if (tile.state === 'flagged') {
    return (
      <button
        onClick={handleClick}
        onContextMenu={handleRightClick}
        className="w-8 h-8 flex items-center justify-center border-t-2 border-l-2 border-white/50 border-b-2 border-r-2 border-black/30 bg-[#C3C7CB] hover:bg-[#d4d8dc] active:border-t-2 active:border-l-2 active:border-b-2 active:border-r-2 transition-colors"
        aria-label={`Flagged tile at row ${tile.row + 1}, column ${tile.col + 1}`}
      >
        <span className="text-sm" role="img" aria-label="flag">🚩</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      onContextMenu={handleRightClick}
      className="w-8 h-8 flex items-center justify-center border-t-2 border-l-2 border-white/50 border-b-2 border-r-2 border-black/30 bg-[#C3C7CB] hover:bg-[#d4d8dc] active:border-t-2 active:border-l-2 active:border-b-2 active:border-r-2 transition-colors"
      aria-label={`Tile at row ${tile.row + 1}, column ${tile.col + 1}, not revealed`}
    >
    </button>
  )
}
