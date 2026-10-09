import { generateProblem } from './generateProblem';

describe('generateProblem', () => {
  it('only draws items from the requested tier pool', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem([1]);
      expect(p.item.tier).toBe(1);
    }
  });
});
