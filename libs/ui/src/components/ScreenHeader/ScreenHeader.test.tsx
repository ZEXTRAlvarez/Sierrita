import { fireEvent } from '@testing-library/react-native';
import { renderWithTamagui } from '../../testing/renderWithTamagui';
import { ScreenHeader } from './ScreenHeader';

describe('ScreenHeader', () => {
  it('renders the title', () => {
    const { getByText } = renderWithTamagui(<ScreenHeader title="Zona de Padres" />);

    expect(getByText('Zona de Padres')).toBeTruthy();
  });

  it('does not render a close button when onClose is not provided', () => {
    const { queryByLabelText } = renderWithTamagui(<ScreenHeader title="Zona de Padres" />);

    expect(queryByLabelText('Cerrar')).toBeNull();
  });

  it('calls onClose when the close button is tapped', () => {
    const onClose = jest.fn();
    const { getByLabelText } = renderWithTamagui(<ScreenHeader title="Zona de Padres" onClose={onClose} />);

    fireEvent.press(getByLabelText('Cerrar'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
