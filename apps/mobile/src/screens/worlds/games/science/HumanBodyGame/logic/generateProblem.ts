import {
  getBodyPart,
  getBodyPartDistractorPool,
  type BodyPart,
} from '@sierrita/games';

export interface Problem {
  part: BodyPart;
  options: string[];
}

/** Builds a round: a random body part/organ within the tier pool, plus 3 distractor labels from the same pool. */
export function generateProblem(tiers: number[]): Problem {
  const part = getBodyPart(tiers);
  const distractorPool = getBodyPartDistractorPool(tiers, part);
  const shuffled = [...distractorPool].sort(() => Math.random() - 0.5);
  const options = [part.label, ...shuffled.slice(0, 3)].sort(
    () => Math.random() - 0.5,
  );
  return { part, options };
}
