import { generateProblem } from './generateProblem';

describe('generateProblem', () => {
  it('keeps multiplication operands within range and computes the product correctly', () => {
    for (let i = 0; i < 40; i++) {
      const p = generateProblem(10);
      if (p.op !== 'multiply') continue;
      expect(p.a).toBeGreaterThanOrEqual(1);
      expect(p.a).toBeLessThanOrEqual(10);
      expect(p.b).toBeGreaterThanOrEqual(1);
      expect(p.b).toBeLessThanOrEqual(10);
      expect(p.result).toBe(p.a * p.b);
    }
  });

  it('never leaves a remainder for division, and computes the quotient correctly', () => {
    for (let i = 0; i < 40; i++) {
      const p = generateProblem(10);
      if (p.op !== 'divide') continue;
      expect(p.a % p.b).toBe(0);
      expect(p.result).toBe(p.a / p.b);
      expect(p.b).toBeGreaterThanOrEqual(2);
    }
  });

  it('keeps the table within [1, maxTable] for multiplication', () => {
    for (let i = 0; i < 40; i++) {
      const p = generateProblem(5);
      if (p.op !== 'multiply') continue;
      expect(p.a).toBeLessThanOrEqual(5);
    }
  });

  it('keeps the divisor within [2, maxTable] for division', () => {
    for (let i = 0; i < 40; i++) {
      const p = generateProblem(5);
      if (p.op !== 'divide') continue;
      expect(p.b).toBeLessThanOrEqual(5);
      expect(p.b).toBeGreaterThanOrEqual(2);
    }
  });

  it('produces both operations across enough rounds', () => {
    const ops = new Set(
      Array.from({ length: 30 }, () => generateProblem(10).op),
    );
    expect(ops.has('multiply')).toBe(true);
    expect(ops.has('divide')).toBe(true);
  });
});
