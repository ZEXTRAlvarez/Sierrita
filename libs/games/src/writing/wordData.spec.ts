import {
  getWords,
  getBlanks,
  getForcedBlank,
  getLetterOptions,
  getPhoneticOptions,
} from './wordData';

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

  it('excludes focus-tagged words (H/soft-C) from the normal pool', () => {
    const words = getWords(4, 'mixed', 50);

    expect(words.length).toBeGreaterThan(0);
    for (const w of words) expect(w.focus).toBeUndefined();
  });

  it('returns only words tagged with the requested focus', () => {
    const hWords = getWords(4, 'mixed', 50, 'h');
    expect(hWords.length).toBeGreaterThan(0);
    for (const w of hWords) {
      expect(w.focus).toBe('h');
      expect(w.word).toContain('H');
    }

    const softCWords = getWords(4, 'mixed', 50, 'soft-c');
    expect(softCWords.length).toBeGreaterThan(0);
    for (const w of softCWords) {
      expect(w.focus).toBe('soft-c');
      expect(w.word).toContain('C');
    }
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

describe('getForcedBlank', () => {
  it('returns the index of the first occurrence of the target letter', () => {
    expect(getForcedBlank('HUEVO', 'H')).toEqual([0]);
    expect(getForcedBlank('BUHO', 'H')).toEqual([2]);
    expect(getForcedBlank('CIELO', 'C')).toEqual([0]);
    expect(getForcedBlank('DULCE', 'C')).toEqual([3]);
  });

  it('is case-insensitive about the target letter', () => {
    expect(getForcedBlank('HUEVO', 'h')).toEqual([0]);
  });

  it('falls back to a random single blank when the letter is absent', () => {
    const blank = getForcedBlank('GATO', 'H');
    expect(blank).toHaveLength(1);
    expect(blank[0]).toBeGreaterThanOrEqual(0);
    expect(blank[0]).toBeLessThan(4);
  });
});

describe('getPhoneticOptions', () => {
  it('always includes the correct letter', () => {
    const opts = getPhoneticOptions('HUEVO', 0, 'h');
    expect(opts).toContain('H');
  });

  it('includes S and Z as traps for a soft C', () => {
    const opts = getPhoneticOptions('CIELO', 0, 'soft-c');
    expect(opts).toEqual(expect.arrayContaining(['C', 'S', 'Z']));
  });

  it('includes the following letter as a trap for a silent H', () => {
    const opts = getPhoneticOptions('HUEVO', 0, 'h');
    expect(opts).toEqual(expect.arrayContaining(['H', 'U']));
  });

  it('returns exactly 4 unique options', () => {
    const opts = getPhoneticOptions('HACHA', 0, 'h');
    expect(opts).toHaveLength(4);
    expect(new Set(opts).size).toBe(4);
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
