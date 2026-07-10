import type { IconAnimationName } from '../../../components/IconAnimation';

export interface MoodBubbleContent {
  text: string;
  accent: string;
}

export const MOOD_BUBBLE: Record<string, MoodBubbleContent> = {
  happy: { text: '¡Estoy de gran humor! ✨', accent: '#4CAF50' },
  neutral: { text: 'Listo para una aventura 🌤️', accent: '#FBC02D' },
  hungry: { text: 'Se me escucha la pancita…', accent: '#FF7043' },
  thirsty: { text: 'Necesito un trago de agua 💧', accent: '#2196F3' },
  sad: { text: 'Te extrañé un montón 🥺', accent: '#E91E63' },
};

export interface WorldCard {
  id: string;
  iconName: IconAnimationName;
  name: string;
  subject: string;
  bg: string;
  dark: string;
  accent: string;
  games: number;
}

export const WORLD_CARDS: WorldCard[] = [
  {
    id: 'jungle',
    iconName: 'selva',
    name: 'Selva\nMágica',
    subject: 'Escritura',
    bg: '#4CAF50',
    dark: '#2E7D32',
    accent: '#A5D6A7',
    games: 6,
  },
  {
    id: 'ocean',
    iconName: 'oceano',
    name: 'Océano\nProfundo',
    subject: 'Matemáticas',
    bg: '#2196F3',
    dark: '#1565C0',
    accent: '#90CAF9',
    games: 5,
  },
  {
    id: 'space',
    iconName: 'cohete',
    name: 'Espacio\nEstelar',
    subject: 'Lógica',
    bg: '#9C27B0',
    dark: '#4A148C',
    accent: '#CE93D8',
    games: 6,
  },
];

const TIPS = [
  'Un ratito de práctica al día te convierte en una estrella ⭐',
  'Cada letra nueva es un superpoder que sumás 📚',
  'Los números son divertidos cuando jugás con ellos 🔢',
  'Tu compañero te espera con muchas ganas de jugar 🐾',
  'Equivocarse también es aprender — ¡seguí intentando! 💡',
];

export function dailyTip(): string {
  const day = new Date().getDate();
  return TIPS[day % TIPS.length];
}
