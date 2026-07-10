import type { IconAnimationName } from '../../../components/IconAnimation';

export interface GameDef {
  id: string;
  name: string;
  emoji: string;
  minAge: number;
}

export interface WorldDef {
  id: string;
  iconName: IconAnimationName;
  name: string;
  subject: string;
  color: string;
  dark: string;
  light: string;
  games: GameDef[];
}

export const WORLDS: WorldDef[] = [
  {
    id: 'jungle',
    iconName: 'selva',
    name: 'Selva Mágica',
    subject: 'Escritura',
    color: '#4CAF50',
    dark: '#2E7D32',
    light: '#E8F5E9',
    games: [
      { id: 'tracing', name: 'Trazos y Letras', emoji: '✏️', minAge: 4 },
      { id: 'words', name: 'Palabras Mágicas', emoji: '🔤', minAge: 5 },
      { id: 'wordsh', name: 'La H Escondida', emoji: '🤫', minAge: 5 },
      { id: 'wordsc', name: 'La C Traviesa', emoji: '🐍', minAge: 5 },
      { id: 'sentences', name: 'Armar Oraciones', emoji: '📝', minAge: 6 },
      { id: 'cursive', name: 'Letra Cursiva', emoji: '🖊️', minAge: 6 },
    ],
  },
  {
    id: 'ocean',
    iconName: 'oceano',
    name: 'Océano Profundo',
    subject: 'Matemáticas',
    color: '#2196F3',
    dark: '#1565C0',
    light: '#E3F2FD',
    games: [
      { id: 'counting', name: 'Contar Pececitos', emoji: '🐟', minAge: 4 },
      { id: 'sums', name: 'Sumas y Restas', emoji: '➕', minAge: 5 },
      { id: 'hundreds', name: 'Centenas y Decenas', emoji: '💯', minAge: 6 },
      { id: 'compare', name: 'Mayor y Menor', emoji: '⚖️', minAge: 4 },
      { id: 'casita', name: 'La Casita', emoji: '🏠', minAge: 6 },
    ],
  },
  {
    id: 'space',
    iconName: 'cohete',
    name: 'Espacio Estelar',
    subject: 'Lógica',
    color: '#9C27B0',
    dark: '#4A148C',
    light: '#F3E5F5',
    games: [
      { id: 'patterns', name: 'Secuencias', emoji: '🔮', minAge: 4 },
      { id: 'memory', name: 'Memoria Estelar', emoji: '🃏', minAge: 4 },
      { id: 'classify', name: 'Clasificar', emoji: '📦', minAge: 4 },
      { id: 'maze', name: 'Laberinto', emoji: '🌀', minAge: 5 },
    ],
  },
];
