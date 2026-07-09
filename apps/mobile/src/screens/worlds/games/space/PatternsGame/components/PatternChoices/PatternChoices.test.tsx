import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PatternChoices } from './PatternChoices';

describe('PatternChoices', () => {
  it('renders one button per choice and reports the pressed choice', () => {
    const onChoose = jest.fn();
    const { getAllByTestId } = render(
      <PatternChoices
        choices={['🔴', '🔵']}
        answer="🔴"
        result="idle"
        onChoose={onChoose}
      />,
    );

    const buttons = getAllByTestId('pattern-choice');
    expect(buttons).toHaveLength(2);

    fireEvent.press(buttons[1]);
    expect(onChoose).toHaveBeenCalledWith('🔵');
  });

  it('disables all buttons once a result is showing', () => {
    const onChoose = jest.fn();
    const { getAllByTestId } = render(
      <PatternChoices
        choices={['🔴', '🔵']}
        answer="🔴"
        result="correct"
        onChoose={onChoose}
      />,
    );

    fireEvent.press(getAllByTestId('pattern-choice')[0]);
    expect(onChoose).not.toHaveBeenCalled();
  });
});
