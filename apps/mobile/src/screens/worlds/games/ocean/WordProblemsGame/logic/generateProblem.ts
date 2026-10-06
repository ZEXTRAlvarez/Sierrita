import {
  getWordProblemTemplate,
  randomChildName,
  type WordProblemOperation,
  type WordProblemTemplate,
} from '@sierrita/games';
import { rand } from '../../../shared/rand';

export interface Problem {
  template: WordProblemTemplate;
  name: string;
  a: number;
  b: number;
  result: number;
}

/**
 * Builds a narrated word problem: picks a template for one of the allowed
 * operations and fills in operands that fit within the given bounds.
 * Multiplication operands are always kept small (a one-digit table) no
 * matter how large maxOperand is, since "3 cajas con 8 juguetes cada una" is
 * still readable at maxOperand=50.
 */
export function generateProblem(
  operations: WordProblemOperation[],
  maxOperand: number,
  resultMax: number,
): Problem {
  const template = getWordProblemTemplate(operations);
  const name = randomChildName();

  let a: number, b: number, result: number;
  if (template.operation === 'multiply') {
    const cap = Math.min(10, maxOperand);
    a = rand(2, cap);
    b = rand(2, cap);
    result = a * b;
  } else if (template.operation === 'sub') {
    a = rand(1, maxOperand);
    b = rand(1, a);
    result = a - b;
  } else {
    let tries = 0;
    do {
      tries++;
      a = rand(1, maxOperand);
      b = rand(1, maxOperand);
      result = a + b;
    } while (result > resultMax && tries < 10);
  }

  return { template, name, a, b, result };
}
