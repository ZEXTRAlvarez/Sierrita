import { rand } from '../../../shared/rand';
import { COLOR_SETS, SHAPE_COMBOS, SPACE_EMOJIS } from '../data/patternPools';
import { shuffle } from './shuffle';

export interface PatternRound {
  sequence: string[]; // full sequence including answer
  missingIdx: number; // which index is the blank
  choices: string[]; // options shown to user
  answer: string;
}

/** Builds a repeating-pattern round: a sequence with the last item blanked out, plus answer choices. */
export function generatePattern(
  patternLength: number,
  attributes: string[],
  choices: number,
): PatternRound {
  // Pick a repeating unit length (2 or 3 elements)
  const unitLen = patternLength <= 3 ? 2 : attributes.length === 1 ? 2 : 3;

  // Pick elements pool based on attributes
  let pool: string[];
  if (attributes.includes('shape') && attributes.includes('color')) {
    pool = shuffle([...SPACE_EMOJIS]).slice(0, unitLen + 2);
  } else if (attributes.includes('color')) {
    pool = shuffle([...COLOR_SETS[0]]).slice(0, unitLen);
  } else {
    pool = shuffle([...SHAPE_COMBOS[rand(0, SHAPE_COMBOS.length - 1)]]).slice(
      0,
      unitLen,
    );
  }

  const unit = pool.slice(0, unitLen);
  const totalLen = patternLength + 1; // show patternLength items + 1 for context
  const sequence: string[] = [];
  for (let i = 0; i < totalLen; i++) {
    sequence.push(unit[i % unit.length]);
  }

  // Hide the last element
  const missingIdx = totalLen - 1;
  const answer = sequence[missingIdx];

  // Distractors
  const distractors = shuffle(
    SPACE_EMOJIS.filter((e) => !unit.includes(e)),
  ).slice(0, choices - 1);
  const choiceSet = shuffle([answer, ...distractors]).slice(0, choices);

  return { sequence, missingIdx, choices: choiceSet, answer };
}
