import { getClassifiedWord, getSentenceWithTarget } from './wordClassData';

describe('getClassifiedWord', () => {
  it('returns a word with a valid word class', () => {
    for (let i = 0; i < 20; i++) {
      const w = getClassifiedWord();
      expect(['noun', 'verb', 'adjective']).toContain(w.wordClass);
      expect(w.word.length).toBeGreaterThan(0);
    }
  });

  it('can return words of every class across enough draws', () => {
    const classes = new Set(
      Array.from({ length: 30 }, () => getClassifiedWord().wordClass),
    );
    expect(classes.has('noun')).toBe(true);
    expect(classes.has('verb')).toBe(true);
    expect(classes.has('adjective')).toBe(true);
  });
});

describe('getSentenceWithTarget', () => {
  it('always marks a target word that exists at targetIndex', () => {
    for (let i = 0; i < 20; i++) {
      const s = getSentenceWithTarget();
      expect(s.targetIndex).toBeGreaterThanOrEqual(0);
      expect(s.targetIndex).toBeLessThan(s.words.length);
      expect(['noun', 'verb', 'adjective']).toContain(s.targetClass);
    }
  });
});
