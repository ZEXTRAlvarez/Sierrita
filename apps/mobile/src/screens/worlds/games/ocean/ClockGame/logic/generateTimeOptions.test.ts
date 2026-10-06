import { generateTimeOptions } from './generateTimeOptions';
import { timeLabel } from './generateProblem';

describe('generateTimeOptions', () => {
  it('always includes the correct time among 4 unique labels', () => {
    const correct = { hour: 3, minute: 0 };
    const opts = generateTimeOptions(correct, [0, 30]);

    expect(opts).toHaveLength(4);
    const labels = opts.map(timeLabel);
    expect(new Set(labels).size).toBe(4);
    expect(labels).toContain('3:00');
  });

  it('only draws distractors from the given minute pool', () => {
    const correct = { hour: 7, minute: 15 };
    const opts = generateTimeOptions(correct, [0, 15, 30, 45]);

    for (const t of opts) {
      expect(t.hour).toBeGreaterThanOrEqual(1);
      expect(t.hour).toBeLessThanOrEqual(12);
      expect([0, 15, 30, 45]).toContain(t.minute);
    }
  });
});
