import { randomFrom } from '../utils/randomFrom';

export interface FloatItem {
  label: string;
  emoji: string;
  /** true = flota, false = se hunde. */
  floats: boolean;
  /** 1 = muy obvio, 3 = contraintuitivo por tamaño/material. */
  tier: 1 | 2 | 3;
}

// Objetos cotidianos con su resultado real al caer al agua.
const FLOAT_ITEMS: FloatItem[] = [
  { label: 'Piedra', emoji: '🪨', floats: false, tier: 1 },
  { label: 'Hoja', emoji: '🍃', floats: true, tier: 1 },
  { label: 'Pelota', emoji: '🏀', floats: true, tier: 1 },
  { label: 'Moneda', emoji: '🪙', floats: false, tier: 1 },
  { label: 'Clavo', emoji: '🔩', floats: false, tier: 1 },
  { label: 'Manzana', emoji: '🍎', floats: true, tier: 1 },
  { label: 'Tenedor de metal', emoji: '🍴', floats: false, tier: 2 },
  { label: 'Tronco de madera', emoji: '🪵', floats: true, tier: 2 },
  { label: 'Huevo crudo', emoji: '🥚', floats: false, tier: 2 },
  { label: 'Barco de metal', emoji: '🚢', floats: true, tier: 3 },
  { label: 'Pelota de bolos', emoji: '🎳', floats: false, tier: 3 },
  { label: 'Canoa de aluminio', emoji: '🛶', floats: true, tier: 3 },
];

/** Picks a random item whose tier is within the given pool. */
export function getFloatItem(tiers: number[]): FloatItem {
  const pool = FLOAT_ITEMS.filter((i) => tiers.includes(i.tier));
  return randomFrom(pool);
}
