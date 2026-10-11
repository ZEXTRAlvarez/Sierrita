import { generateProblem } from './generateProblem';

describe('generateProblem', () => {
  it('generates a number within [10, maxNumber] whose digits recompose to it', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem(500);
      expect(p.number).toBeGreaterThanOrEqual(10);
      expect(p.number).toBeLessThanOrEqual(500);
      expect(
        p.thousands * 1000 + p.hundreds * 100 + p.tens * 10 + p.units,
      ).toBe(p.number);
    }
  });

  it('keeps recomposing correctly up to and including 1000', () => {
    for (let i = 0; i < 40; i++) {
      const p = generateProblem(1000);
      expect(p.number).toBeLessThanOrEqual(1000);
      expect(
        p.thousands * 1000 + p.hundreds * 100 + p.tens * 10 + p.units,
      ).toBe(p.number);
    }
  });
});
