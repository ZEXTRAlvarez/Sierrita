import {
  generateMaze,
  type Cell,
  type Dir,
} from '../../MazeGame/logic/generateMaze';

export interface Puzzle {
  size: number;
  maze: Cell[][];
  start: [number, number];
  goal: [number, number];
  startFacing: Dir;
}

/** Builds a puzzle on top of MazeGame's perfect-maze generator: start at the top-left facing down, goal at the bottom-right. */
export function generatePuzzle(size: number): Puzzle {
  return {
    size,
    maze: generateMaze(size),
    start: [0, 0],
    goal: [size - 1, size - 1],
    startFacing: 'bottom',
  };
}
