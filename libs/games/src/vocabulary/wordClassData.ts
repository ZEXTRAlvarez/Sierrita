import { randomFrom } from '../utils/randomFrom';

export type WordClass = 'noun' | 'verb' | 'adjective';

export interface ClassifiedWord {
  word: string;
  wordClass: WordClass;
}

export interface SentenceWithTarget {
  words: string[];
  targetIndex: number;
  targetClass: WordClass;
}

// Vocabulario reutilizado de wordData.ts / sentenceData.ts, clasificado por
// clase gramatical para el juego "Clases de Palabras".
const WORDS: ClassifiedWord[] = [
  { word: 'GATO', wordClass: 'noun' },
  { word: 'LUNA', wordClass: 'noun' },
  { word: 'PATO', wordClass: 'noun' },
  { word: 'SOL', wordClass: 'noun' },
  { word: 'OSO', wordClass: 'noun' },
  { word: 'RANA', wordClass: 'noun' },
  { word: 'PERRO', wordClass: 'noun' },
  { word: 'NUBE', wordClass: 'noun' },
  { word: 'TIGRE', wordClass: 'noun' },
  { word: 'FLOR', wordClass: 'noun' },
  { word: 'LIBRO', wordClass: 'noun' },
  { word: 'LOBO', wordClass: 'noun' },
  { word: 'DUERME', wordClass: 'verb' },
  { word: 'BRILLA', wordClass: 'verb' },
  { word: 'NADA', wordClass: 'verb' },
  { word: 'COME', wordClass: 'verb' },
  { word: 'SALTA', wordClass: 'verb' },
  { word: 'CORRE', wordClass: 'verb' },
  { word: 'JUEGA', wordClass: 'verb' },
  { word: 'TRAE', wordClass: 'verb' },
  { word: 'GRANDE', wordClass: 'adjective' },
  { word: 'SUAVE', wordClass: 'adjective' },
  { word: 'FUERTE', wordClass: 'adjective' },
  { word: 'LINDA', wordClass: 'adjective' },
  { word: 'RÁPIDO', wordClass: 'adjective' },
  { word: 'BONITO', wordClass: 'adjective' },
];

// Mismas oraciones que sentenceData.ts, con la palabra objetivo marcada.
const SENTENCES_WITH_TARGET: SentenceWithTarget[] = [
  { words: ['EL', 'GATO', 'DUERME'], targetIndex: 1, targetClass: 'noun' },
  {
    words: ['EL', 'PERRO', 'CORRE', 'RÁPIDO'],
    targetIndex: 2,
    targetClass: 'verb',
  },
  {
    words: ['LA', 'LUNA', 'ES', 'GRANDE'],
    targetIndex: 3,
    targetClass: 'adjective',
  },
  {
    words: ['EL', 'PATO', 'NADA', 'BIEN'],
    targetIndex: 1,
    targetClass: 'noun',
  },
  {
    words: ['LA', 'FLOR', 'ES', 'LINDA'],
    targetIndex: 3,
    targetClass: 'adjective',
  },
  {
    words: ['EL', 'LOBO', 'CORRE', 'SOLO'],
    targetIndex: 2,
    targetClass: 'verb',
  },
  { words: ['EL', 'OSO', 'COME'], targetIndex: 2, targetClass: 'verb' },
];

export function getClassifiedWord(): ClassifiedWord {
  return randomFrom(WORDS);
}

export function getSentenceWithTarget(): SentenceWithTarget {
  return randomFrom(SENTENCES_WITH_TARGET);
}
