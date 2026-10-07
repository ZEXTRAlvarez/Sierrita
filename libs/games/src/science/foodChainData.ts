import { randomFrom } from '../utils/randomFrom';

export interface FoodChainLink {
  label: string;
  emoji: string;
}

export interface FoodChain {
  id: string;
  biome: string;
  /** In the real order: productor primero, depredador tope al final. */
  links: FoodChainLink[];
}

// Cadenas alimenticias curadas a mano (no generadas), con bioma asociado.
export const FOOD_CHAINS: FoodChain[] = [
  {
    id: 'pradera-conejo',
    biome: 'pradera',
    links: [
      { label: 'Pasto', emoji: '🌾' },
      { label: 'Conejo', emoji: '🐰' },
      { label: 'Zorro', emoji: '🦊' },
    ],
  },
  {
    id: 'selva-oruga',
    biome: 'selva',
    links: [
      { label: 'Hojas', emoji: '🍃' },
      { label: 'Oruga', emoji: '🐛' },
      { label: 'Pájaro', emoji: '🐦' },
    ],
  },
  {
    id: 'oceano-pez',
    biome: 'océano',
    links: [
      { label: 'Algas', emoji: '🌿' },
      { label: 'Pez', emoji: '🐟' },
      { label: 'Tiburón', emoji: '🦈' },
    ],
  },
  {
    id: 'desierto-lagartija',
    biome: 'desierto',
    links: [
      { label: 'Cactus', emoji: '🌵' },
      { label: 'Lagartija', emoji: '🦎' },
      { label: 'Halcón', emoji: '🦅' },
    ],
  },
  {
    id: 'pradera-saltamontes',
    biome: 'pradera',
    links: [
      { label: 'Pasto', emoji: '🌾' },
      { label: 'Saltamontes', emoji: '🦗' },
      { label: 'Rana', emoji: '🐸' },
      { label: 'Serpiente', emoji: '🐍' },
    ],
  },
  {
    id: 'bosque-raton',
    biome: 'bosque',
    links: [
      { label: 'Bellotas', emoji: '🌰' },
      { label: 'Ratón', emoji: '🐭' },
      { label: 'Búho', emoji: '🦉' },
      { label: 'Zorro', emoji: '🦊' },
    ],
  },
  {
    id: 'oceano-calamar',
    biome: 'océano',
    links: [
      { label: 'Plancton', emoji: '🦠' },
      { label: 'Pez pequeño', emoji: '🐟' },
      { label: 'Calamar', emoji: '🦑' },
      { label: 'Tiburón', emoji: '🦈' },
    ],
  },
  {
    id: 'selva-serpiente',
    biome: 'selva',
    links: [
      { label: 'Hojas', emoji: '🍃' },
      { label: 'Saltamontes', emoji: '🦗' },
      { label: 'Rana', emoji: '🐸' },
      { label: 'Serpiente', emoji: '🐍' },
      { label: 'Águila', emoji: '🦅' },
    ],
  },
  {
    id: 'polar-foca',
    biome: 'polar',
    links: [
      { label: 'Algas', emoji: '🌿' },
      { label: 'Kril', emoji: '🦐' },
      { label: 'Pez', emoji: '🐟' },
      { label: 'Foca', emoji: '🦭' },
      { label: 'Oso polar', emoji: '🐻‍❄️' },
    ],
  },
  {
    id: 'sabana-serpiente',
    biome: 'sabana',
    links: [
      { label: 'Pasto', emoji: '🌾' },
      { label: 'Saltamontes', emoji: '🦗' },
      { label: 'Ratón', emoji: '🐭' },
      { label: 'Serpiente', emoji: '🐍' },
      { label: 'Halcón', emoji: '🦅' },
    ],
  },
];

/** Picks a random food chain whose length (number of links) is within the given pool. */
export function getFoodChain(lengths: number[]): FoodChain {
  const pool = FOOD_CHAINS.filter((c) => lengths.includes(c.links.length));
  return randomFrom(pool);
}
