import { computeGameXp } from './gameXp';

describe('computeGameXp', () => {
  it('scales with difficulty at full score', () => {
    expect(computeGameXp(1, 1)).toBe(20);
    expect(computeGameXp(2, 1)).toBe(40);
    expect(computeGameXp(3, 1)).toBe(60);
  });

  it('scales with score percentage', () => {
    expect(computeGameXp(2, 0.5)).toBe(20);
  });

  it('rounds to the nearest integer', () => {
    expect(computeGameXp(1, 0.33)).toBe(Math.round(20 * 0.33));
  });

  it('returns 0 XP for a zero score', () => {
    expect(computeGameXp(3, 0)).toBe(0);
  });
});
