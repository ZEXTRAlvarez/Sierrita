import type { Fraction } from './fraction';
import { fractionLabel } from './fraction';

/**
 * 4 fraction-label choices for an "identify" round: the correct fraction plus
 * 3 others drawn from the same denominator pool (no numeric distractor
 * spread makes sense for fractions, so this samples real nearby fractions
 * instead).
 */
export function generateFractionOptions(
  correct: Fraction,
  denominators: number[],
): Fraction[] {
  const pool: Fraction[] = [];
  for (const denominator of denominators) {
    for (let numerator = 1; numerator < denominator; numerator++) {
      pool.push({ numerator, denominator });
    }
  }
  const correctLabel = fractionLabel(correct);
  const others = pool.filter((f) => fractionLabel(f) !== correctLabel);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const options = [correct, ...shuffled.slice(0, 3)];
  return options.sort(() => Math.random() - 0.5);
}
