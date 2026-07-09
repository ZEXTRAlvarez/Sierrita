import { levelLabel } from './levelLabels.es';

describe('levelLabel', () => {
  it.each([
    [1, '⭐ Fácil'],
    [2, '⭐⭐ Normal'],
    [3, '⭐⭐⭐ Difícil'],
  ] as const)('maps level %i to %s', (level, expected) => {
    expect(levelLabel(level)).toBe(expected);
  });
});
