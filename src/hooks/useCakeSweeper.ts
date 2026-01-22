import { useState, useCallback } from 'react'

export type TileState = 'hidden' | 'revealed' | 'flagged'
export type GameStatus = 'playing' | 'won' | 'lost'

export interface Tile {
  row: number
  col: number
  isCandle: boolean
  adjacentCandles: number
  state: TileState
}

interface UseCakeSweeperReturn {
  grid: Tile[][]
  status: GameStatus
  revealTile: (row: number, col: number) => void
  toggleFlag: (row: number, col: number) => void
  restart: () => void
}

export function useCakeSweeper(gridSize: number = 8, candleCount: number = 10): UseCakeSweeperReturn {
  const [grid, setGrid] = useState<Tile[][]>(() => {
    const newGrid: Tile[][] = []
    const candlePositions = new Set<string>()

    while (candlePositions.size < candleCount) {
      const row = Math.floor(Math.random() * gridSize)
      const col = Math.floor(Math.random() * gridSize)
      candlePositions.add(`${row},${col}`)
    }

    for (let row = 0; row < gridSize; row++) {
      const tileRow: Tile[] = []
      for (let col = 0; col < gridSize; col++) {
        const isCandle = candlePositions.has(`${row},${col}`)
        tileRow.push({
          row,
          col,
          isCandle,
          adjacentCandles: 0,
          state: 'hidden',
        })
      }
      newGrid.push(tileRow)
    }

    const countAdjacentCandles = (currentGrid: Tile[][], row: number, col: number): number => {
      let count = 0
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          if (r === 0 && c === 0) continue
          const newRow = row + r
          const newCol = col + c
          if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
            if (currentGrid[newRow][newCol].isCandle) count++
          }
        }
      }
      return count
    }

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (!newGrid[row][col].isCandle) {
          newGrid[row][col].adjacentCandles = countAdjacentCandles(newGrid, row, col)
        }
      }
    }

    return newGrid
  })
  const [status, setStatus] = useState<GameStatus>('playing')

  const floodFillReveal = useCallback((currentGrid: Tile[][], startRow: number, startCol: number): Tile[][] => {
    const newGrid = currentGrid.map(row => row.map(tile => ({ ...tile })))
    const queue: [number, number][] = [[startRow, startCol]]
    const visited = new Set<string>()

    while (queue.length > 0) {
      const [row, col] = queue.shift()!
      const key = `${row},${col}`

      if (visited.has(key)) continue
      visited.add(key)

      if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) continue
      if (newGrid[row][col].state === 'revealed' || newGrid[row][col].isCandle) continue

      newGrid[row][col].state = 'revealed'

      if (newGrid[row][col].adjacentCandles === 0) {
        for (let r = -1; r <= 1; r++) {
          for (let c = -1; c <= 1; c++) {
            if (r !== 0 || c !== 0) {
              queue.push([row + r, col + c])
            }
          }
        }
      }
    }

    return newGrid
  }, [gridSize])

  const checkWinCondition = useCallback((currentGrid: Tile[][]): boolean => {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const tile = currentGrid[row][col]
        if (!tile.isCandle && tile.state !== 'revealed') {
          return false
        }
      }
    }
    return true
  }, [gridSize])

  const revealAllCandles = useCallback((currentGrid: Tile[][]) => {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (currentGrid[row][col].isCandle) {
          currentGrid[row][col].state = 'revealed'
        }
      }
    }
  }, [gridSize])

  const revealTile = useCallback((row: number, col: number) => {
    if (status !== 'playing') return

    setGrid(prevGrid => {
      if (prevGrid[row][col].state === 'revealed' || prevGrid[row][col].state === 'flagged') {
        return prevGrid
      }

      const newGrid = prevGrid.map(r => r.map(t => ({ ...t })))

      if (newGrid[row][col].isCandle) {
        newGrid[row][col].state = 'revealed'
        setStatus('lost')
        revealAllCandles(newGrid)
        return newGrid
      }

      const updatedGrid = floodFillReveal(newGrid, row, col)

      if (checkWinCondition(updatedGrid)) {
        setStatus('won')
      }

      return updatedGrid
    })
  }, [status, floodFillReveal, checkWinCondition, revealAllCandles])

  const toggleFlag = useCallback((row: number, col: number) => {
    if (status !== 'playing') return

    setGrid(prevGrid => {
      if (prevGrid[row][col].state === 'revealed') {
        return prevGrid
      }

      const newGrid = prevGrid.map(r => r.map(t => ({ ...t })))
      newGrid[row][col].state = newGrid[row][col].state === 'flagged' ? 'hidden' : 'flagged'
      return newGrid
    })
  }, [status])

  const restart = useCallback(() => {
    setGrid(() => {
      const newGrid: Tile[][] = []
      const candlePositions = new Set<string>()

      while (candlePositions.size < candleCount) {
        const row = Math.floor(Math.random() * gridSize)
        const col = Math.floor(Math.random() * gridSize)
        candlePositions.add(`${row},${col}`)
      }

      for (let row = 0; row < gridSize; row++) {
        const tileRow: Tile[] = []
        for (let col = 0; col < gridSize; col++) {
          const isCandle = candlePositions.has(`${row},${col}`)
          tileRow.push({
            row,
            col,
            isCandle,
            adjacentCandles: 0,
            state: 'hidden',
          })
        }
        newGrid.push(tileRow)
      }

      const countAdjacentCandles = (currentGrid: Tile[][], row: number, col: number): number => {
        let count = 0
        for (let r = -1; r <= 1; r++) {
          for (let c = -1; c <= 1; c++) {
            if (r === 0 && c === 0) continue
            const newRow = row + r
            const newCol = col + c
            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
              if (currentGrid[newRow][newCol].isCandle) count++
            }
          }
        }
        return count
      }

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (!newGrid[row][col].isCandle) {
            newGrid[row][col].adjacentCandles = countAdjacentCandles(newGrid, row, col)
          }
        }
      }

      return newGrid
    })
    setStatus('playing')
  }, [gridSize, candleCount])

  return {
    grid,
    status,
    revealTile,
    toggleFlag,
    restart,
  }
}
