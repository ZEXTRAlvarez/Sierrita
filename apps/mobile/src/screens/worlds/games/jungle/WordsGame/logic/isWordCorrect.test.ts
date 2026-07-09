import { isWordCorrect } from './isWordCorrect';

describe('isWordCorrect', () => {
  it('is true when every chosen letter matches the word at its blank index', () => {
    // GATO, blanks at [1, 3] -> letters 'A' and 'O'
    expect(isWordCorrect(['A', 'O'], 'GATO', [1, 3])).toBe(true);
  });

  it('is false when any chosen letter is wrong', () => {
    expect(isWordCorrect(['A', 'X'], 'GATO', [1, 3])).toBe(false);
  });

  it('is true with no blanks (vacuously)', () => {
    expect(isWordCorrect([], 'SOL', [])).toBe(true);
  });

  it('is false when a slot is still empty', () => {
    expect(isWordCorrect(['A', null], 'GATO', [1, 3])).toBe(false);
  });
});
