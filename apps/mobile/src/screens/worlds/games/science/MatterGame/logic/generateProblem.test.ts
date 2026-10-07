import { generateProblem } from './generateProblem';

describe('generateProblem', () => {
  it('never produces a transformation round when transformChance is 0', () => {
    for (let i = 0; i < 30; i++) {
      expect(generateProblem([1], 0).mode).toBe('item');
    }
  });

  it('always produces a transformation round when transformChance is 1', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem([1], 1);
      expect(p.mode).toBe('transformation');
      if (p.mode !== 'transformation') continue;
      expect(p.correctState).toBe(p.transformation.toState);
    }
  });

  it('uses the item state as the correct answer in item rounds', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem([1, 2], 0);
      if (p.mode !== 'item') continue;
      expect(p.correctState).toBe(p.item.state);
    }
  });

  it('produces both modes across enough rounds at a mid chance', () => {
    const modes = new Set(
      Array.from({ length: 30 }, () => generateProblem([1], 0.5).mode),
    );
    expect(modes.has('item')).toBe(true);
    expect(modes.has('transformation')).toBe(true);
  });
});
