/** Splits a number into hundreds/tens/units digits. */
export function decompose(n: number): { hundreds: number; tens: number; units: number } {
  const hundreds = Math.floor(n / 100);
  const tens     = Math.floor((n % 100) / 10);
  const units    = n % 10;
  return { hundreds, tens, units };
}
