// Paths normalizados en espacio 0-100 × 0-100
// Se escalan al tamaño del canvas en runtime

export interface Checkpoint {
  x: number; // 0-100
  y: number; // 0-100
  r: number; // radio de detección (en unidades normalizadas)
}

export interface LetterDef {
  letter: string;
  guidePath: string; // SVG path en espacio 0-100
  cursivePath?: string; // variante cursiva
  checkpoints: Checkpoint[]; // waypoints que el trazo debe cubrir
  strokes: number; // cantidad de trazos separados
  startHint: { x: number; y: number }; // dónde iniciar el trazo
}
