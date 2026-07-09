import { buildDeck } from './buildDeck';

describe('buildDeck', () => {
  it('builds two cards per pair, all starting face-down and unmatched', () => {
    const deck = buildDeck(4);

    expect(deck).toHaveLength(8);
    deck.forEach((card) => {
      expect(card.flipped).toBe(false);
      expect(card.matched).toBe(false);
    });
  });

  it('gives every card a unique id', () => {
    const deck = buildDeck(6);

    expect(new Set(deck.map((c) => c.id)).size).toBe(12);
  });

  it('pairs each emoji with exactly one other card of the same emoji', () => {
    const deck = buildDeck(5);

    const counts = new Map<string, number>();
    deck.forEach((c) => counts.set(c.emoji, (counts.get(c.emoji) ?? 0) + 1));

    expect(counts.size).toBe(5);
    counts.forEach((count) => expect(count).toBe(2));
  });

  it('never requests more pairs than the available emoji pool', () => {
    const deck = buildDeck(16);

    expect(deck).toHaveLength(32);
  });
});
