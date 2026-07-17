import { generatePuzzle, buildDisplayGrid } from './generatePuzzle';

describe('generatePuzzle', () => {
  it('picks the requested number of distinct blank cells', () => {
    const puzzle = generatePuzzle(9, 3, 3, 5);

    expect(puzzle.blanks).toHaveLength(5);
    const keys = new Set(puzzle.blanks.map((b) => `${b.row},${b.col}`));
    expect(keys.size).toBe(5);
  });

  it('caps the blank count at the number of cells for small grids', () => {
    const puzzle = generatePuzzle(4, 2, 2, 30);

    expect(puzzle.blanks).toHaveLength(16);
  });

  it('every blank cell is inside the grid bounds', () => {
    const puzzle = generatePuzzle(6, 2, 3, 6);

    for (const { row, col } of puzzle.blanks) {
      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(6);
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(6);
    }
  });
});

describe('buildDisplayGrid', () => {
  it('shows 0 at every blank cell and the solved value everywhere else', () => {
    const puzzle = generatePuzzle(9, 3, 3, 5);
    const display = buildDisplayGrid(puzzle);
    const blankKeys = new Set(puzzle.blanks.map((b) => `${b.row},${b.col}`));

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (blankKeys.has(`${r},${c}`)) {
          expect(display[r][c]).toBe(0);
        } else {
          expect(display[r][c]).toBe(puzzle.solution[r][c]);
        }
      }
    }
  });
});
