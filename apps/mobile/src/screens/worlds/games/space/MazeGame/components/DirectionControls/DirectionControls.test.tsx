import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DirectionControls } from './DirectionControls';

describe('DirectionControls', () => {
  it('renders all four direction buttons and reports the pressed direction', () => {
    const onMove = jest.fn();
    const { getByTestId } = render(
      <DirectionControls canMove={() => true} onMove={onMove} />,
    );

    fireEvent.press(getByTestId('maze-dir-right'));
    expect(onMove).toHaveBeenCalledWith('right');

    fireEvent.press(getByTestId('maze-dir-top'));
    expect(onMove).toHaveBeenCalledWith('top');
  });

  it('still presses through for a blocked direction (the caller decides what to do)', () => {
    const onMove = jest.fn();
    const { getByTestId } = render(
      <DirectionControls canMove={(dir) => dir !== 'left'} onMove={onMove} />,
    );

    fireEvent.press(getByTestId('maze-dir-left'));
    expect(onMove).toHaveBeenCalledWith('left');
  });
});
