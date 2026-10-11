import { decompose } from './decompose';

describe('decompose', () => {
  it('splits a 3-digit number into thousands, hundreds, tens and units', () => {
    expect(decompose(347)).toEqual({
      thousands: 0,
      hundreds: 3,
      tens: 4,
      units: 7,
    });
  });

  it('has zero hundreds for 2-digit numbers', () => {
    expect(decompose(58)).toEqual({
      thousands: 0,
      hundreds: 0,
      tens: 5,
      units: 8,
    });
  });

  it('handles exact hundreds with no remainder', () => {
    expect(decompose(300)).toEqual({
      thousands: 0,
      hundreds: 3,
      tens: 0,
      units: 0,
    });
  });

  it('recognizes exactly 1000 as 1 thousand and no hundreds/tens/units', () => {
    expect(decompose(1000)).toEqual({
      thousands: 1,
      hundreds: 0,
      tens: 0,
      units: 0,
    });
  });
});
