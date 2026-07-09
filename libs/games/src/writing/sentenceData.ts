export interface SentenceEntry {
  words: string[]; // palabras en orden correcto
  emoji: string; // emoji representativo de la oración
  category: 'action' | 'description' | 'question';
}

// Oraciones simples para niños de 5-6 años, en español latinoamericano
const SENTENCES_3: SentenceEntry[] = [
  { words: ['EL', 'GATO', 'DUERME'], emoji: '🐱', category: 'action' },
  { words: ['LA', 'LUNA', 'BRILLA'], emoji: '🌙', category: 'action' },
  { words: ['EL', 'PATO', 'NADA'], emoji: '🦆', category: 'action' },
  { words: ['EL', 'SOL', 'BRILLA'], emoji: '☀️', category: 'action' },
  { words: ['EL', 'OSO', 'COME'], emoji: '🐻', category: 'action' },
  { words: ['LA', 'RANA', 'SALTA'], emoji: '🐸', category: 'action' },
  { words: ['EL', 'PEZ', 'NADA'], emoji: '🐟', category: 'action' },
];

const SENTENCES_4: SentenceEntry[] = [
  { words: ['EL', 'PERRO', 'CORRE', 'RÁPIDO'], emoji: '🐶', category: 'action' },
  { words: ['LA', 'LUNA', 'ES', 'GRANDE'], emoji: '🌙', category: 'description' },
  { words: ['EL', 'GATO', 'ES', 'SUAVE'], emoji: '🐱', category: 'description' },
  { words: ['EL', 'TIGRE', 'ES', 'FUERTE'], emoji: '🐯', category: 'description' },
  { words: ['LA', 'FLOR', 'ES', 'LINDA'], emoji: '🌸', category: 'description' },
  { words: ['EL', 'PATO', 'NADA', 'BIEN'], emoji: '🦆', category: 'action' },
  { words: ['EL', 'LOBO', 'CORRE', 'SOLO'], emoji: '🐺', category: 'action' },
];

const SENTENCES_5: SentenceEntry[] = [
  { words: ['EL', 'PERRO', 'JUEGA', 'CON', 'PEPE'], emoji: '🐶', category: 'action' },
  { words: ['LA', 'NUBE', 'TRAE', 'AGUA', 'HOY'], emoji: '☁️', category: 'action' },
  { words: ['EL', 'PUMA', 'CORRE', 'MUY', 'RÁPIDO'], emoji: '🐆', category: 'action' },
  { words: ['MI', 'GATO', 'DUERME', 'EN', 'CASA'], emoji: '🐱', category: 'action' },
  { words: ['EL', 'SOL', 'SALE', 'POR', 'ALLI'], emoji: '☀️', category: 'action' },
  { words: ['EL', 'LIBRO', 'ES', 'MUY', 'BONITO'], emoji: '📚', category: 'description' },
  { words: ['LA', 'LUNA', 'BRILLA', 'EN', 'NOCHE'], emoji: '🌙', category: 'action' },
];

export function getSentences(wordCount: 3 | 4 | 5, count: number): SentenceEntry[] {
  const pool = wordCount === 3 ? SENTENCES_3 : wordCount === 4 ? SENTENCES_4 : SENTENCES_5;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

/** Desordena las palabras de una oración para que el niño las reordene */
export function shuffleWords(words: string[]): string[] {
  let shuffled: string[];
  do {
    shuffled = [...words].sort(() => Math.random() - 0.5);
  } while (shuffled.join('') === words.join('') && words.length > 1);
  return shuffled;
}
