import { generateOptions } from './generateOptions';

describe('generateOptions', () => {
  it('always includes the correct answer among 4 unique options', () => {
    const opts = generateOptions(7, 10);

    expect(opts).toHaveLength(4);
    expect(new Set(opts).size).toBe(4);
    expect(opts).toContain(7);
  });

  it('keeps every option within [1, max]', () => {
    const opts = generateOptions(3, 10);

    for (const n of opts) {
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(10);
    }
  });

  it('falls back to filling nearby numbers when max is very small', () => {
    const opts = generateOptions(2, 4);

    expect(opts).toHaveLength(4);
    expect(new Set(opts)).toEqual(new Set([1, 2, 3, 4]));
  });
});
