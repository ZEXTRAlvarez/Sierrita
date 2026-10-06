import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FractionShape } from './FractionShape';

describe('FractionShape', () => {
  it('renders one segment per part', () => {
    const { getAllByTestId } = render(
      <FractionShape parts={4} filled={[0, 1]} />,
    );

    expect(getAllByTestId('fraction-segment')).toHaveLength(4);
  });

  it('is not tappable when onToggleSegment is not given', () => {
    const { getAllByTestId } = render(<FractionShape parts={3} filled={[]} />);

    // A plain View ignores onPress-less taps; this just documents the
    // read-only usage (identify/compare) doesn't crash on press.
    fireEvent.press(getAllByTestId('fraction-segment')[0]);
  });

  it('reports the tapped segment index when interactive', () => {
    const onToggleSegment = jest.fn();
    const { getAllByTestId } = render(
      <FractionShape parts={3} filled={[]} onToggleSegment={onToggleSegment} />,
    );

    fireEvent.press(getAllByTestId('fraction-segment')[2]);

    expect(onToggleSegment).toHaveBeenCalledWith(2);
  });
});
