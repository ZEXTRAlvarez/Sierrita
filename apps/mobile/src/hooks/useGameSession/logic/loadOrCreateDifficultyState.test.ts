import { loadOrCreateDifficultyState } from './loadOrCreateDifficultyState';
import { getDifficultyState, upsertDifficultyState } from '@sierrita/storage';
import { createInitialDifficultyState } from '@sierrita/adaptive';

jest.mock('@sierrita/storage', () => ({
  getDifficultyState: jest.fn(),
  upsertDifficultyState: jest.fn(async () => undefined),
}));
jest.mock('@sierrita/adaptive', () => ({
  createInitialDifficultyState: jest.fn((profileId: string, gameId: string) => ({ profileId, gameId, currentLevel: 1 })),
}));

describe('loadOrCreateDifficultyState', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns the existing state without creating a new one', async () => {
    (getDifficultyState as jest.Mock).mockResolvedValue({ profileId: 'p1', gameId: 'tracing', currentLevel: 2 });

    const result = await loadOrCreateDifficultyState('p1', 'tracing');

    expect(result.currentLevel).toBe(2);
    expect(createInitialDifficultyState).not.toHaveBeenCalled();
    expect(upsertDifficultyState).not.toHaveBeenCalled();
  });

  it('seeds and persists a fresh state on first play', async () => {
    (getDifficultyState as jest.Mock).mockResolvedValue(null);

    const result = await loadOrCreateDifficultyState('p1', 'tracing');

    expect(result).toMatchObject({ profileId: 'p1', gameId: 'tracing', currentLevel: 1 });
    expect(upsertDifficultyState).toHaveBeenCalledWith(result);
  });
});
