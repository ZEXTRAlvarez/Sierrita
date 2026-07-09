import { generateProblem, getSymbol } from './generateProblem';

describe('getSymbol', () => {
  it('returns > when a is greater, < when smaller, = when equal', () => {
    expect(getSymbol(5, 2)).toBe('>');
    expect(getSymbol(2, 5)).toBe('<');
    expect(getSymbol(3, 3)).toBe('=');
  });
});

describe('generateProblem', () => {
  it('keeps visual mode numbers within [1, min(10, maxNumber)] and answer consistent', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem(20, 'visual');
      expect(p.left).toBeGreaterThanOrEqual(1);
      expect(p.left).toBeLessThanOrEqual(10);
      expect(p.right).toBeGreaterThanOrEqual(1);
      expect(p.right).toBeLessThanOrEqual(10);
      expect(p.answer).toBe(getSymbol(p.left, p.right));
    }
  });

  it('keeps number mode within [1, maxNumber]', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem(15, 'number');
      expect(p.left).toBeGreaterThanOrEqual(1);
      expect(p.left).toBeLessThanOrEqual(15);
      expect(p.right).toBeGreaterThanOrEqual(1);
      expect(p.right).toBeLessThanOrEqual(15);
    }
  });

  it('keeps expression mode left/right within bounds', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem(40, 'expression');
      expect(p.left).toBeGreaterThanOrEqual(2);
      expect(p.right).toBeGreaterThanOrEqual(1);
      expect(p.right).toBeLessThanOrEqual(40);
    }
  });
});
