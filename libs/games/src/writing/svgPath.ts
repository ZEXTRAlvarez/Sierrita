export interface Point {
  x: number;
  y: number;
}

type Cmd = 'M' | 'L' | 'C' | 'Q';
const ARG_COUNT: Record<Cmd, number> = { M: 2, L: 2, C: 6, Q: 4 };

/**
 * Samples the small M/L/C/Q SVG-path dialect used by the letter guide data
 * (`letterTypes.ts`) into dense polylines — one per subpath. Every `M`
 * starts a new subpath, and they're kept separate rather than flattened
 * into one polyline so distance checks never bridge across a pen-lift
 * (e.g. the two strokes of a cursive "T") with a phantom straight segment
 * connecting the end of one stroke to the start of the next.
 *
 * Only absolute, explicit commands are supported (every segment repeats
 * its command letter) — that's how all of the current letter data is
 * authored, so no implicit-repeat handling is needed.
 */
export function sampleSvgPath(d: string, segmentsPerCurve = 24): Point[][] {
  const tokens = d.match(/[MLCQ]|-?\d+(?:\.\d+)?/g) ?? [];
  const subpaths: Point[][] = [];
  let current: Point[] = [];
  let cursor: Point = { x: 0, y: 0 };
  let i = 0;

  while (i < tokens.length) {
    const cmd = tokens[i] as Cmd;
    if (!(cmd in ARG_COUNT)) break; // malformed input — bail out, don't loop forever
    i++;

    const argCount = ARG_COUNT[cmd];
    const args = tokens.slice(i, i + argCount).map(Number);
    i += argCount;
    if (args.length < argCount) break;

    if (cmd === 'M') {
      if (current.length > 0) subpaths.push(current);
      cursor = { x: args[0], y: args[1] };
      current = [cursor];
    } else if (cmd === 'L') {
      cursor = { x: args[0], y: args[1] };
      current.push(cursor);
    } else if (cmd === 'Q') {
      const control = { x: args[0], y: args[1] };
      const end = { x: args[2], y: args[3] };
      for (let s = 1; s <= segmentsPerCurve; s++) {
        current.push(quadraticPoint(cursor, control, end, s / segmentsPerCurve));
      }
      cursor = end;
    } else if (cmd === 'C') {
      const c1 = { x: args[0], y: args[1] };
      const c2 = { x: args[2], y: args[3] };
      const end = { x: args[4], y: args[5] };
      for (let s = 1; s <= segmentsPerCurve; s++) {
        current.push(cubicPoint(cursor, c1, c2, end, s / segmentsPerCurve));
      }
      cursor = end;
    }
  }
  if (current.length > 0) subpaths.push(current);
  return subpaths;
}

function quadraticPoint(p0: Point, p1: Point, p2: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
}

function cubicPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt ** 3 * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t ** 3 * p3.x,
    y: mt ** 3 * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t ** 3 * p3.y,
  };
}

/** Minimum distance from `point` to any segment of any subpath. */
export function distanceToPath(point: Point, subpaths: Point[][]): number {
  let min = Infinity;
  for (const points of subpaths) {
    if (points.length === 1) {
      min = Math.min(min, Math.hypot(point.x - points[0].x, point.y - points[0].y));
      continue;
    }
    for (let i = 0; i < points.length - 1; i++) {
      min = Math.min(min, distanceToSegment(point, points[i], points[i + 1]));
    }
  }
  return min;
}

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);

  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq));
  const projX = a.x + t * dx;
  const projY = a.y + t * dy;
  return Math.hypot(p.x - projX, p.y - projY);
}
