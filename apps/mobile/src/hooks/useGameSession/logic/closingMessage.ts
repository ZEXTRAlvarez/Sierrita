/** Spoken closing line once a game session ends, based on the stars earned. */
export function closingMessage(stars: 1 | 2 | 3): string {
  if (stars === 3) return '¡Tres estrellas! ¡Sos una estrella!';
  if (stars === 2) return '¡Muy bien! ¡Dos estrellas!';
  return '¡Lo intentaste muy bien!';
}
