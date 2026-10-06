import { randomFrom } from '../utils/randomFrom';

export interface SynonymAntonymEntry {
  word: string;
  synonym: string;
  antonym: string;
  /** 1 = palabras muy frecuentes, 3 = vocabulario menos frecuente (siempre concreto). */
  tier: 1 | 2 | 3;
}

// Pares sinónimo/antónimo en español, vocabulario concreto para 7-10 años.
const ENTRIES: SynonymAntonymEntry[] = [
  { word: 'GRANDE', synonym: 'ENORME', antonym: 'PEQUEÑO', tier: 1 },
  { word: 'FELIZ', synonym: 'CONTENTO', antonym: 'TRISTE', tier: 1 },
  { word: 'RÁPIDO', synonym: 'VELOZ', antonym: 'LENTO', tier: 1 },
  { word: 'FUERTE', synonym: 'POTENTE', antonym: 'DÉBIL', tier: 1 },
  { word: 'LIMPIO', synonym: 'PULCRO', antonym: 'SUCIO', tier: 2 },
  { word: 'VALIENTE', synonym: 'AUDAZ', antonym: 'COBARDE', tier: 2 },
  { word: 'ANTIGUO', synonym: 'VIEJO', antonym: 'MODERNO', tier: 2 },
  { word: 'CALLADO', synonym: 'SILENCIOSO', antonym: 'RUIDOSO', tier: 2 },
  { word: 'GENEROSO', synonym: 'DESPRENDIDO', antonym: 'TACAÑO', tier: 3 },
  { word: 'HONESTO', synonym: 'SINCERO', antonym: 'MENTIROSO', tier: 3 },
  { word: 'CURIOSO', synonym: 'INTERESADO', antonym: 'INDIFERENTE', tier: 3 },
];

/** Picks a random entry whose tier is within the given pool. */
export function getSynonymAntonymEntry(tiers: number[]): SynonymAntonymEntry {
  const pool = ENTRIES.filter((e) => tiers.includes(e.tier));
  return randomFrom(pool);
}

/**
 * Words usable as distractors for `entry`: every synonym/antonym from other
 * entries within the same tier pool, minus anything that's actually correct
 * for `entry` (its own synonym/antonym), so a distractor never doubles as a
 * valid answer.
 */
export function getDistractorPool(
  tiers: number[],
  entry: SynonymAntonymEntry,
): string[] {
  const others = ENTRIES.filter(
    (e) => tiers.includes(e.tier) && e.word !== entry.word,
  );
  const words = others.flatMap((e) => [e.synonym, e.antonym]);
  return [...new Set(words)].filter(
    (w) => w !== entry.synonym && w !== entry.antonym,
  );
}
