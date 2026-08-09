/**
 * Fisher-Yates shuffle: every order is equally likely. A `sort()` with a random
 * comparator is not, and here it would leave the correct answer sitting in the
 * first button far too often.
 */
export function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
