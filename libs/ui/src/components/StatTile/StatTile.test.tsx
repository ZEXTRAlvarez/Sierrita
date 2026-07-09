import { renderWithTamagui } from '../../testing/renderWithTamagui';
import { StatTile } from './StatTile';

describe('StatTile', () => {
  it('renders the value and label', () => {
    const { getByText } = renderWithTamagui(<StatTile value={12} label="partidas" />);

    expect(getByText('12')).toBeTruthy();
    expect(getByText('partidas')).toBeTruthy();
  });

  it('renders a string value as-is (e.g. a percentage)', () => {
    const { getByText } = renderWithTamagui(<StatTile value="82%" label="prom." />);

    expect(getByText('82%')).toBeTruthy();
  });
});
