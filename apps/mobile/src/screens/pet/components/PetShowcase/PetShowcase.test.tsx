import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PetShowcase } from './PetShowcase';
import { getOutfit } from '../../data/outfits';
import type { PetState } from '@sierrita/pet';

jest.mock('../../../../components/PetAnimation', () => ({ PetAnimation: () => null }));

const petState: PetState = {
  profileId: 'p1',
  petType: 'dragon',
  petName: 'Chispita',
  hunger: 80,
  thirst: 80,
  happiness: 80,
  evolutionStage: 1,
  outfitId: 'none',
  totalXp: 200,
  lastSessionAt: 0,
};

describe('PetShowcase', () => {
  it('shows the pet name and evolution stage', () => {
    const { getByText } = render(
      <PetShowcase
        petState={petState}
        mood="happy"
        petName="Chispita"
        stageName="Niño"
        petColor="#FF6F00"
        currentOutfit={getOutfit('none')}
        xpProgress={0.5}
        onRename={jest.fn()}
      />,
    );

    expect(getByText('Chispita')).toBeTruthy();
    expect(getByText('Niño')).toBeTruthy();
    expect(getByText('50%')).toBeTruthy();
  });

  it('shows the max-evolution badge instead of a progress bar at the last stage', () => {
    const { getByText, queryByText } = render(
      <PetShowcase
        petState={{ ...petState, evolutionStage: 3 }}
        mood="happy"
        petName="Chispita"
        stageName="Adulto"
        petColor="#FF6F00"
        currentOutfit={getOutfit('none')}
        xpProgress={1}
        onRename={jest.fn()}
      />,
    );

    expect(getByText('¡Evolución máxima!')).toBeTruthy();
    expect(queryByText('Progreso de evolución')).toBeNull();
  });

  it('shows the outfit badge emoji when an outfit other than "none" is equipped', () => {
    const { getByText } = render(
      <PetShowcase
        petState={petState}
        mood="happy"
        petName="Chispita"
        stageName="Niño"
        petColor="#FF6F00"
        currentOutfit={getOutfit('hat')}
        xpProgress={0.5}
        onRename={jest.fn()}
      />,
    );

    expect(getByText('🎩')).toBeTruthy();
  });

  it('calls onRename when the edit icon is tapped', () => {
    const onRename = jest.fn();
    const { getByText } = render(
      <PetShowcase
        petState={petState}
        mood="happy"
        petName="Chispita"
        stageName="Niño"
        petColor="#FF6F00"
        currentOutfit={getOutfit('none')}
        xpProgress={0.5}
        onRename={onRename}
      />,
    );

    fireEvent.press(getByText('✏️'));

    expect(onRename).toHaveBeenCalledTimes(1);
  });
});
