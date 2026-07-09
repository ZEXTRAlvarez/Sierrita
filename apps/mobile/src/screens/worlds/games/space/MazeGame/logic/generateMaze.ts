export interface Cell {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export type Dir = 'top' | 'right' | 'bottom' | 'left';

export const OPPOSITE: Record<Dir, Dir> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};
export const MOVES: Record<Dir, [number, number]> = {
  top: [-1, 0],
  bottom: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/** Generates a `size` x `size` perfect maze (every cell reachable, no loops) via recursive backtracking. */
export function generateMaze(size: number): Cell[][] {
  const grid: (Cell & { visited: boolean })[][] = Array.from(
    { length: size },
    () =>
      Array.from({ length: size }, () => ({
        top: true,
        right: true,
        bottom: true,
        left: true,
        visited: false,
      })),
  );

  function carve(r: number, c: number) {
    grid[r][c].visited = true;
    const dirs = shuffle<Dir>(['top', 'right', 'bottom', 'left']);
    for (const dir of dirs) {
      const [dr, dc] = MOVES[dir];
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 &&
        nr < size &&
        nc >= 0 &&
        nc < size &&
        !grid[nr][nc].visited
      ) {
        grid[r][c][dir] = false;
        grid[nr][nc][OPPOSITE[dir]] = false;
        carve(nr, nc);
      }
    }
  }

  carve(0, 0);
  return grid;
}
