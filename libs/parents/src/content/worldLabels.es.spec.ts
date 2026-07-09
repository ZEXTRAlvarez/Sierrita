import { WORLD_LABEL } from './worldLabels.es';

describe('WORLD_LABEL', () => {
  it.each([
    ['jungle', '🌿 Selva'],
    ['ocean', '🌊 Océano'],
    ['space', '🚀 Espacio'],
  ] as const)('maps %s to %s', (world, expected) => {
    expect(WORLD_LABEL[world]).toBe(expected);
  });
});
