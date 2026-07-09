import type { DifficultyState } from '@sierrita/adaptive';
import { getDatabase } from '../schema/getDatabase';
import { rowToDifficultyState } from './difficultyStateRow';

export async function getDifficultyState(profileId: string, gameId: string): Promise<DifficultyState | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM difficulty_state WHERE profile_id = ? AND game_id = ?',
    [profileId, gameId],
  );
  return row ? rowToDifficultyState(row) : null;
}

export async function getAllDifficultyStates(profileId: string): Promise<DifficultyState[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM difficulty_state WHERE profile_id = ?',
    [profileId],
  );
  return rows.map(rowToDifficultyState);
}

export async function upsertDifficultyState(state: DifficultyState): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO difficulty_state
       (profile_id, game_id, current_level, consecutive_hits, consecutive_miss,
        total_attempts, total_correct, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(profile_id, game_id) DO UPDATE SET
       current_level    = excluded.current_level,
       consecutive_hits = excluded.consecutive_hits,
       consecutive_miss = excluded.consecutive_miss,
       total_attempts   = excluded.total_attempts,
       total_correct    = excluded.total_correct,
       updated_at       = excluded.updated_at`,
    [
      state.profileId,
      state.gameId,
      state.currentLevel,
      state.consecutiveHits,
      state.consecutiveMiss,
      state.totalAttempts,
      state.totalCorrect,
      state.updatedAt,
    ],
  );
}
