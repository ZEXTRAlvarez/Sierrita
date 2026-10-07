import { randomFrom } from '../utils/randomFrom';

export interface CycleStage {
  label: string;
  emoji: string;
}

export interface Cycle {
  id: string;
  name: string;
  /** Si es circular, cualquier rotación del orden real cuenta como correcta (la última etapa vuelve a conectar con la primera). */
  isCircular: boolean;
  /** En el orden real. */
  stages: CycleStage[];
}

// Ciclos curados a mano: de vida (mariposa, rana) y del agua.
export const CYCLES: Cycle[] = [
  {
    id: 'water-3',
    name: 'Ciclo del Agua',
    isCircular: true,
    stages: [
      { label: 'Evaporación', emoji: '💨' },
      { label: 'Condensación', emoji: '☁️' },
      { label: 'Precipitación', emoji: '🌧️' },
    ],
  },
  {
    id: 'frog-3',
    name: 'Ciclo de Vida de la Rana',
    isCircular: true,
    stages: [
      { label: 'Huevo', emoji: '🥚' },
      { label: 'Renacuajo', emoji: '🐸' },
      { label: 'Rana', emoji: '🐸' },
    ],
  },
  {
    id: 'butterfly-4',
    name: 'Ciclo de Vida de la Mariposa',
    isCircular: true,
    stages: [
      { label: 'Huevo', emoji: '🥚' },
      { label: 'Oruga', emoji: '🐛' },
      { label: 'Capullo', emoji: '📦' },
      { label: 'Mariposa', emoji: '🦋' },
    ],
  },
  {
    id: 'water-4',
    name: 'Ciclo del Agua (detallado)',
    isCircular: true,
    stages: [
      { label: 'Evaporación', emoji: '💨' },
      { label: 'Condensación', emoji: '☁️' },
      { label: 'Precipitación', emoji: '🌧️' },
      { label: 'Escorrentía', emoji: '🌊' },
    ],
  },
  {
    id: 'water-5',
    name: 'Ciclo del Agua Completo',
    isCircular: true,
    stages: [
      { label: 'Evaporación', emoji: '💨' },
      { label: 'Condensación', emoji: '☁️' },
      { label: 'Precipitación', emoji: '🌧️' },
      { label: 'Escorrentía', emoji: '🌊' },
      { label: 'Infiltración', emoji: '💧' },
    ],
  },
  {
    id: 'butterfly-5',
    name: 'Ciclo de Vida de la Mariposa (con etapas)',
    isCircular: true,
    stages: [
      { label: 'Huevo', emoji: '🥚' },
      { label: 'Oruga joven', emoji: '🐛' },
      { label: 'Oruga grande', emoji: '🐛' },
      { label: 'Capullo', emoji: '📦' },
      { label: 'Mariposa', emoji: '🦋' },
    ],
  },
];

/** Picks a random cycle whose length (number of stages) is within the given pool. */
export function getCycle(lengths: number[]): Cycle {
  const pool = CYCLES.filter((c) => lengths.includes(c.stages.length));
  return randomFrom(pool);
}
