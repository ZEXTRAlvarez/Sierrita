import React from 'react';
import { render } from '@testing-library/react-native';
import type { RenderOptions } from '@testing-library/react-native';
import { TamaguiProvider } from '@tamagui/core';
import { tamaguiConfig } from '@sierrita/ui';

/** RTL render() wrapped in the app's TamaguiProvider, for components using @sierrita/ui. */
export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  return render(
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      {ui}
    </TamaguiProvider>,
    options,
  );
}
