// Paths normalizados en espacio 0-100 × 0-100
// Se escalan al tamaño del canvas en runtime

export interface Checkpoint {
  x: number;   // 0-100
  y: number;   // 0-100
  r: number;   // radio de detección (en unidades normalizadas)
}

export interface LetterDef {
  letter: string;
  guidePath: string;           // SVG path en espacio 0-100
  cursivePath?: string;        // variante cursiva
  checkpoints: Checkpoint[];   // waypoints que el trazo debe cubrir
  strokes: number;             // cantidad de trazos separados
  startHint: { x: number; y: number }; // dónde iniciar el trazo
}

const L: LetterDef[] = [
  // ── VOCALES ──────────────────────────────────────────────────────────────
  {
    letter: 'A',
    guidePath: 'M50,5 L8,95 M50,5 L92,95 M22,60 L78,60',
    cursivePath: 'M50,5 Q10,50 8,95 M50,5 Q90,50 92,95 M22,60 Q50,55 78,60',
    checkpoints: [
      { x: 50, y: 5,  r: 12 },
      { x: 8,  y: 95, r: 12 },
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
      { x: 80, y: 5,  r: 12 },
      { x: 12, y: 5,  r: 10 },
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
      { x: 50, y: 5,  r: 14 },
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
      { x: 50, y: 5,  r: 12 },
      { x: 95, y: 50, r: 12 },
      { x: 50, y: 95, r: 12 },
      { x: 5,  y: 50, r: 12 },
    ],
    strokes: 1,
    startHint: { x: 50, y: 5 },
  },
  {
    letter: 'U',
    guidePath: 'M12,5 L12,68 C12,95 88,95 88,68 L88,5',
    cursivePath: 'M12,5 L12,68 C12,95 88,95 88,68 L88,5',
    checkpoints: [
      { x: 12, y: 5,  r: 12 },
      { x: 12, y: 68, r: 12 },
      { x: 50, y: 92, r: 12 },
      { x: 88, y: 68, r: 12 },
      { x: 88, y: 5,  r: 12 },
    ],
    strokes: 1,
    startHint: { x: 12, y: 5 },
  },

  // ── CONSONANTES FÁCILES ──────────────────────────────────────────────────
  {
    letter: 'L',
    guidePath: 'M30,5 L30,95 L80,95',
    cursivePath: 'M30,5 L30,95 Q55,95 80,95',
    checkpoints: [
      { x: 30, y: 5,  r: 12 },
      { x: 30, y: 95, r: 12 },
      { x: 80, y: 95, r: 12 },
    ],
    strokes: 1,
    startHint: { x: 30, y: 5 },
  },
  {
    letter: 'M',
    guidePath: 'M8,95 L8,5 L50,50 L92,5 L92,95',
    cursivePath: 'M8,95 L8,5 Q29,28 50,50 Q71,28 92,5 L92,95',
    checkpoints: [
      { x: 8,  y: 95, r: 12 },
      { x: 8,  y: 5,  r: 12 },
      { x: 50, y: 50, r: 12 },
      { x: 92, y: 5,  r: 12 },
      { x: 92, y: 95, r: 12 },
    ],
    strokes: 1,
    startHint: { x: 8, y: 95 },
  },
  {
    letter: 'N',
    guidePath: 'M10,95 L10,5 L90,95 L90,5',
    cursivePath: 'M10,95 L10,5 Q50,50 90,95 L90,5',
    checkpoints: [
      { x: 10, y: 95, r: 12 },
      { x: 10, y: 5,  r: 12 },
      { x: 90, y: 95, r: 12 },
      { x: 90, y: 5,  r: 12 },
    ],
    strokes: 1,
    startHint: { x: 10, y: 5 },
  },
  {
    letter: 'P',
    guidePath: 'M15,95 L15,5 M15,5 C70,5 80,20 80,35 C80,50 70,60 15,60',
    cursivePath: 'M15,95 L15,5 M15,5 C70,5 80,20 80,35 C80,50 70,60 15,60',
    checkpoints: [
      { x: 15, y: 95, r: 12 },
      { x: 15, y: 5,  r: 12 },
      { x: 78, y: 20, r: 12 },
      { x: 78, y: 50, r: 12 },
      { x: 15, y: 60, r: 12 },
    ],
    strokes: 2,
    startHint: { x: 15, y: 5 },
  },
  {
    letter: 'S',
    guidePath: 'M85,15 C85,5 15,5 15,45 C15,65 85,55 85,75 C85,98 15,98 15,85',
    cursivePath: 'M85,15 C85,5 15,5 15,45 C15,65 85,55 85,75 C85,98 15,98 15,85',
    checkpoints: [
      { x: 85, y: 15, r: 12 },
      { x: 15, y: 30, r: 12 },
      { x: 50, y: 50, r: 12 },
      { x: 85, y: 70, r: 12 },
      { x: 15, y: 85, r: 12 },
    ],
    strokes: 1,
    startHint: { x: 85, y: 15 },
  },
  {
    letter: 'T',
    guidePath: 'M10,10 L90,10 M50,10 L50,95',
    cursivePath: 'M10,10 L90,10 M50,10 L50,95',
    checkpoints: [
      { x: 10, y: 10, r: 12 },
      { x: 90, y: 10, r: 12 },
      { x: 50, y: 10, r: 10 },
      { x: 50, y: 95, r: 12 },
    ],
    strokes: 2,
    startHint: { x: 10, y: 10 },
  },
  {
    letter: 'C',
    guidePath: 'M88,20 C88,5 12,5 12,50 C12,95 88,95 88,80',
    cursivePath: 'M88,20 C88,5 12,5 12,50 C12,95 88,95 88,80',
    checkpoints: [
      { x: 88, y: 20, r: 12 },
      { x: 12, y: 50, r: 12 },
      { x: 88, y: 80, r: 12 },
    ],
    strokes: 1,
    startHint: { x: 88, y: 20 },
  },
];

const LETTER_MAP = new Map<string, LetterDef>(L.map((d) => [d.letter, d]));

export function getLetterDef(letter: string): LetterDef | undefined {
  return LETTER_MAP.get(letter.toUpperCase());
}

export function getLetterSet(set: 'vowels' | 'consonants-easy' | 'all'): string[] {
  if (set === 'vowels')           return ['A', 'E', 'I', 'O', 'U'];
  if (set === 'consonants-easy')  return ['L', 'M', 'N', 'P', 'S', 'T', 'C'];
  return L.map((d) => d.letter);
}

export { L as ALL_LETTER_DEFS };
