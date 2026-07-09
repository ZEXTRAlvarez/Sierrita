import { fillFirstEmpty, eraseLast } from './chosenLetters';

describe('fillFirstEmpty', () => {
  it('fills the first null slot with the given letter', () => {
    expect(fillFirstEmpty([null, null], 'A')).toEqual(['A', null]);
  });

  it('fills the next empty slot when the first is already filled', () => {
    expect(fillFirstEmpty(['A', null], 'B')).toEqual(['A', 'B']);
  });

  it('is a no-op when every slot is already filled', () => {
    expect(fillFirstEmpty(['A', 'B'], 'C')).toEqual(['A', 'B']);
  });
});

describe('eraseLast', () => {
  it('clears the last filled slot', () => {
    expect(eraseLast(['A', 'B', null])).toEqual(['A', null, null]);
  });

  it('is a no-op when every slot is already empty', () => {
    expect(eraseLast([null, null])).toEqual([null, null]);
  });
});
