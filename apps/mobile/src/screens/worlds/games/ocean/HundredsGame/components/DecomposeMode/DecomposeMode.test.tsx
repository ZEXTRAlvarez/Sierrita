import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import type { DecomposeRound } from '../../logic/buildRound';
import { DecomposeMode } from './DecomposeMode';

const round: DecomposeRound = {
  mode: 'decompose',
  problem: { number: 347, hundreds: 3, tens: 4, units: 7 },
  options: {
    hundreds: [1, 3, 5, 8],
    tens: [4, 0, 6, 9],
    units: [2, 7, 3, 5],
  },
};

describe('DecomposeMode', () => {
  it('renders the number, the C/D/U labels and 4 options per digit', () => {
    const { getByText, getAllByTestId } = render(
      <DecomposeMode round={round} onAnswer={jest.fn()} result="idle" />,
    );

    expect(getByText('347')).toBeTruthy();
    expect(getByText('C')).toBeTruthy();
    expect(getByText('D')).toBeTruthy();
    expect(getByText('U')).toBeTruthy();
    expect(getAllByTestId('decompose-digit-h')).toHaveLength(4);
    expect(getAllByTestId('decompose-digit-d')).toHaveLength(4);
    expect(getAllByTestId('decompose-digit-u')).toHaveLength(4);
  });

  it('calls onAnswer once all three digits are picked', () => {
    const onAnswer = jest.fn();
    const { getAllByTestId } = render(
      <DecomposeMode round={round} onAnswer={onAnswer} result="idle" />,
    );

    fireEvent.press(getAllByTestId('decompose-digit-h')[1]);
    fireEvent.press(getAllByTestId('decompose-digit-d')[0]);
    fireEvent.press(getAllByTestId('decompose-digit-u')[1]);

    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(true);
  });

  it('clears the picked digits and the options when a new round arrives', () => {
    const onAnswer = jest.fn();
    const { getAllByTestId, rerender, getByText, queryByText } = render(
      <DecomposeMode round={round} onAnswer={onAnswer} result="idle" />,
    );

    fireEvent.press(getAllByTestId('decompose-digit-h')[1]);

    const next: DecomposeRound = {
      mode: 'decompose',
      problem: { number: 82, hundreds: 0, tens: 8, units: 2 },
      options: {
        hundreds: [0, 4, 6, 9],
        tens: [8, 1, 3, 5],
        units: [2, 6, 7, 9],
      },
    };
    rerender(<DecomposeMode round={next} onAnswer={onAnswer} result="idle" />);

    expect(getByText('82')).toBeTruthy();
    expect(queryByText('347')).toBeNull();

    fireEvent.press(getAllByTestId('decompose-digit-d')[0]);
    fireEvent.press(getAllByTestId('decompose-digit-u')[0]);

    expect(onAnswer).not.toHaveBeenCalled();

    fireEvent.press(getAllByTestId('decompose-digit-h')[0]);

    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(true);
  });
});
