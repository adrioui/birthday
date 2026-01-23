import { type Tile as TileType } from '../../hooks/useCakeSweeper';

interface CakeSweeperTileProps {
  tile: TileType;
  onReveal: (row: number, col: number) => void;
  onToggleFlag: (row: number, col: number) => void;
}

export function CakeSweeperTile({ tile, onReveal, onToggleFlag }: CakeSweeperTileProps) {
  const handleClick = () => {
    if (tile.state !== 'revealed') {
      onReveal(tile.row, tile.col);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (tile.state !== 'revealed') {
      onToggleFlag(tile.row, tile.col);
    }
  };

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
    ];
    return colors[num - 1] || 'text-[#FF0099]';
  };

  if (tile.state === 'revealed') {
    if (tile.isCandle) {
      return (
        <div
          data-testid={`tile-${tile.row}-${tile.col}`}
          data-state="revealed"
          data-candle="true"
          className="w-8 h-8 flex items-center justify-center border border-black/20 bg-[#FF6B6B]/20"
        >
          <span className="text-lg" role="img" aria-label="candle">
            🕯️
          </span>
        </div>
      );
    }
    if (tile.adjacentCandles > 0) {
      return (
        <div
          data-testid={`tile-${tile.row}-${tile.col}`}
          data-state="revealed"
          data-candle="false"
          className="w-8 h-8 flex items-center justify-center border border-black/20 bg-white relative"
        >
          <span className="text-lg" role="img" aria-label="cake">
            🎂
          </span>
          <span
            className={`absolute top-0 right-0 text-xs font-bold leading-none px-0.5 rounded-full bg-white/80 ${getNumberColor(tile.adjacentCandles)}`}
            aria-label={`${tile.adjacentCandles} adjacent candles`}
          >
            {tile.adjacentCandles}
          </span>
        </div>
      );
    }
    return (
      <div
        data-testid={`tile-${tile.row}-${tile.col}`}
        data-state="revealed"
        data-candle="false"
        className="w-8 h-8 flex items-center justify-center border border-black/20 bg-white"
      >
        <span className="text-lg" role="img" aria-label="cake">
          🎂
        </span>
      </div>
    );
  }

  if (tile.state === 'flagged') {
    return (
      <button
        onClick={handleClick}
        onContextMenu={handleRightClick}
        data-testid={`tile-${tile.row}-${tile.col}`}
        data-state="flagged"
        className="tile-focus w-8 h-8 flex items-center justify-center border-t-2 border-l-2 border-white/50 border-b-2 border-r-2 border-black/30 bg-[#C3C7CB] hover:bg-[#d4d8dc] active:border-t-2 active:border-l-2 active:border-b-2 active:border-r-2 transition-colors"
        aria-label={`Flagged tile at row ${tile.row + 1}, column ${tile.col + 1}`}
      >
        <span className="text-sm" role="img" aria-label="flag">
          🚩
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      onContextMenu={handleRightClick}
      data-testid={`tile-${tile.row}-${tile.col}`}
      data-state="hidden"
      className="tile-focus w-8 h-8 flex items-center justify-center border-t-2 border-l-2 border-white/50 border-b-2 border-r-2 border-black/30 bg-[#C3C7CB] hover:bg-[#d4d8dc] active:border-t-2 active:border-l-2 active:border-b-2 active:border-r-2 transition-colors"
      aria-label={`Tile at row ${tile.row + 1}, column ${tile.col + 1}, not revealed`}
    ></button>
  );
}
