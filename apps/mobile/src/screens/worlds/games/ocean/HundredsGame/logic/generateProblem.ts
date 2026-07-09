import { rand } from '../../../shared/rand';
import { decompose } from './decompose';

export interface Problem {
  number: number;
  hundreds: number;
  tens: number;
  units: number;
}

/** Random number in [10, maxNumber] plus its hundreds/tens/units breakdown. */
export function generateProblem(maxNumber: number): Problem {
  const n = rand(10, maxNumber);
  return { number: n, ...decompose(n) };
}
