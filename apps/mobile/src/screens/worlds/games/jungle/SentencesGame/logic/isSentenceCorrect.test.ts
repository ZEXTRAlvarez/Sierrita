import { isSentenceCorrect } from './isSentenceCorrect';

describe('isSentenceCorrect', () => {
  it('is true when the words match the target order exactly', () => {
    expect(isSentenceCorrect(['EL', 'GATO', 'DUERME'], ['EL', 'GATO', 'DUERME'])).toBe(true);
  });

  it('is false when the words are out of order', () => {
    expect(isSentenceCorrect(['GATO', 'EL', 'DUERME'], ['EL', 'GATO', 'DUERME'])).toBe(false);
  });

  it('is false when a word differs', () => {
    expect(isSentenceCorrect(['EL', 'PERRO', 'DUERME'], ['EL', 'GATO', 'DUERME'])).toBe(false);
  });

  it('is false when fewer words have been placed than the target', () => {
    expect(isSentenceCorrect(['EL', 'GATO'], ['EL', 'GATO', 'DUERME'])).toBe(false);
  });
});
