import type { Difficulty } from '@sierrita/games';
import type { DifficultyState } from '../types';
import { ADAPTIVE_CONFIG } from '../types';

/**
 * Procesa un resultado de ronda y ajusta el nivel si corresponde.
 * Retorna el estado actualizado + si hubo cambio de nivel.
 */
export function processRoundResult(
  state: DifficultyState,
  correct: boolean,
): { next: DifficultyState; levelChanged: boolean; levelUp: boolean } {
  const now = Math.floor(Date.now() / 1000);
  let { currentLevel, consecutiveHits, consecutiveMiss } = state;
  let levelChanged = false;
  let levelUp = false;

  const totalAttempts = state.totalAttempts + 1;
  const totalCorrect = state.totalCorrect + (correct ? 1 : 0);

  if (correct) {
    consecutiveHits = consecutiveHits + 1;
    consecutiveMiss = 0;
    if (consecutiveHits >= ADAPTIVE_CONFIG.hitsToLevelUp && currentLevel < 3) {
      currentLevel = (currentLevel + 1) as Difficulty;
      consecutiveHits = 0;
      levelChanged = true;
      levelUp = true;
    }
  } else {
    consecutiveMiss = consecutiveMiss + 1;
    consecutiveHits = 0;
    if (
      consecutiveMiss >= ADAPTIVE_CONFIG.missToLevelDown &&
      currentLevel > 1
    ) {
      currentLevel = (currentLevel - 1) as Difficulty;
      consecutiveMiss = 0;
      levelChanged = true;
    }
  }

  return {
    next: {
      ...state,
      currentLevel,
      consecutiveHits,
      consecutiveMiss,
      totalAttempts,
      totalCorrect,
      updatedAt: now,
    },
    levelChanged,
    levelUp,
  };
}
