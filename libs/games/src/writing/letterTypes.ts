// Paths normalizados en espacio 0-100 × 0-100
// Se escalan al tamaño del canvas en runtime

export interface Checkpoint {
  x: number; // 0-100
  y: number; // 0-100
  r: number; // radio de detección (en unidades normalizadas)
}

export interface LetterDef {
  letter: string;
  guidePath: string; // SVG path en espacio 0-100 (imprenta mayúscula)
  cursivePath?: string; // variante cursiva (minúscula ligada) — forma propia, no es guidePath curvado
  checkpoints: Checkpoint[]; // waypoints que el trazo de imprenta debe cubrir, en orden
  strokes: number; // cantidad de trazos separados (imprenta)
  startHint: { x: number; y: number }; // dónde iniciar el trazo de imprenta
  cursiveCheckpoints?: Checkpoint[]; // waypoints del trazo cursivo, en orden — la forma cursiva es geométricamente distinta de la de imprenta, así que necesita su propia secuencia
  cursiveStrokes?: number; // cantidad de trazos separados (cursiva); por defecto `strokes` si no se especifica
  cursiveStartHint?: { x: number; y: number }; // dónde iniciar el trazo cursivo
}
