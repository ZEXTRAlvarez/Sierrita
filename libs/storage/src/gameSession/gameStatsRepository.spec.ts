import { setupTestDatabase } from '../schema/__testing__/setupTestDatabase';
import { __setTestDatabase } from '../schema/getDatabase';
import { getGameStats, getProfileStats } from './gameStatsRepository';
import { saveGameSession } from './gameSessionRepository';
import type { GameSummary } from '@sierrita/games';

const summary = (overrides: Partial<GameSummary> = {}): GameSummary => ({
  gameId: 'counting',
  world: 'ocean',
  totalRounds: 6,
  correctRounds: 5,
  scorePercent: 0.8,
  stars: 3,
  xpEarned: 40,
  durationSecs: 60,
  difficulty: 1,
  ...overrides,
});

beforeEach(async () => {
  __setTestDatabase(await setupTestDatabase());
});

afterEach(() => {
  __setTestDatabase(null);
});

describe('getGameStats', () => {
  it('groups multiple sessions of the same game into a single aggregated row', async () => {
    await saveGameSession('p1', summary({ scorePercent: 0.6, difficulty: 1 }));
    await saveGameSession('p1', summary({ scorePercent: 1.0, difficulty: 2 }));

    const stats = await getGameStats('p1');

    expect(stats).toHaveLength(1);
    expect(stats[0]).toMatchObject({
      gameId: 'counting',
      world: 'ocean',
      sessions: 2,
      avgScore: 80, // (60 + 100) / 2
      bestScore: 100,
      lastLevel: 2, // MAX(difficulty)
    });
  });

  it('keeps separate aggregated rows per game', async () => {
    await saveGameSession('p1', summary({ gameId: 'counting' }));
    await saveGameSession('p1', summary({ gameId: 'sums', world: 'ocean' }));

    const stats = await getGameStats('p1');

    expect(stats.map((s) => s.gameId).sort()).toEqual(['counting', 'sums']);
  });

  it('returns an empty array for a profile with no sessions', async () => {
    await expect(getGameStats('p1')).resolves.toEqual([]);
  });
});

describe('getProfileStats', () => {
  it('aggregates totals across all games for the profile', async () => {
    await saveGameSession(
      'p1',
      summary({ scorePercent: 0.5, durationSecs: 60 }),
    );
    await saveGameSession(
      'p1',
      summary({ scorePercent: 1.0, durationSecs: 120 }),
    );

    const stats = await getProfileStats('p1');

    expect(stats).toEqual({
      totalSessions: 2,
      totalMinutes: 3, // 180s / 60
      avgScore: 75, // (50 + 100) / 2
      bestScore: 100,
    });
  });

  it('coalesces SUM/AVG NULLs to 0 for a profile with zero sessions instead of NaN', async () => {
    const stats = await getProfileStats('brand-new-profile');

    expect(stats).toEqual({
      totalSessions: 0,
      totalMinutes: 0,
      avgScore: 0,
      bestScore: 0,
    });
  });
});
