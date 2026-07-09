import { createInitialDifficultyState } from './difficultyStateFactory';

describe('createInitialDifficultyState', () => {
  it('starts at level 1 with zeroed counters', () => {
    const state = createInitialDifficultyState('p1', 'counting');

    expect(state.profileId).toBe('p1');
    expect(state.gameId).toBe('counting');
    expect(state.currentLevel).toBe(1);
    expect(state.consecutiveHits).toBe(0);
    expect(state.consecutiveMiss).toBe(0);
    expect(state.totalAttempts).toBe(0);
    expect(state.totalCorrect).toBe(0);
  });
});
