import { getSentences, shuffleWords } from './sentenceData';

describe('getSentences', () => {
  it.each([3, 4, 5] as const)('returns sentences with %i words each', (wordCount) => {
    const sentences = getSentences(wordCount, 3);

    expect(sentences.length).toBeGreaterThan(0);
    for (const s of sentences) expect(s.words).toHaveLength(wordCount);
  });

  it('never returns more than the requested count', () => {
    expect(getSentences(3, 1)).toHaveLength(1);
  });
});

describe('shuffleWords', () => {
  it('returns a permutation containing the same words', () => {
    const words = ['EL', 'GATO', 'DUERME', 'AHORA'];

    const shuffled = shuffleWords(words);

    expect(shuffled).toHaveLength(words.length);
    expect([...shuffled].sort()).toEqual([...words].sort());
  });

  it('returns a different order than the input for words.length > 1', () => {
    const words = ['EL', 'GATO', 'DUERME', 'AHORA'];

    const shuffled = shuffleWords(words);

    expect(shuffled.join('')).not.toBe(words.join(''));
  });

  it('returns the same single word unchanged (no infinite loop for length 1)', () => {
    expect(shuffleWords(['SOLO'])).toEqual(['SOLO']);
  });
});
