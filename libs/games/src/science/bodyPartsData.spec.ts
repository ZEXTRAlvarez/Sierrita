import { getBodyPart, getBodyPartDistractorPool } from './bodyPartsData';

describe('getBodyPart', () => {
  it('only returns parts within the requested tier pool', () => {
    for (let i = 0; i < 20; i++) {
      const p = getBodyPart([1]);
      expect(p.tier).toBe(1);
    }
  });

  it('can draw from a wider tier pool', () => {
    const tiers = new Set(
      Array.from({ length: 20 }, () => getBodyPart([1, 2]).tier),
    );
    for (const t of tiers) expect([1, 2]).toContain(t);
  });
});

describe('getBodyPartDistractorPool', () => {
  it('never includes the excluded part label', () => {
    const part = getBodyPart([1, 2, 3]);
    const pool = getBodyPartDistractorPool([1, 2, 3], part);

    expect(pool).not.toContain(part.label);
  });

  it('returns enough distractors to fill a 4-option round', () => {
    const part = getBodyPart([1]);
    const pool = getBodyPartDistractorPool([1], part);

    expect(pool.length).toBeGreaterThanOrEqual(3);
  });
});
