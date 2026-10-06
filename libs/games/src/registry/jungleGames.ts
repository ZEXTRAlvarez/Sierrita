import type { GameConfig, Difficulty } from '../types';

// ─── Selva — Escritura ────────────────────────────────────────────────────────

export const JUNGLE_GAMES: GameConfig[] = [
  {
    id: 'tracing',
    world: 'jungle',
    titleEs: 'Trazos y Letras',
    emoji: '✏️',
    minAge: 4,
    roundCount: 6,
    params: (d: Difficulty) => ({
      letterSet: d === 1 ? 'vowels' : d === 2 ? 'consonants-easy' : 'all',
      showGuide: d === 1,
      guideOpacity: d === 1 ? 0.6 : d === 2 ? 0.3 : 0,
    }),
  },
  {
    id: 'words',
    world: 'jungle',
    titleEs: 'Palabras Mágicas',
    emoji: '🔤',
    minAge: 5,
    roundCount: 5,
    params: (d: Difficulty) => ({
      wordLength: d === 1 ? 3 : d === 2 ? 4 : 5,
      blanks: d === 1 ? 1 : d === 2 ? 2 : 3,
      category: d === 1 ? 'animals' : d === 2 ? 'objects' : 'mixed',
    }),
  },
  {
    id: 'wordsh',
    world: 'jungle',
    titleEs: 'La H Escondida',
    emoji: '🤫',
    minAge: 5,
    roundCount: 5,
    params: (d: Difficulty) => ({
      wordLength: d === 1 ? 4 : d === 2 ? 4 : 5,
      category: 'mixed',
      focus: 'h',
    }),
  },
  {
    id: 'wordsc',
    world: 'jungle',
    titleEs: 'La C Traviesa',
    emoji: '🐍',
    minAge: 5,
    roundCount: 5,
    params: (d: Difficulty) => ({
      wordLength: d === 1 ? 4 : d === 2 ? 4 : 5,
      category: 'mixed',
      focus: 'soft-c',
    }),
  },
  {
    id: 'sentences',
    world: 'jungle',
    titleEs: 'Armar Oraciones',
    emoji: '📝',
    minAge: 6,
    roundCount: 4,
    params: (d: Difficulty) => ({
      wordCount: d === 1 ? 3 : d === 2 ? 4 : 5,
      shuffleIntensity: d,
    }),
  },
  {
    id: 'cursive',
    world: 'jungle',
    titleEs: 'Letra Cursiva',
    emoji: '🖊️',
    minAge: 6,
    roundCount: 5,
    params: (d: Difficulty) => ({
      letterSet: d === 1 ? 'vowels' : d === 2 ? 'lowercase' : 'uppercase',
      showGuide: d === 1,
    }),
  },
  {
    id: 'reading',
    world: 'jungle',
    titleEs: 'Comprensión de Lectura',
    emoji: '📖',
    minAge: 7,
    roundCount: 5,
    params: (d: Difficulty) => ({
      // Cuentos más largos y preguntas más inferenciales a medida que sube
      // el nivel.
      lengthPool:
        d === 1
          ? ['short']
          : d === 2
            ? ['short', 'medium']
            : ['medium', 'long'],
      kinds: d === 1 ? ['literal'] : ['literal', 'inferential'],
    }),
  },
  {
    id: 'synonyms',
    world: 'jungle',
    titleEs: 'Sinónimos y Antónimos',
    emoji: '🔁',
    minAge: 7,
    roundCount: 6,
    params: (d: Difficulty) => ({
      // Vocabulario menos frecuente (siempre concreto) a medida que sube el
      // nivel.
      tiers: d === 1 ? [1] : d === 2 ? [1, 2] : [1, 2, 3],
    }),
  },
  {
    id: 'wordClasses',
    world: 'jungle',
    titleEs: 'Clases de Palabras',
    emoji: '🏷️',
    minAge: 8,
    roundCount: 6,
    params: (d: Difficulty) => ({
      // Palabras sueltas (nivel 1) → mezcla → identificar la clase de una
      // palabra marcada dentro de una oración completa (nivel 3).
      sentenceChance: d === 1 ? 0 : d === 2 ? 0.5 : 1,
    }),
  },
];
