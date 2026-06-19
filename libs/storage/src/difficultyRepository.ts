import { getDatabase } from './schema';
import type { DifficultyState } from '../../adaptive/src/types';
import type { Difficulty } from '../../games/src/types';

function rowToState(row: Record<string, unknown>): DifficultyState {
  return {
    profileId:      row.profile_id as string,
    gameId:         row.game_id as string,
    currentLevel:   row.current_level as Difficulty,
    consecutiveHits: row.consecutive_hits as number,
    consecutiveMiss: row.consecutive_miss as number,
    totalAttempts:  row.total_attempts as number,
    totalCorrect:   row.total_correct as number,
    updatedAt:      row.updated_at as number,
  };
}

export async function getDifficultyState(
  profileId: string,
  gameId: string,
): Promise<DifficultyState | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM difficulty_state WHERE profile_id = ? AND game_id = ?',
    [profileId, gameId],
  );
  return row ? rowToState(row) : null;
}

export async function getAllDifficultyStates(
  profileId: string,
): Promise<DifficultyState[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM difficulty_state WHERE profile_id = ?',
    [profileId],
  );
  return rows.map(rowToState);
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
      state.profileId, state.gameId, state.currentLevel,
      state.consecutiveHits, state.consecutiveMiss,
      state.totalAttempts, state.totalCorrect, state.updatedAt,
    ],
  );
}
