import { generateRound } from './generateRound';

describe('generateRound', () => {
  it('picks the requested number of categories', () => {
    const round = generateRound(3, 'color', 6);

    expect(round.categories).toHaveLength(3);
  });

  it('caps categories to the number available for the attribute', () => {
    const round = generateRound(10, 'size', 6);

    expect(round.categories).toHaveLength(2); // 'size' only defines 2 categories
  });

  it('assigns every item a categoryIdx within range and gives each a unique id', () => {
    const round = generateRound(2, 'color', 6);

    const ids = round.items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    round.items.forEach((item) => {
      expect(item.categoryIdx).toBeGreaterThanOrEqual(0);
      expect(item.categoryIdx).toBeLessThan(round.categories.length);
    });
  });

  it('falls back to the color set for an unknown attribute', () => {
    const round = generateRound(2, 'unknown-attribute', 4);

    expect(round.categories).toHaveLength(2);
    expect(round.items.length).toBeGreaterThan(0);
  });
});
