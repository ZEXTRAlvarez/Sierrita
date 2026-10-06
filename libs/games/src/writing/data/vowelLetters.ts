import type { LetterDef } from '../letterTypes';

/**
 * Reglas de los checkpoints (las valida `letterCheckpoints.spec.ts`):
 * - se numeran de izquierda a derecha en cada trazo (o de arriba hacia abajo
 *   si el trazo es vertical) y los trazos se encadenan de izquierda a derecha;
 * - nunca se pasa dos veces por el mismo punto: ningún checkpoint cae en una
 *   unión de trazos ni en un tramo que se recorre de ida y vuelta.
 * `startHint` es el primer punto de la guía.
 */
export const VOWEL_LETTERS: LetterDef[] = [
  {
    letter: 'A',
    // Trazo 1: pata izquierda, vértice y pata derecha. Trazo 2: travesaño.
    guidePath: 'M8,95 L50,5 L92,95 M24,62 L76,62',
    // Óvalo en dos arcos (arriba y abajo, de izquierda a derecha) + palito con colita.
    cursivePath:
      'M14,50 C14,37 23,30 34,30 C45,30 53,37 53,50 M14,50 C14,63 23,70 34,70 C45,70 53,63 53,50 M71,30 L71,63 Q73,72 86,67',
    checkpoints: [
      { x: 8, y: 95, r: 12 },
      { x: 50, y: 5, r: 12 },
      { x: 92, y: 95, r: 12 },
      { x: 40, y: 62, r: 9 },
      { x: 60, y: 62, r: 9 },
    ],
    strokes: 2,
    startHint: { x: 8, y: 95 },
    cursiveCheckpoints: [
      { x: 18, y: 37, r: 9 },
      { x: 34, y: 30, r: 9 },
      { x: 49, y: 37, r: 9 },
      { x: 18, y: 63, r: 9 },
      { x: 34, y: 70, r: 9 },
      { x: 49, y: 63, r: 9 },
      { x: 71, y: 39, r: 9 },
      { x: 71, y: 59, r: 9 },
      { x: 79, y: 69, r: 9 },
    ],
    cursiveStrokes: 3,
    cursiveStartHint: { x: 14, y: 50 },
  },
  {
    letter: 'E',
    // Espina de arriba hacia abajo y luego las tres barras de izquierda a derecha.
    guidePath: 'M12,5 L12,95 M12,5 L80,5 M12,50 L62,50 M12,95 L80,95',
    // Dos arcos (arriba y abajo) y la barra del medio, de izquierda a derecha.
    cursivePath:
      'M14,50 C14,27 29,16 48,16 C67,16 82,27 82,50 M14,50 C14,73 29,84 48,84 C63,84 75,77 86,69 M14,50 L82,50',
    checkpoints: [
      { x: 12, y: 22, r: 10 },
      { x: 12, y: 78, r: 10 },
      { x: 40, y: 5, r: 10 },
      { x: 72, y: 5, r: 10 },
      { x: 40, y: 50, r: 10 },
      { x: 58, y: 50, r: 10 },
      { x: 40, y: 95, r: 10 },
      { x: 72, y: 95, r: 10 },
    ],
    strokes: 4,
    startHint: { x: 12, y: 5 },
    cursiveCheckpoints: [
      { x: 22, y: 27, r: 12 },
      { x: 48, y: 16, r: 12 },
      { x: 75, y: 27, r: 12 },
      { x: 22, y: 73, r: 12 },
      { x: 48, y: 84, r: 12 },
      { x: 78, y: 75, r: 12 },
      { x: 37, y: 50, r: 12 },
      { x: 63, y: 50, r: 12 },
    ],
    cursiveStrokes: 3,
    cursiveStartHint: { x: 14, y: 50 },
  },
  {
    letter: 'I',
    guidePath: 'M50,5 L50,95',
    // Subida en diagonal y bajada con colita.
    cursivePath: 'M14,71 C23,61 33,46 42,33 M61,27 L61,65 Q64,77 86,71',
    checkpoints: [
      { x: 50, y: 15, r: 12 },
      { x: 50, y: 50, r: 12 },
      { x: 50, y: 85, r: 12 },
    ],
    strokes: 1,
    startHint: { x: 50, y: 5 },
    cursiveCheckpoints: [
      { x: 20, y: 61, r: 12 },
      { x: 36, y: 43, r: 12 },
      { x: 61, y: 40, r: 12 },
      { x: 61, y: 61, r: 12 },
      { x: 80, y: 74, r: 12 },
    ],
    cursiveStrokes: 2,
    cursiveStartHint: { x: 14, y: 71 },
  },
  {
    letter: 'O',
    // Dos medias lunas, la izquierda y luego la derecha, ambas de arriba hacia abajo.
    guidePath:
      'M50,5 C22,5 5,25 5,50 C5,75 22,95 50,95 M50,5 C78,5 95,25 95,50 C95,75 78,95 50,95',
    cursivePath:
      'M14,50 C14,26 30,14 50,14 C70,14 86,26 86,50 M14,50 C14,74 30,86 50,86 C70,86 86,74 86,50',
    checkpoints: [
      { x: 17, y: 18, r: 11 },
      { x: 5, y: 50, r: 11 },
      { x: 17, y: 82, r: 11 },
      { x: 83, y: 18, r: 11 },
      { x: 95, y: 50, r: 11 },
      { x: 83, y: 82, r: 11 },
    ],
    strokes: 2,
    startHint: { x: 50, y: 5 },
    cursiveCheckpoints: [
      { x: 22, y: 26, r: 12 },
      { x: 50, y: 14, r: 12 },
      { x: 78, y: 26, r: 12 },
      { x: 22, y: 74, r: 12 },
      { x: 50, y: 86, r: 12 },
      { x: 78, y: 74, r: 12 },
    ],
    cursiveStrokes: 2,
    cursiveStartHint: { x: 14, y: 50 },
  },
  {
    letter: 'U',
    // Brazo izquierdo y curva hasta la derecha; luego el brazo derecho de arriba hacia abajo.
    guidePath: 'M12,5 L12,68 C12,95 88,95 88,68 M88,5 L88,68',
    // Curva izquierda y palito derecho con colita.
    cursivePath: 'M14,26 L14,56 C14,77 43,77 43,56 M65,26 L65,66 Q67,77 86,72',
    checkpoints: [
      { x: 12, y: 22, r: 10 },
      { x: 12, y: 55, r: 10 },
      { x: 50, y: 88, r: 10 },
      { x: 76, y: 83, r: 10 },
      { x: 88, y: 18, r: 10 },
      { x: 88, y: 48, r: 10 },
    ],
    strokes: 2,
    startHint: { x: 12, y: 5 },
    cursiveCheckpoints: [
      { x: 14, y: 37, r: 11 },
      { x: 14, y: 56, r: 11 },
      { x: 29, y: 72, r: 11 },
      { x: 43, y: 56, r: 11 },
      { x: 65, y: 37, r: 11 },
      { x: 65, y: 61, r: 11 },
      { x: 81, y: 73, r: 11 },
    ],
    cursiveStrokes: 2,
    cursiveStartHint: { x: 14, y: 26 },
  },
];
