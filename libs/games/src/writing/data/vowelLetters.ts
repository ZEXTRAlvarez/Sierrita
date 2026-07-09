import type { LetterDef } from '../letterTypes';

export const VOWEL_LETTERS: LetterDef[] = [
  {
    letter: 'A',
    guidePath: 'M50,5 L8,95 M50,5 L92,95 M22,60 L78,60',
    cursivePath: 'M50,5 Q10,50 8,95 M50,5 Q90,50 92,95 M22,60 Q50,55 78,60',
    checkpoints: [
      { x: 50, y: 5, r: 12 },
      { x: 8, y: 95, r: 12 },
      { x: 92, y: 95, r: 12 },
      { x: 50, y: 60, r: 12 },
    ],
    strokes: 3,
    startHint: { x: 50, y: 5 },
  },
  {
    letter: 'E',
    guidePath: 'M80,5 L12,5 L12,95 L80,95 M12,50 L62,50',
    cursivePath: 'M80,5 Q12,5 12,50 Q12,95 80,95 M12,50 L62,50',
    checkpoints: [
      { x: 80, y: 5, r: 12 },
      { x: 12, y: 5, r: 10 },
      { x: 12, y: 50, r: 10 },
      { x: 62, y: 50, r: 12 },
      { x: 12, y: 95, r: 10 },
      { x: 80, y: 95, r: 12 },
    ],
    strokes: 3,
    startHint: { x: 80, y: 5 },
  },
  {
    letter: 'I',
    guidePath: 'M30,5 L70,5 M50,5 L50,95 M30,95 L70,95',
    cursivePath: 'M30,5 L70,5 M50,5 L50,95 M30,95 L70,95',
    checkpoints: [
      { x: 50, y: 5, r: 14 },
      { x: 50, y: 50, r: 12 },
      { x: 50, y: 95, r: 14 },
    ],
    strokes: 3,
    startHint: { x: 50, y: 5 },
  },
  {
    letter: 'O',
    guidePath: 'M50,5 C78,5 95,25 95,50 C95,75 78,95 50,95 C22,95 5,75 5,50 C5,25 22,5 50,5',
    cursivePath: 'M50,5 C78,5 95,25 95,50 C95,75 78,95 50,95 C22,95 5,75 5,50 C5,25 22,5 50,5',
    checkpoints: [
      { x: 50, y: 5, r: 12 },
      { x: 95, y: 50, r: 12 },
      { x: 50, y: 95, r: 12 },
      { x: 5, y: 50, r: 12 },
    ],
    strokes: 1,
    startHint: { x: 50, y: 5 },
  },
  {
    letter: 'U',
    guidePath: 'M12,5 L12,68 C12,95 88,95 88,68 L88,5',
    cursivePath: 'M12,5 L12,68 C12,95 88,95 88,68 L88,5',
    checkpoints: [
      { x: 12, y: 5, r: 12 },
      { x: 12, y: 68, r: 12 },
      { x: 50, y: 92, r: 12 },
      { x: 88, y: 68, r: 12 },
      { x: 88, y: 5, r: 12 },
    ],
    strokes: 1,
    startHint: { x: 12, y: 5 },
  },
];
