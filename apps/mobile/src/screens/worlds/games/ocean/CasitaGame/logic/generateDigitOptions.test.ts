import { generateDigitOptions } from './generateDigitOptions';

describe('generateDigitOptions', () => {
  it('always includes the correct digit', () => {
    for (let i = 0; i < 20; i++) {
      const opts = generateDigitOptions(i % 10);
      expect(opts).toContain(i % 10);
    }
  });

  it('returns exactly 4 unique digits within [0, 9]', () => {
    const opts = generateDigitOptions(5);
    expect(opts).toHaveLength(4);
    expect(new Set(opts).size).toBe(4);
    for (const d of opts) {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(9);
    }
  });
});
