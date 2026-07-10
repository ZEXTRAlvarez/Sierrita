import { rand } from '../../../shared/rand';
import { WEIGHT_ITEMS, LIGHT_ITEMS, HEAVY_ITEMS } from '../data/weightItems';

export type BalanceMode = 'count' | 'weight' | 'sum';
export type BalanceAnswer = 'left' | 'right' | 'equal';

export interface BalanceRound {
  left: string[];
  right: string[];
  answer: BalanceAnswer;
}

function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)];
}

/**
 * Builds a balance-scale round for one of three difficulty modes:
 * - 'count': same item both sides, different quantities — pure counting.
 * - 'weight': one item per side, different intrinsic weight — size intuition.
 * - 'sum': several light items vs. a couple heavy ones — counting alone
 *   isn't enough, the two sides have to actually be weighed against each other.
 */
export function generateRound(mode: BalanceMode): BalanceRound {
  if (mode === 'weight') {
    const a = pick(WEIGHT_ITEMS);
    let b = pick(WEIGHT_ITEMS);
    while (b.weight === a.weight) b = pick(WEIGHT_ITEMS);
    const answer: BalanceAnswer = a.weight > b.weight ? 'left' : 'right';
    return { left: [a.emoji], right: [b.emoji], answer };
  }

  if (mode === 'sum') {
    const light = pick(LIGHT_ITEMS);
    const heavy = pick(HEAVY_ITEMS);
    const lightCount = rand(2, 5);
    const heavyCount = rand(1, 2);
    const lightOnLeft = Math.random() < 0.5;

    const leftSum = lightOnLeft
      ? light.weight * lightCount
      : heavy.weight * heavyCount;
    const rightSum = lightOnLeft
      ? heavy.weight * heavyCount
      : light.weight * lightCount;
    const answer: BalanceAnswer =
      leftSum === rightSum ? 'equal' : leftSum > rightSum ? 'left' : 'right';

    return {
      left: Array(lightOnLeft ? lightCount : heavyCount).fill(
        lightOnLeft ? light.emoji : heavy.emoji,
      ),
      right: Array(lightOnLeft ? heavyCount : lightCount).fill(
        lightOnLeft ? heavy.emoji : light.emoji,
      ),
      answer,
    };
  }

  // mode === 'count'
  const item = pick(WEIGHT_ITEMS);
  const leftCount = rand(1, 4);
  let rightCount = rand(1, 4);
  if (Math.random() < 0.25) {
    rightCount = leftCount;
  } else if (leftCount === rightCount) {
    rightCount = leftCount === 4 ? leftCount - 1 : leftCount + 1;
  }
  const answer: BalanceAnswer =
    leftCount === rightCount
      ? 'equal'
      : leftCount > rightCount
        ? 'left'
        : 'right';

  return {
    left: Array(leftCount).fill(item.emoji),
    right: Array(rightCount).fill(item.emoji),
    answer,
  };
}
