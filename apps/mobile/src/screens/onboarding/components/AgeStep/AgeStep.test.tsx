import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { AgeStep } from './AgeStep';

describe('AgeStep', () => {
  it('calls onSelectAge when an age pill is pressed', () => {
    const onSelectAge = jest.fn();
    const { getByText } = render(<AgeStep age={null} onSelectAge={onSelectAge} onNext={jest.fn()} />);

    fireEvent.press(getByText('5'));

    expect(onSelectAge).toHaveBeenCalledWith(5);
  });

  it('does not advance when no age is selected', () => {
    const onNext = jest.fn();
    const { getByText } = render(<AgeStep age={null} onSelectAge={jest.fn()} onNext={onNext} />);

    fireEvent.press(getByText('¡Siguiente!'));

    expect(onNext).not.toHaveBeenCalled();
  });

  it('advances once an age is selected', () => {
    const onNext = jest.fn();
    const { getByText } = render(<AgeStep age={5} onSelectAge={jest.fn()} onNext={onNext} />);

    fireEvent.press(getByText('¡Siguiente!'));

    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
