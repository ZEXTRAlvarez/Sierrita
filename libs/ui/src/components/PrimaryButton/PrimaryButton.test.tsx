import { fireEvent } from '@testing-library/react-native';
import { renderWithTamagui } from '../../testing/renderWithTamagui';
import { PrimaryButton } from './PrimaryButton';

describe('PrimaryButton', () => {
  it('renders the label', () => {
    const { getByText } = renderWithTamagui(<PrimaryButton label="Guardar" />);

    expect(getByText('Guardar')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTamagui(<PrimaryButton label="Guardar" onPress={onPress} />);

    fireEvent.press(getByText('Guardar'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('marks itself disabled to assistive tech and blocks pointer events when disabled', () => {
    // fireEvent.press() dispatches straight to the onPress prop and doesn't
    // perform real hit-testing, so it can't observe pointerEvents:'none' the
    // way an actual touch would — assert on the mechanism Tamagui's Button
    // actually uses to block presses instead (see @tamagui/button's
    // `disabled` variant).
    const { getByRole } = renderWithTamagui(<PrimaryButton label="Guardar" disabled />);

    const button = getByRole('button');
    expect(button.props.accessibilityState).toMatchObject({ disabled: true });
    expect(button.props.pointerEvents).toBe('none');
    expect(button.props.onPress).toBeUndefined();
  });
});
