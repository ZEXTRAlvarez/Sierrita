import { generateProblem } from './generateProblem';

describe('generateProblem', () => {
  it('shuffles the links into a different order than the original chain', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem([3, 4, 5]);
      const shuffledLabels = p.shuffled.map((l) => l.label).join('');
      const originalLabels = p.chain.links.map((l) => l.label).join('');
      expect(shuffledLabels).not.toBe(originalLabels);
    }
  });

  it('keeps the same set of links, just reordered', () => {
    const byLabel = (a: { label: string }, b: { label: string }) =>
      a.label < b.label ? -1 : 1;
    const p = generateProblem([3]);

    expect([...p.shuffled].sort(byLabel)).toEqual(
      [...p.chain.links].sort(byLabel),
    );
  });

  it('only draws chains within the requested length pool', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem([3]);
      expect(p.chain.links).toHaveLength(3);
    }
  });
});
