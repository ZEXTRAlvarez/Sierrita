export interface GameStat {
  gameId: string;
  world: string;
  sessions: number;
  avgScore: number;
  bestScore: number;
  totalMinutes: number;
  lastLevel: number;
}

export interface ProfileStats {
  totalSessions: number;
  totalMinutes: number;
  avgScore: number;
  bestScore: number;
}

export function rowToGameStat(row: Record<string, unknown>): GameStat {
  return {
    gameId: row.game_id as string,
    world: row.world as string,
    sessions: row.sessions as number,
    avgScore: row.avg_score as number,
    bestScore: row.best_score as number,
    totalMinutes: row.total_minutes as number,
    lastLevel: row.last_level as number,
  };
}

export function rowToProfileStats(
  row: Record<string, unknown> | null,
): ProfileStats {
  return {
    totalSessions: (row?.total_sessions as number) ?? 0,
    totalMinutes: Math.round(((row?.total_secs as number) ?? 0) / 60),
    avgScore: Math.round((row?.avg_score as number) ?? 0),
    bestScore: (row?.best_score as number) ?? 0,
  };
}
