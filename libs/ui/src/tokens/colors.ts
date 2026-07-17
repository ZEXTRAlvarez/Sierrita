// Named tokens for the 3 world accents — replaces the hex literals that were
// repeated ~60 times across apps/mobile screens.
export const worldAccentColors = {
  worldJungle: '#4CAF50',
  worldOcean: '#2196F3',
  worldSpace: '#9C27B0',
} as const;

export type WorldAccentKey = keyof typeof worldAccentColors;

export const brandColors = {
  brand50: '#E3F2FD',
  brand500: '#1976D2',
  brand700: '#1565C0',
  brand900: '#0D47A1',
} as const;

export const semanticColors = {
  success: '#4CAF50',
  error: '#F44336',
  backgroundApp: '#F5F9FF',
  backgroundCard: '#FFFFFF',
  textPrimary: '#222222',
  textMuted: '#777777',
  border: '#90CAF9',
} as const;

export const colorTokens = {
  ...worldAccentColors,
  ...brandColors,
  ...semanticColors,
} as const;

/** Higher-contrast variant of semanticColors for the accessibility "alto contraste" setting. */
export const highContrastColors = {
  success: '#1B5E20',
  error: '#B71C1C',
  backgroundApp: '#FFFFFF',
  backgroundCard: '#FFFFFF',
  textPrimary: '#000000',
  textMuted: '#333333',
  border: '#000000',
} as const;
