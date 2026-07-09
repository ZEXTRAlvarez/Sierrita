/** True when every chosen letter matches the target word at its blank index. */
export function isWordCorrect(
  chosen: (string | null)[],
  word: string,
  blankIndices: number[],
): boolean {
  return blankIndices.every((blankIdx, i) => chosen[i] === word[blankIdx]);
}
