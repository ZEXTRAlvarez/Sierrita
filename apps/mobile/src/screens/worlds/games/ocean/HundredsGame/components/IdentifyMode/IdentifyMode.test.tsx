import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { IdentifyMode } from './IdentifyMode';

describe('IdentifyMode', () => {
  it('shows the number and 4 answer options', () => {
    const { getByText, getAllByTestId } = render(
      <IdentifyMode
        problem={{ number: 347, hundreds: 3, tens: 4, units: 7 }}
        onAnswer={jest.fn()}
        result="idle"
      />,
    );

    expect(getByText('347')).toBeTruthy();
    expect(getAllByTestId('identify-option')).toHaveLength(4);
  });

  it('reports whether the pressed option matches the correct digit', () => {
    const onAnswer = jest.fn();
    const { getAllByTestId } = render(
      <IdentifyMode
        problem={{ number: 58, hundreds: 0, tens: 5, units: 8 }}
        onAnswer={onAnswer}
        result="idle"
      />,
    );

    fireEvent.press(getAllByTestId('identify-option')[0]);

    expect(onAnswer).toHaveBeenCalledWith(expect.any(Boolean));
  });
});
