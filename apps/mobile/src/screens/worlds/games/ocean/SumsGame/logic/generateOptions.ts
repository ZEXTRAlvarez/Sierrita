import { rand } from '../../../shared/rand';

/** 4 answer choices for a sum/subtraction round: the correct result plus 3 nearby distractors within [0, max]. */
export function generateOptions(correct: number, max: number): number[] {
  const spread = Math.max(3, Math.floor(max / 8));
  const opts = new Set<number>([correct]);
  let attempts = 0;
  while (opts.size < 4 && attempts < 40) {
    attempts++;
    const n = correct + rand(-spread, spread);
    if (n >= 0 && n <= max) opts.add(n);
  }
  for (let i = 0; opts.size < 4; i++) {
    const n = correct + i + 1;
    if (n <= max) opts.add(n);
  }
  return [...opts].sort(() => Math.random() - 0.5).slice(0, 4);
}
