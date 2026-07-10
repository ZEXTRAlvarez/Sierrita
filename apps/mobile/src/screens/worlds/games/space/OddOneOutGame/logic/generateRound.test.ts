import { generateRound } from './generateRound';

describe('generateRound', () => {
  it('produces the requested number of items, including the intruder', () => {
    const round = generateRound(4, 'category');

    expect(round.items).toHaveLength(4);
    expect(round.items).toContain(round.intruder);
  });

  it('produces unique items', () => {
    const round = generateRound(5, 'category');

    expect(new Set(round.items).size).toBe(5);
  });

  it('works in attribute mode, keeping the intruder from the opposite group', () => {
    const round = generateRound(5, 'attribute');

    expect(round.items).toHaveLength(5);
    expect(new Set(round.items).size).toBe(5);
    expect(round.items).toContain(round.intruder);
  });

  it('varies the group order across many rounds instead of always picking the same intruder', () => {
    const intruders = new Set<string>();
    for (let i = 0; i < 30; i++) {
      intruders.add(generateRound(4, 'category').intruder);
    }

    expect(intruders.size).toBeGreaterThan(1);
  });
});
