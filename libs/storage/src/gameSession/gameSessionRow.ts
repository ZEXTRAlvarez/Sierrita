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

export function rowToGameSession(row: Record<string, unknown>): StoredGameSession {
  return {
    id: row.id as string,
    profileId: row.profile_id as string,
    world: row.world as string,
    gameId: row.game_id as string,
    score: row.score as number,
    maxScore: row.max_score as number,
    durationSecs: row.duration_secs as number,
    difficulty: row.difficulty as number,
    completed: Boolean(row.completed),
    playedAt: row.played_at as number,
  };
}
