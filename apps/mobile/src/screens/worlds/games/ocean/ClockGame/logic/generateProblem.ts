import { rand } from '../../../shared/rand';

export type ClockMode = 'identify' | 'set';

export interface TimeValue {
  hour: number;
  minute: number;
}

export interface Problem extends TimeValue {
  mode: ClockMode;
}

/** Builds a clock round: read the hands ("identify") or set them to a given time ("set"), alternating each round. */
export function generateProblem(minutePool: number[]): Problem {
  const hour = rand(1, 12);
  const minute = minutePool[rand(0, minutePool.length - 1)];
  const mode: ClockMode = Math.random() < 0.5 ? 'identify' : 'set';
  return { mode, hour, minute };
}

export function timeLabel(t: TimeValue): string {
  return `${t.hour}:${String(t.minute).padStart(2, '0')}`;
}
