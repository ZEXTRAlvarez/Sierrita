import type { Checkpoint } from './letterTypes';
import type { Point } from './svgPath';
import { distanceToPath } from './svgPath';

/**
 * Max distance (in the letter's own 0-100 space) a touched point may stray
 * from the guide path before the trazo counts as "salido". Generous on
 * purpose — small kids have imprecise fine motor control, so this only
 * needs to catch real scribbling, not minor wobble.
 */
export const DEFAULT_PATH_TOLERANCE = 16;

export interface StrokeCheckResult {
  /** Hit map after this point — unchanged unless `advanced` is true. */
  newHitMap: boolean[];
  /** A new checkpoint (the next expected one, in order) was just reached. */
  advanced: boolean;
  /** The trazo should now be scored as wrong — stop accepting input. */
  failed: boolean;
  reason?: 'off-path' | 'out-of-order';
}

/**
 * Evaluates a single touched point against a letter's guide path and its
 * checkpoints. Checkpoints must be reached in array order — reaching one
 * out of turn, or straying too far from the guide path, fails the trazo
 * immediately instead of letting the child scribble freely to a "good
 * enough" score.
 */
export function checkStrokePoint(
  point: Point, // in canvas pixel space
  checkpoints: Checkpoint[],
  hitMap: boolean[],
  canvasSize: number,
  guidePathSubpaths: Point[][], // sampleSvgPath(guidePath) in 0-100 space, memoized by the caller
  tolerance = DEFAULT_PATH_TOLERANCE,
): StrokeCheckResult {
  const scale = canvasSize / 100;
  const p: Point = { x: point.x / scale, y: point.y / scale };

  if (distanceToPath(p, guidePathSubpaths) > tolerance) {
    return {
      newHitMap: hitMap,
      advanced: false,
      failed: true,
      reason: 'off-path',
    };
  }

  const expectedIndex = hitMap.findIndex((hit) => !hit);
  if (expectedIndex === -1) {
    return { newHitMap: hitMap, advanced: false, failed: false };
  }

  const expected = checkpoints[expectedIndex];
  if (Math.hypot(p.x - expected.x, p.y - expected.y) <= expected.r) {
    const newHitMap = [...hitMap];
    newHitMap[expectedIndex] = true;
    return { newHitMap, advanced: true, failed: false };
  }

  for (let i = expectedIndex + 1; i < checkpoints.length; i++) {
    const cp = checkpoints[i];
    if (Math.hypot(p.x - cp.x, p.y - cp.y) <= cp.r) {
      return {
        newHitMap: hitMap,
        advanced: false,
        failed: true,
        reason: 'out-of-order',
      };
    }
  }

  return { newHitMap: hitMap, advanced: false, failed: false };
}
