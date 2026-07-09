import { rowToGameSession } from './gameSessionRow';

describe('rowToGameSession', () => {
  it('maps a raw SQLite row, coercing completed to a boolean', () => {
    const row = {
      id: 'gs_1',
      profile_id: 'p1',
      world: 'ocean',
      game_id: 'counting',
      score: 80,
      max_score: 100,
      duration_secs: 120,
      difficulty: 2,
      completed: 1,
      played_at: 1700000000,
    };

    expect(rowToGameSession(row)).toEqual({
      id: 'gs_1',
      profileId: 'p1',
      world: 'ocean',
      gameId: 'counting',
      score: 80,
      maxScore: 100,
      durationSecs: 120,
      difficulty: 2,
      completed: true,
      playedAt: 1700000000,
    });
  });

  it('maps completed=0 to false', () => {
    expect(rowToGameSession({ completed: 0 } as never).completed).toBe(false);
  });
});
