import { rand } from './rand';

describe('rand', () => {
  it('never returns a value outside the inclusive [min, max] range', () => {
    for (let i = 0; i < 200; i++) {
      const n = rand(3, 7);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(7);
    }
  });

  it('returns the single value when min equals max', () => {
    expect(rand(5, 5)).toBe(5);
  });
});
