import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DecomposeMode } from './DecomposeMode';

describe('DecomposeMode', () => {
  const problem = { number: 347, hundreds: 3, tens: 4, units: 7 };

  it('renders the number, the C/D/U labels and 4 options per digit', () => {
    const { getByText, getAllByTestId } = render(
      <DecomposeMode problem={problem} onAnswer={jest.fn()} result="idle" />,
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
      <DecomposeMode problem={problem} onAnswer={onAnswer} result="idle" />,
    );

    fireEvent.press(getAllByTestId('decompose-digit-h')[0]);
    fireEvent.press(getAllByTestId('decompose-digit-d')[0]);
    fireEvent.press(getAllByTestId('decompose-digit-u')[0]);

    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(expect.any(Boolean));
  });
});
