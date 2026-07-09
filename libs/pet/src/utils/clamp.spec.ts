import { clamp } from './clamp';

describe('clamp', () => {
  it('returns the value unchanged when within bounds', () => {
    expect(clamp(50)).toBe(50);
  });

  it('clamps to the default minimum of 0', () => {
    expect(clamp(-10)).toBe(0);
  });

  it('clamps to the default maximum of 100', () => {
    expect(clamp(150)).toBe(100);
  });

  it('respects custom bounds', () => {
    expect(clamp(5, 10, 20)).toBe(10);
    expect(clamp(25, 10, 20)).toBe(20);
    expect(clamp(15, 10, 20)).toBe(15);
  });
});
