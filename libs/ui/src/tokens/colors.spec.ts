import { colorTokens, worldAccentColors, semanticColors, highContrastColors } from './colors';

describe('colorTokens', () => {
  it('has the correct world accent hex values (guards against silent typos)', () => {
    expect(worldAccentColors.worldJungle).toBe('#4CAF50');
    expect(worldAccentColors.worldOcean).toBe('#2196F3');
    expect(worldAccentColors.worldSpace).toBe('#9C27B0');
  });

  it('merges world, brand and semantic colors into one lookup', () => {
    expect(colorTokens.worldJungle).toBeDefined();
    expect(colorTokens.brand700).toBeDefined();
    expect(colorTokens.error).toBeDefined();
  });
});

describe('highContrastColors', () => {
  it('has the same keys as semanticColors', () => {
    expect(Object.keys(highContrastColors).sort()).toEqual(
      Object.keys(semanticColors).sort(),
    );
  });

  it('uses pure black text on a pure white background', () => {
    expect(highContrastColors.textPrimary).toBe('#000000');
    expect(highContrastColors.backgroundCard).toBe('#FFFFFF');
  });
});
