export interface WordEntry {
  word: string;
  emoji: string;
  category: 'animals' | 'objects' | 'mixed';
}

// Palabras en español latinoamericano, ordenadas por longitud
const WORDS: WordEntry[] = [
  // 3 letras — animales
  { word: 'OSO', emoji: '🐻', category: 'animals' },
  { word: 'PEZ', emoji: '🐟', category: 'animals' },
  { word: 'SOL', emoji: '☀️', category: 'objects' },
  { word: 'MAR', emoji: '🌊', category: 'objects' },
  { word: 'PAN', emoji: '🍞', category: 'objects' },
  { word: 'OCA', emoji: '🦢', category: 'animals' },
  { word: 'RIO', emoji: '🏞️', category: 'objects' },
  { word: 'LUZ', emoji: '💡', category: 'objects' },
  // 4 letras
  { word: 'GATO', emoji: '🐱', category: 'animals' },
  { word: 'PATO', emoji: '🦆', category: 'animals' },
  { word: 'LOBO', emoji: '🐺', category: 'animals' },
  { word: 'LUNA', emoji: '🌙', category: 'objects' },
  { word: 'MESA', emoji: '🪑', category: 'objects' },
  { word: 'CASA', emoji: '🏠', category: 'objects' },
  { word: 'NUBE', emoji: '☁️', category: 'objects' },
  { word: 'RANA', emoji: '🐸', category: 'animals' },
  { word: 'PUMA', emoji: '🐆', category: 'animals' },
  { word: 'TORO', emoji: '🐂', category: 'animals' },
  // 5 letras
  { word: 'TIGRE', emoji: '🐯', category: 'animals' },
  { word: 'PERRO', emoji: '🐶', category: 'animals' },
  { word: 'BURRO', emoji: '🫏', category: 'animals' },
  { word: 'SAPOS', emoji: '🐸', category: 'animals' },
  { word: 'PLATO', emoji: '🍽️', category: 'objects' },
  { word: 'LIBRO', emoji: '📚', category: 'objects' },
  { word: 'FLOR',  emoji: '🌸', category: 'objects' },
];

export function getWords(
  length: 3 | 4 | 5,
  category: 'animals' | 'objects' | 'mixed',
  count: number,
): WordEntry[] {
  const filtered = WORDS.filter(
    (w) => w.word.length === length && (category === 'mixed' || w.category === category),
  );
  // Barajar y devolver `count` palabras
  return [...filtered].sort(() => Math.random() - 0.5).slice(0, count);
}

/** Devuelve índices de blancos en la palabra. blanks = cuántas letras ocultar */
export function getBlanks(word: string, blanks: number): number[] {
  const indices = Array.from({ length: word.length }, (_, i) => i);
  return [...indices].sort(() => Math.random() - 0.5).slice(0, blanks).sort((a, b) => a - b);
}

/** Genera opciones de letras para elegir (incluye la correcta + distractores) */
export function getLetterOptions(word: string, blankIndices: number[]): string[] {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const correct = blankIndices.map((i) => word[i]);
  const distractors = Array.from({ length: 6 - correct.length }, () =>
    ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
  );
  return [...correct, ...distractors]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.max(6, correct.length + 3));
}
