import { sampleSvgPath, distanceToPath } from './svgPath';

describe('sampleSvgPath', () => {
  it('samples M/L into a single subpath with the exact endpoints', () => {
    const subpaths = sampleSvgPath('M0,0 L10,0 L10,10');

    expect(subpaths).toHaveLength(1);
    expect(subpaths[0][0]).toEqual({ x: 0, y: 0 });
    expect(subpaths[0][subpaths[0].length - 1]).toEqual({ x: 10, y: 10 });
  });

  it('starts a new subpath on every M', () => {
    const subpaths = sampleSvgPath('M0,0 L10,0 M50,50 L60,50');

    expect(subpaths).toHaveLength(2);
    expect(subpaths[0][0]).toEqual({ x: 0, y: 0 });
    expect(subpaths[1][0]).toEqual({ x: 50, y: 50 });
  });

  it('samples a C curve so it starts and ends at the right points', () => {
    const subpaths = sampleSvgPath('M0,0 C0,10 10,10 10,0');
    const points = subpaths[0];

    expect(points[0]).toEqual({ x: 0, y: 0 });
    expect(points[points.length - 1]).toEqual({ x: 10, y: 0 });
    // The curve bulges below the M->end chord (higher y, since y grows down).
    const midY = points[Math.floor(points.length / 2)].y;
    expect(midY).toBeGreaterThan(0);
  });

  it('samples a Q curve so it starts and ends at the right points', () => {
    const subpaths = sampleSvgPath('M0,0 Q5,10 10,0');
    const points = subpaths[0];

    expect(points[0]).toEqual({ x: 0, y: 0 });
    expect(points[points.length - 1]).toEqual({ x: 10, y: 0 });
    const midY = points[Math.floor(points.length / 2)].y;
    expect(midY).toBeGreaterThan(0); // pulled toward the y=10 control point
  });
});

describe('distanceToPath', () => {
  it('returns ~0 for a point sitting on a straight segment', () => {
    const subpaths = sampleSvgPath('M0,0 L100,0');
    expect(distanceToPath({ x: 50, y: 0 }, subpaths)).toBeCloseTo(0, 5);
  });

  it('returns the perpendicular distance for a point off to the side', () => {
    const subpaths = sampleSvgPath('M0,0 L100,0');
    expect(distanceToPath({ x: 50, y: 20 }, subpaths)).toBeCloseTo(20, 5);
  });

  it('does not bridge two disconnected subpaths with a phantom segment', () => {
    // Two short strokes far apart, like the crossbar and the stem of a "T".
    const subpaths = sampleSvgPath('M0,0 L10,0 M0,50 L10,50');
    // Sitting exactly between the two subpaths: if they were wrongly
    // flattened into one polyline, the "bridge" segment from (10,0) to
    // (0,50) would put this point within a couple of units of the path.
    const midpoint = { x: 5, y: 25 };

    expect(distanceToPath(midpoint, subpaths)).toBeCloseTo(25, 5);
  });
});
