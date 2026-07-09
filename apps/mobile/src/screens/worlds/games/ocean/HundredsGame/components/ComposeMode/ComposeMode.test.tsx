import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ComposeMode } from './ComposeMode';

describe('ComposeMode', () => {
  const problem = { number: 347, hundreds: 3, tens: 4, units: 7 };

  it('shows the H/D/U expression and 4 number options', () => {
    const { getByText, getAllByTestId } = render(
      <ComposeMode problem={problem} maxNumber={999} onAnswer={jest.fn()} result="idle" />,
    );

    expect(getByText('3 C')).toBeTruthy();
    expect(getByText('4 D')).toBeTruthy();
    expect(getByText('7 U')).toBeTruthy();
    expect(getAllByTestId('compose-option')).toHaveLength(4);
  });

  it('reports true only when the composed number is chosen', () => {
    const onAnswer = jest.fn();
    const { getByText } = render(
      <ComposeMode problem={problem} maxNumber={999} onAnswer={onAnswer} result="idle" />,
    );

    fireEvent.press(getByText('347'));

    expect(onAnswer).toHaveBeenCalledWith(true);
  });
});
