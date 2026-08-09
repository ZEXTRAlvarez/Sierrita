import { rand } from '../../../shared/rand';
import { shuffle } from './shuffle';

/** 4 unique single-digit (0-9) choices, always including the correct one. */
export function generateDigitOptions(correct: number): number[] {
  const opts = new Set<number>([correct]);
  while (opts.size < 4) {
    opts.add(rand(0, 9));
  }
  return shuffle([...opts]);
}
