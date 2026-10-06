import type { TimeValue } from './generateProblem';
import { timeLabel } from './generateProblem';

/** 4 digital-time choices for an "identify" round: the correct time plus 3 others from the same hour/minute pool. */
export function generateTimeOptions(
  correct: TimeValue,
  minutePool: number[],
): TimeValue[] {
  const pool: TimeValue[] = [];
  for (let hour = 1; hour <= 12; hour++) {
    for (const minute of minutePool) {
      pool.push({ hour, minute });
    }
  }
  const correctLabel = timeLabel(correct);
  const others = pool.filter((t) => timeLabel(t) !== correctLabel);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const options = [correct, ...shuffled.slice(0, 3)];
  return options.sort(() => Math.random() - 0.5);
}
