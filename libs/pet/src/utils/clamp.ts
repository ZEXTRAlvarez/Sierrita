export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}
