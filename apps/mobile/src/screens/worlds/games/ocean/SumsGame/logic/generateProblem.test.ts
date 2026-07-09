import { generateProblem } from './generateProblem';

describe('generateProblem', () => {
  it('never produces a negative result for subtraction, and orders operands so a >= b', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem(10, ['sub'], 10);
      expect(p.op).toBe('sub');
      expect(p.a).toBeGreaterThanOrEqual(p.b);
      expect(p.result).toBeGreaterThanOrEqual(0);
      expect(p.result).toBe(p.a - p.b);
    }
  });

  it('keeps operands within [1, maxOperand] and result within [0, resultMax]', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem(6, ['add'], 8);
      expect(p.a).toBeGreaterThanOrEqual(1);
      expect(p.a).toBeLessThanOrEqual(6);
      expect(p.b).toBeGreaterThanOrEqual(1);
      expect(p.b).toBeLessThanOrEqual(6);
      expect(p.result).toBeLessThanOrEqual(8);
    }
  });

  it('only uses the requested operation and computes it correctly', () => {
    const p = generateProblem(10, ['add'], 20);
    expect(p.op).toBe('add');
    expect(p.result).toBe(p.a + p.b);
  });
});
