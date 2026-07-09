import { setupTestDatabase } from '../schema/__testing__/setupTestDatabase';
import { __setTestDatabase } from '../schema/getDatabase';
import { saveGameSession, getRecentSessions } from './gameSessionRepository';
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
