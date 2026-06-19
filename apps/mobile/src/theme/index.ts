import { createTamagui } from '@tamagui/core';
import { tokens, themes, fonts, animations, shorthands, media } from '@tamagui/config/v4';

const tamaguiConfig = createTamagui({
  fonts,
  tokens,
  themes,
  animations,
  shorthands,
  media,
  settings: {
    allowedStyleValues: 'somewhat-strict',
    autocompleteSpecificTokens: 'except-special',
  },
});

export type AppConfig = typeof tamaguiConfig;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
