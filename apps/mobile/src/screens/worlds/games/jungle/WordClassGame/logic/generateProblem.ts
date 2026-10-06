import {
  getClassifiedWord,
  getSentenceWithTarget,
  type WordClass,
} from '@sierrita/games';

export interface WordProblem {
  mode: 'word';
  word: string;
  correctClass: WordClass;
}

export interface SentenceProblem {
  mode: 'sentence';
  words: string[];
  targetIndex: number;
  correctClass: WordClass;
}

export type Problem = WordProblem | SentenceProblem;

/**
 * Builds a round: a standalone word to classify, or — once sentenceChance
 * allows it — a full sentence with one word marked as the target to
 * classify.
 */
export function generateProblem(sentenceChance: number): Problem {
  if (Math.random() < sentenceChance) {
    const s = getSentenceWithTarget();
    return {
      mode: 'sentence',
      words: s.words,
      targetIndex: s.targetIndex,
      correctClass: s.targetClass,
    };
  }
  const w = getClassifiedWord();
  return { mode: 'word', word: w.word, correctClass: w.wordClass };
}
