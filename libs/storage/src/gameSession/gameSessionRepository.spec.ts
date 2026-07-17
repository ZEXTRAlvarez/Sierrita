import { setupTestDatabase } from '../schema/__testing__/setupTestDatabase';
import { __setTestDatabase, getDatabase } from '../schema/getDatabase';
import {
  saveGameSession,
  getRecentSessions,
  countSessionsSince,
} from './gameSessionRepository';
import type { GameSummary } from '@sierrita/games';

const summary = (overrides: Partial<GameSummary> = {}): GameSummary => ({
  gameId: 'counting',
  world: 'ocean',
  totalRounds: 6,
  correctRounds: 5,
  scorePercent: 0.83,
  stars: 3,
  xpEarned: 40,
  durationSecs: 90,
  difficulty: 2,
  ...overrides,
});

beforeEach(async () => {
  __setTestDatabase(await setupTestDatabase());
});

afterEach(() => {
  __setTestDatabase(null);
});

describe('saveGameSession / getRecentSessions', () => {
  it('persists a session derived from the game summary', async () => {
    await saveGameSession('p1', summary());

    const sessions = await getRecentSessions('p1');

    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({
      profileId: 'p1',
      world: 'ocean',
      gameId: 'counting',
      score: 83, // scorePercent * 100, rounded
      maxScore: 100,
      durationSecs: 90,
      difficulty: 2,
      completed: true,
    });
  });

  it('orders sessions most-recent-first and respects the limit', async () => {
    for (let i = 0; i < 3; i++) {
      await saveGameSession('p1', summary());
    }

    const sessions = await getRecentSessions('p1', 2);

    expect(sessions).toHaveLength(2);
  });

  it('only returns sessions for the requested profile', async () => {
    await saveGameSession('p1', summary());
    await saveGameSession('p2', summary());

    const sessions = await getRecentSessions('p1');

    expect(sessions.every((s) => s.profileId === 'p1')).toBe(true);
  });
});

describe('countSessionsSince', () => {
  async function insertAt(id: string, profileId: string, playedAt: number) {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO game_sessions (id, profile_id, world, game_id, played_at)
       VALUES (?, ?, 'ocean', 'counting', ?)`,
      [id, profileId, playedAt],
    );
  }

  it('counts only sessions played at or after the given timestamp', async () => {
    await insertAt('gs1', 'p1', 1000);
    await insertAt('gs2', 'p1', 2000);
    await insertAt('gs3', 'p1', 3000);

    await expect(countSessionsSince('p1', 2000)).resolves.toBe(2);
  });

  it('only counts sessions for the requested profile', async () => {
    await insertAt('gs1', 'p1', 1000);
    await insertAt('gs2', 'p2', 1000);

    await expect(countSessionsSince('p1', 0)).resolves.toBe(1);
  });

  it('returns 0 when there are no matching sessions', async () => {
    await expect(countSessionsSince('p1', 0)).resolves.toBe(0);
  });
});
