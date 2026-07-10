import { generateRound } from './generateRound';
import { WEIGHT_ITEMS } from '../data/weightItems';

const weightOf = (emoji: string) => {
  const item = WEIGHT_ITEMS.find((i) => i.emoji === emoji);
  if (!item) throw new Error(`Unknown weight item: ${emoji}`);
  return item.weight;
};

describe('generateRound', () => {
  it('count mode: answer matches which side has more items of the same emoji', () => {
    for (let i = 0; i < 30; i++) {
      const round = generateRound('count');
      expect(round.left[0]).toBe(round.right[0]); // same item both sides
      if (round.answer === 'equal') {
        expect(round.left.length).toBe(round.right.length);
      } else if (round.answer === 'left') {
        expect(round.left.length).toBeGreaterThan(round.right.length);
      } else {
        expect(round.right.length).toBeGreaterThan(round.left.length);
      }
    }
  });

  it('weight mode: one item per side, answer matches the heavier one, never equal', () => {
    for (let i = 0; i < 30; i++) {
      const round = generateRound('weight');
      expect(round.left).toHaveLength(1);
      expect(round.right).toHaveLength(1);
      expect(round.answer).not.toBe('equal');

      const leftWeight = weightOf(round.left[0]);
      const rightWeight = weightOf(round.right[0]);
      if (round.answer === 'left') {
        expect(leftWeight).toBeGreaterThan(rightWeight);
      } else {
        expect(rightWeight).toBeGreaterThan(leftWeight);
      }
    }
  });

  it('sum mode: answer is consistent with the actual summed weight of each side', () => {
    for (let i = 0; i < 30; i++) {
      const round = generateRound('sum');
      const leftSum = round.left.reduce((s, e) => s + weightOf(e), 0);
      const rightSum = round.right.reduce((s, e) => s + weightOf(e), 0);

      if (round.answer === 'equal') {
        expect(leftSum).toBe(rightSum);
      } else if (round.answer === 'left') {
        expect(leftSum).toBeGreaterThan(rightSum);
      } else {
        expect(rightSum).toBeGreaterThan(leftSum);
      }

      // Stays within a small, renderable number of icons per side.
      expect(round.left.length).toBeLessThanOrEqual(5);
      expect(round.right.length).toBeLessThanOrEqual(5);
    }
  });
});
