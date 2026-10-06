import { generateOptions } from './generateOptions';

describe('generateOptions', () => {
  it('always includes the correct result among 4 unique options', () => {
    const opts = generateOptions(14, 30);

    expect(opts).toHaveLength(4);
    expect(new Set(opts).size).toBe(4);
    expect(opts).toContain(14);
  });

  it('keeps every option within [0, max]', () => {
    const opts = generateOptions(6, 10);

    for (const n of opts) {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(10);
    }
  });
});
