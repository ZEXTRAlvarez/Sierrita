import { generateProblem } from './generateProblem';

describe('generateProblem', () => {
  it('never produces a sentence round when sentenceChance is 0', () => {
    for (let i = 0; i < 30; i++) {
      expect(generateProblem(0).mode).toBe('word');
    }
  });

  it('always produces a sentence round when sentenceChance is 1', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem(1);
      expect(p.mode).toBe('sentence');
      if (p.mode !== 'sentence') continue;
      expect(p.targetIndex).toBeGreaterThanOrEqual(0);
      expect(p.targetIndex).toBeLessThan(p.words.length);
    }
  });

  it('produces both modes across enough rounds at a mid chance', () => {
    const modes = new Set(
      Array.from({ length: 30 }, () => generateProblem(0.5).mode),
    );
    expect(modes.has('word')).toBe(true);
    expect(modes.has('sentence')).toBe(true);
  });

  it('always has a valid correctClass', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem(0.5);
      expect(['noun', 'verb', 'adjective']).toContain(p.correctClass);
    }
  });
});
