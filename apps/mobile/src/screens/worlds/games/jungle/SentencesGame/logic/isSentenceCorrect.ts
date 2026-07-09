/** True when the placed words are in the exact same order as the target sentence. */
export function isSentenceCorrect(placed: string[], correctWords: string[]): boolean {
  return placed.join(' ') === correctWords.join(' ');
}
