import { spellWord } from './spellWord';

describe('spellWord', () => {
  it('keeps every letter when there are no blanks', () => {
    expect(spellWord('SOL', [])).toBe('S O L');
  });

  it('replaces all letters when every index is blank', () => {
    expect(spellWord('PEZ', [0, 1, 2])).toBe('... ... ...');
  });

  it('mixes letters and blanks at the given positions', () => {
    expect(spellWord('GATO', [1, 3])).toBe('G ... T ...');
  });
});
