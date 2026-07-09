import type { Checkpoint, LetterDef } from './letterTypes';
import { VOWEL_LETTERS } from './data/vowelLetters';
import { CONSONANT_LETTERS } from './data/consonantLetters';

export type { Checkpoint, LetterDef };

const ALL_LETTER_DEFS: LetterDef[] = [...VOWEL_LETTERS, ...CONSONANT_LETTERS];

const LETTER_MAP = new Map<string, LetterDef>(ALL_LETTER_DEFS.map((d) => [d.letter, d]));

export function getLetterDef(letter: string): LetterDef | undefined {
  return LETTER_MAP.get(letter.toUpperCase());
}

export function getLetterSet(set: 'vowels' | 'consonants-easy' | 'all'): string[] {
  if (set === 'vowels') return VOWEL_LETTERS.map((d) => d.letter);
  if (set === 'consonants-easy') return CONSONANT_LETTERS.map((d) => d.letter);
  return ALL_LETTER_DEFS.map((d) => d.letter);
}

export { ALL_LETTER_DEFS };
