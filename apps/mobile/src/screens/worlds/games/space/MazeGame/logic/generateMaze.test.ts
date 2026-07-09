import { generateMaze, MOVES, type Dir } from './generateMaze';

describe('generateMaze', () => {
  it('returns a size x size grid', () => {
    const maze = generateMaze(4);

    expect(maze).toHaveLength(4);
    maze.forEach((row) => expect(row).toHaveLength(4));
  });

  it('produces a fully connected maze reachable from the start cell', () => {
    const size = 5;
    const maze = generateMaze(size);

    const visited = new Set<string>();
    const stack: [number, number][] = [[0, 0]];
    while (stack.length) {
      const [r, c] = stack.pop() as [number, number];
      const key = `${r},${c}`;
      if (visited.has(key)) continue;
      visited.add(key);
      (Object.keys(MOVES) as Dir[]).forEach((dir) => {
        if (!maze[r][c][dir]) {
          const [dr, dc] = MOVES[dir];
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < size && nc >= 0 && nc < size)
            stack.push([nr, nc]);
        }
      });
    }

    expect(visited.size).toBe(size * size);
  });

  it('keeps openings symmetric between adjacent cells', () => {
    const maze = generateMaze(3);

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (!maze[r][c].right && c + 1 < 3) {
          expect(maze[r][c + 1].left).toBe(false);
        }
        if (!maze[r][c].bottom && r + 1 < 3) {
          expect(maze[r + 1][c].top).toBe(false);
        }
      }
    }
  });
});
