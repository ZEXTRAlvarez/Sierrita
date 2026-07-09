import React from 'react';
import { render } from '@testing-library/react-native';
import type { RenderOptions } from '@testing-library/react-native';
import { TamaguiProvider } from '@tamagui/core';
import tamaguiConfig from '../theme/tamaguiConfig';

/** RTL render() wrapped in the app's TamaguiProvider, for testing components in ../components. */
export function renderWithTamagui(ui: React.ReactElement, options?: RenderOptions) {
  return render(
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      {ui}
    </TamaguiProvider>,
    options,
  );
}
