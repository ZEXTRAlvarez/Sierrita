import type { Checkpoint } from './letterTypes';

export interface Point {
  x: number;
  y: number;
}

/**
 * Evalúa si el path dibujado cubre los checkpoints de la letra.
 * Devuelve score 0-1 y qué checkpoints fueron alcanzados.
 */
export function evaluatePath(
  drawnPoints: Point[],
  checkpoints: Checkpoint[],
  canvasSize: number, // tamaño real del canvas cuadrado en px
): { score: number; hitMap: boolean[] } {
  if (drawnPoints.length < 5) return { score: 0, hitMap: checkpoints.map(() => false) };

  const scale = canvasSize / 100;

  const hitMap = checkpoints.map((cp) => {
    const cpX = cp.x * scale;
    const cpY = cp.y * scale;
    const thresh = cp.r * scale;

    return drawnPoints.some((p) => Math.hypot(p.x - cpX, p.y - cpY) <= thresh);
  });

  const score = hitMap.filter(Boolean).length / checkpoints.length;
  return { score, hitMap };
}

/** Verifica si un punto nuevo activa algún checkpoint no activado aún */
export function checkNewPoint(
  point: Point,
  checkpoints: Checkpoint[],
  hitMap: boolean[],
  canvasSize: number,
): { updated: boolean; newHitMap: boolean[] } {
  const scale = canvasSize / 100;
  let updated = false;
  const newHitMap = [...hitMap];

  checkpoints.forEach((cp, i) => {
    if (newHitMap[i]) return;
    const cpX = cp.x * scale;
    const cpY = cp.y * scale;
    const thresh = cp.r * scale;
    if (Math.hypot(point.x - cpX, point.y - cpY) <= thresh) {
      newHitMap[i] = true;
      updated = true;
    }
  });

  return { updated, newHitMap };
}
