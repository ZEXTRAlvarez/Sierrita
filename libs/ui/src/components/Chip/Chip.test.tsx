import { fireEvent } from '@testing-library/react-native';
import { renderWithTamagui } from '../../testing/renderWithTamagui';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders the label', () => {
    const { getByText } = renderWithTamagui(<Chip label="30min" />);

    expect(getByText('30min')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTamagui(<Chip label="30min" onPress={onPress} />);

    fireEvent.press(getByText('30min'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('defaults to unselected', () => {
    const { getByRole } = renderWithTamagui(<Chip label="30min" />);

    expect(getByRole('button').props.accessibilityState).toMatchObject({ selected: false });
  });

  it('reflects selected state via accessibilityState', () => {
    const { getByRole } = renderWithTamagui(<Chip label="30min" selected />);

    expect(getByRole('button').props.accessibilityState).toMatchObject({ selected: true });
  });
});
