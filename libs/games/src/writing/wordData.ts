export interface WordEntry {
  word: string;
  emoji: string;
  category: 'animals' | 'objects' | 'mixed';
  /** Tags a word for a focused spelling-rule practice mode (silent H, soft C). Absent for the normal word pool. */
  focus?: 'h' | 'soft-c';
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
  { word: 'FLOR', emoji: '🌸', category: 'objects' },

  // Práctica de la "H muda" (inicial e intermedia)
  { word: 'HADA', emoji: '🧚', category: 'objects', focus: 'h' },
  { word: 'HOJA', emoji: '🍃', category: 'objects', focus: 'h' },
  { word: 'HUMO', emoji: '💨', category: 'objects', focus: 'h' },
  { word: 'HOYO', emoji: '🕳️', category: 'objects', focus: 'h' },
  { word: 'HILO', emoji: '🧵', category: 'objects', focus: 'h' },
  { word: 'BUHO', emoji: '🦉', category: 'animals', focus: 'h' },
  { word: 'MOHO', emoji: '🦠', category: 'objects', focus: 'h' },
  { word: 'HUEVO', emoji: '🥚', category: 'objects', focus: 'h' },
  { word: 'HUESO', emoji: '🦴', category: 'objects', focus: 'h' },
  { word: 'HORNO', emoji: '🔥', category: 'objects', focus: 'h' },
  { word: 'HACHA', emoji: '🪓', category: 'objects', focus: 'h' },

  // Práctica de la "C" con sonido de S (antes de E/I)
  { word: 'CENA', emoji: '🍽️', category: 'objects', focus: 'soft-c' },
  { word: 'CINE', emoji: '🎬', category: 'objects', focus: 'soft-c' },
  { word: 'ONCE', emoji: '🔢', category: 'objects', focus: 'soft-c' },
  { word: 'DOCE', emoji: '🔢', category: 'objects', focus: 'soft-c' },
  { word: 'CIELO', emoji: '☁️', category: 'objects', focus: 'soft-c' },
  { word: 'CEBRA', emoji: '🦓', category: 'animals', focus: 'soft-c' },
  { word: 'CIRCO', emoji: '🎪', category: 'objects', focus: 'soft-c' },
  { word: 'TRECE', emoji: '🔢', category: 'objects', focus: 'soft-c' },
  { word: 'DULCE', emoji: '🍬', category: 'objects', focus: 'soft-c' },
  { word: 'LUCES', emoji: '💡', category: 'objects', focus: 'soft-c' },
];

export function getWords(
  length: 3 | 4 | 5,
  category: 'animals' | 'objects' | 'mixed',
  count: number,
  focus?: 'h' | 'soft-c',
): WordEntry[] {
  const filtered = WORDS.filter(
    (w) =>
      w.word.length === length &&
      (category === 'mixed' || w.category === category) &&
      (focus ? w.focus === focus : !w.focus),
  );
  // Barajar y devolver `count` palabras
  return [...filtered].sort(() => Math.random() - 0.5).slice(0, count);
}

/** Devuelve índices de blancos en la palabra. blanks = cuántas letras ocultar */
export function getBlanks(word: string, blanks: number): number[] {
  const indices = Array.from({ length: word.length }, (_, i) => i);
  return [...indices]
    .sort(() => Math.random() - 0.5)
    .slice(0, blanks)
    .sort((a, b) => a - b);
}

/**
 * Forces the blank onto the first occurrence of `letter`, instead of a
 * random position — used by the H/soft-C practice modes, where the whole
 * point is testing that exact letter. Falls back to a random blank if the
 * word doesn't contain it (shouldn't happen with the curated focus lists).
 */
export function getForcedBlank(word: string, letter: string): number[] {
  const idx = word.indexOf(letter.toUpperCase());
  return idx === -1 ? getBlanks(word, 1) : [idx];
}

/** Genera opciones de letras para elegir (incluye la correcta + distractores) */
export function getLetterOptions(
  word: string,
  blankIndices: number[],
): string[] {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const correct = blankIndices.map((i) => word[i]);
  const distractors = Array.from(
    { length: 6 - correct.length },
    () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
  );
  return [...correct, ...distractors]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.max(6, correct.length + 3));
}

/**
 * Letter options for the H/soft-C practice modes: instead of random
 * distractors, offer the specific phonetic "traps" kids fall into —
 * S/Z for a soft C, and the letter right after a silent H (the sound they
 * actually hear, since H itself is silent).
 */
export function getPhoneticOptions(
  word: string,
  blankIndex: number,
  focus: 'h' | 'soft-c',
): string[] {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const correct = word[blankIndex];
  const opts = new Set<string>([correct]);

  if (focus === 'soft-c') {
    opts.add('S');
    opts.add('Z');
  } else {
    const nextLetter = word[blankIndex + 1];
    if (nextLetter) opts.add(nextLetter);
    opts.add('J');
  }

  while (opts.size < 4) {
    opts.add(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
  }
  return [...opts].sort(() => Math.random() - 0.5);
}
