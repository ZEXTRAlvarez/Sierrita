import { rand } from '../../../shared/rand';
import { CATEGORIES, ATTRIBUTE_PAIRS } from '../data/itemPools';
import { shuffle } from './shuffle';

export type OddOneOutMode = 'category' | 'attribute';

export interface OddOneOutRound {
  items: string[]; // emoji, shuffled, includes the intruder
  intruder: string;
}

/**
 * Builds a round with `itemCount` emoji where all but one share a group —
 * either a broad category ('category' mode, easy/medium) or a shared
 * attribute within a single domain like "flies" / "lives in water"
 * ('attribute' mode, hard: the intruder no longer stands out by category).
 */
export function generateRound(
  itemCount: number,
  mode: OddOneOutMode,
): OddOneOutRound {
  if (mode === 'attribute') {
    const pair = ATTRIBUTE_PAIRS[rand(0, ATTRIBUTE_PAIRS.length - 1)];
    const [groupA, groupB] = Math.random() < 0.5 ? pair : [pair[1], pair[0]];
    const chosen = shuffle([...groupA]).slice(0, itemCount - 1);
    const intruder = shuffle([...groupB])[0];
    return { items: shuffle([...chosen, intruder]), intruder };
  }

  const names = Object.keys(CATEGORIES);
  const mainName = names[rand(0, names.length - 1)];
  let otherName = names[rand(0, names.length - 1)];
  while (otherName === mainName) {
    otherName = names[rand(0, names.length - 1)];
  }
  const chosen = shuffle([...CATEGORIES[mainName]]).slice(0, itemCount - 1);
  const intruder = shuffle([...CATEGORIES[otherName]])[0];
  return { items: shuffle([...chosen, intruder]), intruder };
}
