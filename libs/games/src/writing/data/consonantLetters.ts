import type { LetterDef } from '../letterTypes';

/**
 * Mismas reglas que en `vowelLetters.ts`: numeración de izquierda a derecha
 * (o de arriba hacia abajo en los trazos verticales), trazos encadenados de
 * izquierda a derecha, y sin pasar dos veces por el mismo punto. Las valida
 * `letterCheckpoints.spec.ts`.
 */
export const CONSONANT_LETTERS: LetterDef[] = [
  {
    letter: 'L',
    // Palo hacia abajo y, sin levantar, base hacia la derecha.
    guidePath: 'M30,5 L30,95 L80,95',
    // Subida en diagonal larga y palo hacia abajo con colita.
    cursivePath: 'M15,84 C25,70 37,41 46,14 M61,14 L61,80 Q63,89 85,84',
    checkpoints: [
      { x: 30, y: 18, r: 11 },
      { x: 30, y: 58, r: 11 },
      { x: 30, y: 95, r: 11 },
      { x: 65, y: 95, r: 11 },
    ],
    strokes: 1,
    startHint: { x: 30, y: 5 },
    cursiveCheckpoints: [
      { x: 22, y: 72, r: 11 },
      { x: 32, y: 50, r: 11 },
      { x: 44, y: 21, r: 11 },
      { x: 61, y: 33, r: 11 },
      { x: 61, y: 63, r: 11 },
      { x: 75, y: 87, r: 11 },
    ],
    cursiveStrokes: 2,
    cursiveStartHint: { x: 15, y: 84 },
  },
  {
    letter: 'M',
    // Palo izquierdo hacia abajo; luego diagonal en V y palo derecho, sin levantar.
    guidePath: 'M8,5 L8,95 M8,5 L50,60 L92,5 L92,95',
    // Palito y dos arcos, de izquierda a derecha.
    cursivePath:
      'M13,32 L13,64 M27,64 L27,42 C27,30 43,30 43,42 L43,64 M57,64 L57,42 C57,30 73,30 73,42 L73,64 Q75,70 87,66',
    checkpoints: [
      { x: 8, y: 30, r: 10 },
      { x: 8, y: 55, r: 10 },
      { x: 8, y: 80, r: 10 },
      { x: 28, y: 31, r: 9 },
      { x: 50, y: 60, r: 10 },
      { x: 72, y: 31, r: 9 },
      { x: 92, y: 50, r: 10 },
      { x: 92, y: 80, r: 10 },
    ],
    strokes: 2,
    startHint: { x: 8, y: 5 },
    cursiveCheckpoints: [
      { x: 13, y: 38, r: 7 },
      { x: 13, y: 56, r: 7 },
      { x: 27, y: 54, r: 7 },
      { x: 35, y: 33, r: 7 },
      { x: 43, y: 52, r: 7 },
      { x: 57, y: 54, r: 7 },
      { x: 65, y: 33, r: 7 },
      { x: 73, y: 52, r: 7 },
      { x: 83, y: 67, r: 7 },
    ],
    cursiveStrokes: 3,
    cursiveStartHint: { x: 13, y: 32 },
  },
  {
    letter: 'N',
    // Palo izquierdo, diagonal y palo derecho; los tres de arriba hacia abajo.
    guidePath: 'M10,5 L10,95 M10,5 L90,95 M90,5 L90,95',
    // Palito y arco con colita.
    cursivePath:
      'M14,25 L14,70 M36,70 L36,39 C36,23 64,23 64,39 L64,70 Q67,78 86,72',
    checkpoints: [
      { x: 10, y: 28, r: 10 },
      { x: 10, y: 55, r: 10 },
      { x: 10, y: 82, r: 10 },
      { x: 30, y: 27, r: 9 },
      { x: 50, y: 50, r: 10 },
      { x: 70, y: 72, r: 9 },
      { x: 90, y: 22, r: 10 },
      { x: 90, y: 50, r: 10 },
    ],
    strokes: 3,
    startHint: { x: 10, y: 5 },
    cursiveCheckpoints: [
      { x: 14, y: 36, r: 11 },
      { x: 14, y: 59, r: 11 },
      { x: 36, y: 61, r: 11 },
      { x: 36, y: 42, r: 11 },
      { x: 50, y: 27, r: 11 },
      { x: 64, y: 42, r: 11 },
      { x: 64, y: 61, r: 11 },
      { x: 80, y: 75, r: 11 },
    ],
    cursiveStrokes: 2,
    cursiveStartHint: { x: 14, y: 25 },
  },
  {
    letter: 'P',
    // Palo hacia abajo y panza, ambos de arriba hacia abajo.
    guidePath: 'M15,5 L15,95 M15,5 C70,5 80,20 80,35 C80,50 70,60 15,60',
    // Palo largo hacia abajo y panza en dos arcos.
    cursivePath:
      'M17,14 L17,86 M37,37 C37,22 47,14 60,14 C73,14 83,22 83,37 M37,37 C37,53 47,60 60,60 C73,60 83,53 83,37',
    checkpoints: [
      { x: 15, y: 30, r: 10 },
      { x: 15, y: 80, r: 10 },
      { x: 48, y: 8, r: 10 },
      { x: 78, y: 26, r: 10 },
      { x: 73, y: 50, r: 10 },
      { x: 43, y: 59, r: 10 },
    ],
    strokes: 2,
    startHint: { x: 15, y: 5 },
    cursiveCheckpoints: [
      { x: 17, y: 27, r: 10 },
      { x: 17, y: 55, r: 10 },
      { x: 17, y: 78, r: 10 },
      { x: 42, y: 22, r: 10 },
      { x: 60, y: 14, r: 10 },
      { x: 78, y: 22, r: 10 },
      { x: 42, y: 53, r: 10 },
      { x: 60, y: 60, r: 10 },
      { x: 78, y: 53, r: 10 },
    ],
    cursiveStrokes: 3,
    cursiveStartHint: { x: 17, y: 14 },
  },
  {
    letter: 'S',
    // La S se traza de abajo a la izquierda hacia arriba a la derecha.
    guidePath: 'M15,85 C15,98 85,98 85,75 C85,55 15,65 15,45 C15,5 85,5 85,15',
    cursivePath:
      'M16,78 C16,90 84,90 84,71 C84,54 16,61 16,44 C16,10 84,10 84,19',
    checkpoints: [
      { x: 15, y: 85, r: 12 },
      { x: 85, y: 70, r: 12 },
      { x: 50, y: 60, r: 12 },
      { x: 15, y: 30, r: 12 },
      { x: 85, y: 15, r: 12 },
    ],
    strokes: 1,
    startHint: { x: 15, y: 85 },
    cursiveCheckpoints: [
      { x: 16, y: 78, r: 12 },
      { x: 84, y: 65, r: 12 },
      { x: 50, y: 57, r: 12 },
      { x: 16, y: 33, r: 12 },
      { x: 84, y: 19, r: 12 },
    ],
    cursiveStrokes: 1,
    cursiveStartHint: { x: 16, y: 78 },
  },
  {
    letter: 'T',
    // Barra de izquierda a derecha y luego el palo hacia abajo.
    guidePath: 'M10,10 L90,10 M50,10 L50,95',
    // Barra primero (de izquierda a derecha) y luego el palo con colita.
    cursivePath: 'M22,45 L78,45 M47,14 L47,79 Q50,90 72,84',
    checkpoints: [
      { x: 25, y: 10, r: 12 },
      { x: 75, y: 10, r: 12 },
      { x: 50, y: 35, r: 12 },
      { x: 50, y: 75, r: 12 },
    ],
    strokes: 2,
    startHint: { x: 10, y: 10 },
    cursiveCheckpoints: [
      { x: 33, y: 45, r: 11 },
      { x: 61, y: 45, r: 11 },
      { x: 47, y: 25, r: 11 },
      { x: 47, y: 64, r: 11 },
      { x: 64, y: 87, r: 11 },
    ],
    cursiveStrokes: 2,
    cursiveStartHint: { x: 22, y: 45 },
  },
  {
    letter: 'C',
    // Dos arcos desde el punto más a la izquierda: el de arriba y luego el de abajo.
    guidePath: 'M12,50 C12,5 88,5 88,20 M12,50 C12,95 88,95 88,80',
    cursivePath:
      'M14,50 C14,27 29,16 52,16 C67,16 78,23 86,31 M14,50 C14,73 29,84 52,84 C67,84 78,77 86,69',
    checkpoints: [
      { x: 17, y: 33, r: 10 },
      { x: 50, y: 12, r: 10 },
      { x: 88, y: 20, r: 10 },
      { x: 17, y: 67, r: 10 },
      { x: 50, y: 88, r: 10 },
      { x: 88, y: 80, r: 10 },
    ],
    strokes: 2,
    startHint: { x: 12, y: 50 },
    cursiveCheckpoints: [
      { x: 22, y: 29, r: 12 },
      { x: 52, y: 16, r: 12 },
      { x: 82, y: 27, r: 12 },
      { x: 22, y: 71, r: 12 },
      { x: 52, y: 84, r: 12 },
      { x: 82, y: 73, r: 12 },
    ],
    cursiveStrokes: 2,
    cursiveStartHint: { x: 14, y: 50 },
  },
];
