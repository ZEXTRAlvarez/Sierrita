import { checkStrokePoint, DEFAULT_PATH_TOLERANCE } from './evaluator';
import { sampleSvgPath } from './svgPath';
import type { Checkpoint } from './letterTypes';

// A simple straight guide from (0,0) to (100,0), with two checkpoints along it.
const straightGuide = sampleSvgPath('M0,0 L100,0');
const checkpoints: Checkpoint[] = [
  { x: 0, y: 0, r: 10 },
  { x: 100, y: 0, r: 10 },
];

describe('checkStrokePoint', () => {
  it('advances the hit map when the expected checkpoint is reached', () => {
    const result = checkStrokePoint(
      { x: 5, y: 0 },
      checkpoints,
      [false, false],
      100,
      straightGuide,
    );

    expect(result).toMatchObject({ advanced: true, failed: false });
    expect(result.newHitMap).toEqual([true, false]);
  });

  it('does nothing when the point is on-path but not near any checkpoint yet', () => {
    const result = checkStrokePoint(
      { x: 50, y: 0 },
      checkpoints,
      [true, false],
      100,
      straightGuide,
    );

    expect(result).toEqual({ newHitMap: [true, false], advanced: false, failed: false });
  });

  it('fails with "off-path" once the point strays past the tolerance', () => {
    const farY = DEFAULT_PATH_TOLERANCE + 5;
    const result = checkStrokePoint(
      { x: 50, y: farY },
      checkpoints,
      [true, false],
      100,
      straightGuide,
    );

    expect(result.failed).toBe(true);
    expect(result.reason).toBe('off-path');
    // Untouched — the caller should freeze on failure, not keep the hit map.
    expect(result.newHitMap).toEqual([true, false]);
  });

  it('tolerates small wobble within the tolerance band', () => {
    const closeY = DEFAULT_PATH_TOLERANCE - 2;
    const result = checkStrokePoint(
      { x: 50, y: closeY },
      checkpoints,
      [true, false],
      100,
      straightGuide,
    );

    expect(result.failed).toBe(false);
  });

  it('fails with "out-of-order" when a later checkpoint is reached before the expected one', () => {
    const result = checkStrokePoint(
      { x: 100, y: 0 },
      checkpoints,
      [false, false], // checkpoint 0 not hit yet, but this point is at checkpoint 1
      100,
      straightGuide,
    );

    expect(result.failed).toBe(true);
    expect(result.reason).toBe('out-of-order');
    expect(result.newHitMap).toEqual([false, false]);
  });

  it('is a no-op once every checkpoint has already been hit', () => {
    const result = checkStrokePoint(
      { x: 50, y: 0 },
      checkpoints,
      [true, true],
      100,
      straightGuide,
    );

    expect(result).toEqual({ newHitMap: [true, true], advanced: false, failed: false });
  });

  it('scales both the path tolerance and the checkpoint radius with canvasSize', () => {
    // 15 units off-path at a 0-100 scale is within DEFAULT_PATH_TOLERANCE (16),
    // but at canvasSize=50 (scale 0.5) those same 15px are 30 units — out of range.
    const point = { x: 25, y: 15 };

    const bigCanvas = checkStrokePoint(point, checkpoints, [true, false], 100, straightGuide);
    const smallCanvas = checkStrokePoint(point, checkpoints, [true, false], 50, straightGuide);

    expect(bigCanvas.failed).toBe(false);
    expect(smallCanvas.failed).toBe(true);
    expect(smallCanvas.reason).toBe('off-path');
  });
});
