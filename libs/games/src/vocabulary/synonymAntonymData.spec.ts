import {
  getDistractorPool,
  getSynonymAntonymEntry,
} from './synonymAntonymData';

describe('getSynonymAntonymEntry', () => {
  it('only returns entries within the requested tier pool', () => {
    for (let i = 0; i < 20; i++) {
      const e = getSynonymAntonymEntry([1]);
      expect(e.tier).toBe(1);
    }
  });

  it('can draw from a wider tier pool', () => {
    const tiers = new Set(
      Array.from({ length: 20 }, () => getSynonymAntonymEntry([1, 2]).tier),
    );
    for (const t of tiers) expect([1, 2]).toContain(t);
  });
});

describe('getDistractorPool', () => {
  it('never includes the correct synonym or antonym of the given entry', () => {
    const entry = getSynonymAntonymEntry([1, 2, 3]);
    const pool = getDistractorPool([1, 2, 3], entry);

    expect(pool).not.toContain(entry.synonym);
    expect(pool).not.toContain(entry.antonym);
  });

  it('returns enough distractors to fill a 4-option round', () => {
    const entry = getSynonymAntonymEntry([1]);
    const pool = getDistractorPool([1], entry);

    expect(pool.length).toBeGreaterThanOrEqual(3);
  });
});
