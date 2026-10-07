import { generateProblem } from './generateProblem';

describe('generateProblem', () => {
  it('produces exactly 4 unique options including the target label', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem([1, 2, 3]);
      expect(p.options).toHaveLength(4);
      expect(new Set(p.options).size).toBe(4);
      expect(p.options).toContain(p.part.label);
    }
  });

  it('only draws parts from the requested tier pool', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem([1]);
      expect(p.part.tier).toBe(1);
    }
  });
});
