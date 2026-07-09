import { rand } from '../../../shared/rand';

export type Operation = 'add' | 'sub';

export interface Problem {
  a: number;
  b: number;
  op: Operation;
  result: number;
}

/** Builds an addition/subtraction problem within the given operand and result bounds. */
export function generateProblem(maxOperand: number, operations: string[], resultMax: number): Problem {
  const ops = operations as Operation[];
  let a: number, b: number, op: Operation, result: number;
  let tries = 0;
  do {
    tries++;
    op = ops[Math.floor(Math.random() * ops.length)];
    a  = rand(1, maxOperand);
    b  = rand(1, maxOperand);
    if (op === 'sub') {
      if (a < b) [a, b] = [b, a];   // no negatives
      result = a - b;
    } else {
      result = a + b;
    }
  } while (result < 0 || result > resultMax || result === 0 && tries < 10);

  return { a, b, op, result };
}
