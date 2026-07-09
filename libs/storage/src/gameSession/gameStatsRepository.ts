import { getDatabase } from '../schema/getDatabase';
import type { GameStat, ProfileStats } from './gameStatsRow';
import { rowToGameStat, rowToProfileStats } from './gameStatsRow';

export async function getGameStats(profileId: string): Promise<GameStat[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT
       game_id, world,
       COUNT(*) as sessions,
       ROUND(AVG(score)) as avg_score,
       MAX(score) as best_score,
       ROUND(SUM(duration_secs) / 60.0) as total_minutes,
       MAX(difficulty) as last_level
     FROM game_sessions
     WHERE profile_id = ?
     GROUP BY game_id, world
     ORDER BY world, game_id`,
    [profileId],
  );
  return rows.map(rowToGameStat);
}

export async function getProfileStats(
  profileId: string,
): Promise<ProfileStats> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT
       COUNT(*) as total_sessions,
       SUM(duration_secs) as total_secs,
       AVG(score) as avg_score,
       MAX(score) as best_score
     FROM game_sessions WHERE profile_id = ?`,
    [profileId],
  );
  return rowToProfileStats(row);
}
