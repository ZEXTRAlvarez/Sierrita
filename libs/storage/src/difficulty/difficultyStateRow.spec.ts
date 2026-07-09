import { rowToDifficultyState } from './difficultyStateRow';

describe('rowToDifficultyState', () => {
  it('maps a raw SQLite row to a DifficultyState', () => {
    const row = {
      profile_id: 'p1',
      game_id: 'counting',
      current_level: 2,
      consecutive_hits: 1,
      consecutive_miss: 0,
      total_attempts: 10,
      total_correct: 8,
      updated_at: 1700000000,
    };

    expect(rowToDifficultyState(row)).toEqual({
      profileId: 'p1',
      gameId: 'counting',
      currentLevel: 2,
      consecutiveHits: 1,
      consecutiveMiss: 0,
      totalAttempts: 10,
      totalCorrect: 8,
      updatedAt: 1700000000,
    });
  });
});
