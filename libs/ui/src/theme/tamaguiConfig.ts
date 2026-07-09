import type { TamaguiInternalConfig } from '@tamagui/core';
import { createTamagui } from '@tamagui/core';
import { tokens, themes, fonts, animations, shorthands, media } from '@tamagui/config/v4';

// Single source of truth for the app's Tamagui setup — relocated from
// apps/mobile/src/theme/index.ts, which is now a re-export shim (see
// apps/mobile/src/theme/index.ts). Sierrita's own design tokens (colors,
// spacing, radius, typography — see ../tokens) are consumed directly as
// plain values by the components in ../components rather than merged into
// this config, to avoid destabilizing Tamagui's own generated token/theme
// graph (v4's `tokens` here are already-built Variable instances, not raw
// input createTokens() can safely re-process).
// Explicit annotation avoids TS2742 (`tsc --emitDeclarationOnly` cannot name
// the fully-inferred config type without a non-portable reference into
// @tamagui/themes' generated internals).
const tamaguiConfig: TamaguiInternalConfig = createTamagui({
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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface -- standard Tamagui declaration-merging pattern
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
