import { generateProblem } from './generateProblem';

describe('generateProblem', () => {
  it('shuffles the stages into a different order than the original cycle', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem([3, 4, 5]);
      const shuffledLabels = p.shuffled.map((s) => s.label).join('');
      const originalLabels = p.cycle.stages.map((s) => s.label).join('');
      expect(shuffledLabels).not.toBe(originalLabels);
    }
  });

  it('only draws cycles within the requested length pool', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem([3]);
      expect(p.cycle.stages).toHaveLength(3);
    }
  });
});
