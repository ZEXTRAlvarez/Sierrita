import { evaluatePath, checkNewPoint } from './evaluator';
import type { Checkpoint } from './letterTypes';

const checkpoints: Checkpoint[] = [
  { x: 0, y: 0, r: 10 },
  { x: 100, y: 100, r: 10 },
];

describe('evaluatePath', () => {
  it('scores 0 with an empty hit map when fewer than 5 points were drawn', () => {
    const result = evaluatePath([{ x: 0, y: 0 }], checkpoints, 100);

    expect(result.score).toBe(0);
    expect(result.hitMap).toEqual([false, false]);
  });

  it('marks a checkpoint hit when a drawn point falls within its radius', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 4 },
    ];

    const result = evaluatePath(points, checkpoints, 100);

    expect(result.hitMap[0]).toBe(true);
    expect(result.hitMap[1]).toBe(false);
    expect(result.score).toBe(0.5);
  });

  it('does not mark a checkpoint hit when every point is outside its radius', () => {
    const points = [
      { x: 50, y: 50 },
      { x: 51, y: 51 },
      { x: 52, y: 52 },
      { x: 53, y: 53 },
      { x: 54, y: 54 },
    ];

    const result = evaluatePath(points, checkpoints, 100);

    expect(result.hitMap).toEqual([false, false]);
    expect(result.score).toBe(0);
  });

  it('scales checkpoint radius with canvasSize', () => {
    // canvasSize 200 -> scale 2, so a checkpoint radius of 10 becomes 20px;
    // a point 15px away only counts as a hit at the larger canvas size.
    const point = { x: 15, y: 0 };
    const points = Array(5).fill(point);

    const smallCanvas = evaluatePath(points, checkpoints, 100);
    const bigCanvas = evaluatePath(points, checkpoints, 200);

    expect(smallCanvas.hitMap[0]).toBe(false);
    expect(bigCanvas.hitMap[0]).toBe(true);
  });
});

describe('checkNewPoint', () => {
  it('flags updated=true and fills in the hit when a new point lands in range', () => {
    const result = checkNewPoint(
      { x: 0, y: 0 },
      checkpoints,
      [false, false],
      100,
    );

    expect(result.updated).toBe(true);
    expect(result.newHitMap).toEqual([true, false]);
  });

  it('does not re-trigger an already-hit checkpoint', () => {
    const result = checkNewPoint(
      { x: 0, y: 0 },
      checkpoints,
      [true, false],
      100,
    );

    expect(result.updated).toBe(false);
    expect(result.newHitMap).toEqual([true, false]);
  });

  it('leaves updated=false when the point is out of range of every checkpoint', () => {
    const result = checkNewPoint(
      { x: 50, y: 50 },
      checkpoints,
      [false, false],
      100,
    );

    expect(result.updated).toBe(false);
    expect(result.newHitMap).toEqual([false, false]);
  });
});
