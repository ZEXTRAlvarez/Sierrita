import { CARD_EMOJIS } from '../data/cardEmojis';

export interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

/** Builds a shuffled deck of `pairs` matched card pairs, each starting face-down. */
export function buildDeck(pairs: number): Card[] {
  const emojis = [...CARD_EMOJIS].sort(() => Math.random() - 0.5).slice(0, pairs);
  const cards: Card[] = [];
  let id = 0;
  for (const emoji of emojis) {
    cards.push({ id: id++, emoji, flipped: false, matched: false });
    cards.push({ id: id++, emoji, flipped: false, matched: false });
  }
  return cards.sort(() => Math.random() - 0.5);
}
