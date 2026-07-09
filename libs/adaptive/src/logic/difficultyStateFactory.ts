import type { DifficultyState } from '../types';

export function createInitialDifficultyState(
  profileId: string,
  gameId: string,
): DifficultyState {
  return {
    profileId,
    gameId,
    currentLevel: 1,
    consecutiveHits: 0,
    consecutiveMiss: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    updatedAt: Math.floor(Date.now() / 1000),
  };
}
