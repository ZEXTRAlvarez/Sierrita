import { rowToGameStat, rowToProfileStats } from './gameStatsRow';

describe('rowToGameStat', () => {
  it('maps a raw aggregation row', () => {
    const row = {
      game_id: 'counting',
      world: 'ocean',
      sessions: 4,
      avg_score: 75,
      best_score: 100,
      total_minutes: 12,
      last_level: 2,
    };

    expect(rowToGameStat(row)).toEqual({
      gameId: 'counting',
      world: 'ocean',
      sessions: 4,
      avgScore: 75,
      bestScore: 100,
      totalMinutes: 12,
      lastLevel: 2,
    });
  });
});

describe('rowToProfileStats', () => {
  it('maps a populated aggregation row, converting seconds to minutes', () => {
    const row = {
      total_sessions: 10,
      total_secs: 600,
      avg_score: 82.4,
      best_score: 100,
    };

    expect(rowToProfileStats(row)).toEqual({
      totalSessions: 10,
      totalMinutes: 10,
      avgScore: 82,
      bestScore: 100,
    });
  });

  it('coalesces NULL aggregates (no sessions yet) to zero instead of NaN', () => {
    const row = {
      total_sessions: 0,
      total_secs: null,
      avg_score: null,
      best_score: null,
    };

    expect(rowToProfileStats(row)).toEqual({
      totalSessions: 0,
      totalMinutes: 0,
      avgScore: 0,
      bestScore: 0,
    });
  });

  it('handles a null row entirely', () => {
    expect(rowToProfileStats(null)).toEqual({
      totalSessions: 0,
      totalMinutes: 0,
      avgScore: 0,
      bestScore: 0,
    });
  });
});
