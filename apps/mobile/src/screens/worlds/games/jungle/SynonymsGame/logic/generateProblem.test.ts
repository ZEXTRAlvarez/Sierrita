import { generateProblem } from './generateProblem';

describe('generateProblem', () => {
  it('produces exactly 4 unique options including the correct one', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem([1, 2, 3]);
      expect(p.options).toHaveLength(4);
      expect(new Set(p.options).size).toBe(4);
      expect(p.options).toContain(p.correct);
    }
  });

  it('uses the entry synonym as the correct answer in synonym mode', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem([1, 2, 3]);
      if (p.mode !== 'synonym') continue;
      expect(p.correct).toBe(p.entry.synonym);
    }
  });

  it('uses the entry antonym as the correct answer in antonym mode', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem([1, 2, 3]);
      if (p.mode !== 'antonym') continue;
      expect(p.correct).toBe(p.entry.antonym);
    }
  });

  it('produces both modes across enough rounds', () => {
    const modes = new Set(
      Array.from({ length: 30 }, () => generateProblem([1, 2, 3]).mode),
    );
    expect(modes.has('synonym')).toBe(true);
    expect(modes.has('antonym')).toBe(true);
  });

  it('only draws entries from the requested tier pool', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem([1]);
      expect(p.entry.tier).toBe(1);
    }
  });
});
