import { getDefaultPetName } from './petNames.es';

describe('getDefaultPetName', () => {
  it.each([
    ['dragon', 'Dragoncito'],
    ['bunny', 'Conejita'],
    ['dog', 'Perrito'],
    ['cat', 'Gatito'],
    ['rex', 'Rex'],
  ] as const)('maps %s to %s', (petType, expected) => {
    expect(getDefaultPetName(petType)).toBe(expected);
  });

  it('falls back to a generic name for an unrecognized pet type', () => {
    // @ts-expect-error — intentionally testing the fallback branch
    expect(getDefaultPetName('unknown')).toBe('Mascota');
  });
});
