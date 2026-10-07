import { getCycle, type Cycle } from '@sierrita/games';

export interface Problem {
  cycle: Cycle;
  shuffled: Cycle['stages'];
}

function shuffleStages(stages: Cycle['stages']): Cycle['stages'] {
  let shuffled: Cycle['stages'];
  do {
    shuffled = [...stages].sort(() => Math.random() - 0.5);
  } while (shuffled.every((s, i) => s.label === stages[i].label));
  return shuffled;
}

/** Builds a round: a random cycle within the length pool, with its stages shuffled for the child to reorder. */
export function generateProblem(lengths: number[]): Problem {
  const cycle = getCycle(lengths);
  return { cycle, shuffled: shuffleStages(cycle.stages) };
}
