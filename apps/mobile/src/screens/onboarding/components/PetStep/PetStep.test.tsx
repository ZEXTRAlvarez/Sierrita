import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { PetStep } from './PetStep';

// PetAnimation renders an expo-video player, which needs native bindings
// unavailable under @react-native/jest-preset — same reasoning as the
// expo-image mock in test-setup.ts. Stub it with a testID exposing the props
// so selection/mood can still be asserted on.
jest.mock('../../../../components/PetAnimation', () => {
  const { Text } = require('react-native');
  return {
    PetAnimation: ({ petType, mood }: { petType: string; mood: string }) => (
      <Text testID={`pet-anim-${petType}`}>{mood}</Text>
    ),
  };
});

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

  it('shows every pet option with its happy animation instead of a static emoji', () => {
    const { getByTestId } = render(
      <PetStep
        pet={null}
        saving={false}
        onSelectPet={jest.fn()}
        onCreate={jest.fn()}
      />,
    );

    for (const type of ['dragon', 'bunny', 'dog', 'cat', 'rex']) {
      expect(getByTestId(`pet-anim-${type}`)).toHaveTextContent('happy');
    }
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
