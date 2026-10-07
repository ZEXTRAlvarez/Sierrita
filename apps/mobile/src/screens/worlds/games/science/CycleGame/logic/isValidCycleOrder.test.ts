import { isValidCycleOrder } from './isValidCycleOrder';

const CORRECT = ['A', 'B', 'C'];

describe('isValidCycleOrder', () => {
  it('accepts the exact order for a linear cycle', () => {
    expect(isValidCycleOrder(['A', 'B', 'C'], CORRECT, false)).toBe(true);
  });

  it('rejects a rotation for a linear cycle', () => {
    expect(isValidCycleOrder(['B', 'C', 'A'], CORRECT, false)).toBe(false);
  });

  it('accepts the exact order for a circular cycle', () => {
    expect(isValidCycleOrder(['A', 'B', 'C'], CORRECT, true)).toBe(true);
  });

  it('accepts any forward rotation for a circular cycle', () => {
    expect(isValidCycleOrder(['B', 'C', 'A'], CORRECT, true)).toBe(true);
    expect(isValidCycleOrder(['C', 'A', 'B'], CORRECT, true)).toBe(true);
  });

  it('rejects the reversed order for a circular cycle', () => {
    expect(isValidCycleOrder(['C', 'B', 'A'], CORRECT, true)).toBe(false);
  });

  it('rejects a different length', () => {
    expect(isValidCycleOrder(['A', 'B'], CORRECT, true)).toBe(false);
  });
});
