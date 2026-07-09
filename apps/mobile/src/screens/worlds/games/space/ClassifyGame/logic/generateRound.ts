import { CATEGORY_SETS } from '../data/categorySets';
import { shuffle } from './shuffle';

export interface Item {
  id: number;
  emoji: string;
  categoryIdx: number;
}

export interface Round {
  categories: { label: string }[];
  items: Item[];
}

/** Picks `categoryCount` categories for `attribute` and fills a shuffled item bank of ~itemCount items. */
export function generateRound(
  categoryCount: number,
  attribute: string,
  itemCount: number,
): Round {
  const sets = CATEGORY_SETS[attribute] ?? CATEGORY_SETS['color'];
  const picked = shuffle(sets).slice(0, Math.min(categoryCount, sets.length));

  const perCategory = Math.ceil(itemCount / picked.length);
  const items: Item[] = [];
  let id = 0;

  for (let ci = 0; ci < picked.length; ci++) {
    const pool = shuffle(picked[ci].items).slice(0, perCategory);
    for (const emoji of pool) {
      items.push({ id: id++, emoji, categoryIdx: ci });
    }
  }

  return {
    categories: picked.map((p) => ({ label: p.label })),
    items: shuffle(items),
  };
}
