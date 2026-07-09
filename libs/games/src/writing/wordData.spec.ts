import { getWords, getBlanks, getLetterOptions } from './wordData';

describe('getWords', () => {
  it('returns only words matching the requested length', () => {
    const words = getWords(4, 'mixed', 20);

    expect(words.length).toBeGreaterThan(0);
    for (const w of words) expect(w.word).toHaveLength(4);
  });

  it('filters by category when not "mixed"', () => {
    const words = getWords(3, 'animals', 20);

    expect(words.length).toBeGreaterThan(0);
    for (const w of words) expect(w.category).toBe('animals');
  });

  it('never returns more than the requested count', () => {
    const words = getWords(4, 'mixed', 2);

    expect(words.length).toBeLessThanOrEqual(2);
  });
});

describe('getBlanks', () => {
  it('returns the requested number of indices, sorted ascending', () => {
    const blanks = getBlanks('GATO', 2);

    expect(blanks).toHaveLength(2);
    expect(blanks).toEqual([...blanks].sort((a, b) => a - b));
  });

  it('returns indices within the bounds of the word', () => {
    const blanks = getBlanks('CASA', 3);

    for (const i of blanks) {
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan('CASA'.length);
    }
  });

  it('returns distinct indices', () => {
    const blanks = getBlanks('LIBRO', 4);

    expect(new Set(blanks).size).toBe(blanks.length);
  });
});

describe('getLetterOptions', () => {
  it('includes the correct letter(s) for the given blank indices', () => {
    const options = getLetterOptions('GATO', [0, 2]);

    expect(options).toEqual(expect.arrayContaining(['G', 'T']));
  });

  it('returns up to 6 options (fewer only if random distractors collide)', () => {
    const options = getLetterOptions('GATO', [0]);

    expect(options.length).toBeGreaterThan(0);
    expect(options.length).toBeLessThanOrEqual(6);
  });

  it('never repeats a letter', () => {
    const options = getLetterOptions('CASA', [0, 1]);

    expect(new Set(options).size).toBe(options.length);
  });
});
