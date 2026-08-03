import React from 'react';
import { render, fireEvent, within } from '@testing-library/react-native';
import { PalitosTray } from './PalitosTray';

/** Sticks live inside whichever box matches their state, so always re-query. */
function counts(api: ReturnType<typeof render>) {
  return {
    inCountArea: within(api.getByTestId('palitos-count-area')).queryAllByTestId(
      'palito',
    ).length,
    inTray: within(api.getByTestId('palitos-tray')).queryAllByTestId('palito')
      .length,
  };
}

function placeSticks(api: ReturnType<typeof render>, howMany: number) {
  for (let i = 0; i < howMany; i++) {
    const loose = within(api.getByTestId('palitos-tray')).getAllByTestId(
      'palito',
    );
    fireEvent.press(loose[0]);
  }
}

describe('PalitosTray', () => {
  it('starts with the 20 sticks in the tray and an empty count area hint', () => {
    const api = render(<PalitosTray />);

    expect(api.getAllByTestId('palito')).toHaveLength(20);
    expect(counts(api)).toEqual({ inCountArea: 0, inTray: 20 });
    expect(
      api.getByText('Arrastrá palitos acá si necesitás contar 🤏'),
    ).toBeTruthy();
  });

  it('moves a stick into the count area and back out, keeping 20 in total', () => {
    const api = render(<PalitosTray />);

    placeSticks(api, 1);
    expect(counts(api)).toEqual({ inCountArea: 1, inTray: 19 });

    const placed = within(api.getByTestId('palitos-count-area')).getAllByTestId(
      'palito',
    );
    fireEvent.press(placed[0]);
    expect(counts(api)).toEqual({ inCountArea: 0, inTray: 20 });
    expect(api.queryByTestId('palitos-decena-badge')).toBeNull();
  });

  it('shows the decena badge once 10 sticks are in the count area', () => {
    const api = render(<PalitosTray />);

    placeSticks(api, 9);
    expect(api.queryByTestId('palitos-decena-badge')).toBeNull();

    placeSticks(api, 1);
    expect(api.getByTestId('palitos-decena-badge')).toBeTruthy();
    expect(counts(api)).toEqual({ inCountArea: 10, inTray: 10 });
  });

  it('swaps the hints when the tray runs out of sticks', () => {
    const api = render(<PalitosTray />);

    placeSticks(api, 20);

    expect(counts(api)).toEqual({ inCountArea: 20, inTray: 0 });
    expect(api.getByText('Ya contaste todos los palitos 👆')).toBeTruthy();
    expect(
      api.queryByText('Arrastrá palitos acá si necesitás contar 🤏'),
    ).toBeNull();
  });
});
