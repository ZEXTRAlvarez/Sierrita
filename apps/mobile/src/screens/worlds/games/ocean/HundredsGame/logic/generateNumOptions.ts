import { rand } from '../../../shared/rand';

/** 4 answer choices for a compose round: the correct number plus 3 nearby distractors within [0, max]. */
export function generateNumOptions(correct: number, max: number): number[] {
  const spread = Math.max(10, Math.floor(max / 5));
  const opts = new Set<number>([correct]);
  let attempts = 0;
  while (opts.size < 4 && attempts < 40) {
    attempts++;
    const n = correct + rand(-spread, spread);
    if (n >= 0 && n <= max && n !== correct) opts.add(n);
  }
  for (let i = 1; opts.size < 4; i++) {
    if (correct + i <= max) opts.add(correct + i);
  }
  return [...opts].sort(() => Math.random() - 0.5).slice(0, 4);
}
