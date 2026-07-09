import { generateDigitOptions } from './generateDigitOptions';

describe('generateDigitOptions', () => {
  it('always includes the correct digit among 4 unique options in [0, 9]', () => {
    const opts = generateDigitOptions(7);

    expect(opts).toHaveLength(4);
    expect(new Set(opts).size).toBe(4);
    expect(opts).toContain(7);
    for (const n of opts) {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(9);
    }
  });
});
