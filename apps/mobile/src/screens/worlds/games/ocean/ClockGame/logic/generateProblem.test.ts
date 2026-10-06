import { generateProblem, timeLabel } from './generateProblem';

describe('generateProblem', () => {
  it('keeps the hour within [1, 12] and the minute within the given pool', () => {
    for (let i = 0; i < 40; i++) {
      const p = generateProblem([0, 15, 30, 45]);
      expect(p.hour).toBeGreaterThanOrEqual(1);
      expect(p.hour).toBeLessThanOrEqual(12);
      expect([0, 15, 30, 45]).toContain(p.minute);
    }
  });

  it('produces both identify and set modes across enough rounds', () => {
    const modes = new Set(
      Array.from({ length: 30 }, () => generateProblem([0]).mode),
    );
    expect(modes.has('identify')).toBe(true);
    expect(modes.has('set')).toBe(true);
  });
});

describe('timeLabel', () => {
  it('pads single-digit minutes with a leading zero', () => {
    expect(timeLabel({ hour: 3, minute: 5 })).toBe('3:05');
  });

  it('does not pad the hour', () => {
    expect(timeLabel({ hour: 12, minute: 30 })).toBe('12:30');
  });
});
