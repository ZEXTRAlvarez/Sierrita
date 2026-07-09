import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { NameStep } from './NameStep';

describe('NameStep', () => {
  it('calls onChangeName as the user types', () => {
    const onChangeName = jest.fn();
    const { getByPlaceholderText } = render(
      <NameStep name="" onChangeName={onChangeName} onNext={jest.fn()} />,
    );

    fireEvent.changeText(getByPlaceholderText('Tu nombre...'), 'Sofía');

    expect(onChangeName).toHaveBeenCalledWith('Sofía');
  });

  it('does not advance when the name is blank', () => {
    const onNext = jest.fn();
    const { getByText } = render(<NameStep name="" onChangeName={jest.fn()} onNext={onNext} />);

    fireEvent.press(getByText('¡Siguiente!'));

    expect(onNext).not.toHaveBeenCalled();
  });

  it('advances when a name has been entered', () => {
    const onNext = jest.fn();
    const { getByText } = render(<NameStep name="Sofía" onChangeName={jest.fn()} onNext={onNext} />);

    fireEvent.press(getByText('¡Siguiente!'));

    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
