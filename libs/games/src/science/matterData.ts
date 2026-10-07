import { randomFrom } from '../utils/randomFrom';

export type MatterState = 'solid' | 'liquid' | 'gas';

export interface MatterItem {
  label: string;
  emoji: string;
  state: MatterState;
  /** 1 = ejemplos muy obvios, 2 = ejemplos menos obvios. */
  tier: 1 | 2;
}

export interface MatterTransformation {
  label: string;
  emoji: string;
  fromState: MatterState;
  /** Estado resultante — la respuesta correcta en este tipo de ronda. */
  toState: MatterState;
}

// Objetos y sustancias cotidianas clasificadas por estado.
const MATTER_ITEMS: MatterItem[] = [
  { label: 'Piedra', emoji: '🪨', state: 'solid', tier: 1 },
  { label: 'Hielo', emoji: '🧊', state: 'solid', tier: 1 },
  { label: 'Libro', emoji: '📖', state: 'solid', tier: 1 },
  { label: 'Agua', emoji: '💧', state: 'liquid', tier: 1 },
  { label: 'Jugo', emoji: '🧃', state: 'liquid', tier: 1 },
  { label: 'Leche', emoji: '🥛', state: 'liquid', tier: 1 },
  { label: 'Aire', emoji: '💨', state: 'gas', tier: 1 },
  { label: 'Humo', emoji: '🌫️', state: 'gas', tier: 1 },
  { label: 'Madera', emoji: '🪵', state: 'solid', tier: 2 },
  { label: 'Clavo', emoji: '🔩', state: 'solid', tier: 2 },
  { label: 'Miel', emoji: '🍯', state: 'liquid', tier: 2 },
  { label: 'Aceite', emoji: '🫗', state: 'liquid', tier: 2 },
  { label: 'Nube', emoji: '☁️', state: 'gas', tier: 2 },
  { label: 'Globo inflado', emoji: '🎈', state: 'gas', tier: 2 },
];

// Cambios de estado: la respuesta correcta es el estado resultante (toState).
const MATTER_TRANSFORMATIONS: MatterTransformation[] = [
  {
    label: 'El hielo al sol',
    emoji: '🧊☀️',
    fromState: 'solid',
    toState: 'liquid',
  },
  {
    label: 'El agua en el freezer',
    emoji: '💧❄️',
    fromState: 'liquid',
    toState: 'solid',
  },
  {
    label: 'El agua hirviendo',
    emoji: '💧🔥',
    fromState: 'liquid',
    toState: 'gas',
  },
  {
    label: 'El vapor en la ventana fría',
    emoji: '💨🪟',
    fromState: 'gas',
    toState: 'liquid',
  },
];

/** Picks a random matter item whose tier is within the given pool. */
export function getMatterItem(tiers: number[]): MatterItem {
  const pool = MATTER_ITEMS.filter((i) => tiers.includes(i.tier));
  return randomFrom(pool);
}

/** Picks a random state-change scenario. */
export function getMatterTransformation(): MatterTransformation {
  return randomFrom(MATTER_TRANSFORMATIONS);
}
