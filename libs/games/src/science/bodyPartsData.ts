import { randomFrom } from '../utils/randomFrom';

export interface BodyPart {
  id: string;
  label: string;
  /** Position on the 160×320 silhouette used by HumanBodyGame. */
  x: number;
  y: number;
  /** 1 = partes externas visibles, 2-3 = órganos internos, de menos a más conocidos. */
  tier: 1 | 2 | 3;
}

// Partes y órganos del cuerpo humano, con posición aproximada sobre la
// silueta de 160×320 que dibuja HumanBodyGame (cabeza + torso + brazos +
// piernas, todo con Views, sin asset de imagen).
export const BODY_PARTS: BodyPart[] = [
  { id: 'head', label: 'Cabeza', x: 80, y: 40, tier: 1 },
  { id: 'eye', label: 'Ojo', x: 68, y: 35, tier: 1 },
  { id: 'mouth', label: 'Boca', x: 80, y: 55, tier: 1 },
  { id: 'arm', label: 'Brazo', x: 34, y: 130, tier: 1 },
  { id: 'hand', label: 'Mano', x: 34, y: 185, tier: 1 },
  { id: 'leg', label: 'Pierna', x: 66, y: 260, tier: 1 },
  { id: 'foot', label: 'Pie', x: 66, y: 312, tier: 1 },
  { id: 'heart', label: 'Corazón', x: 70, y: 110, tier: 2 },
  { id: 'lungs', label: 'Pulmones', x: 88, y: 105, tier: 2 },
  { id: 'stomach', label: 'Estómago', x: 80, y: 150, tier: 2 },
  { id: 'brain', label: 'Cerebro', x: 80, y: 35, tier: 2 },
  { id: 'kidneys', label: 'Riñones', x: 90, y: 160, tier: 3 },
  { id: 'liver', label: 'Hígado', x: 95, y: 140, tier: 3 },
  { id: 'intestines', label: 'Intestinos', x: 80, y: 175, tier: 3 },
];

/** Picks a random body part whose tier is within the given pool. */
export function getBodyPart(tiers: number[]): BodyPart {
  const pool = BODY_PARTS.filter((p) => tiers.includes(p.tier));
  return randomFrom(pool);
}

/** Labels usable as distractors: every other part within the same tier pool. */
export function getBodyPartDistractorPool(
  tiers: number[],
  exclude: BodyPart,
): string[] {
  return BODY_PARTS.filter(
    (p) => tiers.includes(p.tier) && p.id !== exclude.id,
  ).map((p) => p.label);
}
