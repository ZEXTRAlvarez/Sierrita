import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { PetStep } from './PetStep';

describe('PetStep', () => {
  it('calls onSelectPet when a pet option is pressed', () => {
    const onSelectPet = jest.fn();
    const { getByText } = render(
      <PetStep
        pet={null}
        saving={false}
        onSelectPet={onSelectPet}
        onCreate={jest.fn()}
      />,
    );

    fireEvent.press(getByText('Dragoncito'));

    expect(onSelectPet).toHaveBeenCalledWith('dragon');
  });

  it('calls onCreate when the start button is pressed', () => {
    const onCreate = jest.fn();
    const { getByText } = render(
      <PetStep
        pet="dragon"
        saving={false}
        onSelectPet={jest.fn()}
        onCreate={onCreate}
      />,
    );

    fireEvent.press(getByText('¡Empezar!'));

    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('shows a spinner instead of the label while saving', () => {
    const { queryByText } = render(
      <PetStep
        pet="dragon"
        saving={true}
        onSelectPet={jest.fn()}
        onCreate={jest.fn()}
      />,
    );

    expect(queryByText('¡Empezar!')).toBeNull();
  });
});
