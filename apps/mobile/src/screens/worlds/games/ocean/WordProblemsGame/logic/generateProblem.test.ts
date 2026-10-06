import { generateProblem } from './generateProblem';

describe('generateProblem', () => {
  it('never produces a negative result for subtraction', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem(['sub'], 20, 20);
      expect(p.template.operation).toBe('sub');
      expect(p.a).toBeGreaterThanOrEqual(p.b);
      expect(p.result).toBeGreaterThanOrEqual(0);
      expect(p.result).toBe(p.a - p.b);
    }
  });

  it('computes addition correctly and keeps operands within maxOperand', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem(['add'], 10, 20);
      expect(p.template.operation).toBe('add');
      expect(p.a).toBeLessThanOrEqual(10);
      expect(p.b).toBeLessThanOrEqual(10);
      expect(p.result).toBe(p.a + p.b);
    }
  });

  it('keeps multiplication operands small even when maxOperand is large', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem(['multiply'], 50, 99);
      expect(p.template.operation).toBe('multiply');
      expect(p.a).toBeLessThanOrEqual(10);
      expect(p.b).toBeLessThanOrEqual(10);
      expect(p.result).toBe(p.a * p.b);
    }
  });

  it('only uses the requested operations', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem(['add', 'sub'], 20, 30);
      expect(['add', 'sub']).toContain(p.template.operation);
    }
  });

  it('includes the child name in the narrated text', () => {
    const p = generateProblem(['add'], 10, 20);
    expect(p.template.text(p.name, p.a, p.b)).toContain(p.name);
  });
});
