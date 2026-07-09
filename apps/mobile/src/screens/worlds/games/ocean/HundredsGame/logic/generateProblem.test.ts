import { generateProblem } from './generateProblem';

describe('generateProblem', () => {
  it('generates a number within [10, maxNumber] whose digits recompose to it', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem(500);
      expect(p.number).toBeGreaterThanOrEqual(10);
      expect(p.number).toBeLessThanOrEqual(500);
      expect(p.hundreds * 100 + p.tens * 10 + p.units).toBe(p.number);
    }
  });
});
