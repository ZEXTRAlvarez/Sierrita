import { fractionLabel, fractionValue, fractionsEqual } from './fraction';

describe('fraction helpers', () => {
  it('formats a fraction as numerator/denominator', () => {
    expect(fractionLabel({ numerator: 3, denominator: 4 })).toBe('3/4');
  });

  it('computes the decimal value', () => {
    expect(fractionValue({ numerator: 1, denominator: 2 })).toBe(0.5);
  });

  it('treats equivalent fractions as equal', () => {
    expect(
      fractionsEqual(
        { numerator: 1, denominator: 2 },
        { numerator: 2, denominator: 4 },
      ),
    ).toBe(true);
  });

  it('treats different fractions as not equal', () => {
    expect(
      fractionsEqual(
        { numerator: 1, denominator: 3 },
        { numerator: 1, denominator: 4 },
      ),
    ).toBe(false);
  });
});
