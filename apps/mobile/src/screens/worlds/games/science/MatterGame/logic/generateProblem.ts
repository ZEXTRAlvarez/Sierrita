import {
  getMatterItem,
  getMatterTransformation,
  type MatterItem,
  type MatterState,
  type MatterTransformation,
} from '@sierrita/games';

export interface ItemProblem {
  mode: 'item';
  item: MatterItem;
  correctState: MatterState;
}

export interface TransformationProblem {
  mode: 'transformation';
  transformation: MatterTransformation;
  correctState: MatterState;
}

export type Problem = ItemProblem | TransformationProblem;

/**
 * Builds a round: classify a matter item by its state, or — once
 * transformChance allows it — classify the resulting state of a state-change
 * scenario (the correct answer is the resulting state, not the starting one).
 */
export function generateProblem(
  tiers: number[],
  transformChance: number,
): Problem {
  if (Math.random() < transformChance) {
    const transformation = getMatterTransformation();
    return {
      mode: 'transformation',
      transformation,
      correctState: transformation.toState,
    };
  }
  const item = getMatterItem(tiers);
  return { mode: 'item', item, correctState: item.state };
}
