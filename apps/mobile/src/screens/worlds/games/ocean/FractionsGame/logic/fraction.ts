export interface Fraction {
  numerator: number;
  denominator: number;
}

export function fractionLabel(f: Fraction): string {
  return `${f.numerator}/${f.denominator}`;
}

export function fractionValue(f: Fraction): number {
  return f.numerator / f.denominator;
}

export function fractionsEqual(a: Fraction, b: Fraction): boolean {
  return fractionValue(a) === fractionValue(b);
}
