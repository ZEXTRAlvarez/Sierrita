import { generateProblem } from './generateProblem';

describe('generateProblem', () => {
  it('keeps identify rounds within the denominator pool and shaded < parts', () => {
    for (let i = 0; i < 40; i++) {
      const p = generateProblem([2, 3, 4]);
      if (p.mode !== 'identify') continue;
      expect([2, 3, 4]).toContain(p.parts);
      expect(p.shaded).toBeGreaterThanOrEqual(1);
      expect(p.shaded).toBeLessThan(p.parts);
    }
  });

  it('keeps form rounds within the denominator pool and target < parts', () => {
    for (let i = 0; i < 40; i++) {
      const p = generateProblem([2, 3, 4]);
      if (p.mode !== 'form') continue;
      expect([2, 3, 4]).toContain(p.parts);
      expect(p.target).toBeGreaterThanOrEqual(1);
      expect(p.target).toBeLessThan(p.parts);
    }
  });

  it('never produces a compare round when compareChance is 0', () => {
    for (let i = 0; i < 40; i++) {
      const p = generateProblem([2, 4], 0);
      expect(p.mode).not.toBe('compare');
    }
  });

  it('produces compare rounds with two fractions of different value when compareChance is 1', () => {
    for (let i = 0; i < 40; i++) {
      const p = generateProblem([2, 3, 4, 8], 1);
      expect(p.mode).toBe('compare');
      if (p.mode !== 'compare') continue;
      expect(p.a.numerator / p.a.denominator).not.toBe(
        p.b.numerator / p.b.denominator,
      );
    }
  });

  it('produces both identify and form modes across enough rounds', () => {
    const modes = new Set(
      Array.from({ length: 30 }, () => generateProblem([2, 4]).mode),
    );
    expect(modes.has('identify')).toBe(true);
    expect(modes.has('form')).toBe(true);
  });
});
