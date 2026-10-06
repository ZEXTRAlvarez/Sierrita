import { rand } from '../../../shared/rand';

export type Operation = 'multiply' | 'divide';

export interface Problem {
  op: Operation;
  a: number;
  b: number;
  result: number;
}

/**
 * Builds a multiplication or division problem within the given table range.
 * Division always divides exactly (no remainder): the dividend is built from
 * a divisor × quotient pair so it never needs one.
 */
export function generateProblem(maxTable: number): Problem {
  const op: Operation = Math.random() < 0.5 ? 'multiply' : 'divide';

  if (op === 'multiply') {
    const a = rand(1, maxTable);
    const b = rand(1, 10);
    return { op, a, b, result: a * b };
  }

  const divisor = rand(2, maxTable);
  const quotient = rand(1, 10);
  return { op, a: divisor * quotient, b: divisor, result: quotient };
}
