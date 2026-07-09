import { getLetterDef, getLetterSet, ALL_LETTER_DEFS } from './letterPaths';

describe('getLetterSet', () => {
  it('returns the 5 vowels', () => {
    expect(getLetterSet('vowels')).toEqual(['A', 'E', 'I', 'O', 'U']);
  });

  it('returns the 7 easy consonants', () => {
    expect(getLetterSet('consonants-easy')).toEqual(['L', 'M', 'N', 'P', 'S', 'T', 'C']);
  });

  it('returns all 12 letters', () => {
    expect(getLetterSet('all')).toHaveLength(12);
    expect(getLetterSet('all')).toEqual(ALL_LETTER_DEFS.map((d) => d.letter));
  });
});

describe('getLetterDef', () => {
  it('resolves a known letter', () => {
    expect(getLetterDef('A')?.letter).toBe('A');
  });

  it('is case-insensitive', () => {
    expect(getLetterDef('a')?.letter).toBe('A');
  });

  it('returns undefined for an unknown letter', () => {
    expect(getLetterDef('Z')).toBeUndefined();
  });
});
