import { decompose } from './decompose';

describe('decompose', () => {
  it('splits a 3-digit number into hundreds, tens and units', () => {
    expect(decompose(347)).toEqual({ hundreds: 3, tens: 4, units: 7 });
  });

  it('has zero hundreds for 2-digit numbers', () => {
    expect(decompose(58)).toEqual({ hundreds: 0, tens: 5, units: 8 });
  });

  it('handles exact hundreds with no remainder', () => {
    expect(decompose(300)).toEqual({ hundreds: 3, tens: 0, units: 0 });
  });
});
