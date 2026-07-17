import { generateGrid } from './generateGrid';

function expectValidGrid(
  grid: number[][],
  size: number,
  boxRows: number,
  boxCols: number,
) {
  const expected = new Set(Array.from({ length: size }, (_, i) => i + 1));

  expect(grid).toHaveLength(size);
  grid.forEach((row) => expect(row).toHaveLength(size));

  // Rows and columns: every number 1..size exactly once.
  for (let i = 0; i < size; i++) {
    const row = grid[i];
    const col = grid.map((r) => r[i]);
    expect(new Set(row)).toEqual(expected);
    expect(new Set(col)).toEqual(expected);
  }

  // Boxes: same rule over each boxRows×boxCols block.
  for (let br = 0; br < size; br += boxRows) {
    for (let bc = 0; bc < size; bc += boxCols) {
      const box: number[] = [];
      for (let r = br; r < br + boxRows; r++) {
        for (let c = bc; c < bc + boxCols; c++) {
          box.push(grid[r][c]);
        }
      }
      expect(new Set(box)).toEqual(expected);
    }
  }
}

describe('generateGrid', () => {
  it('produces a valid 4x4 grid with 2x2 boxes', () => {
    expectValidGrid(generateGrid(4, 2, 2), 4, 2, 2);
  });

  it('produces a valid 6x6 grid with 2x3 boxes', () => {
    expectValidGrid(generateGrid(6, 2, 3), 6, 2, 3);
  });

  it('produces a valid 9x9 grid with 3x3 boxes', () => {
    expectValidGrid(generateGrid(9, 3, 3), 9, 3, 3);
  });

  it('produces a different grid across runs', () => {
    const grids = Array.from({ length: 5 }, () => generateGrid(9, 3, 3));
    const serialized = grids.map((g) => JSON.stringify(g));
    expect(new Set(serialized).size).toBeGreaterThan(1);
  });
});
