import { shuffle } from './shuffle';

describe('shuffle', () => {
  it('keeps every element and leaves the original array untouched', () => {
    const original = [1, 2, 3, 4, 5];

    const shuffled = shuffle(original);

    expect(shuffled).toHaveLength(5);
    expect([...shuffled].sort()).toEqual(original);
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });

  it('does not leave the first element parked in the first slot', () => {
    let moved = 0;
    for (let i = 0; i < 400; i++) {
      if (shuffle([1, 2, 3, 4])[0] !== 1) moved++;
    }

    // 3 out of 4 orders move it, so ~300 of 400; a biased shuffle scores far less.
    expect(moved).toBeGreaterThan(230);
  });
});
