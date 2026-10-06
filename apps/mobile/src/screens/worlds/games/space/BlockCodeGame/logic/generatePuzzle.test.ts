import { generatePuzzle } from './generatePuzzle';

describe('generatePuzzle', () => {
  it('builds a maze of the requested size with start at the top-left and goal at the bottom-right', () => {
    const p = generatePuzzle(4);

    expect(p.maze).toHaveLength(4);
    expect(p.maze[0]).toHaveLength(4);
    expect(p.start).toEqual([0, 0]);
    expect(p.goal).toEqual([3, 3]);
    expect(p.startFacing).toBe('bottom');
  });
});
