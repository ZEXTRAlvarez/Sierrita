import { MOVES, type Cell, type Dir } from '../../MazeGame/logic/generateMaze';

export type BlockKind = 'forward' | 'forward2' | 'turnLeft' | 'turnRight';

export interface RunStep {
  pos: [number, number];
  facing: Dir;
}

const ORDER: Dir[] = ['top', 'right', 'bottom', 'left'];

function rotate(dir: Dir, delta: number): Dir {
  const idx = (ORDER.indexOf(dir) + delta + ORDER.length) % ORDER.length;
  return ORDER[idx];
}

function stepForward(
  maze: Cell[][],
  pos: [number, number],
  facing: Dir,
): [number, number] {
  const [r, c] = pos;
  if (maze[r][c][facing]) return pos; // a wall blocks the move, the robot stays put
  const [dr, dc] = MOVES[facing];
  return [r + dr, c + dc];
}

/**
 * Runs a block program from the given start/facing against the maze, one
 * block at a time, returning every intermediate (position, facing) state —
 * including the starting one — so the caller can play it back step by step.
 */
export function runProgram(
  maze: Cell[][],
  start: [number, number],
  startFacing: Dir,
  blocks: BlockKind[],
): RunStep[] {
  const steps: RunStep[] = [{ pos: start, facing: startFacing }];
  let pos = start;
  let facing = startFacing;

  for (const block of blocks) {
    if (block === 'turnLeft') facing = rotate(facing, -1);
    else if (block === 'turnRight') facing = rotate(facing, 1);
    else if (block === 'forward') pos = stepForward(maze, pos, facing);
    else if (block === 'forward2') {
      pos = stepForward(maze, pos, facing);
      pos = stepForward(maze, pos, facing);
    }
    steps.push({ pos, facing });
  }

  return steps;
}
