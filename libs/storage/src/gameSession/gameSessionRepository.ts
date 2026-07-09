import type { GameSummary } from '@sierrita/games';
import { getDatabase } from '../schema/getDatabase';
import type { StoredGameSession } from './gameSessionRow';
import { rowToGameSession } from './gameSessionRow';

export async function saveGameSession(
  profileId: string,
  summary: GameSummary,
): Promise<void> {
  const db = await getDatabase();
  const id = `gs_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  await db.runAsync(
    `INSERT INTO game_sessions
       (id, profile_id, world, game_id, score, max_score, duration_secs,
        difficulty, completed, played_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, unixepoch())`,
    [
      id,
      profileId,
      summary.world,
      summary.gameId,
      Math.round(summary.scorePercent * 100),
      100,
      summary.durationSecs,
      summary.difficulty,
    ],
  );
}

export async function getRecentSessions(
  profileId: string,
  limit = 20,
): Promise<StoredGameSession[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM game_sessions WHERE profile_id = ? ORDER BY played_at DESC LIMIT ?`,
    [profileId, limit],
  );
  return rows.map(rowToGameSession);
}
