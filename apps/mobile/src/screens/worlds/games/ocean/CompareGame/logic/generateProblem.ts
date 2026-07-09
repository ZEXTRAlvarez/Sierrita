import { rand } from '../../../shared/rand';

export type Mode = 'visual' | 'number' | 'expression';
export type ComparisonSymbol = '>' | '<' | '=';

export interface Problem {
  left: number;
  right: number;
  answer: ComparisonSymbol;
}

/** `>`, `<` or `=` for comparing a and b. */
export function getSymbol(a: number, b: number): ComparisonSymbol {
  if (a > b) return '>';
  if (a < b) return '<';
  return '=';
}

/** Builds a left/right comparison problem sized appropriately for the requested mode. */
export function generateProblem(maxNumber: number, mode: Mode): Problem {
  let left: number, right: number;

  if (mode === 'visual') {
    // Small numbers for visual counting
    left  = rand(1, Math.min(10, maxNumber));
    right = rand(1, Math.min(10, maxNumber));
  } else if (mode === 'expression') {
    // A = a+b, B = c (or d+e)
    const a = rand(1, Math.floor(maxNumber / 4));
    const b = rand(1, Math.floor(maxNumber / 4));
    left  = a + b;
    right = rand(Math.max(1, left - 5), Math.min(maxNumber, left + 5));
  } else {
    left  = rand(1, maxNumber);
    right = rand(1, maxNumber);
  }

  return { left, right, answer: getSymbol(left, right) };
}
