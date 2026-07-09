/** Random integer in [min, max], inclusive. Duplicated across every round-based game before this. */
export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
