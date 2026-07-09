import { getEvolutionLabel } from './evolutionLabels.es';

describe('getEvolutionLabel', () => {
  it.each([
    [0, 'Bebé'],
    [1, 'Niño'],
    [2, 'Joven'],
    [3, 'Adulto'],
  ] as const)('maps stage %i to %s', (stage, expected) => {
    expect(getEvolutionLabel(stage)).toBe(expected);
  });
});
