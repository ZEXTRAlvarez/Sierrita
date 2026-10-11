import type { GameConfig, Difficulty } from '../types';

// ─── Océano — Matemáticas ─────────────────────────────────────────────────────

export const OCEAN_GAMES: GameConfig[] = [
  {
    id: 'counting',
    world: 'ocean',
    titleEs: 'Contar Pececitos',
    emoji: '🐟',
    minAge: 4,
    roundCount: 6,
    params: (d: Difficulty) => ({
      maxNumber: d === 1 ? 10 : d === 2 ? 50 : 99,
      visualObjects: true,
    }),
  },
  {
    id: 'sums',
    world: 'ocean',
    titleEs: 'Sumas y Restas',
    emoji: '➕',
    minAge: 5,
    roundCount: 6,
    params: (d: Difficulty, age: number) => ({
      // A partir de los 6 años el techo escala hasta la familia del 1000;
      // antes de eso se mantiene el techo original (siempre <= 300).
      maxOperand:
        age >= 6
          ? d === 1
            ? 100
            : d === 2
              ? 300
              : 500
          : d === 1
            ? 10
            : d === 2
              ? 20
              : 50,
      operations: d === 1 ? ['add'] : d === 2 ? ['add', 'sub'] : ['add', 'sub'],
      resultMax:
        age >= 6
          ? d === 1
            ? 400
            : d === 2
              ? 700
              : 1000
          : d === 1
            ? 10
            : d === 2
              ? 30
              : 99,
    }),
  },
  {
    id: 'hundreds',
    world: 'ocean',
    titleEs: 'Centenas y Decenas',
    emoji: '💯',
    minAge: 6,
    roundCount: 5,
    params: (d: Difficulty, age: number) => ({
      maxNumber:
        age >= 6
          ? d === 1
            ? 400
            : d === 2
              ? 700
              : 1000
          : d === 1
            ? 99
            : d === 2
              ? 199
              : 299,
      mode: d === 1 ? 'identify' : d === 2 ? 'decompose' : 'compose',
    }),
  },
  {
    id: 'compare',
    world: 'ocean',
    titleEs: 'Mayor y Menor',
    emoji: '⚖️',
    minAge: 4,
    roundCount: 6,
    params: (d: Difficulty, age: number) => ({
      maxNumber:
        age >= 6
          ? d === 1
            ? 400
            : d === 2
              ? 700
              : 1000
          : d === 1
            ? 20
            : d === 2
              ? 100
              : 299,
      mode: d === 1 ? 'visual' : d === 2 ? 'number' : 'expression',
    }),
  },
  {
    id: 'casita',
    world: 'ocean',
    titleEs: 'La Casita',
    emoji: '🏠',
    minAge: 6,
    roundCount: 5,
    params: (d: Difficulty, age: number) => ({
      // Decenas y unidades solamente en el nivel 1 (recién arrancando);
      // centenas se suman a partir del nivel 2.
      useHundreds: d >= 2,
      // A los 6+ el nivel 3 llega hasta la familia del 1000 (antes se
      // quedaba en 899/999).
      maxOperand: d === 1 ? 39 : d === 2 ? 399 : age >= 6 ? 999 : 899,
      operations: d === 1 ? ['add'] : ['add', 'sub'],
      resultMax: d === 1 ? 99 : d === 3 && age >= 6 ? 1000 : 999,
      // Higher difficulty forces the carry/borrow case more often.
      regroupChance: d === 1 ? 0.4 : d === 2 ? 0.65 : 0.9,
    }),
  },
  {
    id: 'multiply',
    world: 'ocean',
    titleEs: 'Multiplicar y Repartir',
    emoji: '🧮',
    minAge: 7,
    roundCount: 6,
    params: (d: Difficulty) => ({
      // El "techo" de tablas practicadas crece con el nivel; el otro factor
      // (o el cociente, en modo división) siempre va de 1 a 10.
      maxTable: d === 1 ? 5 : d === 2 ? 8 : 10,
    }),
  },
  {
    id: 'fractions',
    world: 'ocean',
    titleEs: 'Fracciones Simples',
    emoji: '🍕',
    minAge: 7,
    roundCount: 6,
    params: (d: Difficulty) => ({
      denominators: d === 1 ? [2, 4] : d === 2 ? [2, 3, 4] : [2, 3, 4, 8],
      // Rondas de "¿cuál es más grande?" entre dos fracciones, solo a partir
      // del nivel 3.
      compareChance: d === 3 ? 0.3 : 0,
    }),
  },
  {
    id: 'clock',
    world: 'ocean',
    titleEs: 'El Reloj',
    emoji: '🕐',
    minAge: 7,
    roundCount: 6,
    params: (d: Difficulty) => ({
      // Horas en punto → + y media → + cuartos y minutos exactos (de a 5).
      minutePool:
        d === 1
          ? [0]
          : d === 2
            ? [0, 30]
            : Array.from({ length: 12 }, (_, i) => i * 5),
    }),
  },
  {
    id: 'wordProblems',
    world: 'ocean',
    titleEs: 'Problemas con Cuentos',
    emoji: '📖',
    minAge: 8,
    roundCount: 6,
    params: (d: Difficulty, age: number) => ({
      operations: d === 3 ? ['add', 'sub', 'multiply'] : ['add', 'sub'],
      maxOperand:
        age >= 6
          ? d === 1
            ? 100
            : d === 2
              ? 300
              : 500
          : d === 1
            ? 10
            : d === 2
              ? 30
              : 50,
      resultMax:
        age >= 6
          ? d === 1
            ? 400
            : d === 2
              ? 700
              : 1000
          : d === 1
            ? 20
            : d === 2
              ? 60
              : 99,
    }),
  },
  {
    id: 'sudoku',
    world: 'ocean',
    titleEs: 'Sudoku',
    emoji: '🔢',
    minAge: 6,
    roundCount: 5,
    params: (d: Difficulty) => ({
      // La dificultad escala el tamaño de la grilla, no la cantidad de
      // casillas a completar (siempre roundCount blancos).
      gridSize: d === 1 ? 4 : d === 2 ? 6 : 9,
      boxRows: d === 1 ? 2 : d === 2 ? 2 : 3,
      boxCols: d === 1 ? 2 : d === 2 ? 3 : 3,
    }),
  },
];
