import { useCallback, useEffect, useState } from 'react';
import type { GameProps } from '../../GameScreen';

export type RoundResult = 'idle' | 'correct' | 'wrong';

export interface UseGameRoundOptions {
  roundCount: number;
  onRoundComplete: GameProps['onRoundComplete'];
  onGameFinish: () => void;
  /** Sets up a fresh round's local state (new problem, new letter, new deck, ...). */
  startRound: () => void;
  /** Pause after a result before advancing, so the correct/wrong feedback is visible. */
  advanceDelayMs?: number;
}

/**
 * The result/roundsDone/advance-timer choreography shared by every round-based
 * game (multiple-choice, tracing, matching): show idle → correct/wrong → wait →
 * either start the next round or finish. Duplicated with minor variations across
 * every game before this.
 */
export function useGameRound({
  roundCount,
  onRoundComplete,
  onGameFinish,
  startRound,
  advanceDelayMs = 900,
}: UseGameRoundOptions) {
  const [result, setResult] = useState<RoundResult>('idle');
  const [roundsDone, setRoundsDone] = useState(0);

  useEffect(() => {
    startRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitAnswer = useCallback(
    async (correct: boolean, responseTimeMs = 0, hintsUsed = 0) => {
      if (result !== 'idle') return;
      setResult(correct ? 'correct' : 'wrong');
      await onRoundComplete(correct, responseTimeMs, hintsUsed);
      const next = roundsDone + 1;
      setRoundsDone(next);
      if (next >= roundCount) {
        setTimeout(onGameFinish, advanceDelayMs);
      } else {
        setTimeout(() => {
          setResult('idle');
          startRound();
        }, advanceDelayMs);
      }
    },
    [
      result,
      roundsDone,
      roundCount,
      onRoundComplete,
      onGameFinish,
      startRound,
      advanceDelayMs,
    ],
  );

  return { result, roundsDone, submitAnswer };
}
