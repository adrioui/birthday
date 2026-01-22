import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCakeSweeper } from './useCakeSweeper'

describe('useCakeSweeper', () => {
  it('initializes with correct grid size', () => {
    const { result } = renderHook(() => useCakeSweeper(8, 10))
    expect(result.current.grid).toHaveLength(8)
    expect(result.current.grid[0]).toHaveLength(8)
  })

  it('initializes with correct number of candles', () => {
    const { result } = renderHook(() => useCakeSweeper(8, 10))
    let candleCount = 0
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (result.current.grid[row][col].isCandle) {
          candleCount++
        }
      }
    }
    expect(candleCount).toBe(10)
  })

  it('initializes with all tiles hidden', () => {
    const { result } = renderHook(() => useCakeSweeper(8, 10))
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        expect(result.current.grid[row][col].state).toBe('hidden')
      }
    }
  })

  it('starts in playing status', () => {
    const { result } = renderHook(() => useCakeSweeper(8, 10))
    expect(result.current.status).toBe('playing')
  })

  it('calculates adjacent candles correctly', () => {
    const { result } = renderHook(() => useCakeSweeper(3, 1))
    
    let candlePos: { row: number; col: number } | null = null
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (result.current.grid[row][col].isCandle) {
          candlePos = { row, col }
          break
        }
      }
    }

    expect(candlePos).not.toBeNull()
    if (candlePos) {
      let adjacentCandleCount = 0
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          if (r === 0 && c === 0) continue
          const newRow = candlePos.row + r
          const newCol = candlePos.col + c
          if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
            adjacentCandleCount += result.current.grid[newRow][newCol].adjacentCandles
          }
        }
      }
      
      expect(adjacentCandleCount).toBeGreaterThan(0)
    }
  })

  it('reveals tile when clicked', () => {
    const { result } = renderHook(() => useCakeSweeper(8, 10))
    const findSafeTile = () => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (!result.current.grid[row][col].isCandle) {
            return { row, col }
          }
        }
      }
      return null
    }

    const safeTile = findSafeTile()
    expect(safeTile).not.toBeNull()
    if (safeTile) {
      act(() => {
        result.current.revealTile(safeTile.row, safeTile.col)
      })
      expect(result.current.grid[safeTile.row][safeTile.col].state).toBe('revealed')
    }
  })

  it('does not reveal already revealed tiles', () => {
    const { result } = renderHook(() => useCakeSweeper(8, 10))
    const findSafeTile = () => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (!result.current.grid[row][col].isCandle) {
            return { row, col }
          }
        }
      }
      return null
    }

    const safeTile = findSafeTile()
    expect(safeTile).not.toBeNull()
    if (safeTile) {
      act(() => {
        result.current.revealTile(safeTile.row, safeTile.col)
      })
      const oldGrid = result.current.grid
      act(() => {
        result.current.revealTile(safeTile.row, safeTile.col)
      })
      expect(result.current.grid).toBe(oldGrid)
    }
  })

  it('does not reveal flagged tiles', () => {
    const { result } = renderHook(() => useCakeSweeper(8, 10))
    const findSafeTile = () => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (!result.current.grid[row][col].isCandle) {
            return { row, col }
          }
        }
      }
      return null
    }

    const safeTile = findSafeTile()
    expect(safeTile).not.toBeNull()
    if (safeTile) {
      act(() => {
        result.current.toggleFlag(safeTile.row, safeTile.col)
      })
      const oldGrid = result.current.grid
      act(() => {
        result.current.revealTile(safeTile.row, safeTile.col)
      })
      expect(result.current.grid).toBe(oldGrid)
    }
  })

  it('reveals adjacent tiles when tile has no adjacent candles', () => {
    const { result } = renderHook(() => useCakeSweeper(5, 2))
    
    const findZeroAdjacentTile = () => {
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          const tile = result.current.grid[row][col]
          if (!tile.isCandle && tile.adjacentCandles === 0) {
            return { row, col }
          }
        }
      }
      return null
    }

    const zeroTile = findZeroAdjacentTile()
    if (zeroTile) {
      act(() => {
        result.current.revealTile(zeroTile.row, zeroTile.col)
      })

      let revealedCount = 0
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          if (result.current.grid[row][col].state === 'revealed') {
            revealedCount++
          }
        }
      }
      expect(revealedCount).toBeGreaterThan(1)
    }
  })

  it('loses when clicking on candle', () => {
    const { result } = renderHook(() => useCakeSweeper(8, 10))
    const findCandle = () => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (result.current.grid[row][col].isCandle) {
            return { row, col }
          }
        }
      }
      return null
    }

    const candle = findCandle()
    expect(candle).not.toBeNull()
    if (candle) {
      act(() => {
        result.current.revealTile(candle.row, candle.col)
      })
      expect(result.current.status).toBe('lost')
    }
  })

  it('reveals all candles when lost', () => {
    const { result } = renderHook(() => useCakeSweeper(8, 10))
    const findCandle = () => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (result.current.grid[row][col].isCandle) {
            return { row, col }
          }
        }
      }
      return null
    }

    const candle = findCandle()
    expect(candle).not.toBeNull()
    if (candle) {
      act(() => {
        result.current.revealTile(candle.row, candle.col)
      })

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (result.current.grid[row][col].isCandle) {
            expect(result.current.grid[row][col].state).toBe('revealed')
          }
        }
      }
    }
  })

  it('toggles flag on hidden tile', () => {
    const { result } = renderHook(() => useCakeSweeper(8, 10))
    const findSafeTile = () => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (!result.current.grid[row][col].isCandle) {
            return { row, col }
          }
        }
      }
      return null
    }

    const safeTile = findSafeTile()
    expect(safeTile).not.toBeNull()
    if (safeTile) {
      act(() => {
        result.current.toggleFlag(safeTile.row, safeTile.col)
      })
      expect(result.current.grid[safeTile.row][safeTile.col].state).toBe('flagged')

      act(() => {
        result.current.toggleFlag(safeTile.row, safeTile.col)
      })
      expect(result.current.grid[safeTile.row][safeTile.col].state).toBe('hidden')
    }
  })

  it('does not flag already revealed tiles', () => {
    const { result } = renderHook(() => useCakeSweeper(8, 10))
    const findSafeTile = () => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (!result.current.grid[row][col].isCandle) {
            return { row, col }
          }
        }
      }
      return null
    }

    const safeTile = findSafeTile()
    expect(safeTile).not.toBeNull()
    if (safeTile) {
      act(() => {
        result.current.revealTile(safeTile.row, safeTile.col)
      })
      const oldGrid = result.current.grid
      act(() => {
        result.current.toggleFlag(safeTile.row, safeTile.col)
      })
      expect(result.current.grid).toBe(oldGrid)
    }
  })

  it('does not reveal or flag when game is lost', () => {
    const { result } = renderHook(() => useCakeSweeper(8, 10))
    const findCandle = () => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (result.current.grid[row][col].isCandle) {
            return { row, col }
          }
        }
      }
      return null
    }

    const candle = findCandle()
    const findSafeTile = () => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (!result.current.grid[row][col].isCandle) {
            return { row, col }
          }
        }
      }
      return null
    }

    expect(candle).not.toBeNull()
    if (candle) {
      act(() => {
        result.current.revealTile(candle.row, candle.col)
      })
      expect(result.current.status).toBe('lost')
    }

    const safeTile = findSafeTile()
    expect(safeTile).not.toBeNull()
    if (safeTile) {
      const oldGrid = result.current.grid
      act(() => {
        result.current.revealTile(safeTile.row, safeTile.col)
      })
      act(() => {
        result.current.toggleFlag(safeTile.row, safeTile.col)
      })
      expect(result.current.grid).toBe(oldGrid)
    }
  })

  it('restarts game with new grid', () => {
    const { result } = renderHook(() => useCakeSweeper(8, 10))
    const oldGrid = result.current.grid

    act(() => {
      result.current.restart()
    })

    expect(result.current.status).toBe('playing')
    expect(result.current.grid).not.toBe(oldGrid)
  })

  it('restarts with same grid size and candle count', () => {
    const { result } = renderHook(() => useCakeSweeper(8, 10))
    
    act(() => {
      result.current.restart()
    })

    expect(result.current.grid).toHaveLength(8)
    expect(result.current.grid[0]).toHaveLength(8)
    
    let candleCount = 0
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (result.current.grid[row][col].isCandle) {
          candleCount++
        }
      }
    }
    expect(candleCount).toBe(10)
  })

  it('can win game by revealing all non-candle tiles', () => {
    const { result } = renderHook(() => useCakeSweeper(3, 1))
    
    act(() => {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const tile = result.current.grid[row][col]
          if (!tile.isCandle && tile.state === 'hidden') {
            result.current.revealTile(row, col)
          }
        }
      }
    })

    expect(result.current.status).toBe('won')
  })

  it('supports custom grid sizes', () => {
    const { result } = renderHook(() => useCakeSweeper(5, 5))
    expect(result.current.grid).toHaveLength(5)
    expect(result.current.grid[0]).toHaveLength(5)
    
    let candleCount = 0
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (result.current.grid[row][col].isCandle) {
          candleCount++
        }
      }
    }
    expect(candleCount).toBe(5)
  })

  it('handles edge tiles correctly', () => {
    const { result } = renderHook(() => useCakeSweeper(3, 1))
    
    const findEdgeSafeTile = () => {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const tile = result.current.grid[row][col]
          if (!tile.isCandle && (row === 0 || col === 0 || row === 2 || col === 2)) {
            return { row, col }
          }
        }
      }
      return null
    }

    const edgeTile = findEdgeSafeTile()
    expect(edgeTile).not.toBeNull()
    if (edgeTile) {
      act(() => {
        result.current.revealTile(edgeTile.row, edgeTile.col)
      })
      expect(result.current.grid[edgeTile.row][edgeTile.col].state).toBe('revealed')
    }
  })
})
