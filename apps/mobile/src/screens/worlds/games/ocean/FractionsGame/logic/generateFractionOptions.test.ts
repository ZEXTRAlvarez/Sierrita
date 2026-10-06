import { generateFractionOptions } from './generateFractionOptions';
import { fractionLabel } from './fraction';

describe('generateFractionOptions', () => {
  it('always includes the correct fraction among 4 unique labels', () => {
    const correct = { numerator: 1, denominator: 2 };
    const opts = generateFractionOptions(correct, [2, 4]);

    expect(opts).toHaveLength(4);
    const labels = opts.map(fractionLabel);
    expect(new Set(labels).size).toBe(4);
    expect(labels).toContain('1/2');
  });

  it('only draws distractors from the given denominator pool', () => {
    const correct = { numerator: 1, denominator: 3 };
    const opts = generateFractionOptions(correct, [2, 3, 4]);

    for (const f of opts) {
      expect([2, 3, 4]).toContain(f.denominator);
      expect(f.numerator).toBeGreaterThanOrEqual(1);
      expect(f.numerator).toBeLessThan(f.denominator);
    }
  });
});
