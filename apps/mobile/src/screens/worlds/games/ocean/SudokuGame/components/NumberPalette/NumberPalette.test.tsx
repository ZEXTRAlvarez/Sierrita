import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NumberPalette } from './NumberPalette';

describe('NumberPalette', () => {
  it('renders one button per number up to size', () => {
    const { getAllByTestId } = render(
      <NumberPalette size={9} answer={5} result="idle" onChoose={jest.fn()} />,
    );

    expect(getAllByTestId('sudoku-number-choice')).toHaveLength(9);
  });

  it('calls onChoose with the tapped number', () => {
    const onChoose = jest.fn();
    const { getAllByTestId } = render(
      <NumberPalette size={4} answer={2} result="idle" onChoose={onChoose} />,
    );

    fireEvent.press(getAllByTestId('sudoku-number-choice')[2]); // number "3"

    expect(onChoose).toHaveBeenCalledWith(3);
  });
});
