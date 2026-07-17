import { generateGrid } from './generateGrid';
import { shuffle } from './shuffle';

export interface Cell {
  row: number;
  col: number;
}

export interface SudokuPuzzle {
  size: number;
  boxRows: number;
  boxCols: number;
  solution: number[][];
  /** Cells to blank out, in the order the child fills them. */
  blanks: Cell[];
}

/**
 * Generates a full valid solution and picks `blankCount` distinct cells to
 * hide. The rest of the grid stays visible as "givens" — with only a
 * handful of blanks, the puzzle stays solvable regardless of grid size.
 */
export function generatePuzzle(
  size: number,
  boxRows: number,
  boxCols: number,
  blankCount: number,
): SudokuPuzzle {
  const solution = generateGrid(size, boxRows, boxCols);

  const allCells: Cell[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      allCells.push({ row, col });
    }
  }
  const blanks = shuffle(allCells).slice(0, Math.min(blankCount, size * size));

  return { size, boxRows, boxCols, solution, blanks };
}

/** The display grid at the start of a session: solution values, but 0 at every blank cell. */
export function buildDisplayGrid(puzzle: SudokuPuzzle): number[][] {
  const blankKeys = new Set(puzzle.blanks.map((b) => `${b.row},${b.col}`));
  return puzzle.solution.map((row, r) =>
    row.map((value, c) => (blankKeys.has(`${r},${c}`) ? 0 : value)),
  );
}
