import { getDatabase } from './schema';
import type { GameSummary } from '../../games/src/types';

export interface StoredGameSession {
  id: string;
  profileId: string;
  world: string;
  gameId: string;
  score: number;
  maxScore: number;
  durationSecs: number;
  difficulty: number;
  completed: boolean;
  playedAt: number;
}

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
      id, profileId, summary.world, summary.gameId,
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
    `SELECT * FROM game_sessions
     WHERE profile_id = ? ORDER BY played_at DESC LIMIT ?`,
    [profileId, limit],
  );
  return rows.map((r) => ({
    id:           r.id as string,
    profileId:    r.profile_id as string,
    world:        r.world as string,
    gameId:       r.game_id as string,
    score:        r.score as number,
    maxScore:     r.max_score as number,
    durationSecs: r.duration_secs as number,
    difficulty:   r.difficulty as number,
    completed:    Boolean(r.completed),
    playedAt:     r.played_at as number,
  }));
}

export interface GameStat {
  gameId: string;
  world: string;
  sessions: number;
  avgScore: number;
  bestScore: number;
  totalMinutes: number;
  lastLevel: number;
}

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
  return rows.map((r) => ({
    gameId:       r.game_id as string,
    world:        r.world as string,
    sessions:     r.sessions as number,
    avgScore:     r.avg_score as number,
    bestScore:    r.best_score as number,
    totalMinutes: r.total_minutes as number,
    lastLevel:    r.last_level as number,
  }));
}

export async function getProfileStats(profileId: string) {
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
  return {
    totalSessions: (row?.total_sessions as number) ?? 0,
    totalMinutes:  Math.round(((row?.total_secs as number) ?? 0) / 60),
    avgScore:      Math.round((row?.avg_score as number) ?? 0),
    bestScore:     (row?.best_score as number) ?? 0,
  };
}
