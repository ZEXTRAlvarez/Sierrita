import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import {
  AccessibilityProvider,
  useAccessibility,
} from './AccessibilityContext';

function Probe() {
  const { fontScale, highContrast, colors, scaledFontSize } =
    useAccessibility();
  return (
    <Text testID="probe">
      {fontScale}|{String(highContrast)}|{colors.textPrimary}|
      {scaledFontSize(14)}
    </Text>
  );
}

describe('AccessibilityProvider / useAccessibility', () => {
  it('defaults to normal font scale and standard colors when used without a provider', () => {
    const { getByTestId } = render(<Probe />);

    expect(getByTestId('probe').props.children.join('')).toBe(
      'normal|false|#222222|14',
    );
  });

  it('scales font sizes up and swaps in high-contrast colors when configured', () => {
    const { getByTestId } = render(
      <AccessibilityProvider fontScale="large" highContrast>
        <Probe />
      </AccessibilityProvider>,
    );

    expect(getByTestId('probe').props.children.join('')).toBe(
      'large|true|#000000|16',
    );
  });

  it('defaults to normal/no-contrast when the provider is given no props', () => {
    const { getByTestId } = render(
      <AccessibilityProvider>
        <Probe />
      </AccessibilityProvider>,
    );

    expect(getByTestId('probe').props.children.join('')).toBe(
      'normal|false|#222222|14',
    );
  });
});
