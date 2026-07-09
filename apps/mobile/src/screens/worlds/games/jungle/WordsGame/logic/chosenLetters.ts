/** Fills the first empty (null) slot with a letter; no-op if every slot is already filled. */
export function fillFirstEmpty(chosen: (string | null)[], letter: string): (string | null)[] {
  const firstEmpty = chosen.findIndex((v) => v === null);
  if (firstEmpty === -1) return chosen;
  const next = [...chosen];
  next[firstEmpty] = letter;
  return next;
}

/** Clears the last filled slot; no-op if every slot is already empty. */
export function eraseLast(chosen: (string | null)[]): (string | null)[] {
  const next = [...chosen];
  const lastFilled = next.map((v, i) => (v !== null ? i : -1)).filter((v) => v !== -1).pop();
  if (lastFilled !== undefined) next[lastFilled] = null;
  return next;
}
