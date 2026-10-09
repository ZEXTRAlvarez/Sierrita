import { getFloatItem, type FloatItem } from '@sierrita/games';

export interface Problem {
  item: FloatItem;
}

/** Builds a round: a random object within the tier pool, with its real floats/sinks outcome. */
export function generateProblem(tiers: number[]): Problem {
  return { item: getFloatItem(tiers) };
}
