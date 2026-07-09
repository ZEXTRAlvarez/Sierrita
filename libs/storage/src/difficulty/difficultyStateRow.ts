import type { DifficultyState } from '@sierrita/adaptive';
import type { Difficulty } from '@sierrita/games';

export function rowToDifficultyState(row: Record<string, unknown>): DifficultyState {
  return {
    profileId: row.profile_id as string,
    gameId: row.game_id as string,
    currentLevel: row.current_level as Difficulty,
    consecutiveHits: row.consecutive_hits as number,
    consecutiveMiss: row.consecutive_miss as number,
    totalAttempts: row.total_attempts as number,
    totalCorrect: row.total_correct as number,
    updatedAt: row.updated_at as number,
  };
}
