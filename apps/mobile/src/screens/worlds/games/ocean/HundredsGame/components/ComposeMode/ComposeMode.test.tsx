import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import type { ComposeRound } from '../../logic/buildRound';
import { ComposeMode } from './ComposeMode';

const round: ComposeRound = {
  mode: 'compose',
  problem: { number: 347, hundreds: 3, tens: 4, units: 7 },
  options: [340, 347, 351, 302],
};

describe('ComposeMode', () => {
  it('shows the H/D/U expression and 4 number options', () => {
    const { getByText, getAllByTestId } = render(
      <ComposeMode round={round} onAnswer={jest.fn()} result="idle" />,
    );

    expect(getByText('3 C')).toBeTruthy();
    expect(getByText('4 D')).toBeTruthy();
    expect(getByText('7 U')).toBeTruthy();
    expect(getAllByTestId('compose-option')).toHaveLength(4);
  });

  it('reports true only when the composed number is chosen', () => {
    const onAnswer = jest.fn();
    const { getByText } = render(
      <ComposeMode round={round} onAnswer={onAnswer} result="idle" />,
    );

    fireEvent.press(getByText('340'));
    expect(onAnswer).toHaveBeenLastCalledWith(false);

    fireEvent.press(getByText('347'));
    expect(onAnswer).toHaveBeenLastCalledWith(true);
  });

  it('swaps to the options of the round it is given', () => {
    const { getByText, rerender, queryByText } = render(
      <ComposeMode round={round} onAnswer={jest.fn()} result="idle" />,
    );

    const next: ComposeRound = {
      mode: 'compose',
      problem: { number: 128, hundreds: 1, tens: 2, units: 8 },
      options: [128, 130, 118, 125],
    };
    rerender(<ComposeMode round={next} onAnswer={jest.fn()} result="idle" />);

    expect(getByText('128')).toBeTruthy();
    expect(queryByText('347')).toBeNull();
  });
});
