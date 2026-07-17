import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { semanticColors, highContrastColors } from '../tokens/colors';

export type FontScale = 'normal' | 'large';

const FONT_SCALE_MULTIPLIER: Record<FontScale, number> = {
  normal: 1,
  large: 1.15,
};

export type ColorPalette = { [K in keyof typeof semanticColors]: string };

export interface AccessibilityContextValue {
  fontScale: FontScale;
  highContrast: boolean;
  colors: ColorPalette;
  scaledFontSize: (base: number) => number;
}

const defaultValue: AccessibilityContextValue = {
  fontScale: 'normal',
  highContrast: false,
  colors: semanticColors,
  scaledFontSize: (base) => base,
};

const AccessibilityContext =
  createContext<AccessibilityContextValue>(defaultValue);

export interface AccessibilityProviderProps {
  fontScale?: FontScale;
  highContrast?: boolean;
  children: ReactNode;
}

export function AccessibilityProvider({
  fontScale = 'normal',
  highContrast = false,
  children,
}: AccessibilityProviderProps) {
  const value = useMemo<AccessibilityContextValue>(
    () => ({
      fontScale,
      highContrast,
      colors: highContrast ? highContrastColors : semanticColors,
      scaledFontSize: (base: number) =>
        Math.round(base * FONT_SCALE_MULTIPLIER[fontScale]),
    }),
    [fontScale, highContrast],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  return useContext(AccessibilityContext);
}
