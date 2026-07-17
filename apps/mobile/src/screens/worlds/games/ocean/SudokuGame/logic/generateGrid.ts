import { shuffle } from './shuffle';

/**
 * Fills an empty `size`×`size` grid via randomized backtracking so every row,
 * column and `boxRows`×`boxCols` box ends up with every number 1..size
 * exactly once — a full, valid sudoku solution. Works for any size where
 * `boxRows * boxCols === size` (4 → 2×2, 6 → 2×3, 9 → 3×3).
 */
export function generateGrid(
  size: number,
  boxRows: number,
  boxCols: number,
): number[][] {
  const grid: number[][] = Array.from({ length: size }, () =>
    Array(size).fill(0),
  );

  function isValid(row: number, col: number, num: number): boolean {
    for (let i = 0; i < size; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    const boxRowStart = Math.floor(row / boxRows) * boxRows;
    const boxColStart = Math.floor(col / boxCols) * boxCols;
    for (let r = boxRowStart; r < boxRowStart + boxRows; r++) {
      for (let c = boxColStart; c < boxColStart + boxCols; c++) {
        if (grid[r][c] === num) return false;
      }
    }
    return true;
  }

  function fill(pos: number): boolean {
    if (pos === size * size) return true;
    const row = Math.floor(pos / size);
    const col = pos % size;

    const candidates = shuffle(Array.from({ length: size }, (_, i) => i + 1));
    for (const num of candidates) {
      if (isValid(row, col, num)) {
        grid[row][col] = num;
        if (fill(pos + 1)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  }

  fill(0);
  return grid;
}
