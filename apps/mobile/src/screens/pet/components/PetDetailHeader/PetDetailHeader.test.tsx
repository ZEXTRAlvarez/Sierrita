import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PetDetailHeader } from './PetDetailHeader';

describe('PetDetailHeader', () => {
  it('renders the pet name, stage and xp', () => {
    const { getByText } = render(
      <PetDetailHeader petColor="#FF6F00" petName="Chispita" stageName="Niño" totalXp={200} onBack={jest.fn()} />,
    );

    expect(getByText('Chispita')).toBeTruthy();
    expect(getByText('Niño · ⭐ 200 XP')).toBeTruthy();
  });

  it('calls onBack when the back button is tapped', () => {
    const onBack = jest.fn();
    const { getByText } = render(
      <PetDetailHeader petColor="#FF6F00" petName="Chispita" stageName="Niño" totalXp={0} onBack={onBack} />,
    );

    fireEvent.press(getByText('← Volver'));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
