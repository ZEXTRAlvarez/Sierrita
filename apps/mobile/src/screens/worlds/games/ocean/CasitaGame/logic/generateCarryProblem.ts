import { rand } from '../../../shared/rand';

export type Operation = 'add' | 'sub';
export type Place = 'units' | 'tens' | 'hundreds';

export interface CasitaColumn {
  place: Place;
  aDigit: number;
  bDigit: number;
  resultDigit: number;
  /** True when finishing this column forces a carry (add) or borrow (sub) into
   * the next column to the left. Always false for the leftmost column. */
  regroups: boolean;
}

export interface CasitaProblem {
  a: number;
  b: number;
  op: Operation;
  /** Ordered rightmost-first: units, tens, and hundreds when useHundreds is true. */
  columns: CasitaColumn[];
  result: number;
}

function digitsOf(n: number): { hundreds: number; tens: number; units: number } {
  return {
    hundreds: Math.floor(n / 100) % 10,
    tens: Math.floor(n / 10) % 10,
    units: n % 10,
  };
}

function buildColumns(a: number, b: number, op: Operation, useHundreds: boolean): CasitaColumn[] {
  const da = digitsOf(a);
  const db = digitsOf(b);
  const places: Place[] = useHundreds ? ['units', 'tens', 'hundreds'] : ['units', 'tens'];
  const columns: CasitaColumn[] = [];

  if (op === 'add') {
    let carry = 0;
    for (const place of places) {
      const aDigit = place === 'units' ? da.units : place === 'tens' ? da.tens : da.hundreds;
      const bDigit = place === 'units' ? db.units : place === 'tens' ? db.tens : db.hundreds;
      const sum = aDigit + bDigit + carry;
      carry = sum >= 10 ? 1 : 0;
      columns.push({ place, aDigit, bDigit, resultDigit: sum % 10, regroups: carry === 1 });
    }
  } else {
    let borrow = 0;
    for (const place of places) {
      const aDigit = place === 'units' ? da.units : place === 'tens' ? da.tens : da.hundreds;
      const bDigit = place === 'units' ? db.units : place === 'tens' ? db.tens : db.hundreds;
      let diff = aDigit - borrow - bDigit;
      const nextBorrow = diff < 0 ? 1 : 0;
      if (diff < 0) diff += 10;
      borrow = nextBorrow;
      columns.push({ place, aDigit, bDigit, resultDigit: diff, regroups: borrow === 1 });
    }
  }

  // The leftmost column never carries/borrows into anything further.
  columns[columns.length - 1].regroups = false;
  return columns;
}

/**
 * Builds an addition/subtraction problem for the "casita" method, with two
 * columns (tens/units) or three (hundreds/tens/units). `forceRegroup` biases
 * generation towards (true) or away from (false) at least one carry/borrow
 * anywhere in the problem, via rejection sampling.
 */
export function generateCarryProblem(
  maxOperand: number,
  operations: Operation[],
  resultMax: number,
  forceRegroup: boolean,
  useHundreds = false,
): CasitaProblem {
  const minOperand = useHundreds ? 100 : 10;
  let a = minOperand;
  let b = minOperand;
  let op: Operation = operations[0] ?? 'add';
  let columns: CasitaColumn[] = [];
  let tries = 0;

  do {
    tries++;
    op = operations[Math.floor(Math.random() * operations.length)];
    a = rand(minOperand, maxOperand);
    b = rand(minOperand, maxOperand);
    if (op === 'sub' && a < b) [a, b] = [b, a]; // no negatives
    columns = buildColumns(a, b, op, useHundreds);
  } while (
    tries < 50 &&
    ((op === 'add' && a + b > resultMax) ||
      columns.some((c) => c.regroups) !== forceRegroup)
  );

  const result = op === 'add' ? a + b : a - b;
  return { a, b, op, columns, result };
}
