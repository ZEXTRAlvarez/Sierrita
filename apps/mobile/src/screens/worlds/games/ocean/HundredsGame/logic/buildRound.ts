import { rand } from '../../../shared/rand';
import { generateDigitOptions } from './generateDigitOptions';
import { generateNumOptions } from './generateNumOptions';
import { generateProblem, type Problem } from './generateProblem';

export type Mode = 'identify' | 'decompose' | 'compose';
export type DigitField = 'hundreds' | 'tens' | 'units';

export const DIGIT_LABELS: Record<DigitField, string> = {
  hundreds: 'centenas',
  tens: 'decenas',
  units: 'unidades',
};

export interface IdentifyRound {
  mode: 'identify';
  problem: Problem;
  field: DigitField;
  answer: number;
  options: number[];
}

export interface DecomposeRound {
  mode: 'decompose';
  problem: Problem;
  options: Record<DigitField, number[]>;
}

export interface ComposeRound {
  mode: 'compose';
  problem: Problem;
  options: number[];
}

export type Round = IdentifyRound | DecomposeRound | ComposeRound;

/**
 * Builds the number and its answer options in one shot: keeping them in a
 * single value is what guarantees the options always belong to the number on
 * screen, instead of to whatever number the previous round showed.
 */
export function buildRound(mode: Mode, maxNumber: number): Round {
  const problem = generateProblem(maxNumber);

  if (mode === 'decompose') {
    return {
      mode,
      problem,
      options: {
        hundreds: generateDigitOptions(problem.hundreds),
        tens: generateDigitOptions(problem.tens),
        units: generateDigitOptions(problem.units),
      },
    };
  }

  if (mode === 'compose') {
    return {
      mode,
      problem,
      options: generateNumOptions(problem.number, maxNumber),
    };
  }

  const field = pickDigitField(problem);
  const answer = problem[field];
  return {
    mode,
    problem,
    field,
    answer,
    options: generateDigitOptions(answer),
  };
}

/**
 * Asking for the hundreds of a two-digit number would always answer 0 no
 * matter which number is shown, so that question only appears from 100 up.
 */
function pickDigitField(problem: Problem): DigitField {
  const fields: DigitField[] =
    problem.number >= 100 ? ['hundreds', 'tens', 'units'] : ['tens', 'units'];
  return fields[rand(0, fields.length - 1)];
}
