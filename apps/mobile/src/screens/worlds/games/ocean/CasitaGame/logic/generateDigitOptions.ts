import { rand } from '../../../shared/rand';

/** 4 unique single-digit (0-9) choices for a column answer, always including the correct one. */
export function generateDigitOptions(correct: number): number[] {
  const opts = new Set<number>([correct]);
  while (opts.size < 4) {
    opts.add(rand(0, 9));
  }
  return [...opts].sort(() => Math.random() - 0.5);
}
