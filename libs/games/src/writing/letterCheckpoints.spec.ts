import { ALL_LETTER_DEFS } from './letterPaths';
import { sampleSvgPath } from './svgPath';
import type { Point } from './svgPath';
import type { Checkpoint, LetterDef } from './letterTypes';

/**
 * Reglas de la numeración de trazos (las mismas para imprenta y cursiva):
 *
 * 1. Nunca se pasa dos veces por el mismo punto: la guía entra una sola vez
 *    en el radio de cada checkpoint (un checkpoint en una unión de trazos o
 *    en un tramo que se recorre de ida y vuelta se detecta acá).
 * 2. Los números siguen el recorrido de la guía, en orden.
 * 3. Cada trazo se numera de izquierda a derecha (x nunca retrocede) o, si
 *    es un trazo vertical/curvo, de arriba hacia abajo (y siempre avanza).
 * 4. Los trazos se encadenan de izquierda a derecha (x de arranque creciente).
 *
 * La S es la única letra que zigzaguea por naturaleza: se le exige que el
 * trazo avance de izquierda a derecha en conjunto, no punto a punto.
 */
const ZIGZAG_LETTERS = new Set(['S']);

const SAMPLE_STEP = 0.5;
const X_BACKSTEP_TOLERANCE = 4;
const MIN_NET_RIGHTWARD = 4;
/** Cuánto puede alejarse el centro de un checkpoint de la guía. */
const MAX_CENTER_DISTANCE = 4;

interface Variant {
  label: string;
  letter: string;
  path: string;
  checkpoints: Checkpoint[];
  startHint: Point;
  expectedStrokes: number;
}

interface Sample {
  p: Point;
  stroke: number;
}

function variantsOf(def: LetterDef): Variant[] {
  const variants: Variant[] = [
    {
      label: `${def.letter} imprenta`,
      letter: def.letter,
      path: def.guidePath,
      checkpoints: def.checkpoints,
      startHint: def.startHint,
      expectedStrokes: def.strokes,
    },
  ];
  if (def.cursivePath && def.cursiveCheckpoints && def.cursiveStartHint) {
    variants.push({
      label: `${def.letter} cursiva`,
      letter: def.letter,
      path: def.cursivePath,
      checkpoints: def.cursiveCheckpoints,
      startHint: def.cursiveStartHint,
      expectedStrokes: def.cursiveStrokes ?? def.strokes,
    });
  }
  return variants;
}

/** Re-muestrea cada trazo a pasos finos para detectar entradas/salidas del radio. */
function denseSamples(path: string): Sample[] {
  const samples: Sample[] = [];
  sampleSvgPath(path).forEach((poly, stroke) => {
    for (let i = 0; i < poly.length - 1; i++) {
      const a = poly[i];
      const b = poly[i + 1];
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      const steps = Math.max(1, Math.ceil(len / SAMPLE_STEP));
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        samples.push({
          p: { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t },
          stroke,
        });
      }
    }
    samples.push({ p: poly[poly.length - 1], stroke });
  });
  return samples;
}

interface CheckpointInfo {
  runs: number;
  firstIndex: number;
  stroke: number;
  centerDistance: number;
}

function analyse(cp: Checkpoint, samples: Sample[]): CheckpointInfo {
  let runs = 0;
  let firstIndex = -1;
  let centerDistance = Infinity;
  let inside = false;
  samples.forEach((s, i) => {
    const d = Math.hypot(s.p.x - cp.x, s.p.y - cp.y);
    centerDistance = Math.min(centerDistance, d);
    const isIn = d <= cp.r;
    if (isIn && (!inside || samples[i - 1].stroke !== s.stroke)) {
      runs++;
      if (firstIndex === -1) firstIndex = i;
    }
    inside = isIn;
  });
  return {
    runs,
    firstIndex,
    stroke: firstIndex === -1 ? -1 : samples[firstIndex].stroke,
    centerDistance,
  };
}

const ALL_VARIANTS = ALL_LETTER_DEFS.flatMap(variantsOf);

describe('letter checkpoints', () => {
  it('covers every letter in both variants', () => {
    expect(ALL_LETTER_DEFS).toHaveLength(12);
    expect(ALL_VARIANTS).toHaveLength(24);
  });

  describe.each(ALL_VARIANTS.map((v) => [v.label, v] as const))(
    '%s',
    (_label, v) => {
      const samples = denseSamples(v.path);
      const infos = v.checkpoints.map((cp) => analyse(cp, samples));

      it('declares as many strokes as the guide has subpaths', () => {
        expect(sampleSvgPath(v.path)).toHaveLength(v.expectedStrokes);
      });

      it('starts where the guide starts', () => {
        expect(
          Math.hypot(
            v.startHint.x - samples[0].p.x,
            v.startHint.y - samples[0].p.y,
          ),
        ).toBeLessThanOrEqual(1);
      });

      it('has checkpoints that sit on the guide', () => {
        infos.forEach((info, i) => {
          expect({
            i,
            onGuide: info.centerDistance <= MAX_CENTER_DISTANCE,
          }).toEqual({
            i,
            onGuide: true,
          });
        });
      });

      it('never passes twice through the same checkpoint', () => {
        expect(infos.map((info, i) => ({ i, runs: info.runs }))).toEqual(
          infos.map((_info, i) => ({ i, runs: 1 })),
        );
      });

      it('numbers checkpoints in the order the guide is drawn', () => {
        const order = infos.map((info) => info.firstIndex);
        const sorted = [...order].sort((a, b) => a - b);
        expect(order).toEqual(sorted);
        expect(new Set(order).size).toBe(order.length);
      });

      it('keeps checkpoints apart so circles do not swallow each other', () => {
        for (let i = 0; i < v.checkpoints.length; i++) {
          for (let j = i + 1; j < v.checkpoints.length; j++) {
            const a = v.checkpoints[i];
            const b = v.checkpoints[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            expect({ i, j, apart: d > Math.max(a.r, b.r) }).toEqual({
              i,
              j,
              apart: true,
            });
          }
        }
      });

      it('gives every stroke at least one checkpoint', () => {
        const strokesWithCheckpoints = new Set(
          infos.map((info) => info.stroke),
        );
        expect(strokesWithCheckpoints.size).toBe(v.expectedStrokes);
      });

      it('numbers each stroke left to right (or top to bottom if vertical)', () => {
        const byStroke = new Map<number, Checkpoint[]>();
        v.checkpoints.forEach((cp, i) => {
          const stroke = infos[i].stroke;
          byStroke.set(stroke, [...(byStroke.get(stroke) ?? []), cp]);
        });

        byStroke.forEach((cps, stroke) => {
          const first = cps[0];
          const last = cps[cps.length - 1];
          const netRightward = last.x - first.x >= MIN_NET_RIGHTWARD;
          const stepsRight = cps.every(
            (cp, i) => i === 0 || cp.x - cps[i - 1].x >= -X_BACKSTEP_TOLERANCE,
          );
          const stepsDown = cps.every(
            (cp, i) => i === 0 || cp.y - cps[i - 1].y > 0,
          );
          const rightward =
            netRightward && (stepsRight || ZIGZAG_LETTERS.has(v.letter));
          expect({ stroke, ok: rightward || stepsDown }).toEqual({
            stroke,
            ok: true,
          });
        });
      });

      it('chains strokes from left to right', () => {
        const starts: number[] = [];
        infos.forEach((info, i) => {
          if (starts[info.stroke] === undefined) {
            starts[info.stroke] = v.checkpoints[i].x;
          }
        });
        starts.forEach((x, i) => {
          if (i === 0) return;
          expect({ stroke: i, ok: x >= starts[i - 1] - 1 }).toEqual({
            stroke: i,
            ok: true,
          });
        });
      });
    },
  );
});
