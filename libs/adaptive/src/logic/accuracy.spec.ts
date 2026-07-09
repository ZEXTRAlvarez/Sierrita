import { accuracyPercent } from './accuracy';
import { createInitialDifficultyState } from './difficultyStateFactory';

describe('accuracyPercent', () => {
  it('returns 0 when there have been no attempts', () => {
    const state = createInitialDifficultyState('p1', 'counting');

    expect(accuracyPercent(state)).toBe(0);
  });

  it('computes the ratio of correct to total attempts', () => {
    const state = {
      ...createInitialDifficultyState('p1', 'counting'),
      totalAttempts: 4,
      totalCorrect: 3,
    };

    expect(accuracyPercent(state)).toBe(0.75);
  });

  it('returns 1 for a perfect record', () => {
    const state = {
      ...createInitialDifficultyState('p1', 'counting'),
      totalAttempts: 5,
      totalCorrect: 5,
    };

    expect(accuracyPercent(state)).toBe(1);
  });
});
