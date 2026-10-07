/**
 * Checks whether `placedLabels` matches `correctLabels` in order. For a
 * circular cycle, any rotation of the correct order is accepted too — the
 * child can start at any stage, as long as the cyclic sequence afterwards is
 * right (reversing the direction is not accepted, only forward rotations).
 */
export function isValidCycleOrder(
  placedLabels: string[],
  correctLabels: string[],
  isCircular: boolean,
): boolean {
  if (placedLabels.length !== correctLabels.length) return false;

  if (!isCircular) {
    return placedLabels.every((label, i) => label === correctLabels[i]);
  }

  for (let shift = 0; shift < correctLabels.length; shift++) {
    const rotated = [
      ...correctLabels.slice(shift),
      ...correctLabels.slice(0, shift),
    ];
    if (placedLabels.every((label, i) => label === rotated[i])) return true;
  }
  return false;
}
