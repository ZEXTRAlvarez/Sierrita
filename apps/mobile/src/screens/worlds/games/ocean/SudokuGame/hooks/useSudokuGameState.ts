import { useCallback, useRef, useState } from 'react';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../../GameScreen';
import { useGameRound } from '../../../shared/useGameRound';
import {
  generatePuzzle,
  buildDisplayGrid,
  type Cell,
  type SudokuPuzzle,
} from '../logic/generatePuzzle';

export interface UseSudokuGameStateOptions {
  size: number;
  boxRows: number;
  boxCols: number;
  blankCount: number;
  onRoundComplete: GameProps['onRoundComplete'];
  onGameFinish: () => void;
  roundCount: number;
}

/**
 * Generates one puzzle for the whole session (unlike most games, which
 * regenerate content every round) and walks through its blank cells one at a
 * time: each round reveals the previous blank's answer and highlights the
 * next one, until every blank in `puzzle.blanks` has been answered.
 */
export function useSudokuGameState({
  size,
  boxRows,
  boxCols,
  blankCount,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: UseSudokuGameStateOptions) {
  const puzzleRef = useRef<SudokuPuzzle | null>(null);
  const [displayGrid, setDisplayGrid] = useState<number[][]>([]);
  const [blankIdx, setBlankIdx] = useState(0);
  const [filledKeys, setFilledKeys] = useState<Set<string>>(new Set());

  const startRound = useCallback(() => {
    if (!puzzleRef.current) {
      const generated = generatePuzzle(size, boxRows, boxCols, blankCount);
      puzzleRef.current = generated;
      setDisplayGrid(buildDisplayGrid(generated));
      setBlankIdx(0);
      setFilledKeys(new Set());
      speak('Completá el sudoku. ¿Qué número va en el cuadrado marcado?');
    } else {
      setBlankIdx((i) => i + 1);
      speak('¿Y en este otro?');
    }
  }, [size, boxRows, boxCols, blankCount]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  const puzzle = puzzleRef.current;
  const currentBlank: Cell | null = puzzle?.blanks[blankIdx] ?? null;

  const handleChoice = useCallback(
    (num: number) => {
      if (result !== 'idle' || !currentBlank || !puzzleRef.current) return;
      const { row, col } = currentBlank;
      const correctValue = puzzleRef.current.solution[row][col];
      const correct = num === correctValue;

      setDisplayGrid((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = correctValue;
        return next;
      });
      setFilledKeys((prev) => new Set(prev).add(`${row},${col}`));
      submitAnswer(correct);
    },
    [result, currentBlank, submitAnswer],
  );

  return {
    puzzle,
    displayGrid,
    currentBlank,
    filledKeys,
    result,
    roundsDone,
    handleChoice,
  };
}
