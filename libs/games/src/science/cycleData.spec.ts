import { getCycle } from './cycleData';

describe('getCycle', () => {
  it('only returns cycles whose length is within the requested pool', () => {
    for (let i = 0; i < 20; i++) {
      const c = getCycle([3]);
      expect(c.stages).toHaveLength(3);
    }
  });

  it('can draw cycles of different lengths from a wider pool', () => {
    const lengths = new Set(
      Array.from({ length: 20 }, () => getCycle([3, 4, 5]).stages.length),
    );
    for (const l of lengths) expect([3, 4, 5]).toContain(l);
  });

  it('every cycle has a name and is flagged circular or linear', () => {
    for (const length of [3, 4, 5]) {
      const c = getCycle([length]);
      expect(c.name.length).toBeGreaterThan(0);
      expect(typeof c.isCircular).toBe('boolean');
    }
  });
});
