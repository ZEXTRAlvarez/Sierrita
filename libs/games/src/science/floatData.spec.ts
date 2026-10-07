import { getFloatItem } from './floatData';

describe('getFloatItem', () => {
  it('only returns items within the requested tier pool', () => {
    for (let i = 0; i < 20; i++) {
      const item = getFloatItem([1]);
      expect(item.tier).toBe(1);
    }
  });

  it('can draw both floating and sinking items across enough draws', () => {
    const outcomes = new Set(
      Array.from({ length: 30 }, () => getFloatItem([1, 2, 3]).floats),
    );
    expect(outcomes.has(true)).toBe(true);
    expect(outcomes.has(false)).toBe(true);
  });
});
