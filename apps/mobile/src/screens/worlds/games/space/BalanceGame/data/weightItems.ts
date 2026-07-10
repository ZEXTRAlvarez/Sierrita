export interface WeightItem {
  emoji: string;
  weight: number;
}

// Ordenados de más liviano a más pesado. Los primeros 4 se usan como "livianos"
// y los últimos 4 como "pesados" en el modo de suma (dificultad alta).
export const WEIGHT_ITEMS: WeightItem[] = [
  { emoji: '🐜', weight: 1 },
  { emoji: '🐭', weight: 3 },
  { emoji: '🐰', weight: 5 },
  { emoji: '🐱', weight: 8 },
  { emoji: '🐶', weight: 10 },
  { emoji: '🦊', weight: 12 },
  { emoji: '🐷', weight: 15 },
  { emoji: '🦁', weight: 20 },
];

export const LIGHT_ITEMS = WEIGHT_ITEMS.slice(0, 4);
export const HEAVY_ITEMS = WEIGHT_ITEMS.slice(4);
