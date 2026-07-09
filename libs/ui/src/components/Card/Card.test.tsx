import { Text } from 'tamagui';
import { renderWithTamagui } from '../../testing/renderWithTamagui';
import { Card } from './Card';

describe('Card', () => {
  it('renders its children', () => {
    const { getByText } = renderWithTamagui(
      <Card>
        <Text>Hola</Text>
      </Card>,
    );

    expect(getByText('Hola')).toBeTruthy();
  });
});
