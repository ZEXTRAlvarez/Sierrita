import { randomFrom } from '../utils/randomFrom';

export type WordProblemOperation = 'add' | 'sub' | 'multiply';

export interface WordProblemTemplate {
  operation: WordProblemOperation;
  emoji: string;
  /** Builds the narrated/displayed question for this template, in problem order (a then b). */
  text: (name: string, a: number, b: number) => string;
}

const NAMES = [
  'Juan',
  'Ana',
  'Pepe',
  'Sofía',
  'Mateo',
  'Lucía',
  'Tomás',
  'Valentina',
];

const ADD_TEMPLATES: WordProblemTemplate[] = [
  {
    operation: 'add',
    emoji: '🍎',
    text: (name, a, b) =>
      `${name} tiene ${a} manzanas y le regalan ${b} más. ¿Cuántas tiene ahora?`,
  },
  {
    operation: 'add',
    emoji: '🎈',
    text: (name, a, b) =>
      `${name} tenía ${a} globos y compró ${b} más. ¿Cuántos globos tiene?`,
  },
  {
    operation: 'add',
    emoji: '🐟',
    text: (name, a, b) =>
      `En la pecera de ${name} hay ${a} peces y agregan ${b} más. ¿Cuántos peces hay ahora?`,
  },
];

const SUB_TEMPLATES: WordProblemTemplate[] = [
  {
    operation: 'sub',
    emoji: '🍬',
    text: (name, a, b) =>
      `${name} tenía ${a} caramelos y comió ${b}. ¿Cuántos le quedan?`,
  },
  {
    operation: 'sub',
    emoji: '⭐',
    text: (name, a, b) =>
      `${name} juntó ${a} estrellitas y perdió ${b}. ¿Cuántas estrellitas le quedan?`,
  },
  {
    operation: 'sub',
    emoji: '🚗',
    text: (name, a, b) =>
      `Había ${a} autitos en la caja de ${name} y regaló ${b}. ¿Cuántos autitos quedan en la caja?`,
  },
];

const MULTIPLY_TEMPLATES: WordProblemTemplate[] = [
  {
    operation: 'multiply',
    emoji: '📦',
    text: (name, a, b) =>
      `${name} tiene ${a} cajas con ${b} juguetes cada una. ¿Cuántos juguetes hay en total?`,
  },
  {
    operation: 'multiply',
    emoji: '🍪',
    text: (name, a, b) =>
      `${name} horneó ${a} bandejas con ${b} galletitas cada una. ¿Cuántas galletitas horneó?`,
  },
  {
    operation: 'multiply',
    emoji: '🚲',
    text: (name, a, b) =>
      `Hay ${a} bicicletas estacionadas y cada una tiene ${b} ruedas. ¿Cuántas ruedas hay en total?`,
  },
];

const TEMPLATES_BY_OPERATION: Record<
  WordProblemOperation,
  WordProblemTemplate[]
> = {
  add: ADD_TEMPLATES,
  sub: SUB_TEMPLATES,
  multiply: MULTIPLY_TEMPLATES,
};

/** Picks a random word-problem template for one of the given operations. */
export function getWordProblemTemplate(
  operations: WordProblemOperation[],
): WordProblemTemplate {
  const operation = randomFrom(operations);
  return randomFrom(TEMPLATES_BY_OPERATION[operation]);
}

export function randomChildName(): string {
  return randomFrom(NAMES);
}
