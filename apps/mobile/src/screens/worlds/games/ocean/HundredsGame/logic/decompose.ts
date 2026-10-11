/**
 * Splits a number into thousands/hundreds/tens/units digits. `thousands` is
 * 0 for every number below 1000 and 1 exactly at 1000 — the game's range
 * never goes past the thousand itself ("familia del 1000").
 */
export function decompose(n: number): {
  thousands: number;
  hundreds: number;
  tens: number;
  units: number;
} {
  const thousands = Math.floor(n / 1000);
  const hundreds = Math.floor((n % 1000) / 100);
  const tens = Math.floor((n % 100) / 10);
  const units = n % 10;
  return { thousands, hundreds, tens, units };
}
