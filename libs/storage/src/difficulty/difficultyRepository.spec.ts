import { setupTestDatabase } from '../schema/__testing__/setupTestDatabase';
import { __setTestDatabase } from '../schema/getDatabase';
import { getDifficultyState, getAllDifficultyStates, upsertDifficultyState } from './difficultyRepository';
import type { DifficultyState } from '@sierrita/adaptive';

const state = (overrides: Partial<DifficultyState> = {}): DifficultyState => ({
  profileId: 'p1',
  gameId: 'counting',
  currentLevel: 1,
  consecutiveHits: 0,
  consecutiveMiss: 0,
  totalAttempts: 0,
  totalCorrect: 0,
  updatedAt: 1700000000,
  ...overrides,
});

beforeEach(async () => {
  __setTestDatabase(await setupTestDatabase());
});

afterEach(() => {
  __setTestDatabase(null);
});

describe('upsertDifficultyState / getDifficultyState', () => {
  it('inserts a new state keyed by (profileId, gameId)', async () => {
    await upsertDifficultyState(state());

    await expect(getDifficultyState('p1', 'counting')).resolves.toEqual(state());
  });

  it('updates on conflict for the same profile+game pair', async () => {
    await upsertDifficultyState(state({ currentLevel: 1 }));

    await upsertDifficultyState(state({ currentLevel: 2, totalAttempts: 5 }));

    await expect(getDifficultyState('p1', 'counting')).resolves.toEqual(
      state({ currentLevel: 2, totalAttempts: 5 }),
    );
  });

  it('keeps separate rows for different games under the same profile', async () => {
    await upsertDifficultyState(state({ gameId: 'counting', currentLevel: 1 }));
    await upsertDifficultyState(state({ gameId: 'sums', currentLevel: 3 }));

    await expect(getDifficultyState('p1', 'counting')).resolves.toMatchObject({ currentLevel: 1 });
    await expect(getDifficultyState('p1', 'sums')).resolves.toMatchObject({ currentLevel: 3 });
  });

  it('returns null when no state exists yet', async () => {
    await expect(getDifficultyState('p1', 'unknown')).resolves.toBeNull();
  });
});

describe('getAllDifficultyStates', () => {
  it('returns every game state for a profile', async () => {
    await upsertDifficultyState(state({ gameId: 'counting' }));
    await upsertDifficultyState(state({ gameId: 'sums' }));

    const all = await getAllDifficultyStates('p1');

    expect(all.map((s) => s.gameId).sort()).toEqual(['counting', 'sums']);
  });
});
