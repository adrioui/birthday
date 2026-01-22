import { type Tile as TileType } from '../../hooks/useCakeSweeper'

interface CakeSweeperTileProps {
  tile: TileType
  onReveal: (row: number, col: number) => void
  onToggleFlag: (row: number, col: number) => void
}

export function CakeSweeperTile({ tile, onReveal, onToggleFlag }: CakeSweeperTileProps) {
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
        className="tile-focus w-8 h-8 flex items-center justify-center border-t-2 border-l-2 border-white/50 border-b-2 border-r-2 border-black/30 bg-[#C3C7CB] hover:bg-[#d4d8dc] active:border-t-2 active:border-l-2 active:border-b-2 active:border-r-2 transition-colors"
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
      className="tile-focus w-8 h-8 flex items-center justify-center border-t-2 border-l-2 border-white/50 border-b-2 border-r-2 border-black/30 bg-[#C3C7CB] hover:bg-[#d4d8dc] active:border-t-2 active:border-l-2 active:border-b-2 active:border-r-2 transition-colors"
      aria-label={`Tile at row ${tile.row + 1}, column ${tile.col + 1}, not revealed`}
    >
    </button>
  )
}
