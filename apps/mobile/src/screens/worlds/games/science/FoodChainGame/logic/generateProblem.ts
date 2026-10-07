import { getFoodChain, type FoodChain } from '@sierrita/games';

export interface Problem {
  chain: FoodChain;
  shuffled: FoodChain['links'];
}

function shuffleLinks(links: FoodChain['links']): FoodChain['links'] {
  let shuffled: FoodChain['links'];
  do {
    shuffled = [...links].sort(() => Math.random() - 0.5);
  } while (shuffled.every((l, i) => l.label === links[i].label));
  return shuffled;
}

/** Builds a round: a random food chain within the length pool, with its links shuffled for the child to reorder. */
export function generateProblem(lengths: number[]): Problem {
  const chain = getFoodChain(lengths);
  return { chain, shuffled: shuffleLinks(chain.links) };
}
