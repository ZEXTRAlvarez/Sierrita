/** XP earned for completing a game (scales with difficulty and score percentage) */
export function computeGameXp(difficulty: 1 | 2 | 3, scorePercent: number): number {
  const base = difficulty * 20;
  return Math.round(base * scorePercent);
}
