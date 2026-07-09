import { useCallback, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../../GameScreen';
import { generateMaze, MOVES, type Dir } from '../logic/generateMaze';

const { width: SCREEN_W } = Dimensions.get('window');

export interface UseMazeGameStateOptions {
  gridSize: number;
  onRoundComplete: GameProps['onRoundComplete'];
  onGameFinish: () => void;
}

/** Owns the maze grid, rocket position and finished state for the single-maze round. */
export function useMazeGameState({
  gridSize,
  onRoundComplete,
  onGameFinish,
}: UseMazeGameStateOptions) {
  const [maze] = useState(() => generateMaze(gridSize));
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    speak('¡Guiá al cohete hasta la estrella!');
  }, []);

  const cellSize = Math.min(Math.floor((SCREEN_W - 48) / gridSize), 58);

  const canMove = useCallback(
    (dir: Dir) => {
      const [r, c] = pos;
      return !maze[r][c][dir];
    },
    [maze, pos],
  );

  const move = useCallback(
    async (dir: Dir) => {
      if (finished || !canMove(dir)) return;

      const [dr, dc] = MOVES[dir];
      const [r, c] = pos;
      const nr = r + dr;
      const nc = c + dc;
      setPos([nr, nc]);

      if (nr === gridSize - 1 && nc === gridSize - 1) {
        setFinished(true);
        speak('¡Llegaste a la estrella!');
        await onRoundComplete(true, 0);
        setTimeout(onGameFinish, 800);
      }
    },
    [finished, canMove, pos, gridSize, onRoundComplete, onGameFinish],
  );

  return { maze, pos, finished, cellSize, canMove, move };
}
