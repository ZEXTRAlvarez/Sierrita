import { runProgram } from './runProgram';
import type { Cell } from '../../MazeGame/logic/generateMaze';

function cell(overrides: Partial<Cell> = {}): Cell {
  return { top: true, right: true, bottom: true, left: true, ...overrides };
}

// A 2x2 grid open enough to move freely down and right from (0,0).
const OPEN_MAZE: Cell[][] = [
  [cell({ bottom: false, right: false }), cell({ bottom: false, left: false })],
  [cell({ top: false, right: false }), cell({ top: false, left: false })],
];

// A 1x3 row, fully open horizontally, for testing a true 2-cell forward2.
const OPEN_ROW: Cell[][] = [
  [
    cell({ right: false }),
    cell({ left: false, right: false }),
    cell({ left: false }),
  ],
];

describe('runProgram', () => {
  it('returns one step per block plus the starting state', () => {
    const steps = runProgram(OPEN_MAZE, [0, 0], 'bottom', [
      'forward',
      'turnRight',
    ]);

    expect(steps).toHaveLength(3);
    expect(steps[0]).toEqual({ pos: [0, 0], facing: 'bottom' });
  });

  it('moves forward one cell in the facing direction when unblocked', () => {
    const steps = runProgram(OPEN_MAZE, [0, 0], 'bottom', ['forward']);

    expect(steps[1]).toEqual({ pos: [1, 0], facing: 'bottom' });
  });

  it('does not move when a wall blocks the facing direction', () => {
    const steps = runProgram(OPEN_MAZE, [0, 0], 'top', ['forward']);

    expect(steps[1]).toEqual({ pos: [0, 0], facing: 'top' });
  });

  it('rotates facing clockwise on turnRight and counter-clockwise on turnLeft, without moving', () => {
    const right = runProgram(OPEN_MAZE, [0, 0], 'top', ['turnRight']);
    const left = runProgram(OPEN_MAZE, [0, 0], 'top', ['turnLeft']);

    expect(right[1]).toEqual({ pos: [0, 0], facing: 'right' });
    expect(left[1]).toEqual({ pos: [0, 0], facing: 'left' });
  });

  it('moves two cells for forward2 when both steps are unblocked', () => {
    const steps = runProgram(OPEN_ROW, [0, 0], 'right', ['forward2']);

    expect(steps[1]).toEqual({ pos: [0, 2], facing: 'right' });
  });

  it('stops at a wall partway through forward2', () => {
    const steps = runProgram(OPEN_MAZE, [0, 0], 'bottom', ['forward2']);

    // (0,0)->(1,0) is open, but (1,0) has no further "bottom" exit, so the
    // second half of forward2 is blocked and the robot stays at (1,0).
    expect(steps[1]).toEqual({ pos: [1, 0], facing: 'bottom' });
  });

  it('can reach the opposite corner with forward + turn + forward', () => {
    const steps = runProgram(OPEN_MAZE, [0, 0], 'bottom', [
      'forward',
      'turnLeft',
      'forward',
    ]);

    expect(steps[steps.length - 1].pos).toEqual([1, 1]);
  });
});
