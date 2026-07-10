import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PalitosTray } from './PalitosTray';

describe('PalitosTray', () => {
  it('renders 20 loose sticks and an empty count area hint', () => {
    const { getAllByTestId, getByText } = render(<PalitosTray />);

    expect(getAllByTestId('palito')).toHaveLength(20);
    expect(
      getByText('Arrastrá palitos acá si necesitás contar 🤏'),
    ).toBeTruthy();
  });

  it('tapping a stick places it, tapping again returns it — no decena badge yet', () => {
    const { getAllByTestId, queryByTestId } = render(<PalitosTray />);
    const sticks = getAllByTestId('palito');

    fireEvent.press(sticks[0]);
    fireEvent.press(sticks[1]);

    expect(queryByTestId('palitos-decena-badge')).toBeNull();

    fireEvent.press(sticks[0]); // return it
    expect(queryByTestId('palitos-decena-badge')).toBeNull();
  });

  it('shows the decena badge once 10 sticks are placed', () => {
    const { getAllByTestId, getByTestId } = render(<PalitosTray />);
    const sticks = getAllByTestId('palito');

    sticks.slice(0, 10).forEach((s) => fireEvent.press(s));

    expect(getByTestId('palitos-decena-badge')).toBeTruthy();
  });
});
