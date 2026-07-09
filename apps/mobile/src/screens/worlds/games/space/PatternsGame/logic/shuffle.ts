/** Returns a shuffled copy of `arr`, leaving the original untouched. */
export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
