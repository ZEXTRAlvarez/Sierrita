import { generateNumOptions } from './generateNumOptions';

describe('generateNumOptions', () => {
  it('always includes the correct number among 4 unique options', () => {
    const opts = generateNumOptions(347, 999);

    expect(opts).toHaveLength(4);
    expect(new Set(opts).size).toBe(4);
    expect(opts).toContain(347);
  });

  it('keeps every option within [0, max]', () => {
    const opts = generateNumOptions(120, 500);

    for (const n of opts) {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(500);
    }
  });
});
