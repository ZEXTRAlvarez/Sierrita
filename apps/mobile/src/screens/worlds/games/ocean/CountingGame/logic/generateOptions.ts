import { rand } from '../../../shared/rand';

/** 4 answer choices for a counting round: the correct count plus 3 plausible nearby distractors. */
export function generateOptions(correct: number, max: number): number[] {
  const spread = Math.max(3, Math.floor(max / 8));
  const opts = new Set<number>([correct]);
  let attempts = 0;
  while (opts.size < 4 && attempts < 40) {
    attempts++;
    const n = correct + rand(-spread, spread);
    if (n >= 1 && n <= max && n !== correct) opts.add(n);
  }
  // Fallback if max is small
  for (let i = 1; opts.size < 4 && i <= max; i++) {
    if (i !== correct) opts.add(i);
  }
  return [...opts].sort(() => Math.random() - 0.5).slice(0, 4);
}
