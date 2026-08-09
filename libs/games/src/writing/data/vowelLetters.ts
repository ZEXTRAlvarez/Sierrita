import type { LetterDef } from '../letterTypes';

export const VOWEL_LETTERS: LetterDef[] = [
  {
    letter: 'A',
    guidePath: 'M50,5 L8,95 M50,5 L92,95 M22,60 L78,60',
    cursivePath:
      'M55,34 C46,28 34,30 30,40 C26,50 34,58 46,58 C54,58 60,52 60,44 L60,68 Q62,74 70,68',
    checkpoints: [
      { x: 50, y: 5, r: 12 },
      { x: 8, y: 95, r: 12 },
      { x: 92, y: 95, r: 12 },
      { x: 50, y: 60, r: 12 },
    ],
    strokes: 3,
    startHint: { x: 50, y: 5 },
    cursiveCheckpoints: [
      { x: 55, y: 34, r: 11 },
      { x: 30, y: 40, r: 11 },
      { x: 46, y: 58, r: 11 },
      { x: 60, y: 44, r: 11 },
      { x: 60, y: 68, r: 10 },
      { x: 70, y: 68, r: 10 },
    ],
    cursiveStrokes: 1,
    cursiveStartHint: { x: 55, y: 34 },
  },
  {
    letter: 'E',
    guidePath: 'M80,5 L12,5 L12,95 L80,95 M12,50 L62,50',
    cursivePath:
      'M28,56 C30,42 42,30 52,34 Q58,37 50,42 C42,46 28,50 28,58 C28,68 42,72 54,68 C60,66 64,60 64,54',
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
    cursiveCheckpoints: [
      { x: 28, y: 56, r: 11 },
      { x: 52, y: 34, r: 11 },
      { x: 50, y: 42, r: 10 },
      { x: 28, y: 58, r: 11 },
      { x: 54, y: 68, r: 11 },
      { x: 64, y: 54, r: 11 },
    ],
    cursiveStrokes: 1,
    cursiveStartHint: { x: 28, y: 56 },
  },
  {
    letter: 'I',
    guidePath: 'M30,5 L70,5 M50,5 L50,95 M30,95 L70,95',
    cursivePath: 'M32,66 C32,52 40,40 48,40 L48,66 Q50,72 58,66',
    checkpoints: [
      { x: 50, y: 5, r: 14 },
      { x: 50, y: 50, r: 12 },
      { x: 50, y: 95, r: 14 },
    ],
    strokes: 3,
    startHint: { x: 50, y: 5 },
    cursiveCheckpoints: [
      { x: 32, y: 66, r: 11 },
      { x: 48, y: 40, r: 11 },
      { x: 48, y: 66, r: 11 },
      { x: 58, y: 66, r: 10 },
    ],
    cursiveStrokes: 1,
    cursiveStartHint: { x: 32, y: 66 },
  },
  {
    letter: 'O',
    guidePath:
      'M50,5 C78,5 95,25 95,50 C95,75 78,95 50,95 C22,95 5,75 5,50 C5,25 22,5 50,5',
    cursivePath:
      'M62,42 C58,32 46,28 38,32 C28,37 26,48 30,56 C34,64 46,68 56,64 C64,60 66,50 62,42 L62,66 Q64,72 72,66',
    checkpoints: [
      { x: 50, y: 5, r: 12 },
      { x: 95, y: 50, r: 12 },
      { x: 50, y: 95, r: 12 },
      { x: 5, y: 50, r: 12 },
    ],
    strokes: 1,
    startHint: { x: 50, y: 5 },
    cursiveCheckpoints: [
      { x: 62, y: 42, r: 11 },
      { x: 38, y: 32, r: 11 },
      { x: 30, y: 56, r: 11 },
      { x: 56, y: 64, r: 11 },
      { x: 62, y: 66, r: 11 },
      { x: 72, y: 66, r: 10 },
    ],
    cursiveStrokes: 1,
    cursiveStartHint: { x: 62, y: 42 },
  },
  {
    letter: 'U',
    guidePath: 'M12,5 L12,68 C12,95 88,95 88,68 L88,5',
    cursivePath:
      'M30,42 C30,58 32,68 42,68 C50,68 50,56 50,42 L50,66 C50,74 58,74 66,62',
    checkpoints: [
      { x: 12, y: 5, r: 12 },
      { x: 12, y: 68, r: 12 },
      { x: 50, y: 92, r: 12 },
      { x: 88, y: 68, r: 12 },
      { x: 88, y: 5, r: 12 },
    ],
    strokes: 1,
    startHint: { x: 12, y: 5 },
    cursiveCheckpoints: [
      { x: 30, y: 42, r: 11 },
      { x: 42, y: 68, r: 11 },
      { x: 50, y: 42, r: 11 },
      { x: 50, y: 66, r: 10 },
      { x: 66, y: 62, r: 11 },
    ],
    cursiveStrokes: 1,
    cursiveStartHint: { x: 30, y: 42 },
  },
];
