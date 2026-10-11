import { rand } from '../../../shared/rand';
import { generateDigitOptions } from './generateDigitOptions';
import { generateNumOptions } from './generateNumOptions';
import { generateProblem, type Problem } from './generateProblem';

export type Mode = 'identify' | 'decompose' | 'compose';
export type DigitField = 'thousands' | 'hundreds' | 'tens' | 'units';

export const DIGIT_LABELS: Record<DigitField, string> = {
  thousands: 'millares',
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
  // `thousands` solo se ofrece cuando el rango del juego llega a 1000 — para
  // los niveles/edades que no llegan ahí, pedirlo sería siempre "0 millares"
  // y no aportaría nada.
  options: {
    thousands?: number[];
    hundreds: number[];
    tens: number[];
    units: number[];
  };
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
        ...(maxNumber >= 1000
          ? { thousands: generateDigitOptions(problem.thousands) }
          : {}),
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
 * Asking for the hundreds of a two-digit number (or the thousands of
 * anything below 1000) would always answer 0 no matter which number is
 * shown, so those questions only appear once the number actually reaches
 * that place value.
 */
function pickDigitField(problem: Problem): DigitField {
  const fields: DigitField[] =
    problem.number >= 1000
      ? ['thousands', 'hundreds', 'tens', 'units']
      : problem.number >= 100
        ? ['hundreds', 'tens', 'units']
        : ['tens', 'units'];
  return fields[rand(0, fields.length - 1)];
}
