import { rand } from '../../../shared/rand';
import type { Fraction } from './fraction';
import { fractionsEqual } from './fraction';

export type FractionMode = 'identify' | 'form' | 'compare';

export interface IdentifyProblem {
  mode: 'identify';
  parts: number;
  shaded: number;
}

export interface FormProblem {
  mode: 'form';
  parts: number;
  target: number;
}

export interface CompareProblem {
  mode: 'compare';
  a: Fraction;
  b: Fraction;
}

export type Problem = IdentifyProblem | FormProblem | CompareProblem;

function randomFraction(denominators: number[]): Fraction {
  const denominator = denominators[rand(0, denominators.length - 1)];
  const numerator = rand(1, denominator - 1);
  return { numerator, denominator };
}

/**
 * Builds a fraction round: "identify" (read a shaded figure) or "form" (shade
 * the requested amount) by default, or — once `compareChance` allows it, from
 * level 3 on — "compare" which of two shaded figures is the bigger fraction.
 */
export function generateProblem(
  denominators: number[],
  compareChance = 0,
): Problem {
  if (Math.random() < compareChance) {
    let a: Fraction, b: Fraction;
    do {
      a = randomFraction(denominators);
      b = randomFraction(denominators);
    } while (fractionsEqual(a, b));
    return { mode: 'compare', a, b };
  }

  const { numerator, denominator } = randomFraction(denominators);
  if (Math.random() < 0.5) {
    return { mode: 'identify', parts: denominator, shaded: numerator };
  }
  return { mode: 'form', parts: denominator, target: numerator };
}
