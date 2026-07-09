/** Renders a word for the speech prompt, replacing each blank letter with '...'. */
export function spellWord(word: string, blankIdx: number[]): string {
  return word
    .split('')
    .map((letter, i) => (blankIdx.includes(i) ? '...' : letter))
    .join(' ');
}
